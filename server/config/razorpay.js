const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Verify if Razorpay keys are set
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Missing Razorpay API keys. Check your .env file.');
  process.exit(1);
}

module.exports = razorpay;
