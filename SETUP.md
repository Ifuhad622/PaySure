# MelHad Investment - Setup Guide

## 🚀 Quick Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Then edit `.env` with your actual credentials.

## 📄 MongoDB Atlas Setup (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a new project called "MelHad Investment"

### Step 2: Create Database Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (Free tier)
3. Select region closest to Sierra Leone (Europe/Frankfurt recommended)
4. Name your cluster: `melhad-cluster`

### Step 3: Configure Database Access
1. Go to "Database Access" → "Add New Database User"
2. Username: `melhad_admin`
3. Password: Generate secure password
4. Database User Privileges: "Read and write to any database"

### Step 4: Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. For development: Click "Add Current IP Address"
3. For production: Add your server's IP address
4. For testing: Use `0.0.0.0/0` (not recommended for production)

### Step 5: Get Connection String
1. Go to "Databases" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `melhad_investment`

Example connection string:
```
mongodb+srv://melhad_admin:YOUR_PASSWORD@melhad-cluster.xxxxx.mongodb.net/melhad_investment?retryWrites=true&w=majority
```

### Step 6: Update Environment File
Add your MongoDB Atlas connection string to `.env`:
```env
MONGODB_URI=mongodb+srv://melhad_admin:YOUR_PASSWORD@melhad-cluster.xxxxx.mongodb.net/melhad_investment?retryWrites=true&w=majority
```

## 💳 Payment Gateway Setup

### Stripe Configuration

#### Step 1: Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up for Sierra Leone business account
3. Complete business verification

#### Step 2: Get API Keys
1. Go to "Developers" → "API keys"
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. For webhooks: Go to "Developers" → "Webhooks" → "Add endpoint"
5. Endpoint URL: `https://yourdomain.com/api/payments/webhook/stripe`
6. Events to send: `payment_intent.succeeded`, `payment_intent.payment_failed`

#### Step 3: Update Environment
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### PayPal Configuration

#### Step 1: Create PayPal Developer Account
1. Go to [PayPal Developer](https://developer.paypal.com)
2. Log in with your PayPal account
3. Create a new app for "MelHad Investment"

#### Step 2: Get Credentials
1. Select "Sandbox" for testing or "Live" for production
2. Copy your **Client ID**
3. Copy your **Client Secret**

#### Step 3: Update Environment
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
```

### Mobile Money Setup (Sierra Leone)

#### Orange Money
1. Contact Orange Sierra Leone business team
2. Request merchant account and API access
3. Get API credentials and merchant ID

#### Africell Money
1. Contact Africell Sierra Leone business department
2. Apply for merchant services
3. Obtain API keys and merchant code

#### QMoney
1. Contact QCell Sierra Leone business services
2. Register for merchant account
3. Get API credentials

## 📱 WhatsApp Business API Setup

### Option 1: WhatsApp Business API (Recommended)
1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create a new app → "Business" type
3. Add "WhatsApp" product
4. Get Phone Number ID and Access Token
5. Set up webhook for message delivery status

### Option 2: Twilio WhatsApp (Alternative)
1. Sign up at [Twilio Console](https://console.twilio.com)
2. Get Account SID and Auth Token
3. Enable WhatsApp sandbox for testing

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in your `.env` file

```env
EMAIL_USER=melhad0121@gmail.com
EMAIL_PASS=your_16_character_app_password
```

## 🔐 Security Configuration

### Generate Secure Keys
```bash
# Generate JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Encryption Key (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Add to `.env`:
```env
JWT_SECRET=your_generated_jwt_secret
ENCRYPTION_KEY=your_generated_encryption_key
```

## 🚀 Deployment

### Local Development
```bash
npm install
npm run dev
```

### Production Deployment

#### Option 1: Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `public`
4. Add environment variables in Netlify dashboard

#### Option 2: VPS/Server
1. Install Node.js 16+ and MongoDB
2. Clone repository
3. Install dependencies: `npm install`
4. Set up environment variables
5. Use PM2 for process management: `pm2 start server.js`

## 📊 Monitoring & Analytics

### Google Analytics
1. Create Google Analytics 4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables

### Error Tracking (Optional)
1. Sign up for [Sentry](https://sentry.io)
2. Create new project
3. Get DSN and add to environment

## ✅ Testing Checklist

- [ ] MongoDB Atlas connection working
- [ ] Stripe test payments successful
- [ ] PayPal sandbox payments working
- [ ] WhatsApp notifications sending
- [ ] Email receipts delivered
- [ ] Mobile money integration tested
- [ ] All environment variables configured
- [ ] SSL certificates installed
- [ ] Domain pointing to correct server

## 🆘 Support

If you encounter issues:

1. **Database Issues**: Check MongoDB Atlas network access and credentials
2. **Payment Issues**: Verify API keys and webhook endpoints
3. **Email Issues**: Confirm Gmail app password and 2FA enabled
4. **WhatsApp Issues**: Check phone number verification and webhook setup

For technical support: melhad0121@gmail.com

## 📱 Production Checklist

Before going live:

- [ ] Switch Stripe from test to live keys
- [ ] Change PayPal from sandbox to live
- [ ] Update MongoDB to production cluster
- [ ] Configure production domain
- [ ] Set up SSL certificates
- [ ] Test all payment methods
- [ ] Set up monitoring and backups
- [ ] Configure rate limiting
- [ ] Enable security headers
- [ ] Test disaster recovery procedures

---

**Next Steps**: Follow this guide to configure your payment gateways and database, then your MelHad Investment app will be ready for production! 🎉
