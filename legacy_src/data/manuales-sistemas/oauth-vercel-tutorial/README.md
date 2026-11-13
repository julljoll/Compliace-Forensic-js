# Vercel OAuth Authentication Integration Tutorial

This tutorial provides a step-by-step guide to setting up Vercel OAuth authentication for the sha256.us forensic laboratory management system.

## Overview

The application uses Vercel OAuth for secure authentication, allowing users to sign in with their Vercel accounts. This guide covers the complete setup process from creating a Vercel OAuth application to configuring the environment variables and testing the authentication flow.

## Prerequisites

1. A Vercel account
2. Node.js 16+ installed
3. Access to the sha256.us repository
4. Basic understanding of OAuth 2.0 flows

## Step 1: Create Vercel OAuth Application

1. Log in to your Vercel account at https://vercel.com
2. Go to **Settings** → **Applications** → **OAuth Applications**
3. Click **"New OAuth Application"**
4. Fill in the form:
   - **Application Name**: sha256-us-forensic-lab (or your preferred name)
   - **Redirect URI**: http://localhost:5173/auth/vercel-callback (for development)
   - **Description**: Forensic Laboratory Management System - OAuth Authentication
5. Click **"Create Application"**
6. Note down the:
   - **Client ID**
   - **Client Secret"

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   `ash
   cp .env.example .env
   `

2. Edit the .env file and add your Vercel OAuth credentials:
   `
   VITE_VERCEL_OAUTH_CLIENT_ID=your_client_id_here
   VITE_VERCEL_OAUTH_CLIENT_SECRET=your_client_secret_here
   `

3. Important: Never commit your .env file to version control. The .gitignore file already excludes it.

## Step 3: Understand the Authentication Flow

The authentication flow follows the OAuth 2.0 Authorization Code Grant:

1. User clicks "Sign in with Vercel"
2. Browser redirects to Vercel authorization endpoint
3. User grants permission to the application
4. Vercel redirects back to /auth/vercel-callback with authorization code
5. Application exchanges code for access token
6. User profile is fetched and stored in authStore
7. User is redirected to the dashboard

## Step 4: Key Files Involved

### Authentication Store (src/store/authStore.ts)
Manages authentication state including:
- User login/logout
- Token storage
- User profile data
- Authentication status

### Vercel Callback Handler (src/pages/Auth/VercelCallback.tsx)
Handles the OAuth callback from Vercel:
- Extracts authorization code from URL
- Exchanges code for access token
- Fetches user profile from Vercel API
- Updates authStore with user data
- Redirects to appropriate page

### OAuth Service (src/api/oauth/vercel.ts)
Contains the core OAuth logic:
- Authorization URL generation
- Token exchange
- User profile fetching
- Error handling

### App Routing (src/App.tsx)
Defines protected routes using AuthGuard component:
- Redirects unauthenticated users to login
- Handles callback route
- Protects all dashboard routes

## Step 5: Development Setup

1. Start the development server:
   `ash
   npm run dev
   `

2. Navigate to http://localhost:5173

3. Click "Sign in with Vercel"

4. You should be redirected to Vercel's authorization page

5. After granting permissions, you'll be redirected back to the application

6. If successful, you'll see the dashboard with your user information

## Step 6: Production Considerations

For production deployment:

1. Update the Redirect URI in your Vercel OAuth application:
   - Production: https://your-domain.com/auth/vercel-callback

2. Set environment variables in your production hosting platform:
   - Vercel: Add to Project Settings → Environment Variables
   - Netlify: Add to Site Settings → Build & Deploy → Environment
   - Docker: Pass as container environment variables

3. Ensure your .env file is NOT included in production builds
   - The build process should inject environment variables at runtime

## Step 7: Troubleshooting

### Common Issues:

**1. "Invalid redirect URI" error**
   - Ensure the Redirect URI in Vercel matches exactly what's in your application
   - Include the protocol (http/https) and port if applicable
   - No trailing slashes unless specified

**2. "Invalid client credentials"**
   - Double-check your Client ID and Client Secret in .env
   - Ensure there are no extra spaces or characters

**3. "Access denied" or "invalid_grant"**
   - The authorization code may have expired (codes are short-lived)
   - Try the authentication flow again
   - Clear browser cookies/cache if persistent

**4. User data not loading after login**
   - Check browser console for API errors
   - Verify the Vercel API is accessible from your network
   - Ensure user has a valid Vercel account

### Debugging Tips:

1. Enable verbose logging in src/api/oauth/vercel.ts temporarily
2. Check the Network tab in DevTools for API requests/responses
3. Monitor the authStore state using React DevTools
4. Check application logs for audit entries

## Step 8: Security Best Practices

1. **Environment Variables**: Never expose client secrets in client-side code
2. **Token Storage**: Tokens are stored in-memory only (not in localStorage/sessionStorage)
3. **HTTPS**: In production, always use HTTPS to prevent token interception
4. **Session Timeout**: Consider implementing automatic logout after inactivity
5. **Audit Logging**: All authentication events are logged to the audit store
6. **CSRF Protection**: OAuth flow includes state parameter to prevent CSRF attacks

## Step 9: Testing the Integration

### Manual Testing:
1. Test login/logout cycles
2. Test accessing protected routes without authentication
3. Test token expiration handling
4. Test error cases (network failure, invalid credentials)

### Automated Testing:
- Unit tests for authStore actions
- Integration tests for OAuth callback flow
- E2E tests covering the complete authentication journey

## Step 10: Maintenance

### Updating Dependencies:
`ash
npm update
`

### Checking for Security Vulnerabilities:
`ash
npm audit
`

### Monitoring:
- Regularly check audit logs for authentication attempts
- Monitor for failed login attempts
- Review OAuth application permissions in Vercel dashboard periodically

## Conclusion

You have successfully integrated Vercel OAuth authentication into the sha256.us forensic laboratory management system. Users can now securely sign in using their Vercel credentials, and their authentication state is managed throughout the application.

For further assistance, refer to:
- Vercel OAuth Documentation: https://vercel.com/docs/concepts/accounts/teams-oauth
- OAuth 2.0 Specification: https://oauth.net/2/
- Application source code for implementation details
