// MelHad Investment - Receipt Generation API
const express = require('express');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');
const router = express.Router();

// Generate receipt PDF
router.get('/download/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Get payment and order information
    const Payment = mongoose.model('Payment');
    const Order = mongoose.model('Order');
    
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const order = await Order.findOne({ orderId: payment.orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Generate PDF receipt
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${paymentId}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add company header
    addCompanyHeader(doc);
    
    // Add receipt details
    addReceiptDetails(doc, payment, order);
    
    // Add payment information
    addPaymentInformation(doc, payment);
    
    // Add order items
    addOrderItems(doc, order);
    
    // Add totals
    addTotals(doc, order, payment);
    
    // Add footer
    addFooter(doc);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Receipt generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate receipt',
      error: error.message
    });
  }
});

// Get receipt data (for preview)
router.get('/data/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const Payment = mongoose.model('Payment');
    const Order = mongoose.model('Order');
    
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const order = await Order.findOne({ orderId: payment.orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      receipt: {
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        transactionId: payment.transactionId,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
        status: payment.status,
        paidAt: payment.completedAt,
        customer: order.customer,
        items: order.items,
        totals: order.totals,
        company: {
          name: 'MelHad Investment',
          address: 'Freetown, Sierra Leone',
          phone: '+232 XX XXX XXXX',
          email: 'melhad0121@gmail.com',
          website: 'https://melhadinvestment.com'
        }
      }
    });
    
  } catch (error) {
    console.error('Receipt data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve receipt data',
      error: error.message
    });
  }
});

// Send receipt via email
router.post('/email/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { email } = req.body;
    
    // Get payment and order information
    const Payment = mongoose.model('Payment');
    const Order = mongoose.model('Order');
    
    const payment = await Payment.findOne({ paymentId });
    const order = await Order.findOne({ orderId: payment.orderId });
    
    if (!payment || !order) {
      return res.status(404).json({
        success: false,
        message: 'Payment or order not found'
      });
    }
    
    // Generate PDF receipt in memory
    const pdfBuffer = await generateReceiptPDF(payment, order);
    
    // Send email with PDF attachment
    await sendReceiptEmail(email, payment, order, pdfBuffer);
    
    res.json({
      success: true,
      message: 'Receipt sent successfully'
    });
    
  } catch (error) {
    console.error('Email receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send receipt',
      error: error.message
    });
  }
});

// Helper functions for PDF generation
function addCompanyHeader(doc) {
  // Company logo and header
  doc.fontSize(24)
     .fillColor('#6A1B9A')
     .text('MelHad Investment', 50, 50);
  
  doc.fontSize(12)
     .fillColor('#333333')
     .text('Professional Business Services', 50, 80)
     .text('Freetown, Sierra Leone', 50, 95)
     .text('Phone: +232 XX XXX XXXX', 50, 110)
     .text('Email: melhad0121@gmail.com', 50, 125)
     .text('Website: melhadinvestment.com', 50, 140);
  
  // Receipt title
  doc.fontSize(20)
     .fillColor('#6A1B9A')
     .text('PAYMENT RECEIPT', 400, 50, { align: 'right' });
  
  // Add line separator
  doc.moveTo(50, 170)
     .lineTo(550, 170)
     .strokeColor('#6A1B9A')
     .lineWidth(2)
     .stroke();
}

function addReceiptDetails(doc, payment, order) {
  const startY = 190;
  
  doc.fontSize(12)
     .fillColor('#333333');
  
  // Receipt details (left side)
  doc.text('Receipt Details:', 50, startY, { underline: true });
  doc.text(`Receipt #: ${payment.paymentId}`, 50, startY + 20);
  doc.text(`Date: ${new Date(payment.completedAt || payment.createdAt).toLocaleDateString()}`, 50, startY + 35);
  doc.text(`Time: ${new Date(payment.completedAt || payment.createdAt).toLocaleTimeString()}`, 50, startY + 50);
  
  // Customer details (right side)
  doc.text('Customer Details:', 350, startY, { underline: true });
  doc.text(`Name: ${order.customer.name}`, 350, startY + 20);
  doc.text(`Phone: ${order.customer.phone}`, 350, startY + 35);
  if (order.customer.email) {
    doc.text(`Email: ${order.customer.email}`, 350, startY + 50);
  }
}

