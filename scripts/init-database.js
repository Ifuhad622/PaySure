// MelHad Investment - Database Initialization Script
const mongoose = require('mongoose');
require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas successfully');

    // Create collections with indexes
    await createCollections();
    await createIndexes();
    await seedInitialData();

    console.log('🎉 Database initialization completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function createCollections() {
  console.log('📄 Creating collections...');

  // Orders Collection
  const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String }
    },
    items: [{
      serviceId: { type: String, required: true },
      serviceName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true }
    }],
    totals: {
      subtotal: { type: Number, required: true },
      delivery: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },
    delivery: {
      method: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
      address: { type: String },
      fee: { type: Number, default: 0 }
    },
    payment: {
      method: { type: String, enum: ['stripe', 'paypal', 'orange-money', 'afrimoney', 'qmoney', 'bank-transfer'], required: true },
      status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending' },
      transactionId: { type: String },
      paymentId: { type: String },
      provider: { type: String },
      amount: { type: Number },
      processingFee: { type: Number, default: 0 },
      paidAt: { type: Date },
      refundedAt: { type: Date },
      receiptUrl: { type: String }
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'in-progress', 'ready', 'completed', 'cancelled'], 
      default: 'pending' 
    },
    specialInstructions: { type: String },
    files: [{ 
      filename: String, 
      originalName: String, 
      size: Number, 
      uploadedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Payments Collection
  const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    customerId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'SLE' },
    provider: { 
      type: String, 
      enum: ['stripe', 'paypal', 'orange-money', 'afrimoney', 'qmoney', 'bank-transfer'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending' 
    },
    transactionId: { type: String },
    receiptUrl: { type: String },
    metadata: {
      customerName: String,
      customerEmail: String,
      customerPhone: String,
      description: String
    },
    fees: {
      processingFee: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      totalFees: { type: Number, default: 0 }
    },
    refunds: [{
      refundId: String,
      amount: Number,
      reason: String,
      processedAt: Date
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  });

  // Customers Collection
  const customerSchema = new mongoose.Schema({
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    address: { type: String },
    location: { type: String },
    loyaltyPoints: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
    preferredPaymentMethod: { type: String },
    communicationPreferences: {
      whatsapp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Create models
  mongoose.model('Order', orderSchema);
  mongoose.model('Payment', paymentSchema);
  mongoose.model('Customer', customerSchema);

  console.log('✅ Collections created successfully');
}

async function createIndexes() {
  console.log('🔍 Creating database indexes...');

  const Order = mongoose.model('Order');
  const Payment = mongoose.model('Payment');
  const Customer = mongoose.model('Customer');

  // Order indexes
  await Order.createIndexes([
    { orderId: 1 },
    { 'customer.phone': 1 },
    { 'payment.status': 1 },
    { status: 1 },
    { createdAt: -1 },
    { 'customer.phone': 1, createdAt: -1 }
  ]);

  // Payment indexes
  await Payment.createIndexes([
    { paymentId: 1 },
    { orderId: 1 },
    { customerId: 1 },
    { provider: 1 },
    { status: 1 },
    { createdAt: -1 },
    { customerId: 1, createdAt: -1 }
  ]);

  // Customer indexes
  await Customer.createIndexes([
    { customerId: 1 },
    { phone: 1 },
    { email: 1 },
    { createdAt: -1 },
    { totalSpent: -1 }
  ]);

  console.log('✅ Database indexes created successfully');
}

async function seedInitialData() {
  console.log('🌱 Seeding initial data...');

  const Customer = mongoose.model('Customer');
  
  // Check if data already exists
  const existingCustomers = await Customer.countDocuments();
  if (existingCustomers > 0) {
    console.log('ℹ️  Data already exists, skipping seed');
    return;
  }

  // Seed sample data for testing
  const sampleCustomers = [
    {
      customerId: 'CUST-DEMO-001',
      name: 'Demo Customer',
      phone: '+23278475680',
      email: 'demo@melhadinvestment.com',
      address: 'Freetown, Sierra Leone',
      location: 'Freetown',
      loyaltyPoints: 0,
      totalOrders: 0,
      totalSpent: 0,
      isActive: true
    }
  ];

  await Customer.insertMany(sampleCustomers);
  console.log('✅ Initial data seeded successfully');
}

// Run initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
