# Security Guide for Buy Me a Chai ☕

This guide outlines security best practices for your Buy Me a Chai application.

## Environment Variables

### Protection

- **Never commit .env files** to version control
- Use `.gitignore` to exclude all `.env` files
- Consider using a secrets manager for production environments
- Rotate API keys regularly

### Required Environment Variables

#### Client-side (.env in client directory)
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=your_backend_url
```

#### Server-side (.env in server directory)
```
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CORS_ORIGIN=your_frontend_url
```

## API Security

### CORS Configuration

The application uses CORS middleware to restrict which domains can access your API:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

In production, set `CORS_ORIGIN` to your exact frontend domain (e.g., `https://your-app.com`).

### Rate Limiting

The application implements rate limiting to prevent abuse:

- General API routes: 100 requests per 15 minutes
- Payment routes: 20 requests per hour

Adjust these limits based on your expected traffic.

## Authentication

### Supabase Authentication

- Use Google OAuth for secure authentication
- JWT tokens are validated on the backend for all protected routes
- Configure proper redirect URIs in Google Cloud Console

### Token Handling

- Store tokens securely in browser (Supabase handles this)
- Validate tokens on every protected API request
- Set appropriate token expiration times

## Database Security

### Row Level Security (RLS)

Supabase RLS policies are configured to:

- Allow users to view their own profiles
- Allow users to update their own profiles
- Allow anyone to view chai messages
- Allow only authenticated users to create chai messages

### Service Role Key

The backend uses the Supabase service role key for administrative operations. This key has full access to your database, so:

- Only use it on the server-side
- Never expose it to the client
- Consider using more granular permissions where possible

## Payment Security

### Razorpay Integration

- Server-side order creation prevents tampering with payment amounts
- HMAC signature validation ensures payment authenticity
- Store payment details securely in the database

### Payment Verification

All payments are verified using Razorpay's signature validation:

```javascript
const isValidSignature = verifyPaymentSignature(
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  process.env.RAZORPAY_KEY_SECRET
);
```

## Additional Security Measures

### HTTP Security Headers

The application uses Helmet.js to set secure HTTP headers:

```javascript
app.use(helmet());
```

This helps protect against common web vulnerabilities like XSS, clickjacking, etc.

### Logging

Implement secure logging practices:

- Log security events with timestamps
- Don't log sensitive information (tokens, passwords)
- Use structured logging for easier analysis

### Regular Updates

- Keep all dependencies updated
- Monitor security advisories for your dependencies
- Use `npm audit` regularly to check for vulnerabilities

## Production Checklist

Before deploying to production:

1. ✅ Enable HTTPS for both frontend and backend
2. ✅ Set strict CORS policy
3. ✅ Configure rate limiting
4. ✅ Implement proper error handling
5. ✅ Set up monitoring and alerting
6. ✅ Test payment flow with Razorpay test credentials
7. ✅ Verify all Supabase RLS policies
8. ✅ Ensure all environment variables are properly set