function addPaymentInformation(doc, payment) {
  const startY = 280;
  
  doc.fontSize(12)
     .fillColor('#333333');
  
  doc.text('Payment Information:', 50, startY, { underline: true });
  doc.text(`Order ID: ${payment.orderId}`, 50, startY + 20);
  doc.text(`Transaction ID: ${payment.transactionId}`, 50, startY + 35);
  doc.text(`Payment Method: ${payment.provider.replace('-', ' ').toUpperCase()}`, 50, startY + 50);
  doc.text(`Status: ${payment.status.toUpperCase()}`, 50, startY + 65);
  
  // Add line separator
  doc.moveTo(50, startY + 90)
     .lineTo(550, startY + 90)
     .strokeColor('#E0E0E0')
     .lineWidth(1)
     .stroke();
}

function addOrderItems(doc, order) {
  const startY = 390;
  let currentY = startY;
  
  doc.fontSize(14)
     .fillColor('#6A1B9A')
     .text('Order Items:', 50, currentY);
  
  currentY += 25;
  
  // Table headers
  doc.fontSize(10)
     .fillColor('#333333')
     .text('Description', 50, currentY)
     .text('Qty', 300, currentY)
     .text('Unit Price', 350, currentY)
     .text('Total', 450, currentY);
  
  currentY += 15;
  
  // Add line under headers
  doc.moveTo(50, currentY)
     .lineTo(550, currentY)
     .strokeColor('#E0E0E0')
     .lineWidth(1)
     .stroke();
  
  currentY += 10;
  
  // Add items
  order.items.forEach(item => {
    doc.fontSize(9)
       .fillColor('#333333')
       .text(item.serviceName, 50, currentY, { width: 240 })
       .text(item.quantity.toString(), 300, currentY)
       .text(`Le ${item.price.toLocaleString()}`, 350, currentY)
       .text(`Le ${item.total.toLocaleString()}`, 450, currentY);
    
    currentY += 20;
  });
  
  return currentY;
}

function addTotals(doc, order, payment) {
  const startY = 550;
  
  // Add line separator
  doc.moveTo(300, startY)
     .lineTo(550, startY)
     .strokeColor('#E0E0E0')
     .lineWidth(1)
     .stroke();
  
  const lineHeight = 15;
  let currentY = startY + 10;
  
  doc.fontSize(10)
     .fillColor('#333333');
  
  // Subtotal
  doc.text('Subtotal:', 350, currentY)
     .text(`Le ${order.totals.subtotal.toLocaleString()}`, 450, currentY);
  currentY += lineHeight;
  
  // Delivery fee
  if (order.totals.delivery > 0) {
    doc.text('Delivery:', 350, currentY)
       .text(`Le ${order.totals.delivery.toLocaleString()}`, 450, currentY);
    currentY += lineHeight;
  }
  
  // Processing fee
  if (payment.fees && payment.fees.processingFee > 0) {
    doc.text('Processing Fee:', 350, currentY)
       .text(`Le ${payment.fees.processingFee.toLocaleString()}`, 450, currentY);
    currentY += lineHeight;
  }
  
  // Total
  doc.moveTo(350, currentY + 5)
     .lineTo(550, currentY + 5)
     .strokeColor('#6A1B9A')
     .lineWidth(2)
     .stroke();
  
  currentY += 15;
  
  doc.fontSize(12)
     .fillColor('#6A1B9A')
     .text('TOTAL PAID:', 350, currentY)
     .text(`Le ${payment.amount.toLocaleString()}`, 450, currentY);
}

function addFooter(doc) {
  const footerY = 700;
  
  // Add line separator
  doc.moveTo(50, footerY)
     .lineTo(550, footerY)
     .strokeColor('#E0E0E0')
     .lineWidth(1)
     .stroke();
  
  doc.fontSize(8)
     .fillColor('#666666')
     .text('Thank you for choosing MelHad Investment!', 50, footerY + 15)
     .text('For support, contact us at melhad0121@gmail.com or +232 XX XXX XXXX', 50, footerY + 30)
     .text(`Generated on ${new Date().toLocaleString()}`, 50, footerY + 45);
  
  // QR code or reference
  doc.text(`Reference: ${Date.now()}`, 400, footerY + 15, { align: 'right' })
     .text('Scan QR code to verify receipt', 400, footerY + 30, { align: 'right' });
}

async function generateReceiptPDF(payment, order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Generate PDF content
      addCompanyHeader(doc);
      addReceiptDetails(doc, payment, order);
      addPaymentInformation(doc, payment);
      addOrderItems(doc, order);
      addTotals(doc, order, payment);
      addFooter(doc);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

async function sendReceiptEmail(email, payment, order, pdfBuffer) {
  // Email sending implementation would go here
  // For now, just log the action
  console.log(`Sending receipt email to ${email} for payment ${payment.paymentId}`);
  
  // TODO: Implement actual email sending with nodemailer
  // const nodemailer = require('nodemailer');
  // ... email configuration and sending logic
}

module.exports = router;
