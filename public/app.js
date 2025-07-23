// Global application state
let currentOrder = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
};

let services = [];
let customers = [];
let orders = [];
let invoices = [];

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  loadServices();
  loadDashboardData();
  setupEventListeners();
});

// Initialize application
function initializeApp() {
  // Set today's date for reports
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").value = today;
  document.getElementById("endDate").value = today;

  console.log("🚀 MelHad Investment Payment App Initialized");
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchSection(this.dataset.section);
    });
  });

  // Order form submission
  document
    .getElementById("orderForm")
    .addEventListener("submit", handleOrderSubmit);

  // Modal close
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      closeModal();
    }
  });
}

// Navigation functions
function switchSection(sectionId) {
  // Update navigation
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .querySelector(`[data-section="${sectionId}"]`)
    .classList.add("active");

  // Update content
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");

  // Load section-specific data
  switch (sectionId) {
    case "dashboard":
      loadDashboardData();
      break;
    case "customers":
      loadCustomers();
      break;
    case "invoices":
      loadInvoices();
      break;
    case "orders":
      loadServices();
      break;
  }
}

// Load services from API
async function loadServices() {
  try {
    const response = await fetch("/api/services");
    services = await response.json();
    renderServices();
  } catch (error) {
    console.error("Error loading services:", error);
  }
}

// Render services grid
function renderServices() {
  const servicesGrid = document.getElementById("servicesGrid");
  servicesGrid.innerHTML = "";

  services.forEach((service) => {
    const serviceCard = document.createElement("div");
    serviceCard.className = "service-card";
    serviceCard.innerHTML = `
            <div class="service-header">
                <span class="service-name">${service.name}</span>
                <span class="service-price">$${service.price.toFixed(2)}</span>
            </div>
            <div class="service-unit">per ${service.unit}</div>
            <div class="quantity-controls" style="display: none;">
                <button type="button" class="quantity-btn" onclick="changeQuantity(${service.id}, -1)">-</button>
                <input type="number" class="quantity-input" id="qty-${service.id}" value="1" min="1">
                <button type="button" class="quantity-btn" onclick="changeQuantity(${service.id}, 1)">+</button>
            </div>
        `;

    serviceCard.addEventListener("click", function () {
      selectService(service.id, this);
    });

    servicesGrid.appendChild(serviceCard);
  });
}

