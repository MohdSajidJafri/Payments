# Buy Me a Chai ☕ - Setup Guide

This guide will walk you through setting up and running the "Buy Me a Chai" application locally.

## Prerequisites

Before you begin, make sure you have:

1. [Node.js](https://nodejs.org/) (v14 or higher) and npm installed
2. A [Supabase](https://supabase.com/) account
3. A [Razorpay](https://razorpay.com/) account (you can use test mode for development)

## Step 1: Set Up Supabase

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Go to the SQL Editor and run the SQL commands from `supabase-schema.sql`
4. Set up Google OAuth:
   - Go to Project Settings > Authentication > Providers > Google
   - Enable Google auth
   - Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
   - Add `http://localhost:3000` to the authorized redirect URIs
   - Copy Client ID and Client Secret to Supabase
5. Get your Supabase URL and Anon Key from Project Settings > API

## Step 2: Set Up Razorpay

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings > API Keys
3. Generate API keys for testing
4. Make note of your Key ID and Key Secret

## Step 3: Configure Environment Variables

1. **Client Environment Variables**:
   - Copy the contents of `client/.env.example` to a new file `client/.env`
   - Fill in the values:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     REACT_APP_API_URL=http://localhost:5000
     ```

2. **Server Environment Variables**:
   - Copy the contents of `server/.env.example` to a new file `server/.env`
   - Fill in the values:
     ```
     PORT=5000
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     CORS_ORIGIN=http://localhost:3000
     ```

## Step 4: Install Dependencies

1. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Install Server Dependencies**:
   ```bash
   cd ../server
   npm install
   ```

## Step 5: Run the Application

1. **Start the Backend Server**:
   ```bash
   cd server
   npm run dev
   ```
   The server should start on port 5000.

2. **Start the Frontend Development Server**:
   ```bash
   cd client
   npm start
   ```
   The React app should open in your browser at http://localhost:3000.

## Step 6: Test the Application

1. Log in using Google OAuth
2. Enter your name and a message
3. Select the number of chai you want to buy
4. Click "Buy Me a Chai"
5. Complete the payment using Razorpay test credentials:
   - Card Number: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name
6. After successful payment, your message should appear in the chai messages section

## Troubleshooting

If you encounter any issues:

1. **Backend Connection Issues**:
   - Ensure the server is running on port 5000
   - Check that CORS is properly configured
   - Verify your environment variables

2. **Supabase Authentication Issues**:
   - Ensure Google OAuth is properly configured
   - Check that your redirect URIs are correct
   - Verify your Supabase URL and Anon Key

3. **Razorpay Payment Issues**:
   - Ensure you're using test mode for development
   - Verify your Razorpay API keys
   - Check the browser console for any errors

4. **Database Issues**:
   - Verify that the SQL schema was properly executed
   - Check that RLS policies are correctly set up

## Next Steps

Once you have the application running locally, you can:

1. Customize the UI to match your branding
2. Add additional payment options
3. Implement email notifications for new chai messages
4. Deploy the application to production (see DEPLOYMENT.md)

Happy coding! ☕
