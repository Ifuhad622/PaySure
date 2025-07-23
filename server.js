const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const mongoose = require("mongoose");
const PDFGenerator = require("./pdf-generator");
const WhatsAppService = require("./whatsapp-service");
const AuthService = require("./auth-service");
const ErrorService = require("./error-service");
const SecurityService = require("./security-service");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/melhad_investment';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📄 MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Continue without MongoDB for demo purposes
    console.log('⚠️  Running in demo mode without database');
  }
};

// Connect to database
connectDB();

// Initialize services
const errorService = new ErrorService();
const authService = new AuthService();
const securityService = new SecurityService(errorService);
const pdfGenerator = new PDFGenerator();
const whatsAppService = new WhatsAppService();

// Security middleware
app.use(helmet());
app.use(securityService.securityHeaders());
app.use(securityService.ipBlockingMiddleware());
app.use(errorService.requestLogger());

// Rate limiting for API routes
app.use("/api/", (req, res, next) =>
  securityService.checkRateLimit(req, res, next, "api"),
);

// CORS with security options
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Body parsing with limits
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/pdfs", express.static(path.join(__dirname, "public", "pdfs")));

// Mock database for demo (in production, use MongoDB)
let customers = [];
let orders = [];
let invoices = [];
let printServices = [
  // Printing Services (prices in Sierra Leone Leone)
  {
    id: 1,
    name: "Document Printing (Black & White)",
    price: 500,
    unit: "page",
    category: "printing",
  },
  {
    id: 2,
    name: "Document Printing (Color)",
    price: 1250,
    unit: "page",
    category: "printing",
  },
  {
    id: 3,
    name: "Photo Printing (4x6)",
    price: 2500,
    unit: "photo",
    category: "printing",
  },
  {
    id: 4,
    name: "Photo Printing (8x10)",
    price: 10000,
    unit: "photo",
    category: "printing",
  },
  {
    id: 5,
    name: "Business Cards",
    price: 75000,
    unit: "set of 100",
    category: "printing",
  },
  {
    id: 6,
    name: "Flyers & Posters",
    price: 3750,
    unit: "flyer",
    category: "printing",
  },
  {
    id: 7,
    name: "Banner Printing",
    price: 125000,
    unit: "banner",
    category: "printing",
  },
  {
    id: 8,
    name: "T-Shirt Printing",
    price: 60000,
    unit: "shirt",
    category: "printing",
  },

  // Digital Services
  {
    id: 9,
    name: "Basic Website",
    price: 2500000,
    unit: "website",
    category: "digital",
  },
  {
    id: 10,
    name: "E-commerce Website",
    price: 7500000,
    unit: "website",
    category: "digital",
  },
  {
    id: 11,
    name: "Web Application",
    price: 12500000,
    unit: "application",
    category: "digital",
  },
  {
    id: 12,
    name: "Logo Design",
    price: 500000,
    unit: "logo",
    category: "digital",
  },
  {
    id: 13,
    name: "Graphic Design",
    price: 250000,
    unit: "design",
    category: "digital",
  },
  {
    id: 14,
    name: "Social Media Management",
    price: 750000,
    unit: "month",
    category: "digital",
  },

  // IT & Network Services
  {
    id: 15,
    name: "Computer Repair",
    price: 150000,
    unit: "service",
    category: "support",
  },
  {
    id: 16,
    name: "Network Setup",
    price: 500000,
    unit: "setup",
    category: "support",
  },
  {
    id: 17,
    name: "IT Consulting",
    price: 200000,
    unit: "hour",
    category: "support",
  },
  {
    id: 18,
    name: "Data Recovery",
    price: 350000,
    unit: "recovery",
    category: "support",
  },
  {
    id: 19,
    name: "Software Installation",
    price: 75000,
    unit: "installation",
    category: "support",
  },
  {
    id: 20,
    name: "Security Setup",
    price: 125000,
    unit: "setup",
    category: "support",
  },
];

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: "Access token required" },
      });
    }

    const validation = await authService.validateSession(token);
    if (!validation.success) {
      return res.status(401).json({
        success: false,
        error: { message: validation.error },
      });
    }

    req.user = validation.user;
    req.session = validation.session;
    next();
  } catch (error) {
    errorService.logError(error, {
      url: req.url,
      method: req.method,
      headers: req.headers,
    });
    res.status(401).json({
      success: false,
      error: { message: "Invalid token" },
    });
  }
};

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/dashboard.html", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

