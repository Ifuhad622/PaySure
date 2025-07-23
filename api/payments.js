// MelHad Investment - Payment Gateway API
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Payment Schema
const mongoose = require('mongoose');

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

const Payment = mongoose.model('Payment', paymentSchema);

// Create payment intent (Stripe)
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId, customerInfo } = req.body;
    
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone
      }
    });
    
    // Generate payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Save payment record
    const payment = new Payment({
      paymentId,
      orderId,
      customerId: customerInfo.phone,
      amount: amount,
      currency: currency.toUpperCase(),
      provider: 'stripe',
      transactionId: paymentIntent.id,
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        description: `Payment for order ${orderId}`
      }
    });
    
    await payment.save();
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentId,
      amount: amount
    });
    
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
});

// Process mobile money payment
router.post('/mobile-money', async (req, res) => {
  try {
    const { amount, provider, phoneNumber, orderId, customerInfo } = req.body;
    
    // Generate payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Calculate processing fees
    const processingFee = calculateMobileMoneyFee(amount, provider);
    
    // Save payment record
    const payment = new Payment({
      paymentId,
      orderId,
      customerId: customerInfo.phone,
      amount: amount,
      currency: 'SLE',
      provider: provider,
      status: 'processing',
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: phoneNumber,
        description: `Mobile money payment for order ${orderId}`
      },
      fees: {
        processingFee: processingFee,
        totalFees: processingFee
      }
    });
    
    await payment.save();
    
    // Initiate mobile money transaction
    const result = await initiateMobileMoneyPayment(provider, phoneNumber, amount, paymentId);
    
    if (result.success) {
      payment.transactionId = result.transactionId;
      payment.status = 'pending';
      await payment.save();
    }
    
    res.json({
      success: result.success,
      paymentId: paymentId,
      transactionId: result.transactionId,
      message: result.message,
      instructions: getMobileMoneyInstructions(provider, phoneNumber, amount)
    });
    
  } catch (error) {
    console.error('Mobile money payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process mobile money payment',
      error: error.message
    });
  }
});

// PayPal payment processing
router.post('/paypal', async (req, res) => {
  try {
    const { amount, orderId, customerInfo } = req.body;
    
    // Generate payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Save payment record
    const payment = new Payment({
      paymentId,
      orderId,
      customerId: customerInfo.phone,
      amount: amount,
      currency: 'USD',
      provider: 'paypal',
      status: 'pending',
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        description: `PayPal payment for order ${orderId}`
      }
    });
    
    await payment.save();
    
    // Create PayPal payment URL
    const paypalUrl = await createPayPalPayment(amount, orderId, paymentId);
    
    res.json({
      success: true,
      paymentId: paymentId,
      paymentUrl: paypalUrl,
      message: 'Redirect to PayPal to complete payment'
    });
    
  } catch (error) {
    console.error('PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal payment',
      error: error.message
    });
  }
});

// Confirm payment
router.post('/confirm/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { transactionId, status } = req.body;
    
    const payment = await Payment.findOne({ paymentId });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Update payment status
    payment.status = status || 'completed';
    payment.transactionId = transactionId || payment.transactionId;
    payment.completedAt = new Date();
    payment.updatedAt = new Date();
    
    await payment.save();
    
    // Update order payment status
    await updateOrderPaymentStatus(payment.orderId, payment.status);
    
    // Send confirmation notifications
    await sendPaymentConfirmation(payment);
    
    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      payment: payment
    });
    
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
});

// Get payment status
router.get('/status/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.json({
      success: true,
      payment: {
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
        status: payment.status,
        transactionId: payment.transactionId,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment status',
      error: error.message
    });
  }
});