// Select service
function selectService(serviceId, cardElement) {
  const service = services.find((s) => s.id === serviceId);
  const existingItem = currentOrder.items.find(
    (item) => item.serviceId === serviceId,
  );

  if (existingItem) {
    // Remove service
    currentOrder.items = currentOrder.items.filter(
      (item) => item.serviceId !== serviceId,
    );
    cardElement.classList.remove("selected");
    cardElement.querySelector(".quantity-controls").style.display = "none";
  } else {
    // Add service
    const quantity =
      parseInt(cardElement.querySelector(".quantity-input").value) || 1;
    currentOrder.items.push({
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

  updateOrderSummary();
}

// Change quantity
function changeQuantity(serviceId, change) {
  const qtyInput = document.getElementById(`qty-${serviceId}`);
  const currentQty = parseInt(qtyInput.value);
  const newQty = Math.max(1, currentQty + change);
  qtyInput.value = newQty;

  // Update order item
  const orderItem = currentOrder.items.find(
    (item) => item.serviceId === serviceId,
  );
  if (orderItem) {
    orderItem.quantity = newQty;
    orderItem.total = orderItem.price * newQty;
    updateOrderSummary();
  }
}

// Update order summary
function updateOrderSummary() {
  const orderItemsContainer = document.getElementById("orderItems");

  if (currentOrder.items.length === 0) {
    orderItemsContainer.innerHTML =
      '<p class="no-items">No services selected</p>';
  } else {
    orderItemsContainer.innerHTML = currentOrder.items
      .map(
        (item) => `
            <div class="order-item">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">${item.quantity} ${item.unit}${item.quantity > 1 ? "s" : ""}</div>
                </div>
                <div class="item-price">$${item.total.toFixed(2)}</div>
                <button class="remove-item" onclick="removeOrderItem(${item.serviceId})">Remove</button>
            </div>
        `,
      )
      .join("");
  }

  // Calculate totals
  currentOrder.subtotal = currentOrder.items.reduce(
    (sum, item) => sum + item.total,
    0,
  );
  currentOrder.tax = currentOrder.subtotal * 0.08; // 8% tax
  currentOrder.total = currentOrder.subtotal + currentOrder.tax;

  // Update display
  document.getElementById("subtotal").textContent =
    `$${currentOrder.subtotal.toFixed(2)}`;
  document.getElementById("tax").textContent =
    `$${currentOrder.tax.toFixed(2)}`;
  document.getElementById("total").textContent =
    `$${currentOrder.total.toFixed(2)}`;
}

// Remove order item
function removeOrderItem(serviceId) {
  currentOrder.items = currentOrder.items.filter(
    (item) => item.serviceId !== serviceId,
  );

  // Update service card
  const serviceCard = document.querySelector(
    `#servicesGrid .service-card:nth-child(${serviceId})`,
  );
  if (serviceCard) {
    serviceCard.classList.remove("selected");
    serviceCard.querySelector(".quantity-controls").style.display = "none";
  }

  updateOrderSummary();
}

// Handle order submission
async function handleOrderSubmit(e) {
  e.preventDefault();

  if (currentOrder.items.length === 0) {
    alert("Please select at least one service");
    return;
  }

  const formData = new FormData(e.target);
  const customerName =
    formData.get("customerName") ||
    document.getElementById("customerName").value;
  const customerPhone =
    formData.get("customerPhone") ||
    document.getElementById("customerPhone").value;
  const customerEmail = document.getElementById("customerEmail").value;
  const customerAddress = document.getElementById("customerAddress").value;
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked',
  ).value;

  if (!customerName || !customerPhone) {
    alert("Please fill in customer name and phone number");
    return;
  }

  const orderData = {
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    items: currentOrder.items,
    subtotal: currentOrder.subtotal,
    tax: currentOrder.tax,
    total: currentOrder.total,
    paymentMethod,
  };

  try {
    // Create order
    const orderResponse = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const order = await orderResponse.json();

    // Process payment
    const paymentResponse = await fetch("/api/process-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: order.id,
        amount: currentOrder.total,
        paymentMethod,
        customerPhone,
      }),
    });

    const paymentResult = await paymentResponse.json();

    if (paymentResult.success) {
      showSuccessModal(paymentResult);
      clearOrder();
      loadDashboardData();
    } else {
      alert("Payment failed. Please try again.");
    }
  } catch (error) {
    console.error("Error processing order:", error);
    alert("Error processing order. Please try again.");
  }
}

// Show success modal
function showSuccessModal(paymentResult) {
  const modal = document.getElementById("successModal");
  const message = document.getElementById("successMessage");

  message.innerHTML = `
        <p><strong>Order ID:</strong> ${paymentResult.payment.orderId}</p>
        <p><strong>Payment ID:</strong> ${paymentResult.payment.id}</p>
        <p><strong>Amount:</strong> $${paymentResult.payment.amount.toFixed(2)}</p>
        <p><strong>Invoice ID:</strong> ${paymentResult.invoice.id}</p>
        <p style="color: #28a745; margin-top: 1rem;">
            <i class="fas fa-whatsapp"></i> WhatsApp notification sent to customer!
        </p>
    `;

  modal.classList.add("active");

  // Store invoice for download
  window.currentInvoice = paymentResult.invoice;
}

// Close modal
function closeModal() {
  document.getElementById("successModal").classList.remove("active");
}

// Download invoice
async function downloadInvoice() {
  if (window.currentInvoice) {
    try {
      const response = await fetch(
        `/api/invoice/${window.currentInvoice.id}/pdf`,
      );
      const result = await response.json();

      // In a real app, this would trigger a PDF download
      alert(`Invoice PDF would be downloaded: ${result.pdfUrl}`);
      console.log("Invoice PDF URL:", result.pdfUrl);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  }
}

// Clear order
function clearOrder() {
  currentOrder = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  };

  // Reset form
  document.getElementById("orderForm").reset();

  // Reset service cards
  document.querySelectorAll(".service-card").forEach((card) => {
    card.classList.remove("selected");
    const controls = card.querySelector(".quantity-controls");
    if (controls) {
      controls.style.display = "none";
    }
  });

  updateOrderSummary();
}

