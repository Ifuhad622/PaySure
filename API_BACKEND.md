# MelHad Investment - Backend API Documentation

Complete documentation for the MelHad Investment backend API system, including payment processing, order management, customer data, and security features.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Payment Gateway APIs](#payment-gateway-apis)
- [Order Management APIs](#order-management-apis)
- [Customer Management APIs](#customer-management-apis)
- [Receipt & Document APIs](#receipt--document-apis)
- [Admin & Analytics APIs](#admin--analytics-apis)
- [Webhook Endpoints](#webhook-endpoints)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Rate Limiting](#rate-limiting)
- [Integration Examples](#integration-examples)

## 🔐 Authentication

### JWT Authentication System

The API uses JWT (JSON Web Tokens) for secure authentication. Include the token in the Authorization header for protected endpoints.

```http
Authorization: Bearer <jwt-token>
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "username": "admin",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "User"
  },
  "expiresIn": "24h"
}
```

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Validate Token
```http
GET /api/auth/validate
Authorization: Bearer <jwt-token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt-token>
```

## 💳 Payment Gateway APIs

### Create Payment Intent (Stripe)

```http
POST /api/payments/create-intent
Content-Type: application/json

{
  "amount": 100000,
  "currency": "usd",
  "orderId": "ORD-123456",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+23278123456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_1234567890_secret_abcdef",
  "paymentId": "PAY-1640995200000",
  "amount": 100000
}
```

### Mobile Money Payment

```http
POST /api/payments/mobile-money
Content-Type: application/json

{
  "amount": 100000,
  "provider": "orange-money",
  "phoneNumber": "+23278123456",
  "orderId": "ORD-123456",
  "customerInfo": {
    "name": "John Doe",
    "phone": "+23278123456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "PAY-1640995200000",
  "transactionId": "OM-1640995200000",
  "message": "Payment request sent to your Orange Money account",
  "instructions": [
    "1. Dial *144# on your Orange Money registered phone",
    "2. Select \"Send Money\"",
    "3. Enter merchant number: 77123456",
    "4. Enter amount: Le 100,000",
    "5. Enter your PIN to complete"
  ]
}
```

### PayPal Payment

```http
POST /api/payments/paypal
Content-Type: application/json

{
  "amount": 100000,
  "orderId": "ORD-123456",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+23278123456"
  }
}
```

### Confirm Payment

```http
POST /api/payments/confirm/:paymentId
Content-Type: application/json

{
  "transactionId": "stripe_transaction_123",
  "status": "completed"
}
```

### Get Payment Status

```http
GET /api/payments/status/:paymentId
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "paymentId": "PAY-1640995200000",
    "orderId": "ORD-123456",
    "amount": 100000,
    "currency": "SLE",
    "provider": "stripe",
    "status": "completed",
    "transactionId": "stripe_transaction_123",
    "createdAt": "2023-12-31T23:59:59.000Z",
    "completedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Process Refund

```http
POST /api/payments/refund/:paymentId
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "amount": 50000,
  "reason": "Customer request"
}
```

## 📦 Order Management APIs

### Create Order

```http
POST /api/orders/create
Content-Type: application/json

{
  "customer": {
    "name": "John Doe",
    "phone": "+23278123456",
    "email": "john@example.com",
    "address": "123 Main St, Freetown"
  },
  "items": [
    {
      "serviceId": "business-cards",
      "serviceName": "Business Cards (500 pieces)",
      "quantity": 1,
      "price": 250000,
      "total": 250000
    }
  ],
  "totals": {
    "subtotal": 250000,
    "delivery": 25000,
    "tax": 0,
    "total": 275000
  },
  "delivery": {
    "method": "pickup",
    "address": "",
    "fee": 0
  },
  "payment": {
    "method": "orange-money"
  },
  "specialInstructions": "Please use premium cardstock"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "orderId": "ORD-1640995200000",
  "order": {
    "orderId": "ORD-1640995200000",
    "customer": { ... },
    "items": [ ... ],
    "totals": { ... },
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Order by ID

```http
GET /api/orders/:orderId
```

### Get Order History by Phone

```http
POST /api/orders/history
Content-Type: application/json

{
  "phone": "+23278123456"
}
```

### Update Order Status

```http
PATCH /api/orders/:orderId/status
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "status": "in-progress"
}
```

### Update Order Payment Information

```http
PATCH /api/orders/:orderId/payment
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "paymentId": "PAY-1640995200000",
  "transactionId": "stripe_transaction_123",
  "status": "completed",
  "receiptUrl": "https://example.com/receipt.pdf"
}
```

### Process Order Refund

```http
POST /api/orders/:orderId/refund
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "amount": 275000,
  "reason": "Order cancellation"
}
```

### Get All Orders (Admin)

```http
GET /api/orders/admin/all?page=1&limit=20&status=pending
Authorization: Bearer <jwt-token>
```

### Get Payment Analytics

```http
GET /api/orders/analytics/payments?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalOrders": 150,
    "totalRevenue": 15000000,
    "totalProcessingFees": 300000,
    "completedPayments": 140,
    "pendingPayments": 8,
    "failedPayments": 2
  },
  "paymentMethods": [
    {
      "_id": "orange-money",
      "count": 80,
      "revenue": 8000000
    },
    {
      "_id": "stripe",
      "count": 40,
      "revenue": 5000000
    }
  ]
}
```

## 👥 Customer Management APIs

### Create/Update Customer

```http
POST /api/customers/upsert
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "name": "John Doe",
  "phone": "+23278123456",
  "email": "john@example.com",
  "address": "123 Main St, Freetown",
  "location": "Freetown"
}
```

### Get Customer Profile

```http
GET /api/customers/profile/:phone
Authorization: Bearer <jwt-token>
```

### Get Customer Analytics

```http
GET /api/customers/analytics/:customerId
Authorization: Bearer <jwt-token>
```

### Update Loyalty Points

```http
PATCH /api/customers/:customerId/loyalty
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "points": 100,
  "reason": "Order completion bonus"
}
```

### Newsletter Subscription

```http
POST /api/customers/newsletter
Content-Type: application/json

{
  "email": "customer@example.com",
  "preferences": {
    "promotions": true,
    "orderUpdates": true
  }
}
```

## 📄 Receipt & Document APIs

### Download Receipt PDF

```http
GET /api/receipts/download/:paymentId
```

**Response:** PDF file download

### Get Receipt Data

```http
GET /api/receipts/data/:paymentId
```

**Response:**
```json
{
  "success": true,
  "receipt": {
    "paymentId": "PAY-1640995200000",
    "orderId": "ORD-123456",
    "transactionId": "stripe_transaction_123",
    "amount": 275000,
    "currency": "SLE",
    "provider": "stripe",
    "status": "completed",
    "paidAt": "2024-01-01T00:00:00.000Z",
    "customer": { ... },
    "items": [ ... ],
    "totals": { ... },
    "company": {
      "name": "MelHad Investment",
      "address": "Freetown, Sierra Leone",
      "phone": "+232 XX XXX XXXX",
      "email": "melhad0121@gmail.com",
      "website": "https://melhadinvestment.com"
    }
  }
}
```

### Email Receipt

```http
POST /api/receipts/email/:paymentId
Content-Type: application/json

{
  "email": "customer@example.com"
}
```

## 👨‍💼 Admin & Analytics APIs

### Get All Users (Admin Only)

```http
GET /api/admin/users
Authorization: Bearer <jwt-token>
```

### Get Audit Logs

```http
GET /api/admin/audit-logs
Authorization: Bearer <jwt-token>
```

### Get Security Stats

```http
GET /api/admin/security-stats
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "errorStats": {
    "totalErrors": 25,
    "errorsByType": {
      "authentication": 10,
      "payment": 8,
      "validation": 7
    }
  },
  "securityStats": {
    "blockedIPs": 5,
    "failedLogins": 15,
    "suspiciousTransactions": 3
  }
}
```

## 🔗 Webhook Endpoints

### Stripe Webhook

```http
POST /api/payments/webhook/stripe
Content-Type: application/json
Stripe-Signature: t=timestamp,v1=signature

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "status": "succeeded",
      "metadata": {
        "orderId": "ORD-123456"
      }
    }
  }
}
```

### Mobile Money Callbacks

#### Orange Money Callback

```http
POST /api/payments/callback/orange
Content-Type: application/json

{
  "orderid": "PAY-1640995200000",
  "status": "success",
  "txnid": "OM-1640995200000",
  "amount": 275000
}
```

#### Afrimoney Callback

```http
POST /api/payments/callback/afrimoney
Content-Type: application/json

{
  "reference": "PAY-1640995200000",
  "status": "completed",
  "transaction_id": "AM-1640995200000",
  "amount": 275000
}
```

#### QMoney Callback

```http
POST /api/payments/callback/qmoney
Content-Type: application/json

{
  "order_id": "PAY-1640995200000",
  "status": "paid",
  "txn_id": "QM-1640995200000",
  "amount": 275000
}
```

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "SPECIFIC_ERROR_CODE",
  "details": {
    "field": "validation_error_details"
  }
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Common Error Codes

- `INVALID_CREDENTIALS` - Authentication failed
- `INSUFFICIENT_PERMISSIONS` - Access denied
- `PAYMENT_FAILED` - Payment processing error
- `ORDER_NOT_FOUND` - Order doesn't exist
- `INVALID_PAYMENT_METHOD` - Unsupported payment provider
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `VALIDATION_ERROR` - Input validation failed

## 🛡️ Security Features

### Rate Limiting

| Endpoint Category | Limit |
|------------------|-------|
| Authentication | 5 attempts per 15 minutes |
| Payment Processing | 10 requests per hour |
| General API | 100 requests per minute |
| Webhook Endpoints | 1000 requests per minute |

### Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

### Input Validation

All endpoints validate input data:
- **Phone Numbers**: Sierra Leone format (+232XXXXXXXX)
- **Email Addresses**: RFC 5322 compliant
- **Amounts**: Positive numbers with reasonable limits
- **Text Fields**: XSS prevention and length limits

## 🔧 Integration Examples

### Frontend Integration (JavaScript)

```javascript
// Payment Processing Example
async function processPayment(orderData, paymentMethod) {
  try {
    // Create payment intent
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: orderData.total,
        currency: 'usd',
        orderId: orderData.orderId,
        customerInfo: orderData.customer
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    // Process with Stripe
    const { error } = await stripe.confirmCardPayment(result.clientSecret);
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Payment successful
    console.log('Payment completed successfully');
    
  } catch (error) {
    console.error('Payment failed:', error.message);
  }
}
```

### Mobile Money Integration

```javascript
// Mobile Money Payment Example
async function processMobileMoneyPayment(amount, phoneNumber, provider) {
  try {
    const response = await fetch('/api/payments/mobile-money', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        provider: provider,
        phoneNumber: phoneNumber,
        orderId: generateOrderId(),
        customerInfo: {
          name: customerName,
          phone: phoneNumber
        }
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show instructions to user
      displayPaymentInstructions(result.instructions);
      
      // Poll for payment status
      pollPaymentStatus(result.paymentId);
    }
    
  } catch (error) {
    console.error('Mobile money payment failed:', error);
  }
}

async function pollPaymentStatus(paymentId) {
  const maxAttempts = 60; // 5 minutes
  let attempts = 0;
  
  const checkStatus = async () => {
    try {
      const response = await fetch(`/api/payments/status/${paymentId}`);
      const result = await response.json();
      
      if (result.payment.status === 'completed') {
        // Payment successful
        handlePaymentSuccess(result.payment);
        return;
      }
      
      if (result.payment.status === 'failed') {
        // Payment failed
        handlePaymentFailure(result.payment);
        return;
      }
      
      // Still pending, check again
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkStatus, 5000); // Check every 5 seconds
      } else {
        handlePaymentTimeout();
      }
      
    } catch (error) {
      console.error('Status check failed:', error);
    }
  };
  
  checkStatus();
}
```

### Backend Integration (Node.js)

```javascript
// Order Creation Example
const express = require('express');
const router = express.Router();

router.post('/create-order', async (req, res) => {
  try {
    const { customer, items, totals, delivery, payment } = req.body;
    
    // Validate input
    if (!customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone are required'
      });
    }
    
    // Create order in database
    const order = await createOrder({
      customer,
      items,
      totals,
      delivery,
      payment
    });
    
    // Send notifications
    await sendOrderNotification(order);
    
    res.json({
      success: true,
      orderId: order.orderId,
      message: 'Order created successfully'
    });
    
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});
```

## 📞 Support & Resources

### Documentation
- **Main README**: Complete setup and feature guide
- **Setup Guide**: MongoDB Atlas and payment gateway configuration
- **Mobile API Setup**: Sierra Leone mobile money integration
- **Deployment Guide**: Production deployment checklist

### Contact Information
- **Technical Support**: melhad0121@gmail.com
- **Business Inquiries**: +232 XX XXX XXXX
- **WhatsApp Support**: +232 XX XXX XXXX

### Development Resources
- **Postman Collection**: Available for API testing
- **Webhook Testing**: Use ngrok for local webhook development
- **Database Schema**: MongoDB collections and indexes
- **Security Guidelines**: Best practices for production deployment

---

**MelHad Investment Backend API** - Enterprise-grade payment and order management system for Sierra Leone's digital commerce ecosystem.
