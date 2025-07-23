// MelHad Investment - Customers API
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  address: { type: String },
  businessName: { type: String },
  customerType: { type: String, enum: ['individual', 'business'], default: 'individual' },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  preferredServices: [{ type: String }],
  marketingPreferences: {
    email: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastOrderAt: { type: Date },
  updatedAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);

// Create or update customer
router.post('/upsert', async (req, res) => {
  try {
    const { name, phone, email, address, businessName, customerType } = req.body;
    
    let customer = await Customer.findOne({ phone });
    
    if (customer) {
      // Update existing customer
      customer.name = name || customer.name;
      customer.email = email || customer.email;
      customer.address = address || customer.address;
      customer.businessName = businessName || customer.businessName;
      customer.customerType = customerType || customer.customerType;
      customer.updatedAt = new Date();
      
      await customer.save();
    } else {
      // Create new customer
      customer = new Customer({
        name,
        phone,
        email,
        address,
        businessName,
        customerType
      });
      
      await customer.save();
    }
    
    res.json({
      success: true,
      message: customer.isNew ? 'Customer created successfully' : 'Customer updated successfully',
      customer: customer
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process customer data',
      error: error.message
    });
  }
});

// Get customer by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const customer = await Customer.findOne({ phone: req.params.phone });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      customer: customer
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer',
      error: error.message
    });
  }
});

// Update customer loyalty points
router.patch('/:customerId/loyalty', async (req, res) => {
  try {
    const { points, orderTotal } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      { 
        $inc: { 
          loyaltyPoints: points,
          totalSpent: orderTotal,
          totalOrders: 1
        },
        lastOrderAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Loyalty points updated',
      customer: customer
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update loyalty points',
      error: error.message
    });
  }
});

// Get customer analytics (admin)
router.get('/admin/analytics', async (req, res) => {
  try {
    const analytics = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          businessCustomers: {
            $sum: { $cond: [{ $eq: ['$customerType', 'business'] }, 1, 0] }
          },
          averageSpent: { $avg: '$totalSpent' },
          totalRevenue: { $sum: '$totalSpent' },
          averageOrders: { $avg: '$totalOrders' }
        }
      }
    ]);
    
    const topCustomers = await Customer.find()
      .sort({ totalSpent: -1 })
      .limit(10)
      .select('name phone totalSpent totalOrders customerType');
    
    const recentCustomers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name phone createdAt customerType');
    
    res.json({
      success: true,
      analytics: analytics[0] || {},
      topCustomers,
      recentCustomers
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate customer analytics',
      error: error.message
    });
  }
});

// Newsletter subscription
router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    await Customer.findOneAndUpdate(
      { $or: [{ email }, { phone }] },
      { 
        'marketingPreferences.email': true,
        updatedAt: new Date()
      },
      { upsert: true }
    );
    
    // Add to newsletter service (e.g., Mailchimp, ConvertKit)
    // TODO: Integrate with newsletter service
    
    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter',
      error: error.message
    });
  }
});

module.exports = router;