// Load dashboard data
async function loadDashboardData() {
  try {
    const [ordersResponse, customersResponse, invoicesResponse] =
      await Promise.all([
        fetch("/api/orders"),
        fetch("/api/customers"),
        fetch("/api/invoices"),
      ]);

    orders = await ordersResponse.json();
    customers = await customersResponse.json();
    invoices = await invoicesResponse.json();

    updateDashboardStats();
    updateRecentOrders();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

// Update dashboard statistics
function updateDashboardStats() {
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

  // Update display
  document.getElementById("todayRevenue").textContent =
    `$${todayRevenue.toFixed(2)}`;
  document.getElementById("todayOrders").textContent = todayOrders.length;
  document.getElementById("pendingOrders").textContent = pendingOrders.length;
  document.getElementById("totalCustomers").textContent = customers.length;
}

// Update recent orders display
function updateRecentOrders() {
  const recentOrdersList = document.getElementById("recentOrdersList");

  if (orders.length === 0) {
    recentOrdersList.innerHTML =
      '<p class="no-data">No orders yet. Create your first order!</p>';
    return;
  }

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  recentOrdersList.innerHTML = recentOrders
    .map(
      (order) => `
        <div class="order-card" style="background: #f8f9fa; padding: 1rem; margin-bottom: 0.5rem; border-radius: 8px; border-left: 4px solid ${order.status === "paid" ? "#28a745" : "#ffc107"};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${order.customerName}</strong>
                    <div style="color: #666; font-size: 0.9rem;">${order.id}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600; color: #333;">$${(order.total || 0).toFixed(2)}</div>
                    <div style="color: ${order.status === "paid" ? "#28a745" : "#ffc107"}; font-size: 0.8rem; text-transform: uppercase;">
                        ${order.status}
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// Load customers
async function loadCustomers() {
  try {
    const response = await fetch("/api/customers");
    customers = await response.json();
    renderCustomers();
  } catch (error) {
    console.error("Error loading customers:", error);
  }
}

// Render customers
function renderCustomers() {
  const customersList = document.getElementById("customersList");

  if (customers.length === 0) {
    customersList.innerHTML =
      '<p class="no-data">No customers yet. Add your first customer!</p>';
    return;
  }

  customersList.innerHTML = customers
    .map(
      (customer) => `
        <div class="customer-card" style="background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin-bottom: 0.5rem;">${customer.name}</h3>
                    <p style="color: #666; margin-bottom: 0.25rem;"><i class="fas fa-phone"></i> ${customer.phone}</p>
                    ${customer.email ? `<p style="color: #666; margin-bottom: 0.25rem;"><i class="fas fa-envelope"></i> ${customer.email}</p>` : ""}
                    ${customer.address ? `<p style="color: #666;"><i class="fas fa-map-marker-alt"></i> ${customer.address}</p>` : ""}
                </div>
                <div style="text-align: right;">
                    <div style="color: #667eea; font-weight: 600;">Customer #${customer.id}</div>
                    <div style="color: #666; font-size: 0.9rem;">
                        Joined ${new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// Load invoices
async function loadInvoices() {
  try {
    const response = await fetch("/api/invoices");
    invoices = await response.json();
    renderInvoices();
  } catch (error) {
    console.error("Error loading invoices:", error);
  }
}

// Render invoices
function renderInvoices() {
  const invoicesList = document.getElementById("invoicesList");

  if (invoices.length === 0) {
    invoicesList.innerHTML =
      '<p class="no-data">No invoices yet. Process your first order!</p>';
    return;
  }

  invoicesList.innerHTML = invoices
    .map(
      (invoice) => `
        <div class="invoice-card" style="background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin-bottom: 0.5rem;">${invoice.id}</h3>
                    <p style="color: #666; margin-bottom: 0.25rem;">Customer: ${invoice.customerName}</p>
                    <p style="color: #666; margin-bottom: 0.25rem;">Order: ${invoice.orderId}</p>
                    <p style="color: #666;">Date: ${new Date(invoice.generatedAt).toLocaleDateString()}</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.2rem; font-weight: 600; color: #333;">$${invoice.total.toFixed(2)}</div>
                    <div style="color: #28a745; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem;">
                        ${invoice.status}
                    </div>
                    <button class="btn-primary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" 
                            onclick="downloadInvoicePDF('${invoice.id}')">
                        <i class="fas fa-download"></i> Download PDF
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// Download invoice PDF
async function downloadInvoicePDF(invoiceId) {
  try {
    const response = await fetch(`/api/invoice/${invoiceId}/pdf`);
    const result = await response.json();

    // In a real app, this would trigger a PDF download
    alert(`Invoice PDF would be downloaded: ${result.pdfUrl}`);
    console.log("Invoice PDF URL:", result.pdfUrl);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    alert("Error downloading invoice PDF");
  }
}

// Show add customer modal (placeholder)
function showAddCustomerModal() {
  alert(
    "Add Customer feature would open a modal here. For now, customers are auto-created when processing orders.",
  );
}

console.log(
  "📱 MelHad Investment Payment App - JavaScript Loaded Successfully",
);
