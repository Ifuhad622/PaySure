const crypto = require("crypto");
const { RateLimiterMemory } = require("rate-limiter-flexible");

class SecurityService {
  constructor(errorService) {
    this.errorService = errorService;
    this.suspiciousIPs = new Set();
    this.blockedIPs = new Set();
    this.paymentAttempts = new Map();
    this.deviceFingerprints = new Map();

    // Rate limiters
    this.loginLimiter = new RateLimiterMemory({
      keyGenerator: (req) => req.ip,
      points: 5, // 5 attempts
      duration: 900, // per 15 minutes
    });

    this.paymentLimiter = new RateLimiterMemory({
      keyGenerator: (req) => req.ip,
      points: 3, // 3 payment attempts
      duration: 3600, // per hour
    });

    this.apiLimiter = new RateLimiterMemory({
      keyGenerator: (req) => req.ip,
      points: 100, // 100 requests
      duration: 60, // per minute
    });

    // Known fraud patterns
    this.fraudPatterns = {
      suspiciousAmounts: [999.99, 1000.0, 1234.56, 9999.99],
      blacklistedPhones: new Set(),
      blacklistedEmails: new Set(),
      suspiciousUserAgents: [
        "bot",
        "crawler",
        "spider",
        "scraper",
        "automated",
      ],
    };
  }

  // IP-based security
  isIPBlocked(ip) {
    return this.blockedIPs.has(ip);
  }

  blockIP(ip, reason) {
    this.blockedIPs.add(ip);
    this.errorService.logSecurityEvent("IP_BLOCKED", {
      ipAddress: ip,
      reason,
      timestamp: new Date(),
    });
    console.log(`🚫 IP Blocked: ${ip} - Reason: ${reason}`);
  }

  markIPSuspicious(ip, reason) {
    this.suspiciousIPs.add(ip);
    this.errorService.logSecurityEvent("IP_MARKED_SUSPICIOUS", {
      ipAddress: ip,
      reason,
      timestamp: new Date(),
    });
  }

  // Device fingerprinting
  generateDeviceFingerprint(req) {
    const userAgent = req.get("User-Agent") || "";
    const acceptLanguage = req.get("Accept-Language") || "";
    const acceptEncoding = req.get("Accept-Encoding") || "";

    const fingerprint = crypto
      .createHash("sha256")
      .update(userAgent + acceptLanguage + acceptEncoding)
      .digest("hex");

    return fingerprint;
  }

  trackDevice(fingerprint, userId, ipAddress) {
    if (!this.deviceFingerprints.has(fingerprint)) {
      this.deviceFingerprints.set(fingerprint, {
        firstSeen: new Date(),
        lastSeen: new Date(),
        users: new Set([userId]),
        ipAddresses: new Set([ipAddress]),
        suspicious: false,
      });
    } else {
      const device = this.deviceFingerprints.get(fingerprint);
      device.lastSeen = new Date();
      device.users.add(userId);
      device.ipAddresses.add(ipAddress);

      // Mark suspicious if used by too many users
      if (device.users.size > 5) {
        device.suspicious = true;
        this.errorService.logSecurityEvent("SUSPICIOUS_DEVICE", {
          fingerprint,
          userCount: device.users.size,
          ipCount: device.ipAddresses.size,
        });
      }
    }
  }

  // Rate limiting middleware
  async checkRateLimit(req, res, next, limiterType = "api") {
    try {
      let limiter;
      switch (limiterType) {
        case "login":
          limiter = this.loginLimiter;
          break;
        case "payment":
          limiter = this.paymentLimiter;
          break;
        default:
          limiter = this.apiLimiter;
      }

      await limiter.consume(req.ip);
      next();
    } catch (rateLimiterRes) {
      const remainingTime = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;

      this.errorService.logSecurityEvent("RATE_LIMIT_EXCEEDED", {
        ipAddress: req.ip,
        limiterType,
        remainingTime,
        userAgent: req.get("User-Agent"),
      });

      // Mark IP as suspicious after multiple rate limit violations
      if (rateLimiterRes.remainingPoints <= 0) {
        this.markIPSuspicious(req.ip, `Rate limit exceeded for ${limiterType}`);
      }

      res.status(429).json({
        success: false,
        error: {
          message: "Too many requests",
          retryAfter: remainingTime,
        },
      });
    }
  }

