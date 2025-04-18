import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ChaiForm = ({ session, onChaiAdded }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chaiCount, setChaiCount] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const CHAI_PRICE = 30; // Price per chai in INR

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create order on the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          amount: CHAI_PRICE * chaiCount,
          currency: 'INR',
          name,
          message,
          chaiCount
        })
      });

      const orderData = await response.json();
      
      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.key_id, // Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Buy Me a Chai",
        description: `${chaiCount} Chai${chaiCount > 1 ? 's' : ''}`,
        order_id: orderData.id,
        // Disable features that might not be supported in all browsers
        features: {
          'otp-credentials': false
        },
        handler: async function (response) {
          try {
            // Verify payment on the backend
            const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                name,
                message,
                amount: CHAI_PRICE * chaiCount
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            // Reset form
            setName('');
            setMessage('');
            setChaiCount(1);
            
            // Notify parent component to refresh messages
            onChaiAdded();
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: name,
          email: session.user.email
        },
        theme: {
          color: "#f59e0b"
        }
      };

      try {
        console.log('Initializing Razorpay with options:', JSON.stringify(options));
        const rzp = new window.Razorpay(options);
        rzp.open();
        
        // Handle Razorpay modal close
        rzp.on('payment.failed', function (response) {
          toast.error('Payment failed. Please try again.');
          console.error('Payment failed:', response.error);
        });
      } catch (razorpayError) {
        console.error('Razorpay initialization error:', razorpayError);
        toast.error('Payment gateway initialization failed. Please try again later.');
      }
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-amber-800 mb-6">Buy Me a Chai</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Write a nice message..."
            rows="3"
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="chaiCount" className="block text-gray-700 mb-2">
            Number of Chai (₹{CHAI_PRICE} each)
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setChaiCount(Math.max(1, chaiCount - 1))}
              className="px-3 py-1 bg-amber-100 text-amber-800 rounded-l-lg hover:bg-amber-200"
            >
              -
            </button>
            <input
              type="number"
              id="chaiCount"
              value={chaiCount}
              onChange={(e) => setChaiCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center py-1 border-t border-b border-gray-300 focus:outline-none"
              min="1"
            />
            <button
              type="button"
              onClick={() => setChaiCount(chaiCount + 1)}
              className="px-3 py-1 bg-amber-100 text-amber-800 rounded-r-lg hover:bg-amber-200"
            >
              +
            </button>
            <span className="ml-4 text-amber-800 font-medium">
              Total: ₹{CHAI_PRICE * chaiCount}
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Processing...
            </>
          ) : (
            <>Buy Me a Chai ☕</>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChaiForm;
