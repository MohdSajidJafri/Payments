import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState(null);
  
  useEffect(() => {
    // Log Supabase URL and key (without exposing full key)
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Anon Key available:', !!anonKey);
    console.log('Current origin:', window.location.origin);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      console.log('Attempting Google login...');
      
      // Get the current URL for redirect
      const currentUrl = window.location.origin;
      console.log('Current origin:', currentUrl);
      
      // First try with the current URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: currentUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      console.log('Auth response data:', data);
      
      // If we get a URL back, we can redirect manually
      if (data?.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
        return;
      }

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      console.error('Error details:', error.message, error.stack);
      toast.error(`Failed to sign in with Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-amber-800 mb-6">Login to Buy Me a Chai</h2>
      <p className="mb-6 text-gray-600">
        Support me by buying a virtual chai! Login to leave a message and make a payment.
      </p>
      
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </button>
    </div>
  );
};

export default Login;
