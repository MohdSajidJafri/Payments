require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configuration and middleware
const supabase = require('../config/supabase');
const razorpay = require('../config/razorpay');
const { authenticateUser, apiLimiter, paymentLimiter } = require('./middleware');
const { log, verifyPaymentSignature } = require('./utils');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Security middleware
app.use(helmet());
app.use(morgan('common'));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Buy Me a Chai API is running!',
    timestamp: new Date().toISOString()
  });
});

// Create Razorpay order
app.post('/api/create-order', authenticateUser, paymentLimiter, async (req, res) => {
  try {
    const { amount, currency = 'INR', name, message, chaiCount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        name,
        message,
        chaiCount,
        user_id: req.user.id
      }
    };

    const order = await razorpay.orders.create(options);
    
    log('info', `Order created: ${order.id}`, { userId: req.user.id });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    log('error', 'Error creating order', { error: error.message });
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment and store message
app.post('/api/verify-payment', authenticateUser, paymentLimiter, async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      name,
      message,
      amount
    } = req.body;

    // Verify payment signature using utility function
    
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValidSignature) {
      log('error', 'Invalid payment signature', { orderId: razorpay_order_id });
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Store chai message in Supabase
    const { data, error } = await supabase
      .from('chai_messages')
      .insert([
        {
          user_id: req.user.id,
          name,
          message,
          amount,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id
        }
      ]);

    if (error) {
      log('error', 'Error storing chai message', { error: error.message });
      return res.status(500).json({ error: 'Failed to store chai message' });
    }

    log('info', 'Payment verified and message stored', { paymentId: razorpay_payment_id });
    res.json({ success: true, message: 'Payment verified and message stored' });
  } catch (error) {
    log('error', 'Error verifying payment', { error: error.message });
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get all chai messages
app.get('/api/messages', apiLimiter, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chai_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    log('error', 'Error fetching messages', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Start server
app.listen(PORT, () => {
  log('info', `Server running on port ${PORT}`);
});
