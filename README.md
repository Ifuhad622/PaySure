# MelHad Investment - Enterprise Payment Management System

A comprehensive, production-ready payment management system designed for MelHad Investment's professional printing and digital services business. Features enterprise-grade security, multi-gateway payment processing, real-time analytics, automated invoice generation, WhatsApp business integration, and modern user experience optimized for Sierra Leone market.

## 🆕 Production Release (v4.0 - Full Stack Enterprise)

### ✨ Latest Features
- **🌍 MongoDB Atlas Integration** with cloud database support
- **💳 Multi-Gateway Payment System** (Stripe, PayPal, Mobile Money)
- **📱 Sierra Leone Mobile Payment APIs** (Orange Money, Afrimoney, QMoney)
- **🔐 Advanced Security Suite** with fraud detection and rate limiting
- **📊 Real-Time Analytics Dashboard** with business intelligence
- **📄 Professional Receipt Generation** with PDF download
- **🤖 WhatsApp Business Integration** with automated notifications
- **🎯 Secure Checkout Flow** with multiple payment options
- **📱 Progressive Web App (PWA)** with offline capabilities
- **🔧 Admin Dashboard** with comprehensive order management

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (recommended) or local MongoDB
- Internet connection for payment gateway integration

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd melhad-investment-app
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (see Configuration section below)
   ```

3. **Database Setup**
   ```bash
   # Initialize MongoDB Atlas database
   npm run db:init
   
   # Test all integrations
   npm run payments:test
   ```

4. **Start the Application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the Application**
   - **Customer Portal**: http://localhost:3000
   - **Secure Checkout**: http://localhost:3000/checkout
   - **Admin Dashboard**: http://localhost:3000/admin
   - **Default Admin**: Username: `Fuhad` | Password: `melhad@1`

## 🔧 Configuration Guide

### Essential Environment Variables

```env
# Database Configuration (MongoDB Atlas Recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/melhad_investment

# Payment Gateway Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Mobile Money APIs (Sierra Leone)
ORANGE_MONEY_API_KEY=your_orange_api_key
AFRIMONEY_API_KEY=your_afrimoney_api_key
QMONEY_API_KEY=your_qmoney_api_key

# WhatsApp Integration
WHATSAPP_BUSINESS_TOKEN=your_whatsapp_token
TWILIO_ACCOUNT_SID=your_twilio_sid (alternative)

# Email Configuration
EMAIL_USER=melhad0121@gmail.com
EMAIL_PASS=your_gmail_app_password

