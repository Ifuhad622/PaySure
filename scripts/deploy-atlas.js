// MelHad Investment - MongoDB Atlas Deployment Script
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function deployToAtlas() {
  console.log('🚀 Deploying MelHad Investment to MongoDB Atlas...\n');

  // Step 1: Verify environment configuration
  await verifyEnvironment();
  
  // Step 2: Test MongoDB Atlas connection
  await testAtlasConnection();
  
  // Step 3: Initialize database
  await initializeDatabase();
  
  // Step 4: Deploy application
  await deployApplication();
  
  console.log('\n🎉 Deployment to MongoDB Atlas completed successfully!');
}

async function verifyEnvironment() {
  console.log('🔍 Verifying environment configuration...');
  
  const requiredVars = [
    'MONGODB_URI',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY'
  ];
  
  let missing = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.log('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n💡 Copy .env.example to .env and configure your values');
    process.exit(1);
  }
  
  // Check if using MongoDB Atlas
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI.includes('mongodb+srv://')) {
    console.log('⚠️  Warning: Not using MongoDB Atlas connection string');
    console.log('💡 For production, use MongoDB Atlas: mongodb+srv://...');
  } else {
    console.log('✅ MongoDB Atlas connection string detected');
  }
  
  console.log('✅ Environment configuration verified');
}

async function testAtlasConnection() {
  console.log('\n📄 Testing MongoDB Atlas connection...');
  
  return new Promise((resolve, reject) => {
    exec('npm run db:init', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ MongoDB Atlas connection failed');
        console.log(stderr);
        reject(error);
      } else {
        console.log('✅ MongoDB Atlas connection successful');
        resolve();
      }
    });
  });
}

async function initializeDatabase() {
  console.log('\n🗄️ Initializing database collections and indexes...');
  
  return new Promise((resolve, reject) => {
    exec('node scripts/init-database.js', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Database initialization failed');
        console.log(stderr);
        reject(error);
      } else {
        console.log(stdout);
        console.log('✅ Database initialized successfully');
        resolve();
      }
    });
  });
}

async function deployApplication() {
  console.log('\n🚀 Starting application deployment...');
  
  // Install dependencies
  console.log('📦 Installing dependencies...');
  await execCommand('npm install');
  
  // Build application
  console.log('🔨 Building application...');
  await execCommand('npm run build');
  
  // Test payment gateways
  console.log('🧪 Testing payment integrations...');
  await execCommand('npm run payments:test');
  
  console.log('✅ Application deployed and tested successfully');
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ Command failed: ${command}`);
        console.log(stderr);
        reject(error);
      } else {
        console.log(`✅ Command completed: ${command}`);
        resolve(stdout);
      }
    });
  });
}

async function createProductionEnv() {
  console.log('\n📝 Creating production environment template...');
  
  const productionEnv = `# MelHad Investment - Production Environment Configuration

# Server Configuration
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://melhadinvestment.com,https://melhadinvestment.netlify.app

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/melhad_investment?retryWrites=true&w=majority

# Stripe Configuration (LIVE KEYS)
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal Configuration (LIVE)
PAYPAL_CLIENT_ID=your_live_paypal_client_id
PAYPAL_CLIENT_SECRET=your_live_paypal_client_secret
PAYPAL_MODE=live

# WhatsApp Business API
WHATSAPP_BUSINESS_PHONE_ID=your_phone_number_id
WHATSAPP_BUSINESS_TOKEN=your_permanent_token

# Email Configuration
EMAIL_USER=melhad0121@gmail.com
EMAIL_PASS=your_gmail_app_password

# Security Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_min_32_characters
ENCRYPTION_KEY=your_32_character_encryption_key_here

# Company Information
COMPANY_NAME="MelHad Investment"
COMPANY_ADDRESS="Freetown, Sierra Leone"
COMPANY_PHONE="+232 XX XXX XXXX"
COMPANY_EMAIL="melhad0121@gmail.com"
COMPANY_WEBSITE="https://melhadinvestment.com"
`;

  fs.writeFileSync('.env.production', productionEnv);
  console.log('✅ Production environment template created (.env.production)');
  console.log('💡 Configure your production values before deploying');
}

function displayNextSteps() {
  console.log('\n📋 Next Steps for Production Deployment:\n');
  
  console.log('1. 🌐 Domain & Hosting:');
  console.log('   - Point your domain to your server');
  console.log('   - Set up SSL certificates');
  console.log('   - Configure firewall rules');
  
  console.log('\n2. 🔐 Security:');
  console.log('   - Update MongoDB Atlas network access');
  console.log('   - Configure Stripe webhooks');
  console.log('   - Set up rate limiting');
  
  console.log('\n3. 📊 Monitoring:');
  console.log('   - Set up error tracking (Sentry)');
  console.log('   - Configure uptime monitoring');
  console.log('   - Enable backup schedules');
  
  console.log('\n4. 🧪 Testing:');
  console.log('   - Test all payment methods');
  console.log('   - Verify WhatsApp notifications');
  console.log('   - Check email receipts');
  
  console.log('\n5. 🚀 Go Live:');
  console.log('   - Switch to live payment keys');
  console.log('   - Update PayPal to live mode');
  console.log('   - Announce launch to customers');
  
  console.log('\n💡 See SETUP.md for detailed instructions');
}

// Run deployment
if (require.main === module) {
  deployToAtlas()
    .then(() => {
      createProductionEnv();
      displayNextSteps();
    })
    .catch(error => {
      console.error('❌ Deployment failed:', error);
      process.exit(1);
    });
}

module.exports = { deployToAtlas };
