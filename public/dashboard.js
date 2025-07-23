// Enterprise Dashboard JavaScript - Professional Features

class DashboardManager {
  constructor() {
    this.currentUser = null;
    this.currentSection = "dashboard";
    this.charts = {};
    this.refreshInterval = null;
    this.notificationCount = 0;

    this.initializeApp();
  }

  async initializeApp() {
    // Show loading overlay
    this.showLoading(true);

    try {
      // Validate authentication first
      await this.validateAuthentication();
      console.log("✅ Authentication validated successfully");

      // Initialize UI components
      this.initializeNavigation();
      this.initializeCharts();
      this.setupEventListeners();
      this.startRealTimeUpdates();

      // Load initial data only after authentication is confirmed
      await this.loadDashboardData();

      console.log("🚀 MelHad Investment Dashboard Initialized Successfully");
    } catch (error) {
      console.error("Dashboard initialization failed:", error);
      this.showNotification(
        "Authentication failed. Redirecting to login...",
        "error",
      );
      // Wait a moment before redirecting to show the error
      setTimeout(() => this.redirectToLogin(), 2000);
    } finally {
      // Hide loading overlay
      setTimeout(() => this.showLoading(false), 1000);
    }
  }

  async validateAuthentication() {
    const token = localStorage.getItem("authToken");
    console.log(
      "🔍 Checking auth token:",
      token ? "Token exists" : "No token found",
    );

    if (!token) {
      throw new Error("No authentication token");
    }

    try {
      console.log("🔑 Validating token with server...");
      const response = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Server response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "❌ Token validation failed:",
          response.status,
          errorText,
        );
        throw new Error("Invalid token");
      }

      const result = await response.json();
      this.currentUser = result.user;
      console.log("✅ User authenticated:", this.currentUser.username);