  // Payment fraud detection
  analyzePaymentRisk(paymentData, userProfile, deviceFingerprint) {
    const riskFactors = [];
    let riskScore = 0;

    // Amount-based risk
    if (this.fraudPatterns.suspiciousAmounts.includes(paymentData.amount)) {
      riskFactors.push("Suspicious amount pattern");
      riskScore += 30;
    }

    if (paymentData.amount > 5000) {
      riskFactors.push("High amount transaction");
      riskScore += 20;
    }

    // Frequency-based risk
    const userPayments = this.paymentAttempts.get(userProfile.id) || [];
    const recentPayments = userPayments.filter(
      (p) => Date.now() - p.timestamp < 3600000, // Last hour
    );

    if (recentPayments.length > 3) {
      riskFactors.push("Multiple recent payments");
      riskScore += 40;
    }

    // Device-based risk
    const device = this.deviceFingerprints.get(deviceFingerprint);
    if (device?.suspicious) {
      riskFactors.push("Suspicious device");
      riskScore += 50;
    }

    // User profile risk
    if (
      userProfile.createdAt &&
      Date.now() - new Date(userProfile.createdAt).getTime() < 86400000
    ) {
      riskFactors.push("New user account");
      riskScore += 25;
    }

    // Contact information risk
    if (this.fraudPatterns.blacklistedPhones.has(paymentData.customerPhone)) {
      riskFactors.push("Blacklisted phone number");
      riskScore += 60;
    }

    if (this.fraudPatterns.blacklistedEmails.has(paymentData.customerEmail)) {
      riskFactors.push("Blacklisted email");
      riskScore += 60;
    }

    // Determine risk level
    let riskLevel = "LOW";
    if (riskScore >= 70) {
      riskLevel = "HIGH";
    } else if (riskScore >= 40) {
      riskLevel = "MEDIUM";
    }

    // Track payment attempt
    if (!this.paymentAttempts.has(userProfile.id)) {
      this.paymentAttempts.set(userProfile.id, []);
    }
    this.paymentAttempts.get(userProfile.id).push({
      amount: paymentData.amount,
      timestamp: Date.now(),
      riskScore,
      riskLevel,
    });

    const analysis = {
      riskScore,
      riskLevel,
      riskFactors,
      recommendation: this.getRecommendation(riskLevel, riskScore),
    };

    // Log high-risk transactions
    if (riskLevel === "HIGH") {
      this.errorService.logSecurityEvent("HIGH_RISK_PAYMENT", {
        userId: userProfile.id,
        amount: paymentData.amount,
        riskScore,
        riskFactors,
        customerPhone: paymentData.customerPhone,
        deviceFingerprint,
      });
    }

    return analysis;
  }

  getRecommendation(riskLevel, riskScore) {
    if (riskLevel === "HIGH") {
      return "BLOCK_TRANSACTION";
    } else if (riskLevel === "MEDIUM") {
      return riskScore > 50 ? "REQUIRE_VERIFICATION" : "MONITOR_CLOSELY";
    } else {
      return "APPROVE";
    }
  }

  // Input validation and sanitization
  validateInput(input, type, options = {}) {
    if (input === null || input === undefined) {
      if (options.required) {
        throw this.errorService.createValidationError(`${type} is required`);
      }
      return null;
    }

    switch (type) {
      case "email":
        return this.validateEmail(input, options);
      case "phone":
        return this.validatePhone(input, options);
      case "amount":
        return this.validateAmount(input, options);
      case "string":
        return this.validateString(input, options);
      case "number":
        return this.validateNumber(input, options);
      default:
        return this.sanitizeString(input);
    }
  }

