const crypto = require('crypto');

/**
 * Verify Razorpay payment signature using HMAC SHA256
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @param {string} secret - Razorpay key secret
 * @returns {boolean} - Whether signature is valid
 */
const verifyPaymentSignature = (orderId, paymentId, signature, secret) => {
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  
  return generatedSignature === signature;
};

/**
 * Log with timestamp
 * @param {string} level - Log level (info, error, warn)
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log
 */
const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logData = { timestamp, message, ...data };
  
  switch (level) {
    case 'error':
      console.error(`[${timestamp}] ERROR: ${message}`, data);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARN: ${message}`, data);
      break;
    default:
      console.log(`[${timestamp}] INFO: ${message}`, data);
  }
  
  return logData;
};

module.exports = {
  verifyPaymentSignature,
  log
};