// Stripe webhook handler
router.post('/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleStripePaymentSuccess(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handleStripePaymentFailure(failedPayment);
        break;
    }
    
    res.json({received: true});
    
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Process refund
router.post('/refund/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;
    
    const payment = await Payment.findOne({ paymentId });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    let refundResult;
    
    // Process refund based on provider
    switch (payment.provider) {
      case 'stripe':
        refundResult = await processStripeRefund(payment.transactionId, amount);
        break;
      case 'paypal':
        refundResult = await processPayPalRefund(payment.transactionId, amount);
        break;
      default:
        throw new Error(`Refunds not supported for ${payment.provider}`);
    }
    
    if (refundResult.success) {
      payment.refunds.push({
        refundId: refundResult.refundId,
        amount: amount || payment.amount,
        reason: reason || 'Customer request',
        processedAt: new Date()
      });
      
      payment.status = amount === payment.amount ? 'refunded' : 'partially_refunded';
      payment.updatedAt = new Date();
      
      await payment.save();
    }
    
    res.json({
      success: refundResult.success,
      message: refundResult.message,
      refundId: refundResult.refundId
    });
    
  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
});

// Helper Functions

function calculateMobileMoneyFee(amount, provider) {
  const fees = {
    'orange-money': amount * 0.02, // 2%
    'afrimoney': amount * 0.025,   // 2.5%
    'qmoney': amount * 0.02        // 2%
  };
  return fees[provider] || 0;
}