  validateEmail(email, options = {}) {
    if (typeof email !== "string") {
      throw this.errorService.createValidationError("Email must be a string");
    }

    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitized)) {
      throw this.errorService.createValidationError("Invalid email format");
    }

    if (options.maxLength && sanitized.length > options.maxLength) {
      throw this.errorService.createValidationError(
        `Email too long (max ${options.maxLength})`,
      );
    }

    return sanitized;
  }

  validatePhone(phone, options = {}) {
    if (typeof phone !== "string") {
      throw this.errorService.createValidationError("Phone must be a string");
    }

    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length < 10 || cleaned.length > 15) {
      throw this.errorService.createValidationError(
        "Invalid phone number length",
      );
    }

    return cleaned;
  }

  validateAmount(amount, options = {}) {
    const num = parseFloat(amount);

    if (isNaN(num) || num < 0) {
      throw this.errorService.createValidationError(
        "Amount must be a positive number",
      );
    }

    if (options.max && num > options.max) {
      throw this.errorService.createValidationError(
        `Amount exceeds maximum (${options.max})`,
      );
    }

    if (options.min && num < options.min) {
      throw this.errorService.createValidationError(
        `Amount below minimum (${options.min})`,
      );
    }

    return Math.round(num * 100) / 100; // Round to 2 decimal places
  }

  validateString(str, options = {}) {
    if (typeof str !== "string") {
      throw this.errorService.createValidationError("Input must be a string");
    }

    const sanitized = this.sanitizeString(str.trim());

    if (options.minLength && sanitized.length < options.minLength) {
      throw this.errorService.createValidationError(
        `String too short (min ${options.minLength})`,
      );
    }

    if (options.maxLength && sanitized.length > options.maxLength) {
      throw this.errorService.createValidationError(
        `String too long (max ${options.maxLength})`,
      );
    }

    if (options.pattern && !options.pattern.test(sanitized)) {
      throw this.errorService.createValidationError("String format invalid");
    }

    return sanitized;
  }

  validateNumber(num, options = {}) {
    const parsed = parseInt(num);

    if (isNaN(parsed)) {
      throw this.errorService.createValidationError("Input must be a number");
    }

    if (options.min && parsed < options.min) {
      throw this.errorService.createValidationError(
        `Number too small (min ${options.min})`,
      );
    }

    if (options.max && parsed > options.max) {
      throw this.errorService.createValidationError(
        `Number too large (max ${options.max})`,
      );
    }

    return parsed;
  }

  sanitizeString(str) {
    if (typeof str !== "string") return str;

    // Remove potentially dangerous characters and patterns
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .replace(/[<>]/g, "") // Remove < and >
      .trim();
  }

  // Security headers middleware
  securityHeaders() {
    return (req, res, next) => {
      // Security headers
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains",
      );
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;",
      );

      next();
    };
  }

  // IP blocking middleware
  ipBlockingMiddleware() {
    return (req, res, next) => {
      if (this.isIPBlocked(req.ip)) {
        this.errorService.logSecurityEvent("BLOCKED_IP_ACCESS_ATTEMPT", {
          ipAddress: req.ip,
          url: req.url,
          userAgent: req.get("User-Agent"),
        });

        return res.status(403).json({
          success: false,
          error: {
            message: "Access denied",
          },
        });
      }

      next();
    };
  }

  // Generate secure random token
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString("hex");
  }

  // Hash sensitive data
  hashData(data, salt = null) {
    if (!salt) {
      salt = crypto.randomBytes(16).toString("hex");
    }
    const hash = crypto
      .pbkdf2Sync(data, salt, 10000, 64, "sha512")
      .toString("hex");
    return { hash, salt };
  }

  // Encrypt sensitive data
  encryptData(data, key = null) {
    if (!key) {
      key =
        process.env.ENCRYPTION_KEY ||
        "default-encryption-key-change-in-production";
    }

    const algorithm = "aes-256-gcm";
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    };
  }

  // Decrypt sensitive data
  decryptData(encryptedData, key = null) {
    if (!key) {
      key =
        process.env.ENCRYPTION_KEY ||
        "default-encryption-key-change-in-production";
    }

    const algorithm = "aes-256-gcm";
    const decipher = crypto.createDecipher(algorithm, key);

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

module.exports = SecurityService;
