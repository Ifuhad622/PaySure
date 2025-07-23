// Authentication JavaScript - Professional Security Features

class AuthManager {
  constructor() {
    this.loginForm = document.getElementById("loginForm");
    this.registerForm = document.getElementById("registerForm");
    this.authMessage = document.getElementById("authMessage");
    this.isLoading = false;

    this.initializeEventListeners();
    this.checkExistingSession();
  }

  initializeEventListeners() {
    // Login form
    if (this.loginForm) {
      this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    // Register form
    if (this.registerForm) {
      this.registerForm.addEventListener("submit", (e) =>
        this.handleRegister(e),
      );

      // Password strength checking
      const regPassword = document.getElementById("regPassword");
      if (regPassword) {
        regPassword.addEventListener("input", (e) =>
          this.checkPasswordStrength(e.target.value),
        );
      }

      // Password confirmation
      const confirmPassword = document.getElementById("confirmPassword");
      if (confirmPassword) {
        confirmPassword.addEventListener("input", (e) =>
          this.validatePasswordMatch(),
        );
      }
    }

    // Real-time validation
    this.setupRealtimeValidation();
  }

  setupRealtimeValidation() {
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.addEventListener("blur", (e) => this.validateField(e.target));
      input.addEventListener("input", (e) => this.clearFieldError(e.target));
    });
  }

  async handleLogin(e) {
    e.preventDefault();

    if (this.isLoading) return;

    const formData = new FormData(this.loginForm);
    const credentials = {
      username: formData.get("username").trim(),
      password: formData.get("password"),
    };

    // Client-side validation
    if (!this.validateLoginForm(credentials)) {
      return;
    }

    this.setLoading(true, "loginBtn");
    this.clearMessage();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success) {
        // Store token securely
        this.storeAuthToken(result.token);

        this.showMessage("Login successful! Redirecting...", "success");

        // Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = "/dashboard.html";
        }, 1500);
      } else {
        this.showMessage(
          result.error || "Login failed. Please try again.",
          "error",
        );

        // Clear password field on failed login
        document.getElementById("password").value = "";
      }
    } catch (error) {
      console.error("Login error:", error);
      this.showMessage("Network error. Please check your connection.", "error");
    } finally {
      this.setLoading(false, "loginBtn");
    }
  }

  async handleRegister(e) {
    e.preventDefault();

    if (this.isLoading) return;

    const formData = new FormData(this.registerForm);
    const userData = {
      username: formData.get("username").trim(),
      email: formData.get("email").trim(),
      password: formData.get("password"),
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
    };

    // Client-side validation
    if (!this.validateRegisterForm(userData)) {
      return;
    }

    this.setLoading(true, "registerBtn");
    this.clearMessage();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage(
          "Account created successfully! Please sign in.",
          "success",
        );

        // Switch to login form after delay
        setTimeout(() => {
          this.showLogin();
          // Pre-fill username
          document.getElementById("username").value = userData.username;
        }, 2000);
      } else {
        this.showMessage(
          result.error || "Registration failed. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      this.showMessage("Network error. Please check your connection.", "error");
    } finally {
      this.setLoading(false, "registerBtn");
    }
  }

  validateLoginForm(credentials) {
    let isValid = true;

    // Username validation
    if (!credentials.username) {
      this.showFieldError("username", "Username or email is required");
      isValid = false;
    } else if (credentials.username.length < 3) {
      this.showFieldError("username", "Username must be at least 3 characters");
      isValid = false;
    }

    // Password validation
    if (!credentials.password) {
      this.showFieldError("password", "Password is required");
      isValid = false;
    } else if (credentials.password.length < 6) {
      this.showFieldError("password", "Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  }

  validateRegisterForm(userData) {
    let isValid = true;

    // First name validation
    if (!userData.firstName) {
      this.showFieldError("firstName", "First name is required");
      isValid = false;
    }

    // Last name validation
    if (!userData.lastName) {
      this.showFieldError("lastName", "Last name is required");
      isValid = false;
    }

    // Username validation
    if (!userData.username) {
      this.showFieldError("regUsername", "Username is required");
      isValid = false;
    } else if (userData.username.length < 3) {
      this.showFieldError(
        "regUsername",
        "Username must be at least 3 characters",
      );
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      this.showFieldError(
        "regUsername",
        "Username can only contain letters, numbers, and underscores",
      );
      isValid = false;
    }

    // Email validation
    if (!userData.email) {
      this.showFieldError("regEmail", "Email is required");
      isValid = false;
    } else if (!this.isValidEmail(userData.email)) {
      this.showFieldError("regEmail", "Please enter a valid email address");
      isValid = false;
    }

    // Password validation
    if (!userData.password) {
      this.showFieldError("regPassword", "Password is required");
      isValid = false;
    } else if (!this.isStrongPassword(userData.password)) {
      this.showFieldError(
        "regPassword",
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
      );
      isValid = false;
    }

    // Password confirmation
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (userData.password !== confirmPassword) {
      this.showFieldError("confirmPassword", "Passwords do not match");
      isValid = false;
    }

    // Terms acceptance
    const acceptTerms = document.getElementById("acceptTerms").checked;
    if (!acceptTerms) {
      this.showMessage(
        "You must accept the Terms of Service and Privacy Policy",
        "error",
      );
      isValid = false;
    }

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;

    switch (fieldName) {
      case "username":
      case "regUsername":
        if (value && value.length < 3) {
          this.showFieldError(
            field.id,
            "Username must be at least 3 characters",
          );
          return false;
        }
        break;
      case "email":
      case "regEmail":
        if (value && !this.isValidEmail(value)) {
          this.showFieldError(field.id, "Please enter a valid email address");
          return false;
        }
        break;
      case "password":
      case "regPassword":
        if (value && value.length < 6) {
          this.showFieldError(
            field.id,
            "Password must be at least 6 characters",
          );
          return false;
        }
        break;
    }

    this.clearFieldError(field);
    return true;
  }

  checkPasswordStrength(password) {
    const strengthIndicator = document.getElementById("passwordStrength");
    if (!strengthIndicator) return;

    let strength = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) strength += 1;
    else feedback.push("at least 8 characters");

    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    else feedback.push("uppercase letter");

    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    else feedback.push("lowercase letter");

    // Number check
    if (/\d/.test(password)) strength += 1;
    else feedback.push("number");

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    else feedback.push("special character");

    // Update strength indicator
    let strengthText, strengthClass;
    if (strength <= 2) {
      strengthText = "Weak";
      strengthClass = "strength-weak";
    } else if (strength <= 3) {
      strengthText = "Medium";
      strengthClass = "strength-medium";
    } else {
      strengthText = "Strong";
      strengthClass = "strength-strong";
    }

    strengthIndicator.textContent = password
      ? `Password strength: ${strengthText}`
      : "";
    strengthIndicator.className = `password-strength ${strengthClass}`;

    if (feedback.length > 0 && password) {
      strengthIndicator.textContent += ` (needs: ${feedback.join(", ")})`;
    }
  }

  validatePasswordMatch() {
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (confirmPassword && password !== confirmPassword) {
      this.showFieldError("confirmPassword", "Passwords do not match");
    } else {
      this.clearFieldError(document.getElementById("confirmPassword"));
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isStrongPassword(password) {
    // At least 8 characters, uppercase, lowercase, number, special char
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return strongRegex.test(password);
  }

  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "Error");

    if (field) {
      field.style.borderColor = "#f56565";
    }

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearFieldError(field) {
    const fieldId = field.id;
    const errorElement = document.getElementById(fieldId + "Error");

    field.style.borderColor = "#e2e8f0";

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  showMessage(message, type = "info") {
    this.authMessage.textContent = message;
    this.authMessage.className = `auth-message ${type}`;
    this.authMessage.style.display = "block";

    // Auto-hide success messages
    if (type === "success") {
      setTimeout(() => {
        this.clearMessage();
      }, 5000);
    }
  }

  clearMessage() {
    this.authMessage.style.display = "none";
    this.authMessage.textContent = "";
    this.authMessage.className = "auth-message";
  }

  setLoading(loading, buttonId) {
    this.isLoading = loading;
    const button = document.getElementById(buttonId);
    const btnText = button.querySelector(".btn-text");
    const btnLoader = button.querySelector(".btn-loader");

    if (loading) {
      button.classList.add("loading");
      button.disabled = true;
      btnText.style.display = "none";
      btnLoader.style.display = "block";
    } else {
      button.classList.remove("loading");
      button.disabled = false;
      btnText.style.display = "block";
      btnLoader.style.display = "none";
    }
  }

  storeAuthToken(token) {
    // Store in secure httpOnly cookie would be better in production
    localStorage.setItem("authToken", token);
    localStorage.setItem("loginTime", Date.now().toString());
  }

  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  clearAuthToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginTime");
  }

  async checkExistingSession() {
    const token = this.getAuthToken();
    if (token) {
      try {
        const response = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // User is already logged in, redirect to dashboard
          window.location.href = "/dashboard.html";
        }
      } catch (error) {
        // Token is invalid, clear it
        this.clearAuthToken();
      }
    }
  }
}

// Form switching functions
function showLogin() {
  const loginCard = document.querySelector(".auth-card:not(#registerCard)");
  const registerCard = document.getElementById("registerCard");

  registerCard.style.display = "none";
  loginCard.style.display = "block";
  loginCard.classList.add("card-enter");

  // Clear forms
  document.getElementById("loginForm").reset();
  authManager.clearMessage();
}

function showRegister() {
  const loginCard = document.querySelector(".auth-card:not(#registerCard)");
  const registerCard = document.getElementById("registerCard");

  loginCard.style.display = "none";
  registerCard.style.display = "block";
  registerCard.classList.add("card-enter");

  // Clear forms
  document.getElementById("registerForm").reset();
  authManager.clearMessage();
}

function showForgotPassword() {
  // For now, show a simple alert - in production, implement proper forgot password flow
  alert(
    "Forgot Password functionality will be available soon. Please contact your administrator.",
  );
}

// Password visibility toggle functions
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("passwordToggleIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

function toggleRegPassword() {
  const passwordInput = document.getElementById("regPassword");
  const toggleIcon = document.getElementById("regPasswordToggleIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

// Initialize authentication manager
let authManager;
document.addEventListener("DOMContentLoaded", function () {
  authManager = new AuthManager();

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Enter key on form elements
    if (e.key === "Enter" && e.target.classList.contains("form-input")) {
      const form = e.target.closest("form");
      if (form) {
        form.dispatchEvent(new Event("submit"));
      }
    }

    // Escape key to clear messages
    if (e.key === "Escape") {
      authManager.clearMessage();
    }
  });
});

console.log("🔐 MelHad Investment - Secure Authentication System Loaded");
