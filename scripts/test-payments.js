// MelHad Investment - Payment Gateway Testing Script
const mongoose = require('mongoose');
const stripe = require('stripe');
require('dotenv').config();

async function testPaymentGateways() {
  console.log('🧪 Testing Payment Gateway Integrations...\n');

  // Test MongoDB Connection
  await testMongoDBConnection();
  
  // Test Stripe Integration
  await testStripeIntegration();
  
  // Test PayPal Integration
  await testPayPalIntegration();
  
  // Test Mobile Money APIs
  await testMobileMoneyIntegrations();
  
  // Test WhatsApp Integration
  await testWhatsAppIntegration();
  
  // Test Email Configuration
  await testEmailConfiguration();

  console.log('\n🎉 Payment gateway testing completed!');
  process.exit(0);
}

async function testMongoDBConnection() {
  console.log('📄 Testing MongoDB Atlas Connection...');
  
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('❌ MONGODB_URI not configured in environment variables');
      return;
    }

    if (mongoURI.includes('mongodb+srv://')) {
      console.log('✅ MongoDB Atlas connection string detected');
    } else if (mongoURI.includes('mongodb://localhost')) {
      console.log('⚠️  Local MongoDB detected (consider using Atlas for production)');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connection successful');
    
    // Test database operations
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    await testCollection.deleteOne({ test: 'connection' });
    
    console.log('✅ Database operations working correctly');
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('💡 Check your MONGODB_URI and network access settings');
  }
}

async function testStripeIntegration() {
  console.log('\n💳 Testing Stripe Integration...');
  
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    
    if (!stripeSecretKey || !stripePublishableKey) {
      console.log('❌ Stripe keys not configured');
      console.log('💡 Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to your .env file');
      return;
    }

    if (stripeSecretKey.startsWith('sk_test_')) {
      console.log('⚠️  Stripe in TEST mode');
    } else if (stripeSecretKey.startsWith('sk_live_')) {
      console.log('🔴 Stripe in LIVE mode');
    }

    const stripeClient = stripe(stripeSecretKey);
    
    // Test creating a payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: 100, // $1.00 USD
      currency: 'usd',
      metadata: {
        test: 'payment_gateway_test'
      }
    });

    console.log('✅ Stripe payment intent created successfully');
    console.log(`   Payment Intent ID: ${paymentIntent.id}`);
    
    // Cancel the test payment intent
    await stripeClient.paymentIntents.cancel(paymentIntent.id);
    console.log('✅ Test payment intent cancelled');
    
  } catch (error) {
    console.log('❌ Stripe integration failed:', error.message);
    console.log('💡 Check your Stripe API keys');
  }
}

async function testPayPalIntegration() {
  console.log('\n🅿️ Testing PayPal Integration...');
  
  try {
    const paypalClientId = process.env.PAYPAL_CLIENT_ID;
    const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
    
    if (!paypalClientId || !paypalClientSecret) {
      console.log('❌ PayPal credentials not configured');
      console.log('💡 Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your .env file');
      return;
    }

    const paypalMode = process.env.PAYPAL_MODE || 'sandbox';
    console.log(`⚠️  PayPal in ${paypalMode.toUpperCase()} mode`);
    
    // Test PayPal API access (simplified check)
    console.log('✅ PayPal credentials configured');
    console.log('💡 Test actual payments through the checkout page');
    
  } catch (error) {
    console.log('❌ PayPal integration failed:', error.message);
  }
}

async function testMobileMoneyIntegrations() {
  console.log('\n📱 Testing Mobile Money Integrations...');
  
  const mobileMoneyProviders = [
    { name: 'Orange Money', key: 'ORANGE_MONEY_API_KEY', merchant: 'ORANGE_MONEY_MERCHANT_ID' },
    { name: 'Afrimoney', key: 'AFRIMONEY_API_KEY', merchant: 'AFRIMONEY_MERCHANT_CODE' },
    { name: 'QMoney', key: 'QMONEY_API_KEY', merchant: 'QMONEY_MERCHANT_ID' }
  ];

  mobileMoneyProviders.forEach(provider => {
    const apiKey = process.env[provider.key];
    const merchantId = process.env[provider.merchant];
    
    if (apiKey && merchantId) {
      console.log(`✅ ${provider.name} credentials configured`);
    } else {
      console.log(`❌ ${provider.name} credentials missing`);
      console.log(`💡 Add ${provider.key} and ${provider.merchant} to your .env file`);
    }
  });

  console.log('💡 Contact mobile money providers to get API credentials for Sierra Leone');
}

async function testWhatsAppIntegration() {
  console.log('\n📱 Testing WhatsApp Integration...');
  
  try {
    // Test WhatsApp Business API
    const whatsappToken = process.env.WHATSAPP_BUSINESS_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_BUSINESS_PHONE_ID;
    
    if (whatsappToken && whatsappPhoneId) {
      console.log('✅ WhatsApp Business API credentials configured');
    } else {
      console.log('❌ WhatsApp Business API credentials missing');
    }
    
    // Test Twilio WhatsApp (fallback)
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (twilioSid && twilioToken) {
      console.log('✅ Twilio WhatsApp credentials configured');
    } else {
      console.log('❌ Twilio WhatsApp credentials missing');
    }
    
    if (!whatsappToken && !twilioSid) {
      console.log('💡 Configure either WhatsApp Business API or Twilio for notifications');
    }
    
  } catch (error) {
    console.log('❌ WhatsApp integration test failed:', error.message);
  }
}

async function testEmailConfiguration() {
  console.log('\n📧 Testing Email Configuration...');
  
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailHost = process.env.EMAIL_HOST;
    
    if (!emailUser || !emailPass) {
      console.log('❌ Email credentials not configured');
      console.log('💡 Add EMAIL_USER and EMAIL_PASS to your .env file');
      return;
    }

    console.log('✅ Email credentials configured');
    console.log(`   Email Host: ${emailHost || 'smtp.gmail.com'}`);
    console.log(`   Email User: ${emailUser}`);
    
    if (emailHost === 'smtp.gmail.com' || emailUser.includes('@gmail.com')) {
      console.log('💡 Make sure you\'re using a Gmail App Password, not your regular password');
    }
    
  } catch (error) {
    console.log('❌ Email configuration test failed:', error.message);
  }
}

function displayConfigurationStatus() {
  console.log('\n📋 Configuration Status Summary:\n');
  
  const requiredEnvVars = [
    'MONGODB_URI',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];
  
  const optionalEnvVars = [
    'WHATSAPP_BUSINESS_TOKEN',
    'TWILIO_ACCOUNT_SID',
    'ORANGE_MONEY_API_KEY',
    'AFRIMONEY_API_KEY',
    'QMONEY_API_KEY'
  ];
  
  console.log('Required Configuration:');
  requiredEnvVars.forEach(envVar => {
    const configured = process.env[envVar] ? '✅' : '❌';
    console.log(`   ${configured} ${envVar}`);
  });
  
  console.log('\nOptional Configuration:');
  optionalEnvVars.forEach(envVar => {
    const configured = process.env[envVar] ? '✅' : '⚪';
    console.log(`   ${configured} ${envVar}`);
  });
  
  console.log('\n💡 See SETUP.md for detailed configuration instructions');
}

// Run tests
if (require.main === module) {
  testPaymentGateways()
    .then(() => {
      displayConfigurationStatus();
    })
    .catch(error => {
      console.error('❌ Testing failed:', error);
      process.exit(1);
    });
}

module.exports = { testPaymentGateways };