// Authentication routes
app.post(
  "/api/auth/login",
  (req, res, next) => securityService.checkRateLimit(req, res, next, "login"),
  async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input
      const validatedUsername = securityService.validateInput(
        username,
        "string",
        { required: true, minLength: 3, maxLength: 50 },
      );
      const validatedPassword = securityService.validateInput(
        password,
        "string",
        { required: true, minLength: 6 },
      );

      // Generate device fingerprint
      const deviceFingerprint = securityService.generateDeviceFingerprint(req);

      const result = await authService.login(
        { username: validatedUsername, password: validatedPassword },
        req.ip,
        req.get("User-Agent"),
      );

      if (result.success) {
        // Track device
        securityService.trackDevice(deviceFingerprint, result.user.id, req.ip);

        res.json(result);
      } else {
        // Log failed login attempt
        errorService.logSecurityEvent("LOGIN_FAILED", {
          username: validatedUsername,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          reason: result.error,
        });

        res.status(401).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validate input
    const validatedData = {
      username: securityService.validateInput(username, "string", {
        required: true,
        minLength: 3,
        maxLength: 30,
      }),
      email: securityService.validateInput(email, "email", {
        required: true,
        maxLength: 100,
      }),
      password: securityService.validateInput(password, "string", {
        required: true,
        minLength: 8,
      }),
      firstName: securityService.validateInput(firstName, "string", {
        required: true,
        maxLength: 50,
      }),
      lastName: securityService.validateInput(lastName, "string", {
        required: true,
        maxLength: 50,
      }),
    };

    const result = await authService.register(validatedData);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const result = await authService.logout(token);
    res.json(result);
  } catch (error) {
    errorService.logError(error);
    res
      .status(500)
      .json({ success: false, error: { message: "Logout failed" } });
  }
});

app.get("/api/auth/validate", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    session: req.session,
  });
});

// Customer management
app.get("/api/customers", authenticateToken, (req, res) => {
  res.json(customers);
});

app.post("/api/customers", authenticateToken, (req, res) => {
  const customer = {
    id: customers.length + 1,
    ...req.body,
    createdAt: new Date(),
  };
  customers.push(customer);
  res.json(customer);
});

// Print services
app.get("/api/services", authenticateToken, (req, res) => {
  res.json(printServices);
});

// Orders
app.get("/api/orders", authenticateToken, (req, res) => {
  res.json(orders);
});

app.post("/api/orders", authenticateToken, (req, res) => {
  const order = {
    id: "ORD-" + Date.now(),
    ...req.body,
    status: "pending",
    createdAt: new Date(),
  };
  orders.push(order);
  res.json(order);
});