# Security Configuration
JWT_SECRET=your_32_plus_character_jwt_secret
ENCRYPTION_KEY=your_32_character_encryption_key
```

### Payment Gateway Setup

#### 1. **Stripe Integration**
- Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
- Get API keys from "Developers" → "API keys"
- Configure webhooks for payment confirmations
- Support for international card payments

#### 2. **PayPal Integration**
- Create app at [PayPal Developer](https://developer.paypal.com)
- Get Client ID and Secret
- Configure for sandbox/live mode
- Global payment support

#### 3. **Mobile Money (Sierra Leone)**
- **Orange Money**: Contact Orange Business Services
- **Afrimoney**: Contact Africell Business Department  
- **QMoney**: Contact QCell Business Services
- Configure callback URLs for real-time confirmations

### Database Setup Options

#### Option 1: MongoDB Atlas (Recommended)
```bash
# 1. Create free cluster at https://cloud.mongodb.com
# 2. Get connection string
# 3. Add to MONGODB_URI in .env
# 4. Initialize database
npm run db:init
```

#### Option 2: Local MongoDB
```bash
# 1. Install MongoDB locally
# 2. Set MONGODB_URI=mongodb://localhost:27017/melhad_investment
# 3. Initialize database
npm run db:init
```

## 🏗️ System Architecture

### Backend Infrastructure
- **Node.js + Express** - Robust server architecture
- **MongoDB/Atlas** - Cloud-first database with local fallback
- **JWT Authentication** - Secure session management
- **Multi-Gateway Payments** - Stripe, PayPal, Mobile Money APIs
- **Rate Limiting** - Protection against abuse
- **Comprehensive Logging** - Error tracking and monitoring
- **WhatsApp Integration** - Automated customer notifications
- **PDF Generation** - Professional receipt creation

### Frontend Experience
- **Progressive Web App (PWA)** - Mobile-first design
- **Responsive Design** - Optimized for all devices
- **Real-Time Calculator** - Instant pricing and quotes
- **Secure Checkout Flow** - Multiple payment options
- **Theme System** - Light/Dark mode with persistence
- **Voice Search** - Accessibility features
- **Offline Support** - Service worker caching

### Security Framework
- **Advanced Fraud Detection** - Risk scoring and monitoring
- **Device Fingerprinting** - Transaction security
- **Input Validation** - XSS and injection prevention
- **CORS Protection** - Cross-origin security
- **Rate Limiting** - API abuse prevention
- **Audit Logging** - Complete transaction tracking

## 💳 Payment Gateway Features

### Supported Payment Methods

#### **International Payments**
- **💳 Stripe** - Credit/Debit cards worldwide
- **🅿️ PayPal** - Global digital payments
- **🏦 Bank Transfer** - Direct bank payments

#### **Sierra Leone Mobile Money**
- **📱 Orange Money** - Real-time API integration
- **📱 Afrimoney** - Africell mobile payments
- **📱 QMoney** - QCell mobile payments

### Payment Flow Features
- **🔒 Secure Checkout** - PCI DSS compliant processing
- **⚡ Real-Time Processing** - Instant payment confirmations
- **📄 Automatic Receipts** - PDF generation and delivery
- **📱 WhatsApp Notifications** - Instant customer updates
- **🔄 Callback Handling** - Webhook processing for all gateways
- **💰 Fee Calculation** - Transparent pricing with processing fees
- **🛡️ Fraud Detection** - Advanced security scoring

## 📊 Admin Dashboard Features

### Business Intelligence
- **📈 Real-Time Analytics** - Revenue, orders, customer metrics
- **💹 Payment Analytics** - Gateway performance and usage
- **👥 Customer Management** - Profiles, history, loyalty points
- **📦 Order Management** - Status tracking and updates
- **🔍 Advanced Reporting** - Custom date ranges and exports
- **📱 Mobile Usage Stats** - Device and network analytics

### Order Management System
- **📋 Order Processing** - Complete lifecycle management
- **💳 Payment Tracking** - Multi-gateway status monitoring
- **📞 Customer Communication** - WhatsApp integration
- **📄 Document Generation** - Invoices and receipts
- **🔄 Status Updates** - Real-time order progression
- **💰 Refund Processing** - Automated refund handling

### Security Monitoring
- **🛡️ Fraud Detection** - Risk scoring and alerts
- **🔐 Authentication Logs** - Login attempt monitoring
- **📊 Security Dashboard** - Threat assessment and reporting
- **🚫 IP Blocking** - Automated threat response
- **📝 Audit Trails** - Complete action logging

## 🛍️ Customer Experience

### Service Catalog (30+ Services)

#### **Traditional Printing**
- Document Printing (B&W & Color)
- Photo Printing (4x6, 8x10, Canvas)
- Business Cards & Stationery
- Flyers, Posters & Banners

#### **Professional Business Services**
- Wedding Invitations & Custom Stationery
- Company Letterheads & Receipt Books
- ID Card Printing & Badges
- Product Labels & Packaging
- Custom Notebooks & Journals
- Certificate Printing & Awards

#### **Large Format & Specialized**
- Large Format Poster Printing (A0 size)
- Roll-up Banner Stands & Displays
- Vehicle Wrap Design & Graphics
- Event Backdrop & Fabric Printing
- Real Estate & Metal Signage
- Digital Wallpaper & Floor Graphics

#### **Custom Products**
- Custom Mug Printing & Gifts
- Vinyl Stickers & Decals
- Custom Calendars & Planners
- Restaurant Menu Printing
- Brochure & Catalog Printing

### User Interface Features
- **🧮 Real-Time Calculator** - Instant pricing with cart integration
- **🎨 Theme System** - Light/Dark mode with smooth transitions
- **🗣️ Voice Search** - Web Speech API integration
- **📱 Mobile Optimization** - Touch-friendly interface
- **💬 In-App Chat** - AI-powered customer support
- **🔍 Smart Search** - Service discovery and filtering

## 📱 Mobile Optimization (Sierra Leone Focus)

### Network Optimization
- **📶 Low-Bandwidth Support** - Optimized for 2G/3G networks
- **⚡ Fast Loading** - Compressed assets and lazy loading
- **📱 Mobile-First Design** - Touch-optimized interface
- **🔄 Offline Support** - Service worker caching

### Mobile Payment Integration
- **📱 USSD Integration** - Auto-dial payment codes (*144#, *151#, *155#)
- **⚡ Instant Notifications** - WhatsApp payment confirmations
- **🔒 Secure Processing** - Mobile-optimized security
- **💳 Multiple Options** - All major Sierra Leone mobile money providers

## 🔧 Development & Deployment

### Available Scripts
```bash
# Development
npm run dev                    # Start development server with hot reload
npm run build                 # Build for production
npm run test                  # Run test suite