      // Update user display
      this.updateUserDisplay();
    } catch (error) {
      console.error("🚨 Authentication error:", error);
      localStorage.removeItem("authToken");
      throw error;
    }
  }

  updateUserDisplay() {
    if (this.currentUser) {
      document.getElementById("userName").textContent =
        `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      document.getElementById("userRole").textContent =
        this.currentUser.role.charAt(0).toUpperCase() +
        this.currentUser.role.slice(1);
    }
  }

  initializeNavigation() {
    // Navigation click handlers
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.switchSection(section);
      });
    });

    // Update current time
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 1000);
  }

  switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    document
      .querySelector(`[data-section="${sectionId}"]`)
      .classList.add("active");

    // Update content
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Update page title and breadcrumb
    this.updatePageTitle(sectionId);
    this.updateBreadcrumb(sectionId);

    // Load section-specific data
    this.loadSectionData(sectionId);

    this.currentSection = sectionId;
  }

  updatePageTitle(sectionId) {
    const titles = {
      dashboard: "Dashboard Overview",
      orders: "Create New Order",
      "order-management": "Order Management",
      customers: "Customer Management",
      invoices: "Invoice Management",
      services: "Services Management",
      reports: "Business Reports",
      security: "Security Dashboard",
      settings: "System Settings",
    };

    const title = titles[sectionId] || "Dashboard";
    document.getElementById("pageTitle").textContent = title;
  }

  updateBreadcrumb(sectionId) {
    const breadcrumbList = document.getElementById("breadcrumbList");
    const breadcrumbs = {
      dashboard: [
        { text: "Home", href: "#dashboard", icon: "fas fa-home" },
        { text: "Dashboard", active: true },
      ],
      orders: [
        { text: "Home", href: "#dashboard", icon: "fas fa-home" },
        { text: "Orders", href: "#order-management" },
        { text: "New Order", active: true },
      ],
      "order-management": [
        { text: "Home", href: "#dashboard", icon: "fas fa-home" },
        { text: "Order Management", active: true },
      ],
      customers: [
        { text: "Home", href: "#dashboard", icon: "fas fa-home" },
        { text: "Customer Management", active: true },
      ],
      security: [
        { text: "Home", href: "#dashboard", icon: "fas fa-home" },
        { text: "Security Dashboard", active: true },
      ],
    };

    const items = breadcrumbs[sectionId] || breadcrumbs["dashboard"];

    breadcrumbList.innerHTML = items
      .map((item) => {
        if (item.active) {
          return `<li class="breadcrumb-item active">${item.text}</li>`;
        } else {
          const icon = item.icon ? `<i class="${item.icon}"></i> ` : "";
          return `<li class="breadcrumb-item"><a href="${item.href}">${icon}${item.text}</a></li>`;
        }
      })
      .join("");
  }

  updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeElement = document.getElementById("currentTime");
    if (timeElement) {
      timeElement.textContent = timeString;
    }
  }

  async loadDashboardData() {
    try {
      const token = localStorage.getItem("authToken");
      console.log("📊 Loading dashboard data...");

      if (!token) {
        throw new Error("No authentication token");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      console.log("📡 Making API calls with token...");

      // Load dashboard metrics in parallel
      const [ordersResponse, customersResponse, invoicesResponse] =
        await Promise.all([
          fetch("/api/orders", { headers }),
          fetch("/api/customers", { headers }),
          fetch("/api/invoices", { headers }),
        ]);

      console.log("📈 API Response statuses:", {
        orders: ordersResponse.status,
        customers: customersResponse.status,
        invoices: invoicesResponse.status,
      });

      // Check for authentication errors
      if (
        ordersResponse.status === 401 ||
        customersResponse.status === 401 ||
        invoicesResponse.status === 401
      ) {
        console.error("❌ One or more API calls returned 401 Unauthorized");
        throw new Error("Authentication failed");
      }

      const orders = await ordersResponse.json();
      const customers = await customersResponse.json();
      const invoices = await invoicesResponse.json();

      console.log("✅ Data loaded successfully:", {
        orders: orders.length,
        customers: customers.length,
        invoices: invoices.length,
      });

      // Update metrics
      this.updateDashboardMetrics(orders, customers, invoices);

      // Update charts
      this.updateRevenueChart(orders);
      this.updateOrderStatusChart(orders);

      // Update recent activities
      this.updateRecentActivities(orders);

      // Load security data
      await this.loadSecurityData();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      this.showNotification("Error loading dashboard data", "error");
    }
  }

  updateDashboardMetrics(orders, customers, invoices) {
    const today = new Date().toDateString();

    // Today's orders
    const todayOrders = orders.filter(
      (order) => new Date(order.createdAt).toDateString() === today,
    );

    // Today's revenue
    const todayRevenue = todayOrders
      .filter((order) => order.status === "paid")
      .reduce((sum, order) => sum + (order.total || 0), 0);

    // Pending orders
    const pendingOrders = orders.filter((order) => order.status === "pending");

    // Update display with animation
    this.animateValue(
      "todayRevenue",
      0,
      todayRevenue,
      1000,
      (value) => `$${value.toFixed(2)}`,
    );
    this.animateValue("todayOrders", 0, todayOrders.length, 800);
    this.animateValue("pendingOrders", 0, pendingOrders.length, 600);
    this.animateValue("totalCustomers", 0, customers.length, 1200);
  }

  animateValue(elementId, start, end, duration, formatter = null) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = start + (end - start) * easeOutCubic;

      const displayValue = formatter
        ? formatter(currentValue)
        : Math.floor(currentValue);
      element.textContent = displayValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById("revenueChart");
    if (revenueCtx) {
      this.charts.revenue = new Chart(revenueCtx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Revenue",
              data: [],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "#e9ecef",
              },
              ticks: {
                callback: function (value) {
                  return "$" + value.toFixed(2);
                },
              },
            },
            x: {
              grid: {
                color: "#e9ecef",
              },
            },
          },
        },
      });
    }

    // Order Status Chart
    const statusCtx = document.getElementById("orderStatusChart");
    if (statusCtx) {
      this.charts.orderStatus = new Chart(statusCtx, {
        type: "doughnut",
        data: {
          labels: ["Pending", "Processing", "Printing", "Ready", "Completed"],
          datasets: [
            {
              data: [0, 0, 0, 0, 0],
              backgroundColor: [
                "#f39c12",
                "#3498db",
                "#9b59b6",
                "#27ae60",
                "#2c3e50",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                usePointStyle: true,
              },
            },
          },
        },
      });
    }
  }

  updateRevenueChart(orders) {
    if (!this.charts.revenue) return;

    // Get last 7 days
    const days = [];
    const revenues = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();

      days.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      );

      const dayRevenue = orders
        .filter(
          (order) =>
            new Date(order.createdAt).toDateString() === dateString &&
            order.status === "paid",
        )
        .reduce((sum, order) => sum + (order.total || 0), 0);

      revenues.push(dayRevenue);
    }

    this.charts.revenue.data.labels = days;
    this.charts.revenue.data.datasets[0].data = revenues;
    this.charts.revenue.update();
  }

  updateOrderStatusChart(orders) {
    if (!this.charts.orderStatus) return;

    const statusCounts = {
      pending: 0,
      processing: 0,
      printing: 0,
      ready: 0,
      completed: 0,
    };

    orders.forEach((order) => {
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status]++;
      }
    });

    this.charts.orderStatus.data.datasets[0].data = Object.values(statusCounts);
    this.charts.orderStatus.update();
  }

  updateRecentActivities(orders) {
    const activitiesContainer = document.getElementById("recentActivities");
    if (!activitiesContainer) return;

    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    if (recentOrders.length === 0) {
      activitiesContainer.innerHTML =
        '<p class="no-data">No recent activities</p>';
      return;
    }

    activitiesContainer.innerHTML = recentOrders
      .map((order) => {
        const statusColor = this.getStatusColor(order.status);
        const timeAgo = this.getTimeAgo(new Date(order.createdAt));

        return `
                <div class="activity-item">
                    <div class="activity-icon ${statusColor}">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="activity-content">
                        <p class="activity-title">
                            New order from <strong>${order.customerName}</strong>
                        </p>
                        <p class="activity-details">
                            Order ${order.id} • $${(order.total || 0).toFixed(2)} • ${timeAgo}
                        </p>
                    </div>
                    <div class="activity-status">
                        <span class="status-badge ${order.status}">${order.status}</span>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  async loadSecurityData() {
    try {
      const token = localStorage.getItem("authToken");

      // In a real implementation, these would be separate API endpoints
      // For now, we'll simulate security data
      this.updateSecurityMetrics({
        authLogs: 12,
        securityAlerts: 0,
        failedPayments: 1,
        blockedIPs: 0,
        suspiciousActivities: 0,
        fraudScore: "Low",
      });
    } catch (error) {
      console.error("Error loading security data:", error);
    }
  }

  updateSecurityMetrics(data) {
    const elements = {
      authLogCount: `${data.authLogs} today`,
      securityAlertCount: `${data.securityAlerts} active`,
      failedPayments: data.failedPayments,
      blockedIPs: data.blockedIPs,
      suspiciousActivities: data.suspiciousActivities,
      fraudScore: data.fraudScore,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  loadSectionData(sectionId) {
    switch (sectionId) {
      case "orders":
        this.loadServices();
        break;
      case "order-management":
        this.loadOrderManagement();
        break;
      case "customers":
        this.loadCustomers();
        break;
      case "invoices":
        this.loadInvoices();
        break;
      case "security":
        this.loadSecurityLogs();
        break;
      case "reports":
        // Set default date range for reports
        const today = new Date().toISOString().split("T")[0];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        const startDateElement = document.getElementById("reportStartDate");
        const endDateElement = document.getElementById("reportEndDate");
        if (startDateElement) startDateElement.value = thirtyDaysAgo;
        if (endDateElement) endDateElement.value = today;
        break;
      default:
        break;
    }
  }

  async loadOrderManagement() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Authentication failed");
      }

      const orders = await response.json();
      this.renderOrdersTable(orders);
    } catch (error) {
      console.error("Error loading orders:", error);
      if (error.message.includes("Authentication")) {
        this.redirectToLogin();
      } else {
        this.showNotification(
          "Error loading orders: " + error.message,
          "error",
        );
      }
    }
  }

  renderOrdersTable(orders) {
    const tableBody = document.getElementById("ordersTableBody");
    if (!tableBody) return;

    if (orders.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">No orders found</td>
                </tr>
            `;
      return;
    }

    tableBody.innerHTML = orders
      .map(
        (order) => `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customerName}</td>
                <td>
                    <div class="service-list">
                        ${(order.items || [])
                          .slice(0, 2)
                          .map(
                            (item) =>
                              `<span class="service-tag">${item.name}</span>`,
                          )
                          .join("")}
                        ${
                          (order.items || []).length > 2
                            ? `<span class="service-more">+${(order.items || []).length - 2} more</span>`
                            : ""
                        }
                    </div>
                </td>
                <td><strong>$${(order.total || 0).toFixed(2)}</strong></td>
                <td>
                    <span class="status-badge ${order.status}">${order.status}</span>
                </td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="dashboard.viewOrder('${order.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="dashboard.editOrder('${order.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon danger" onclick="dashboard.deleteOrder('${order.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `,
      )
      .join("");
  }

  loadSecurityLogs() {
    // Simulate security logs
    const authLogs = [
      {
        user: "admin",
        action: "LOGIN_SUCCESS",
        time: "2 minutes ago",
        ip: "192.168.1.100",
      },
      {
        user: "john.doe",
        action: "PASSWORD_CHANGED",
        time: "1 hour ago",
        ip: "192.168.1.105",
      },
      {
        user: "unknown",
        action: "LOGIN_FAILED",
        time: "3 hours ago",
        ip: "203.0.113.195",
      },
    ];

    const authLogsContainer = document.getElementById("authLogs");
    if (authLogsContainer) {
      authLogsContainer.innerHTML = authLogs
        .map(
          (log) => `
                <div class="log-item ${log.action.includes("FAILED") ? "danger" : "success"}">
                    <div class="log-content">
                        <p class="log-action">${log.action.replace("_", " ")}</p>
                        <p class="log-details">${log.user} • ${log.ip} • ${log.time}</p>
                    </div>
                </div>
            `,
        )
        .join("");
    }
  }

  setupEventListeners() {
    // Sidebar toggle
    document.addEventListener("click", (e) => {
      if (e.target.closest(".mobile-menu-btn")) {
        this.toggleSidebar();
      }
    });

    // Order form submission
    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
      orderForm.addEventListener("submit", (e) => this.handleOrderSubmit(e));
    }

    // User menu toggle
    document.addEventListener("click", (e) => {
      if (e.target.closest(".user-profile")) {
        this.toggleUserMenu();
      } else {
        // Close user menu if clicking outside
        const userMenu = document.getElementById("userMenu");
        if (userMenu && !e.target.closest(".user-menu")) {
          userMenu.classList.remove("show");
        }
      }
    });

    // Search functionality
    const orderSearch = document.getElementById("orderSearch");
    if (orderSearch) {
      orderSearch.addEventListener("input", (e) => {
        this.filterOrders(e.target.value);
      });
    }

    // Notification panel close
    document.addEventListener("click", (e) => {
      if (
        e.target.closest(".notification-panel") &&
        !e.target.closest(".close-btn")
      ) {
        return;
      }
      if (!e.target.closest('.action-btn[title="Notifications"]')) {
        this.closeNotifications();
      }
    });
  }

  startRealTimeUpdates() {
    // Update dashboard every 30 seconds
    this.refreshInterval = setInterval(() => {
      if (this.currentSection === "dashboard") {
        this.loadDashboardData();
      }
    }, 30000);
  }

  getStatusColor(status) {
    const colors = {
      pending: "warning",
      processing: "info",
      printing: "secondary",
      ready: "success",
      completed: "primary",
    };
    return colors[status] || "secondary";
  }

  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.style.display = show ? "flex" : "none";
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === "error" ? "exclamation-circle" : "info-circle"}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add to notification panel or create temporary toast
    const notificationList = document.getElementById("notificationList");
    if (notificationList) {
      notificationList.prepend(notification);
      this.updateNotificationCount();
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
        this.updateNotificationCount();
      }
    }, 5000);
  }

  updateNotificationCount() {
    const notificationList = document.getElementById("notificationList");
    const countElement = document.getElementById("notificationCount");

    if (notificationList && countElement) {
      const count = notificationList.children.length;
      countElement.textContent = count;
      countElement.style.display = count > 0 ? "block" : "none";
    }
  }

  redirectToLogin() {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  }

  // UI Helper Functions
  toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    sidebar.classList.toggle("show");
    if (window.innerWidth > 768) {
      mainContent.classList.toggle("expanded");
    }
  }

  toggleUserMenu() {
    const userMenu = document.getElementById("userMenu");
    const toggleIcon = document.getElementById("userMenuToggle");

    userMenu.classList.toggle("show");
    toggleIcon.classList.toggle("fa-chevron-up");
    toggleIcon.classList.toggle("fa-chevron-down");
  }

  toggleNotifications() {
    const panel = document.getElementById("notificationPanel");
    panel.classList.toggle("show");
  }

  closeNotifications() {
    const panel = document.getElementById("notificationPanel");
    panel.classList.remove("show");
  }

  // Action Functions
  async logout() {
    try {
      const token = localStorage.getItem("authToken");
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.redirectToLogin();
    }
  }

  viewOrder(orderId) {
    console.log("Viewing order:", orderId);
    // Implement order view functionality
  }

  editOrder(orderId) {
    console.log("Editing order:", orderId);
    // Implement order edit functionality
  }

  deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
      console.log("Deleting order:", orderId);
      // Implement order delete functionality
    }
  }

  filterOrders(searchTerm) {
    const tableBody = document.getElementById("ordersTableBody");
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const matches = text.includes(searchTerm.toLowerCase());
      row.style.display = matches ? "" : "none";
    });
  }

  createNewOrder() {
    this.switchSection("orders");
    this.loadServices();
  }

  exportOrders() {
    console.log("Exporting orders...");
    // Implement export functionality
  }

  // Order Form Methods
  async loadServices() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch("/api/services", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Authentication failed");
      }

      const services = await response.json();
      this.renderServices(services);
    } catch (error) {
      console.error("Error loading services:", error);
      if (error.message.includes("Authentication")) {
        this.redirectToLogin();
      }
    }
  }

  renderServices(services) {
    const servicesGrid = document.getElementById("servicesGrid");
    if (!servicesGrid) return;

    this.currentOrder = {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    };

    servicesGrid.innerHTML = services
      .map(
        (service) => `
      <div class="service-card" data-service-id="${service.id}">
        <div class="service-header">
          <span class="service-name">${service.name}</span>
          <span class="service-price">$${service.price.toFixed(2)}</span>
        </div>
        <div class="service-unit">per ${service.unit}</div>
        <div class="quantity-controls" style="display: none;">
          <button type="button" class="quantity-btn" onclick="dashboard.changeQuantity(${service.id}, -1)">-</button>
          <input type="number" class="quantity-input" id="qty-${service.id}" value="1" min="1">
          <button type="button" class="quantity-btn" onclick="dashboard.changeQuantity(${service.id}, 1)">+</button>
        </div>
      </div>
    `,
      )
      .join("");

    // Add click handlers
    servicesGrid.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("click", () => {
        const serviceId = parseInt(card.dataset.serviceId);
        this.selectService(serviceId, services, card);
      });
    });
  }

  selectService(serviceId, services, cardElement) {
    const service = services.find((s) => s.id === serviceId);
    const existingItem = this.currentOrder.items.find(
      (item) => item.serviceId === serviceId,
    );

    if (existingItem) {
      // Remove service
      this.currentOrder.items = this.currentOrder.items.filter(
        (item) => item.serviceId !== serviceId,
      );
      cardElement.classList.remove("selected");
      cardElement.querySelector(".quantity-controls").style.display = "none";
    } else {
      // Add service
      const quantity =
        parseInt(cardElement.querySelector(".quantity-input").value) || 1;
      this.currentOrder.items.push({
        serviceId: serviceId,
        name: service.name,
        price: service.price,
        unit: service.unit,
        quantity: quantity,
        total: service.price * quantity,
      });
      cardElement.classList.add("selected");
      cardElement.querySelector(".quantity-controls").style.display = "flex";
    }

    this.updateOrderSummary();
  }

  changeQuantity(serviceId, change) {
    const qtyInput = document.getElementById(`qty-${serviceId}`);
    const currentQty = parseInt(qtyInput.value);
    const newQty = Math.max(1, currentQty + change);
    qtyInput.value = newQty;

    // Update order item
    const orderItem = this.currentOrder.items.find(
      (item) => item.serviceId === serviceId,
    );
    if (orderItem) {
      orderItem.quantity = newQty;
      orderItem.total = orderItem.price * newQty;
      this.updateOrderSummary();
    }
  }

  updateOrderSummary() {
    const orderItemsContainer = document.getElementById("orderItems");

    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      if (orderItemsContainer) {
        orderItemsContainer.innerHTML =
          '<p class="no-items">No services selected</p>';
      }
    } else {
      if (orderItemsContainer) {
        orderItemsContainer.innerHTML = this.currentOrder.items
          .map(
            (item) => `
          <div class="order-item">
            <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-quantity">${item.quantity} ${item.unit}${item.quantity > 1 ? "s" : ""}</div>
            </div>
            <div class="item-price">$${item.total.toFixed(2)}</div>
            <button class="remove-item" onclick="dashboard.removeOrderItem(${item.serviceId})">Remove</button>
          </div>
        `,
          )
          .join("");
      }
    }

    // Calculate totals
    this.currentOrder.subtotal = this.currentOrder.items.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    this.currentOrder.tax = this.currentOrder.subtotal * 0.08; // 8% tax
    this.currentOrder.total =
      this.currentOrder.subtotal + this.currentOrder.tax;

    // Update display
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    if (subtotalElement)
      subtotalElement.textContent = `$${this.currentOrder.subtotal.toFixed(2)}`;
    if (taxElement)
      taxElement.textContent = `$${this.currentOrder.tax.toFixed(2)}`;
    if (totalElement)
      totalElement.textContent = `$${this.currentOrder.total.toFixed(2)}`;
  }

  removeOrderItem(serviceId) {
    this.currentOrder.items = this.currentOrder.items.filter(
      (item) => item.serviceId !== serviceId,
    );

    // Update service card
    const serviceCard = document.querySelector(
      `[data-service-id="${serviceId}"]`,
    );
    if (serviceCard) {
      serviceCard.classList.remove("selected");
      const controls = serviceCard.querySelector(".quantity-controls");
      if (controls) {
        controls.style.display = "none";
      }
    }

    this.updateOrderSummary();
  }

  async handleOrderSubmit(e) {
    e.preventDefault();

    if (!this.currentOrder || this.currentOrder.items.length === 0) {
      this.showNotification("Please select at least one service", "error");
      return;
    }

    const customerName = document.getElementById("customerName").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const customerAddress = document.getElementById("customerAddress").value;
    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked',
    ).value;

    if (!customerName || !customerPhone) {
      this.showNotification(
        "Please fill in customer name and phone number",
        "error",
      );
      return;
    }

    const orderData = {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items: this.currentOrder.items,
      subtotal: this.currentOrder.subtotal,
      tax: this.currentOrder.tax,
      total: this.currentOrder.total,
      paymentMethod,
    };

    try {
      const token = localStorage.getItem("authToken");

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (orderResponse.status === 401) {
        throw new Error("Authentication failed");
      }

      const order = await orderResponse.json();

      // Process payment
      const paymentResponse = await fetch("/api/process-payment-secure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: this.currentOrder.total,
          paymentMethod,
          customerPhone,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success) {
        this.showNotification(
          "Payment processed successfully! WhatsApp notification sent to customer.",
          "success",
        );
        this.clearOrder();
        this.loadDashboardData();

        // Show success details
        const successDetails = `Order ID: ${paymentResult.payment.orderId}
Payment ID: ${paymentResult.payment.id}
Amount: $${paymentResult.payment.amount.toFixed(2)}
Invoice ID: ${paymentResult.invoice.id}`;
        setTimeout(() => {
          alert("Payment Successful!\n\n" + successDetails);
        }, 1000);
      } else {
        this.showNotification(
          "Payment failed: " + paymentResult.error.message,
          "error",
        );
      }
    } catch (error) {
      console.error("Error processing order:", error);
      if (error.message.includes("Authentication")) {
        this.redirectToLogin();
      } else {
        this.showNotification(
          "Error processing order: " + error.message,
          "error",
        );
      }
    }
  }

  clearOrder() {
    this.currentOrder = {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    };

    // Reset form
    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
      orderForm.reset();
    }

    // Reset service cards
    document.querySelectorAll(".service-card").forEach((card) => {
      card.classList.remove("selected");
      const controls = card.querySelector(".quantity-controls");
      if (controls) {
        controls.style.display = "none";
      }
    });

    this.updateOrderSummary();
  }

  // Customer Management Methods
  async loadCustomers() {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Authentication failed");
      }

      const customers = await response.json();
      this.renderCustomersTable(customers);
    } catch (error) {
      console.error("Error loading customers:", error);
      if (error.message.includes("Authentication")) {
        this.redirectToLogin();
      }
    }
  }

  renderCustomersTable(customers) {
    const tableBody = document.getElementById("customersTableBody");
    if (!tableBody) return;

    if (customers.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="8" class="no-data">No customers found</td></tr>';
      return;
    }

    tableBody.innerHTML = customers
      .map(
        (customer) => `
      <tr>
        <td><strong>#${customer.id}</strong></td>
        <td>${customer.name || customer.customerName || "N/A"}</td>
        <td>${customer.phone || customer.customerPhone || "N/A"}</td>
        <td>${customer.email || customer.customerEmail || "N/A"}</td>
        <td>0</td>
        <td>$0.00</td>
        <td>${new Date(customer.createdAt).toLocaleDateString()}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="dashboard.viewCustomer(${customer.id})" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" onclick="dashboard.editCustomer(${customer.id})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  // Invoice Management Methods
  async loadInvoices() {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Authentication failed");
      }

      const invoices = await response.json();
      this.renderInvoicesTable(invoices);
    } catch (error) {
      console.error("Error loading invoices:", error);
      if (error.message.includes("Authentication")) {
        this.redirectToLogin();
      }
    }
  }

  renderInvoicesTable(invoices) {
    const tableBody = document.getElementById("invoicesTableBody");
    if (!tableBody) return;

    if (invoices.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="7" class="no-data">No invoices found</td></tr>';
      return;
    }

    tableBody.innerHTML = invoices
      .map(
        (invoice) => `
      <tr>
        <td><strong>${invoice.id}</strong></td>
        <td>${invoice.customerName}</td>
        <td>${invoice.orderId}</td>
        <td><strong>$${invoice.total.toFixed(2)}</strong></td>
        <td><span class="status-badge ${invoice.status}">${invoice.status}</span></td>
        <td>${new Date(invoice.generatedAt).toLocaleDateString()}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="dashboard.viewInvoice('${invoice.id}')" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" onclick="dashboard.downloadInvoicePDF('${invoice.id}')" title="Download PDF">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  async downloadInvoicePDF(invoiceId) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/invoice/${invoiceId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Authentication failed");
      }

      const result = await response.json();

      this.showNotification(`PDF generated: ${result.filename}`, "success");
      window.open(result.pdfUrl, "_blank");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      if (error.message.includes("Authentication")) {
        this.redirectToLogin();
      } else {
        this.showNotification(
          "Error downloading invoice PDF: " + error.message,
          "error",
        );
      }
    }
  }

  // Report Generation
  async generateReport() {
    try {
      const startDate = document.getElementById("reportStartDate").value;
      const endDate = document.getElementById("reportEndDate").value;

      if (!startDate || !endDate) {
        this.showNotification("Please select start and end dates", "error");
        return;
      }

      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (response.status === 401) {
        throw new Error("Authentication failed");
      }

      const report = await response.json();
      this.displayReport(report);
    } catch (error) {
      console.error("Error generating report:", error);
      if (error.message.includes("Authentication")) {
        this.redirectToLogin();
      } else {
        this.showNotification(
          "Error generating report: " + error.message,
          "error",
        );
      }
    }
  }

  displayReport(report) {
    const reportPeriod = document.getElementById("reportPeriod");
    if (reportPeriod) {
      reportPeriod.textContent = `${report.period.startDate} to ${report.period.endDate}`;
    }

    const topServicesReport = document.getElementById("topServicesReport");
    if (topServicesReport) {
      topServicesReport.innerHTML = report.topServices
        .map(
          (service) => `
        <div class="service-report-item">
          <span class="service-name">${service.name}</span>
          <span class="service-count">${service.count} orders</span>
        </div>
      `,
        )
        .join("");
    }

    const customerAnalytics = document.getElementById("customerAnalytics");
    if (customerAnalytics) {
      customerAnalytics.innerHTML = `
        <div class="analytics-item">
          <span class="label">Total Orders:</span>
          <span class="value">${report.totalOrders}</span>
        </div>
        <div class="analytics-item">
          <span class="label">Total Revenue:</span>
          <span class="value">$${report.totalRevenue.toFixed(2)}</span>
        </div>
        <div class="analytics-item">
          <span class="label">Average Order Value:</span>
          <span class="value">$${report.averageOrderValue.toFixed(2)}</span>
        </div>
      `;
    }

    this.showNotification("Report generated successfully", "success");
  }

  // Missing placeholder methods
  showAddCustomerModal() {
    this.showNotification(
      "Add Customer modal would open here. For demo, customers are auto-created with orders.",
      "info",
    );
  }

  exportCustomers() {
    this.showNotification(
      "Customer export functionality would be implemented here.",
      "info",
    );
  }

  exportInvoices() {
    this.showNotification(
      "Invoice export functionality would be implemented here.",
      "info",
    );
  }

  viewCustomer(customerId) {
    this.showNotification(`View customer ${customerId} details`, "info");
  }

  editCustomer(customerId) {
    this.showNotification(`Edit customer ${customerId}`, "info");
  }

  viewInvoice(invoiceId) {
    this.showNotification(`View invoice ${invoiceId} details`, "info");
  }
}

// Global functions for onclick handlers
function toggleSidebar() {
  dashboard.toggleSidebar();
}

function toggleUserMenu() {
  dashboard.toggleUserMenu();
}

function toggleNotifications() {
  dashboard.toggleNotifications();
}

function toggleQuickActions() {
  console.log("Quick actions menu");
}

function toggleSearch() {
  console.log("Search functionality");
}

function logout() {
  dashboard.logout();
}

// Initialize dashboard
let dashboard;
document.addEventListener("DOMContentLoaded", function () {
  dashboard = new DashboardManager();
});

// Handle browser back/forward
window.addEventListener("popstate", function (e) {
  if (e.state && e.state.section) {
    dashboard.switchSection(e.state.section);
  }
});

console.log("🏢 MelHad Investment - Enterprise Dashboard System Loaded");
