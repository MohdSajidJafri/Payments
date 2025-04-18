# Deployment Guide for Buy Me a Chai ☕

This guide will help you deploy your Buy Me a Chai application to production environments.

## Prerequisites

Before deploying, make sure you have:

1. A Supabase account with a project set up
2. A Razorpay account with API keys
3. Completed the local setup and testing

## Step 1: Set Up Supabase

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or use an existing one
3. Run the SQL commands from `supabase-schema.sql` in the SQL Editor
4. Set up Google OAuth:
   - Go to Project Settings > Authentication > Providers > Google
   - Enable Google auth
   - Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
   - Add your production domain to the authorized redirect URIs
   - Copy Client ID and Client Secret to Supabase

## Step 2: Set Up Razorpay

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings > API Keys
3. Generate API keys for production (or use test keys for testing)
4. Make note of your Key ID and Key Secret

## Step 3: Deploy Frontend (Client)

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Sign up for [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Configure the build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variables:
   ```
   REACT_APP_SUPABASE_URL=your_production_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   REACT_APP_API_URL=your_production_backend_url
   ```
6. Deploy

### Alternative: Deploy to Netlify

1. Sign up for [Netlify](https://www.netlify.com/)
2. Import your GitHub repository
3. Configure build settings:
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`
4. Add the same environment variables as above

## Step 4: Deploy Backend (Server)

### Deploy to Render

1. Sign up for [Render](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Name: `buy-me-a-chai-api`
   - Environment: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node src/index.js`
5. Add environment variables:
   ```
   PORT=10000
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   CORS_ORIGIN=your_frontend_url
   ```
6. Deploy

### Alternative: Deploy to Railway

1. Sign up for [Railway](https://railway.app/)
2. Create a new project and import your GitHub repository
3. Configure the service with the same environment variables as above

## Step 5: Update Frontend Configuration

After deploying both frontend and backend:

1. Update the frontend environment variables with the production backend URL
2. Redeploy the frontend if necessary

## Step 6: Test the Production Deployment

1. Visit your deployed frontend URL
2. Test the login functionality
3. Test the payment process with Razorpay test cards
4. Verify that messages are being stored and displayed correctly

## Security Considerations

1. **CORS Configuration**: Ensure your backend CORS settings only allow requests from your frontend domain
2. **Environment Variables**: Never commit your .env files to version control
3. **Rate Limiting**: The application already includes rate limiting, but monitor for abuse
4. **Supabase RLS**: Ensure Row Level Security policies are properly configured
5. **HTTPS**: Ensure both frontend and backend use HTTPS in production
6. **API Keys**: Regularly rotate your Razorpay and Supabase keys

## Monitoring and Maintenance

1. Set up logging with a service like [LogRocket](https://logrocket.com/) or [Sentry](https://sentry.io/)
2. Monitor your API endpoints for errors and performance
3. Regularly update dependencies to patch security vulnerabilities

## Troubleshooting

If you encounter issues:

1. Check the server logs for errors
2. Verify that all environment variables are correctly set
3. Ensure your Razorpay and Supabase configurations are correct
4. Test the payment flow with Razorpay test cards