# Database Management
npm run db:init               # Initialize MongoDB collections and indexes
npm run db:seed               # Seed sample data for testing
npm run db:backup             # Backup database
npm run db:restore            # Restore from backup

# Payment Testing
npm run payments:test         # Test all payment gateway integrations
npm run deploy                # Deploy to production with build

# Maintenance
npm run lint                  # Check code quality
npm run optimize              # Optimize assets for production
```

### Deployment Options

#### **Netlify (Recommended for Frontend)**
```bash
# 1. Connect GitHub repository to Netlify
# 2. Set build command: npm run build
# 3. Set publish directory: public
# 4. Configure environment variables in Netlify dashboard
npm run deploy
```

#### **VPS/Server Deployment**
```bash
# 1. Clone repository on server
# 2. Install dependencies: npm install
# 3. Configure environment variables
# 4. Use PM2 for process management
pm2 start server.js --name "melhad-investment"
```

#### **MongoDB Atlas Setup**
```bash
# 1. Create MongoDB Atlas account
# 2. Create cluster (M0 free tier available)
# 3. Configure network access and database user
# 4. Get connection string and add to MONGODB_URI
# 5. Initialize database: npm run db:init
```

## 🔐 Security Features

### Advanced Protection
- **🛡️ Fraud Detection** - Machine learning-based risk scoring
- **🔒 Payment Security** - PCI DSS compliance ready
- **📱 Device Fingerprinting** - Transaction verification
- **🌐 CORS Protection** - Cross-origin request security
- **⚡ Rate Limiting** - API abuse prevention
- **🔐 JWT Authentication** - Secure session management

### Monitoring & Logging
- **📊 Security Dashboard** - Real-time threat monitoring
- **📝 Audit Trails** - Complete transaction logging
- **🚨 Alert System** - Automated threat notifications
- **📈 Analytics** - Security metrics and reporting

## 📞 Support & Documentation

### Additional Documentation
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions for MongoDB Atlas and payment gateways
- **[MOBILE_API_SETUP.md](./MOBILE_API_SETUP.md)** - Mobile money API configuration guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment checklist
- **[API_BACKEND.md](./API_BACKEND.md)** - Backend API documentation and integration guide

### Getting Help
- **📧 Email**: melhad0121@gmail.com
- **📱 WhatsApp**: +232 XX XXX XXXX
- **🌐 Website**: https://melhadinvestment.com
- **📍 Address**: Freetown, Sierra Leone

### Troubleshooting
- Check MongoDB Atlas connection and network access
- Verify payment gateway API keys and webhooks
- Test mobile money provider credentials
- Review security logs for authentication issues
- Check WhatsApp Business API configuration

## 📋 Production Checklist

### Before Going Live
- [ ] Configure MongoDB Atlas with production cluster
- [ ] Switch payment gateways from test to live keys
- [ ] Set up SSL certificates and domain configuration
- [ ] Configure WhatsApp Business API with verified number
- [ ] Test all payment methods with small transactions
- [ ] Set up monitoring and backup procedures
- [ ] Configure rate limiting for production traffic
- [ ] Update company information and branding
- [ ] Train staff on admin dashboard features

### Security Checklist
- [ ] Update default admin credentials
- [ ] Configure strong JWT and encryption keys
- [ ] Set up proper CORS origins for production
- [ ] Enable audit logging and monitoring
- [ ] Configure IP blocking for suspicious activity
- [ ] Test fraud detection with various scenarios
- [ ] Verify all webhook endpoints are secured
- [ ] Review and update rate limiting rules

### Performance Checklist
- [ ] Enable gzip compression and caching
- [ ] Optimize images and assets for production
- [ ] Configure CDN for static asset delivery
- [ ] Set up database indexing and optimization
- [ ] Test mobile performance on various networks
- [ ] Verify offline PWA functionality
- [ ] Configure automated backup schedules

## 📄 License

This software is proprietary to MelHad Investment. All rights reserved.

---

**MelHad Investment** - Enterprise Payment Management System  
*Powering Sierra Leone's digital commerce with cutting-edge technology*

*Built with ❤️ for Sierra Leone's business community*