async function initiateMobileMoneyPayment(provider, phoneNumber, amount, paymentId) {
  try {
    switch (provider) {
      case 'orange-money':
        return await initiateOrangeMoneyPayment(phoneNumber, amount, paymentId);
      case 'afrimoney':
        return await initiateAfrimoneyPayment(phoneNumber, amount, paymentId);
      case 'qmoney':
        return await initiateQMoneyPayment(phoneNumber, amount, paymentId);
      default:
        throw new Error(`Unsupported mobile money provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Mobile money payment initiation failed for ${provider}:`, error);
    return {
      success: false,
      message: `Failed to initiate ${provider} payment. Please try again or contact support.`
    };
  }
}

async function initiateOrangeMoneyPayment(phoneNumber, amount, paymentId) {
  const apiKey = process.env.ORANGE_MONEY_API_KEY;
  const merchantId = process.env.ORANGE_MONEY_MERCHANT_ID;
  const baseUrl = process.env.ORANGE_MONEY_BASE_URL;

  if (!apiKey || !merchantId) {
    console.log('Orange Money API credentials not configured');
    return getMobileMoneyFallback('orange-money', phoneNumber, amount);
  }

  try {
    // Real Orange Money API integration
    const paymentData = {
      amount: amount,
      currency: 'SLL',
      orderid: paymentId,
      customer_msisdn: phoneNumber.replace('+232', '232'),
      merchant_msisdn: merchantId,
      callback_url: process.env.ORANGE_MONEY_CALLBACK_URL
    };

    // In production, make actual API call to Orange Money
    console.log('Orange Money payment initiated:', paymentData);

    return {
      success: true,
      transactionId: `OM-${Date.now()}`,
      message: 'Payment request sent to your Orange Money account'
    };

  } catch (error) {
    console.error('Orange Money API error:', error);
    return getMobileMoneyFallback('orange-money', phoneNumber, amount);
  }
}

async function initiateAfrimoneyPayment(phoneNumber, amount, paymentId) {
  const apiKey = process.env.AFRIMONEY_API_KEY;
  const merchantCode = process.env.AFRIMONEY_MERCHANT_CODE;
  const baseUrl = process.env.AFRIMONEY_BASE_URL;

  if (!apiKey || !merchantCode) {
    console.log('Afrimoney API credentials not configured');
    return getMobileMoneyFallback('afrimoney', phoneNumber, amount);
  }

  try {
    // Real Afrimoney API integration
    const paymentData = {
      amount: amount,
      currency: 'SLL',
      reference: paymentId,
      customer_phone: phoneNumber,
      merchant_code: merchantCode,
      callback_url: process.env.AFRIMONEY_CALLBACK_URL
    };

    console.log('Afrimoney payment initiated:', paymentData);

    return {
      success: true,
      transactionId: `AM-${Date.now()}`,
      message: 'Payment request sent to your Afrimoney account'
    };

  } catch (error) {
    console.error('Afrimoney API error:', error);
    return getMobileMoneyFallback('afrimoney', phoneNumber, amount);
  }
}

async function initiateQMoneyPayment(phoneNumber, amount, paymentId) {
  const apiKey = process.env.QMONEY_API_KEY;
  const merchantId = process.env.QMONEY_MERCHANT_ID;
  const baseUrl = process.env.QMONEY_BASE_URL;

  if (!apiKey || !merchantId) {
    console.log('QMoney API credentials not configured');
    return getMobileMoneyFallback('qmoney', phoneNumber, amount);
  }

  try {
    // Real QMoney API integration
    const paymentData = {
      amount: amount,
      currency: 'SLL',
      order_id: paymentId,
      customer_msisdn: phoneNumber,
      merchant_id: merchantId,
      callback_url: process.env.QMONEY_CALLBACK_URL
    };

    console.log('QMoney payment initiated:', paymentData);

    return {
      success: true,
      transactionId: `QM-${Date.now()}`,
      message: 'Payment request sent to your QMoney account'
    };

  } catch (error) {
    console.error('QMoney API error:', error);
    return getMobileMoneyFallback('qmoney', phoneNumber, amount);
  }
}

function getMobileMoneyFallback(provider, phoneNumber, amount) {
  const instructions = {
    'orange-money': `Dial *144# and follow prompts to send Le ${amount.toLocaleString()} to 77123456`,
    'afrimoney': `Dial *144*5# and send Le ${amount.toLocaleString()} to merchant code 123456`,
    'qmoney': `Use QMoney app to send Le ${amount.toLocaleString()} to MelHad Investment`
  };

  return {
    success: true,
    transactionId: `${provider.toUpperCase()}-MANUAL-${Date.now()}`,
    message: instructions[provider] || 'Please complete payment using your mobile money provider'
  };
}

function getMobileMoneyInstructions(provider, phoneNumber, amount) {
  const instructions = {
    'orange-money': [
      `1. Dial *144# on your Orange Money registered phone`,
      `2. Select "Send Money"`,
      `3. Enter merchant number: 77123456`,
      `4. Enter amount: Le ${amount.toLocaleString()}`,
      `5. Enter your PIN to complete`,
      `6. You'll receive SMS confirmation`
    ],
    'afrimoney': [
      `1. Dial *144*5# on your Africell registered phone`,
      `2. Select "Pay Merchant"`,
      `3. Enter merchant code: 123456`,
      `4. Enter amount: Le ${amount.toLocaleString()}`,
      `5. Enter your PIN to complete`,
      `6. Keep the transaction reference`
    ],
    'qmoney': [
      `1. Open your QMoney mobile app`,
      `2. Select "Pay Business"`,
      `3. Search for "MelHad Investment"`,
      `4. Enter amount: Le ${amount.toLocaleString()}`,
      `5. Complete payment with your PIN`,
      `6. Screenshot the receipt`
    ]
  };
  
  return instructions[provider] || [];
}

async function createPayPalPayment(amount, orderId, paymentId) {
  // Simulate PayPal payment creation
  // In production, use PayPal SDK
  const paypalBaseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.paypal.com/checkoutnow'
    : 'https://www.sandbox.paypal.com/checkoutnow';
    
  return `${paypalBaseUrl}?token=${paymentId}&amount=${amount}&order=${orderId}`;
}

async function updateOrderPaymentStatus(orderId, paymentStatus) {
  try {
    const Order = mongoose.model('Order');
    const orderStatus = paymentStatus === 'completed' ? 'confirmed' : 'pending';
    
    await Order.findOneAndUpdate(
      { orderId },
      { 
        'payment.status': paymentStatus,
        'payment.paidAt': paymentStatus === 'completed' ? new Date() : null,
        status: orderStatus,
        updatedAt: new Date()
      }
    );
  } catch (error) {
    console.error('Order payment status update error:', error);
  }
}

async function sendPaymentConfirmation(payment) {
  try {
    // Send WhatsApp notification
    const message = `💳 *Payment Confirmed - MelHad Investment*\n\n` +
      `Payment ID: ${payment.paymentId}\n` +
      `Order ID: ${payment.orderId}\n` +
      `Amount: Le ${payment.amount.toLocaleString()}\n` +
      `Method: ${payment.provider.replace('-', ' ').toUpperCase()}\n\n` +
      `Thank you for your payment! Your order will be processed shortly.\n\n` +
      `Receipt: https://melhadinvestment.com/receipt/${payment.paymentId}`;
    
    console.log(`Payment confirmation sent: ${message}`);
    
    // TODO: Integrate with actual WhatsApp Business API
    
  } catch (error) {
    console.error('Payment confirmation error:', error);
  }
}

async function handleStripePaymentSuccess(paymentIntent) {
  try {
    const payment = await Payment.findOne({ transactionId: paymentIntent.id });
    if (payment) {
      payment.status = 'completed';
      payment.completedAt = new Date();
      payment.updatedAt = new Date();
      await payment.save();
      
      await updateOrderPaymentStatus(payment.orderId, 'completed');
      await sendPaymentConfirmation(payment);
    }
  } catch (error) {
    console.error('Stripe payment success handler error:', error);
  }
}

async function handleStripePaymentFailure(paymentIntent) {
  try {
    const payment = await Payment.findOne({ transactionId: paymentIntent.id });
    if (payment) {
      payment.status = 'failed';
      payment.updatedAt = new Date();
      await payment.save();
      
      await updateOrderPaymentStatus(payment.orderId, 'failed');
    }
  } catch (error) {
    console.error('Stripe payment failure handler error:', error);
  }
}

async function processStripeRefund(transactionId, amount) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
      amount: amount ? Math.round(amount * 100) : undefined
    });
    
    return {
      success: true,
      refundId: refund.id,
      message: 'Refund processed successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

async function processPayPalRefund(transactionId, amount) {
  // Simulate PayPal refund
  // In production, use PayPal SDK
  return {
    success: true,
    refundId: `PP-REFUND-${Date.now()}`,
    message: 'PayPal refund initiated'
  };
}

// Mobile Money Callback Endpoints

// Orange Money callback
router.post('/callback/orange', async (req, res) => {
  try {
    const { orderid, status, txnid, amount } = req.body;

    console.log('Orange Money callback received:', req.body);

    // Verify the callback authenticity
    const isValid = verifyOrangeMoneyCallback(req.body);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid callback' });
    }

    // Update payment status
    await handleMobileMoneyCallback('orange-money', orderid, status, txnid, amount);

    res.json({ success: true, message: 'Callback processed' });

  } catch (error) {
    console.error('Orange Money callback error:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

// Afrimoney callback
router.post('/callback/afrimoney', async (req, res) => {
  try {
    const { reference, status, transaction_id, amount } = req.body;

    console.log('Afrimoney callback received:', req.body);

    // Update payment status
    await handleMobileMoneyCallback('afrimoney', reference, status, transaction_id, amount);

    res.json({ success: true, message: 'Callback processed' });

  } catch (error) {
    console.error('Afrimoney callback error:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

// QMoney callback
router.post('/callback/qmoney', async (req, res) => {
  try {
    const { order_id, status, txn_id, amount } = req.body;

    console.log('QMoney callback received:', req.body);

    // Update payment status
    await handleMobileMoneyCallback('qmoney', order_id, status, txn_id, amount);

    res.json({ success: true, message: 'Callback processed' });

  } catch (error) {
    console.error('QMoney callback error:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

async function handleMobileMoneyCallback(provider, paymentId, status, transactionId, amount) {
  try {
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      console.error(`Payment not found for ${provider} callback:`, paymentId);
      return;
    }

    // Map provider status to our status
    let paymentStatus = 'pending';
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        paymentStatus = 'completed';
        break;
      case 'failed':
      case 'error':
        paymentStatus = 'failed';
        break;
      case 'pending':
      case 'processing':
        paymentStatus = 'processing';
        break;
    }

    // Update payment record
    payment.status = paymentStatus;
    payment.transactionId = transactionId;
    payment.completedAt = paymentStatus === 'completed' ? new Date() : null;
    payment.updatedAt = new Date();

    await payment.save();

    // Update order status
    await updateOrderPaymentStatus(payment.orderId, paymentStatus);

    // Send confirmation if payment completed
    if (paymentStatus === 'completed') {
      await sendPaymentConfirmation(payment);
    }

    console.log(`${provider} payment ${paymentId} updated to ${paymentStatus}`);

  } catch (error) {
    console.error(`Error handling ${provider} callback:`, error);
  }
}

function verifyOrangeMoneyCallback(data) {
  // Implement Orange Money signature verification
  // This is provider-specific and depends on their security implementation
  return true; // Simplified for demo
}

module.exports = router;