// Payment processing
app.post(
  "/api/process-payment",
  authenticateToken,
  (req, res, next) => securityService.checkRateLimit(req, res, next, "payment"),
  async (req, res) => {
    try {
      const { orderId, amount, paymentMethod, customerPhone } = req.body;

      // Mock payment processing (integrate with real payment gateway)
      const payment = {
        id: "PAY-" + Date.now(),
        orderId,
        amount,
        status: "completed",
        processedAt: new Date(),
      };

      // Update order status
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        order.status = "paid";
        order.paymentId = payment.id;
      }

      // Generate invoice
      const invoice = generateInvoice(order, payment);
      invoices.push(invoice);

      // Send WhatsApp notification (mock)
      if (customerPhone) {
        await sendWhatsAppNotification(customerPhone, order, invoice);
      }

      res.json({
        success: true,
        payment,
        invoice,
        message: "Payment processed successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Invoice generation
app.get("/api/invoices", authenticateToken, (req, res) => {
  res.json(invoices);
});

app.get("/api/invoice/:id/pdf", authenticateToken, async (req, res) => {
  try {
    const invoice = invoices.find((inv) => inv.id === req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const order = orders.find((o) => o.id === invoice.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Generate PDF
    const pdfResult = await pdfGenerator.generateInvoice(invoice, order, {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      customerAddress: order.customerAddress,
    });

    res.json({
      pdfUrl: pdfResult.url,
      filename: pdfResult.filename,
      message: "PDF generated successfully",
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// Mock functions
function generateInvoice(order, payment) {
  return {
    id: "INV-" + Date.now(),
    orderId: order.id,
    paymentId: payment.id,
    customerName: order.customerName,
    items: order.items,
    subtotal: order.subtotal,
    tax: order.tax || 0,
    total: order.total,
    status: "paid",
    generatedAt: new Date(),
  };
}

async function sendWhatsAppNotification(phone, order, invoice) {
  try {
    const result = await whatsAppService.sendPaymentConfirmation(
      phone,
      order,
      invoice,
    );
    if (result.success) {
      console.log(
        `📱 WhatsApp notification sent to ${phone}: ${result.messageId}`,
      );
      return true;
    } else {
      console.error(`❌ WhatsApp notification failed: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    return false;
  }
}

// Order status updates
app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = orders.find((o) => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    order.updatedAt = new Date();

    // Send WhatsApp notification for status update
    if (order.customerPhone) {
      await whatsAppService.sendOrderStatusUpdate(
        order.customerPhone,
        order,
        status,
      );
    }

    res.json({
      success: true,
      order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk invoice generation for reporting
app.post("/api/generate-report", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end && order.status === "paid";
    });

    const report = {
      period: { startDate, endDate },
      totalOrders: filteredOrders.length,
      totalRevenue: filteredOrders.reduce(
        (sum, order) => sum + (order.total || 0),
        0,
      ),
      averageOrderValue:
        filteredOrders.length > 0
          ? filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0) /
            filteredOrders.length
          : 0,
      topServices: getTopServices(filteredOrders),
      orders: filteredOrders,
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function for top services
function getTopServices(orders) {
  const serviceCount = {};

  orders.forEach((order) => {
    if (order.items) {
      order.items.forEach((item) => {
        if (serviceCount[item.name]) {
          serviceCount[item.name] += item.quantity;
        } else {
          serviceCount[item.name] = item.quantity;
        }
      });
    }
  });

  return Object.entries(serviceCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

// Admin routes (protected)
app.get("/api/admin/users", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: { message: "Admin access required" } });
  }
  res.json(authService.getAllUsers());
});

app.get("/api/admin/audit-logs", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: { message: "Admin access required" } });
  }
  res.json(authService.getAuditLogs());
});

app.get("/api/admin/security-stats", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: { message: "Admin access required" } });
  }
  res.json({
    errorStats: errorService.getErrorStats(),
    securityStats: errorService.getSecurityStats(),
  });
});

// Enhanced payment processing with fraud detection
app.post("/api/process-payment-secure", authenticateToken, async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, customerPhone } = req.body;

    // Validate input
    const validatedAmount = securityService.validateInput(amount, "amount", {
      min: 0.01,
      max: 10000,
    });
    const validatedPhone = securityService.validateInput(
      customerPhone,
      "phone",
      { required: true },
    );

    // Generate device fingerprint
    const deviceFingerprint = securityService.generateDeviceFingerprint(req);

    // Analyze payment risk
    const riskAnalysis = securityService.analyzePaymentRisk(
      { amount: validatedAmount, customerPhone: validatedPhone },
      req.user,
      deviceFingerprint,
    );

    // Block high-risk transactions
    if (riskAnalysis.recommendation === "BLOCK_TRANSACTION") {
      errorService.logSecurityEvent("HIGH_RISK_PAYMENT_BLOCKED", {
        userId: req.user.id,
        amount: validatedAmount,
        riskScore: riskAnalysis.riskScore,
        riskFactors: riskAnalysis.riskFactors,
      });

      return res.status(403).json({
        success: false,
        error: { message: "Transaction blocked due to security concerns" },
        riskLevel: riskAnalysis.riskLevel,
      });
    }

    // Process payment normally
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      throw errorService.createNotFoundError("Order not found");
    }

    const payment = {
      id: "PAY-" + Date.now(),
      orderId,
      amount: validatedAmount,
      status: "completed",
      riskScore: riskAnalysis.riskScore,
      processedAt: new Date(),
    };

    order.status = "paid";
    order.paymentId = payment.id;

    const invoice = generateInvoice(order, payment);
    invoices.push(invoice);

    // Send WhatsApp notification
    if (validatedPhone) {
      await sendWhatsAppNotification(validatedPhone, order, invoice);
    }

    // Log successful payment
    authService.logAuditEvent("PAYMENT_PROCESSED", req.user.id, {
      orderId,
      amount: validatedAmount,
      paymentId: payment.id,
      riskScore: riskAnalysis.riskScore,
    });

    res.json({
      success: true,
      payment,
      invoice,
      riskAnalysis,
      message: "Payment processed successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Import API routes
const ordersAPI = require('./api/orders');
const paymentsAPI = require('./api/payments');
const receiptsAPI = require('./api/receipts');
const customersAPI = require('./api/customers');

// API Routes
app.use('/api/orders', ordersAPI);
app.use('/api/payments', paymentsAPI);
app.use('/api/receipts', receiptsAPI);
app.use('/api/customers', customersAPI);

// Customer payment processing with PDF generation (no authentication required)
app.post("/api/customer/process-payment", async (req, res) => {
  try {
    const { orderData, paymentData } = req.body;

    // Validate input
    const validatedOrderData = securityService.validateInput(orderData, "object", {
      required: true,
    });
    const validatedPaymentData = securityService.validateInput(paymentData, "object", {
      required: true,
    });

    // Create order record
    const order = {
      id: "ORD-" + Date.now(),
      customerName: orderData.customer.name,
      customerPhone: orderData.customer.phone,
      customerEmail: orderData.customer.email || '',
      customerAddress: orderData.customer.address || '',
      items: orderData.items,
      subtotal: orderData.totals.subtotal,
      tax: orderData.totals.tax || 0,
      total: orderData.totals.total,
      deliveryFee: orderData.totals.deliveryFee || 0,
      status: "processing",
      createdAt: new Date(),
    };

    orders.push(order);

    // Process payment
    const payment = {
      id: paymentData.id,
      orderId: order.id,
      amount: paymentData.amount,
      method: paymentData.method,
      phone: paymentData.phone,
      status: "completed",
      processedAt: new Date(),
      securityScore: paymentData.securityScore || 100,
      transactionHash: paymentData.transactionHash,
    };

    // Update order status
    order.status = "paid";
    order.paymentId = payment.id;

    // Generate invoice
    const invoice = generateInvoice(order, payment);
    invoices.push(invoice);

    // Generate PDF
    const pdfResult = await pdfGenerator.generateInvoice(invoice, order, {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      customerAddress: order.customerAddress,
    });

    // Send WhatsApp notification with PDF
    if (order.customerPhone) {
      await whatsAppService.sendPaymentConfirmation(order.customerPhone, order, {
        ...invoice,
        pdfUrl: pdfResult.url,
      });
    }

    res.json({
      success: true,
      payment,
      invoice: {
        ...invoice,
        pdfUrl: pdfResult.url,
        pdfFilename: pdfResult.filename,
      },
      order,
      message: "Payment processed successfully and PDF generated",
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});

// Customer order endpoints (no authentication required)
app.post("/api/customer/order", async (req, res) => {
  try {
    const { customer, items, delivery, specialInstructions, totals } = req.body;

    // Validate required fields
    if (!customer.name || !customer.phone || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: "Customer name, phone, and items are required" },
      });
    }

    // Create customer order
    const order = {
      id: "ORD-" + Date.now(),
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerLocation: customer.location,
      items: items,
      delivery: delivery,
      specialInstructions: specialInstructions,
      subtotal: totals.subtotal,
      deliveryFee: totals.delivery,
      total: totals.total,
      status: "pending",
      createdAt: new Date(),
    };

    orders.push(order);

    // Add customer to database if not exists
    const existingCustomer = customers.find(
      (c) =>
        c.customerPhone === customer.phone ||
        c.customerEmail === customer.email,
    );

    if (!existingCustomer) {
      const newCustomer = {
        id: customers.length + 1,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerLocation: customer.location,
        createdAt: new Date(),
      };
      customers.push(newCustomer);
    }

    // Send WhatsApp notification to business
    const businessMessage =
      `🔔 *New Customer Order*\n\n` +
      `Order ID: ${order.id}\n` +
      `Customer: ${customer.name}\n` +
      `Phone: ${customer.phone}\n` +
      `Total: Le ${totals.total.toLocaleString()}\n\n` +
      `Items: ${items.length} service(s)\n` +
      `Delivery: ${delivery.option}\n\n` +
      `Please review and process this order.`;

    console.log("📱 Business notification:", businessMessage);

    res.json({
      success: true,
      order: order,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Customer order error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to place order" },
    });
  }
});

// Generate payment link
app.post("/api/customer/payment-link", async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!orderData || !orderData.totals) {
      return res.status(400).json({
        success: false,
        error: { message: "Order data is required" },
      });
    }

    // Generate payment link
    const paymentId = "PAY-" + Date.now();
    const paymentLink = `${req.protocol}://${req.get("host")}/payment/${paymentId}`;

    // Store payment data (in production, use database)
    const paymentData = {
      id: paymentId,
      orderData: orderData,
      amount: orderData.totals.total,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    // In production, store in database
    console.log("💳 Payment link generated:", paymentData);

    res.json({
      success: true,
      paymentLink: paymentLink,
      paymentId: paymentId,
      expiresAt: paymentData.expiresAt,
    });
  } catch (error) {
    console.error("Payment link generation error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to generate payment link" },
    });
  }
});

// Payment page
app.get("/payment/:paymentId", (req, res) => {
  const { paymentId } = req.params;

  // In production, fetch payment data from database
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment - MelHad Investment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .logo { color: #2C5530; font-size: 2rem; margin-bottom: 20px; }
            h1 { color: #2C5530; }
            .payment-info { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
            .amount { font-size: 2rem; font-weight: bold; color: #2C5530; margin: 20px 0; }
            .payment-methods { margin: 20px 0; }
            .method { background: #2C5530; color: white; padding: 15px; margin: 10px 0; border-radius: 8px; text-decoration: none; display: block; }
            .method:hover { background: #1B3A1E; }
            .whatsapp { background: #25D366; }
            .whatsapp:hover { background: #128C7E; }
            .contact { margin-top: 30px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🏢</div>
            <h1>MelHad Investment</h1>
            <p>Secure Payment Portal</p>

            <div class="payment-info">
                <h3>Payment ID: ${paymentId}</h3>
                <p>Click below to complete your payment</p>
            </div>

            <div class="payment-methods">
                                <a href="https://wa.me/23278475680?text=I want to pay for order ${paymentId}" class="method whatsapp">
                    📱 Pay via WhatsApp
                </a>
                                <a href="tel:+23278475680" class="method">
                    📞 Call to Pay
                </a>
                                <a href="mailto:melhad0121@gmail.com?subject=Payment for ${paymentId}" class="method">
                    📧 Email Payment Details
                </a>
            </div>

            <div class="contact">
                <p><strong>MelHad Investment</strong></p>
                <p>Freetown, Sierra Leone</p>
                                <p>+232 78 475 680</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Public services endpoint (no authentication required)
app.get("/api/public/services", (req, res) => {
  res.json(printServices);
});

// WhatsApp webhook setup
whatsAppService.setupWebhook(app);

// Global error handler (must be last)
app.use(errorService.errorHandler());

app.listen(PORT, () => {
  console.log(
    `🚀 MelHad Investment Payment Server running on http://localhost:${PORT}`,
  );
  console.log(
    `📊 Enterprise features: Payment Processing, Invoice Generation, WhatsApp Notifications`,
  );
  console.log(
    `📱 WhatsApp Service: ${whatsAppService.client ? "Live Mode" : "Demo Mode"}`,
  );
  console.log(`📄 PDF Generation: Enabled`);
});
