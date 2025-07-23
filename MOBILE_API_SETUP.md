# 📱 Mobile Money API Setup Guide

## Quick Setup for Your Mobile API Keys

### 🔧 **Step 1: Add Your API Keys to .env**

Open your `.env` file and replace the placeholder values with your actual API credentials:

```env
# Orange Money API - Add your actual credentials
ORANGE_MONEY_API_KEY=your_actual_orange_api_key_here
ORANGE_MONEY_MERCHANT_ID=your_orange_merchant_id_here

# Africell Money API - Add your actual credentials  
AFRIMONEY_API_KEY=your_actual_afrimoney_api_key_here
AFRIMONEY_MERCHANT_CODE=your_afrimoney_merchant_code_here

# QMoney API - Add your actual credentials
QMONEY_API_KEY=your_actual_qmoney_api_key_here
QMONEY_MERCHANT_ID=your_qmoney_merchant_id_here
```

### 📋 **Step 2: Configure Each Provider**

#### **Orange Money (Orange Sierra Leone)**
1. **Contact**: Orange Business Services Sierra Leone
2. **Required**: 
   - API Key
   - Merchant ID
   - Business registration documents
3. **Documentation**: Usually provided by Orange after approval

#### **Afrimoney (Africell Sierra Leone)**
1. **Contact**: Africell Business Department
2. **Required**:
   - API Key
   - Merchant Code
   - Valid business license
3. **Integration**: REST API with JSON responses

#### **QMoney (QCell Sierra Leone)**
1. **Contact**: QCell Business Services
2. **Required**:
   - API Key
   - Merchant ID
   - Business verification
3. **Features**: Real-time payment notifications

### 🧪 **Step 3: Test Your Integration**

Run the payment test script to verify your API keys work:

```bash
npm run payments:test
```

### 🔒 **Step 4: Set Up Webhooks (Important!)**

Configure callback URLs with each provider:

- **Orange Money**: `https://yourdomain.com/api/payments/callback/orange`
- **Afrimoney**: `https://yourdomain.com/api/payments/callback/afrimoney`
- **QMoney**: `https://yourdomain.com/api/payments/callback/qmoney`

### 💡 **Step 5: Test Payments**

1. Start your server: `npm start`
2. Go to: `http://localhost:3000/checkout`
3. Test each mobile money provider
4. Check payment confirmations

### 📱 **Mobile Money Provider Contacts**

#### **Orange Money Sierra Leone**
- **Business Line**: +232 25 155 555
- **Email**: business@orange.sl
- **Office**: Orange Head Office, Freetown

#### **Africell Money**
- **Business Line**: +232 30 888 888  
- **Email**: business@africell.sl
- **Office**: Africell Head Office, Freetown

#### **QMoney (QCell)**
- **Business Line**: +232 33 999 999
- **Email**: business@qcell.sl
- **Office**: QCell Head Office, Freetown

### 🔧 **Troubleshooting**

#### **API Key Not Working**
- Verify the key is correctly copied (no extra spaces)
- Check if the key is for sandbox or production
- Confirm your merchant account is active

#### **Payments Not Processing**
- Check your callback URLs are accessible
- Verify your server can receive POST requests
- Check payment provider dashboards for errors

#### **Callback Issues**
- Ensure your domain has SSL (https://)
- Check firewall allows incoming webhooks
- Test callback URLs with tools like Postman

### 🚀 **Going Live Checklist**

- [ ] All API keys added to production `.env`
- [ ] Callback URLs configured with providers
- [ ] SSL certificate installed
- [ ] Payment flows tested with small amounts
- [ ] Error handling verified
- [ ] Customer notification system working
- [ ] Backup payment methods available

### 💰 **Expected Fees**

| Provider | Transaction Fee | Setup Fee | Monthly Fee |
|----------|----------------|-----------|-------------|
| Orange Money | 2% | Free | Free |
| Afrimoney | 2.5% | Free | Free |
| QMoney | 2% | Free | Free |

### 📞 **Support**

If you need help with integration:
- **Technical**: melhad0121@gmail.com
- **Business Setup**: Contact providers directly
- **Testing**: Use the built-in test scripts

---

**🎉 Once configured, your customers can pay instantly using their mobile money accounts!**
