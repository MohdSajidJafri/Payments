# Buy Me a Chai ☕

A full-stack web application where users can support you by buying you a virtual chai. Users can log in using Google OAuth, enter a message, make a payment through Razorpay, and their message will be displayed on a public feed.

## Project Structure

```
buy-me-a-chai/
├── client/             # React frontend
│   ├── public/         # Public assets
│   ├── src/            # Source files
│   └── .env            # Frontend environment variables
└── server/             # Express backend
    ├── src/            # Source files
    ├── config/         # Configuration files
    └── .env            # Backend environment variables
```

## Environment Variables

### Client (.env)
- `REACT_APP_SUPABASE_URL`: Your Supabase project URL (from Supabase Project Settings)
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key (from Supabase Project Settings > API)
- `REACT_APP_API_URL`: Your backend API URL (default: http://localhost:5000)

### Server (.env)
- `PORT`: Port for the server to run on (default: 5000)
- `RAZORPAY_KEY_ID`: Your Razorpay Key ID (from Razorpay Dashboard > Settings > API Keys)
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret (from Razorpay Dashboard > Settings > API Keys)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for secure backend operations)
- `CORS_ORIGIN`: Frontend URL for CORS (default: http://localhost:3000)

## Getting Started

1. Clone the repository
2. Install dependencies for both client and server:
   ```
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up your environment variables in both `.env` files
4. Set up Supabase tables as described in the documentation
5. Run the development servers:
   ```
   # Terminal 1 - Client
   cd client && npm start
   
   # Terminal 2 - Server
   cd server && npm run dev
   ```

## Deployment
- Frontend: Deploy to Vercel or Netlify
- Backend: Deploy to Render, Railway, or Supabase Edge Functions
