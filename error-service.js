const fs = require("fs");
const path = require("path");

class ErrorService {
  constructor() {
    this.logDirectory = path.join(__dirname, "logs");
    this.ensureLogDirectory();
    this.errorLogs = [];
    this.securityLogs = [];
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  logError(error, context = {}) {
    const errorEntry = {
      id: this.errorLogs.length + 1,
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
      context,
      severity: this.determineSeverity(error),
      resolved: false,
    };

    this.errorLogs.push(errorEntry);

    // Write to file
    const logFile = path.join(
      this.logDirectory,
      `error-${new Date().toISOString().split("T")[0]}.log`,
    );
    const logEntry = `[${errorEntry.timestamp.toISOString()}] ${errorEntry.severity} - ${errorEntry.message}\n${errorEntry.stack}\nContext: ${JSON.stringify(context)}\n\n`;

    fs.appendFileSync(logFile, logEntry);

    // Console log based on severity
    if (errorEntry.severity === "CRITICAL" || errorEntry.severity === "HIGH") {
      console.error("🚨 CRITICAL ERROR:", errorEntry);
    } else {
      console.warn("⚠️ ERROR:", errorEntry.message);
    }

    return errorEntry.id;
  }

  logSecurityEvent(event, details = {}) {
    const securityEntry = {
      id: this.securityLogs.length + 1,
      timestamp: new Date(),
      event,
      details,
      severity: this.determineSecuritySeverity(event),
      source: details.ipAddress || "unknown",
    };

    this.securityLogs.push(securityEntry);

    // Write to security log
    const logFile = path.join(
      this.logDirectory,
      `security-${new Date().toISOString().split("T")[0]}.log`,
    );
    const logEntry = `[${securityEntry.timestamp.toISOString()}] ${securityEntry.severity} - ${event}\nDetails: ${JSON.stringify(details)}\n\n`;

    fs.appendFileSync(logFile, logEntry);

    // Alert for high severity events
    if (securityEntry.severity === "CRITICAL") {
      console.error("🔒 SECURITY ALERT:", securityEntry);
      this.alertSecurityTeam(securityEntry);
    }

    return securityEntry.id;
  }

  determineSeverity(error) {
    const message = error.message.toLowerCase();

    if (
      message.includes("payment") ||
      message.includes("transaction") ||
      message.includes("fraud") ||
      message.includes("security")
    ) {
      return "CRITICAL";
    }

    if (
      message.includes("database") ||
      message.includes("connection") ||
      message.includes("authentication") ||
      message.includes("authorization")
    ) {
      return "HIGH";
    }

    if (
      message.includes("validation") ||
      message.includes("input") ||
      message.includes("format")
    ) {
      return "MEDIUM";
    }

    return "LOW";
  }

  determineSecuritySeverity(event) {
    const highRiskEvents = [
      "BRUTE_FORCE_ATTACK",
      "SQL_INJECTION_ATTEMPT",
      "XSS_ATTEMPT",
      "PAYMENT_FRAUD_DETECTED",
      "UNAUTHORIZED_ACCESS_ATTEMPT",
      "SUSPICIOUS_TRANSACTION",
    ];

    const mediumRiskEvents = [
      "LOGIN_FAILED",
      "INVALID_TOKEN",
      "RATE_LIMIT_EXCEEDED",
      "SUSPICIOUS_ACTIVITY",
    ];

    if (highRiskEvents.includes(event)) {
      return "CRITICAL";
    } else if (mediumRiskEvents.includes(event)) {
      return "HIGH";
    } else {
      return "MEDIUM";
    }
  }

  alertSecurityTeam(securityEntry) {
    // In production, this would send alerts via email, SMS, Slack, etc.
    console.log("🚨 SECURITY TEAM ALERT:", {
      event: securityEntry.event,
      timestamp: securityEntry.timestamp,
      details: securityEntry.details,
    });
  }

  getErrorLogs(filters = {}) {
    let logs = [...this.errorLogs];

    if (filters.severity) {
      logs = logs.filter((log) => log.severity === filters.severity);
    }

    if (filters.startDate) {
      logs = logs.filter((log) => log.timestamp >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      logs = logs.filter((log) => log.timestamp <= new Date(filters.endDate));
    }

    if (filters.resolved !== undefined) {
      logs = logs.filter((log) => log.resolved === filters.resolved);
    }

    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  getSecurityLogs(filters = {}) {
    let logs = [...this.securityLogs];

    if (filters.event) {
      logs = logs.filter((log) => log.event === filters.event);
    }

    if (filters.severity) {
      logs = logs.filter((log) => log.severity === filters.severity);
    }

    if (filters.startDate) {
      logs = logs.filter((log) => log.timestamp >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      logs = logs.filter((log) => log.timestamp <= new Date(filters.endDate));
    }

    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  markErrorResolved(errorId) {
    const error = this.errorLogs.find((log) => log.id === errorId);
    if (error) {
      error.resolved = true;
      error.resolvedAt = new Date();
      return true;
    }
    return false;
  }

  getErrorStats() {
    const total = this.errorLogs.length;
    const resolved = this.errorLogs.filter((log) => log.resolved).length;
    const unresolved = total - resolved;

    const severityCount = {
      CRITICAL: this.errorLogs.filter((log) => log.severity === "CRITICAL")
        .length,
      HIGH: this.errorLogs.filter((log) => log.severity === "HIGH").length,
      MEDIUM: this.errorLogs.filter((log) => log.severity === "MEDIUM").length,
      LOW: this.errorLogs.filter((log) => log.severity === "LOW").length,
    };

    return {
      total,
      resolved,
      unresolved,
      severityCount,
    };
  }

  getSecurityStats() {
    const total = this.securityLogs.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEvents = this.securityLogs.filter(
      (log) => log.timestamp >= today,
    ).length;

    const severityCount = {
      CRITICAL: this.securityLogs.filter((log) => log.severity === "CRITICAL")
        .length,
      HIGH: this.securityLogs.filter((log) => log.severity === "HIGH").length,
      MEDIUM: this.securityLogs.filter((log) => log.severity === "MEDIUM")
        .length,
    };

    const eventTypes = {};
    this.securityLogs.forEach((log) => {
      eventTypes[log.event] = (eventTypes[log.event] || 0) + 1;
    });

    return {
      total,
      todayEvents,
      severityCount,
      eventTypes,
    };
  }

  // Middleware factory for Express error handling
  errorHandler() {
    return (error, req, res, next) => {
      const errorId = this.logError(error, {
        url: req.url,
        method: req.method,
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        userId: req.user?.id,
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Don't expose sensitive error details in production
      const isDevelopment = process.env.NODE_ENV === "development";

      let statusCode = 500;
      let message = "Internal Server Error";

      // Handle specific error types
      if (error.name === "ValidationError") {
        statusCode = 400;
        message = isDevelopment ? error.message : "Invalid input data";
      } else if (
        error.name === "UnauthorizedError" ||
        error.message.includes("unauthorized")
      ) {
        statusCode = 401;
        message = "Unauthorized access";
      } else if (
        error.name === "ForbiddenError" ||
        error.message.includes("forbidden")
      ) {
        statusCode = 403;
        message = "Access forbidden";
      } else if (error.name === "NotFoundError") {
        statusCode = 404;
        message = "Resource not found";
      } else if (error.name === "ConflictError") {
        statusCode = 409;
        message = "Resource conflict";
      }

      res.status(statusCode).json({
        success: false,
        error: {
          message,
          errorId: isDevelopment ? errorId : undefined,
          stack: isDevelopment ? error.stack : undefined,
        },
      });
    };
  }

  // Middleware for request logging
  requestLogger() {
    return (req, res, next) => {
      const start = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - start;
        const logEntry = {
          timestamp: new Date(),
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          userAgent: req.get("User-Agent"),
          ipAddress: req.ip,
          userId: req.user?.id,
        };

        // Log suspicious activity
        if (res.statusCode === 401 || res.statusCode === 403) {
          this.logSecurityEvent("UNAUTHORIZED_ACCESS_ATTEMPT", {
            url: req.url,
            method: req.method,
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
          });
        }

        // Log slow requests
        if (duration > 5000) {
          console.warn(
            `⏱️ Slow request: ${req.method} ${req.url} - ${duration}ms`,
          );
        }
      });

      next();
    };
  }

  // Validation error helper
  createValidationError(message, field) {
    const error = new Error(message);
    error.name = "ValidationError";
    error.field = field;
    return error;
  }

  // Authorization error helper
  createUnauthorizedError(message = "Unauthorized access") {
    const error = new Error(message);
    error.name = "UnauthorizedError";
    return error;
  }

  // Forbidden error helper
  createForbiddenError(message = "Access forbidden") {
    const error = new Error(message);
    error.name = "ForbiddenError";
    return error;
  }

  // Not found error helper
  createNotFoundError(message = "Resource not found") {
    const error = new Error(message);
    error.name = "NotFoundError";
    return error;
  }
}

module.exports = ErrorService;
