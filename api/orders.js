// MelHad Investment - Orders API
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Order Schema
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

const Order = mongoose.model('Order', orderSchema);

// Create new order
router.post('/create', async (req, res) => {
  try {
    const { customer, items, totals, delivery, payment, specialInstructions } = req.body;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Set initial order status based on payment method
    let initialStatus = 'pending';
    if (payment.method === 'bank-transfer') {
      initialStatus = 'pending-payment';
    }

    const order = new Order({
      orderId,
      customer,
      items,
      totals,
      delivery,
      payment: {
        ...payment,
        amount: totals.total,
        processingFee: totals.processingFee || 0
      },
      status: initialStatus,
      specialInstructions
    });

    await order.save();

    // Send WhatsApp notification (integrate with WhatsApp Business API)
    await sendWhatsAppNotification(customer.phone, orderId, totals.total, payment.method);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: orderId,
      order: order
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order: order
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
});

// Get orders by phone number
router.post('/history', async (req, res) => {
  try {
    const { phone } = req.body;
    
    const orders = await Order.find({ 
      'customer.phone': phone 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders: orders
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order history',
      error: error.message
    });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Send status update notification
    await sendStatusUpdateNotification(order.customer.phone, order.orderId, status);
    
    res.json({
      success: true,
      message: 'Order status updated',
      order: order
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Get all orders (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total: total
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
});

// WhatsApp notification function
async function sendWhatsAppNotification(phone, orderId, total, paymentMethod = 'mobile-money') {
  try {
    let message = `✅ *Order Confirmed - MelHad Investment*\n\n` +
      `Order ID: ${orderId}\n` +
      `Total: Le ${total.toLocaleString()}\n` +
      `Payment: ${paymentMethod.replace('-', ' ').toUpperCase()}\n\n`;

    if (paymentMethod === 'bank-transfer') {
      message += `Your order is pending payment verification. Please ensure you've transferred the exact amount using the order ID as reference.\n\n`;
    } else {
      message += `Thank you for choosing MelHad Investment! We'll update you on your order progress.\n\n`;
    }

    message += `Track your order: https://melhadinvestment.com/track?id=${orderId}`;

    // TODO: Implement actual WhatsApp Business API call
    console.log(`WhatsApp notification sent to ${phone}: ${message}`);

  } catch (error) {
    console.error('WhatsApp notification error:', error);
  }
}

// Status update notification function
async function sendStatusUpdateNotification(phone, orderId, status) {
  try {
    let message = `📱 *Order Update - MelHad Investment*\n\n` +
      `Order ID: ${orderId}\n` +
      `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}\n\n`;
    
    switch(status) {
      case 'confirmed':
        message += `Your order has been confirmed and is being prepared.`;
        break;
      case 'in-progress':
        message += `Your order is currently in production.`;
        break;
      case 'ready':
        message += `Great news! Your order is ready for pickup/delivery.`;
        break;
      case 'completed':
        message += `Your order has been completed. Thank you for choosing MelHad Investment!`;
        break;
    }
    
    // TODO: Implement actual WhatsApp Business API call
    console.log(`Status update sent to ${phone}: ${message}`);
    
  } catch (error) {
    console.error('Status update notification error:', error);
  }
}

// Update order payment information
router.patch('/:orderId/payment', async (req, res) => {
  try {
    const { paymentId, transactionId, status, receiptUrl } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      {
        'payment.paymentId': paymentId,
        'payment.transactionId': transactionId,
        'payment.status': status,
        'payment.receiptUrl': receiptUrl,
        'payment.paidAt': status === 'completed' ? new Date() : null,
        status: status === 'completed' ? 'confirmed' : 'pending',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Send payment confirmation notification
    if (status === 'completed') {
      await sendPaymentConfirmationNotification(order.customer.phone, order.orderId, order.totals.total);
    }

    res.json({
      success: true,
      message: 'Order payment updated',
      order: order
    });

  } catch (error) {
    console.error('Order payment update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order payment',
      error: error.message
    });
  }
});

// Process refund for order
router.post('/:orderId/refund', async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund unpaid order'
      });
    }

    // Update order status
    const refundAmount = amount || order.totals.total;
    const isFullRefund = refundAmount >= order.totals.total;

    order.payment.status = isFullRefund ? 'refunded' : 'partially_refunded';
    order.payment.refundedAt = new Date();
    order.status = isFullRefund ? 'cancelled' : order.status;
    order.updatedAt = new Date();

    await order.save();

    // Send refund notification
    await sendRefundNotification(order.customer.phone, order.orderId, refundAmount, reason);

    res.json({
      success: true,
      message: 'Refund processed successfully',
      order: order
    });

  } catch (error) {
    console.error('Order refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
});

// Get payment analytics
router.get('/analytics/payments', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchCondition = {};
    if (startDate && endDate) {
      matchCondition.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totals.total' },
          totalProcessingFees: { $sum: '$payment.processingFee' },
          completedPayments: {
            $sum: { $cond: [{ $eq: ['$payment.status', 'completed'] }, 1, 0] }
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ['$payment.status', 'pending'] }, 1, 0] }
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ['$payment.status', 'failed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Payment method breakdown
    const paymentMethods = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$payment.method',
          count: { $sum: 1 },
          revenue: { $sum: '$totals.total' }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: analytics[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        totalProcessingFees: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0
      },
      paymentMethods: paymentMethods
    });

  } catch (error) {
    console.error('Payment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment analytics',
      error: error.message
    });
  }
});

// Payment confirmation notification function
async function sendPaymentConfirmationNotification(phone, orderId, total) {
  try {
    const message = `\u2705 *Payment Confirmed - MelHad Investment*\\n\\n` +
      `Order ID: ${orderId}\\n` +
      `Amount: Le ${total.toLocaleString()}\\n\\n` +
      `Your payment has been confirmed! Your order is now being processed.\\n\\n` +
      `Expected completion: 2-3 business days\\n` +
      `Track progress: https://melhadinvestment.com/track?id=${orderId}`;

    console.log(`Payment confirmation sent to ${phone}: ${message}`);

  } catch (error) {
    console.error('Payment confirmation notification error:', error);
  }
}

// Refund notification function
async function sendRefundNotification(phone, orderId, amount, reason) {
  try {
    const message = `\u{1F4B0} *Refund Processed - MelHad Investment*\\n\\n` +
      `Order ID: ${orderId}\\n` +
      `Refund Amount: Le ${amount.toLocaleString()}\\n` +
      `Reason: ${reason || 'Customer request'}\\n\\n` +
      `Your refund has been processed and will reflect in your account within 3-5 business days.\\n\\n` +
      `Contact us: +232 XX XXX XXXX`;

    console.log(`Refund notification sent to ${phone}: ${message}`);

  } catch (error) {
    console.error('Refund notification error:', error);
  }
}

module.exports = router;
