# Production Setup - Automatic Token Refresh

Your Zoho Desk integration is now production-ready with automatic token refresh!

## ✅ What's Configured

### 1. Automatic Token Refresh
The system will automatically refresh your Zoho Desk access token **before it expires** (1 hour lifespan).

**Key Features:**
- Automatic token refresh 60 seconds before expiry
- Retry mechanism if a request fails with 401 Unauthorized
- Falls back to static token if refresh fails
- Thread-safe token management (prevents race conditions)

### 2. Environment Variables

Your `.env.local` now contains:

```bash
# Static token (expires in 1 hour)
ZOHO_DESK_ACCESS_TOKEN=1000.45a7b8cf8630d5676c3ca8c19a6fd2ed...

# Refresh credentials (never expire)
ZOHO_DESK_REFRESH_TOKEN=1000.355f08963f0400c3aa15f0d7c077b02a...
ZOHO_DESK_CLIENT_ID=1000.GNFLOVJOPNE1YZ0Y4SVQ6ZPLHNLYFN
ZOHO_DESK_CLIENT_SECRET=a756e38a5c1610c6c3b6e755f739443cdc75350e07
```

## 🔄 How Token Refresh Works

### Automatic Flow

1. **Request Made** → System checks if token is still valid
2. **Token Expired?** → Automatically refreshes using refresh token
3. **New Token** → Cached and used for subsequent requests
4. **401 Error?** → Clears cache, refreshes, and retries once

### Architecture

```
┌─────────────────┐
│   API Request   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Token Manager   │ ← Checks expiry (60s buffer)
└────────┬────────┘
         │
    ┌────▼────┐
    │ Valid?  │
    └─┬────┬──┘
   Yes│    │No
      │    │
      │    ▼
      │  ┌──────────────┐
      │  │ Refresh Token│ ← Calls Zoho OAuth
      │  └──────┬───────┘
      │         │
      │         ▼
      │  ┌──────────────┐
      │  │  New Token   │
      │  └──────┬───────┘
      │         │
      └─────┬───┘
            │
            ▼
    ┌───────────────┐
    │ Make Request  │
    └───────────────┘
```

## 🧪 Testing Token Refresh

### Test Auto-Refresh

1. **Wait for token to expire** (1 hour) or force it:

```bash
curl -X POST http://localhost:3000/api/zoho-desk/token
```

2. **Check token status:**

```bash
curl http://localhost:3000/api/zoho-desk/token
```

Response:
```json
{
  "success": true,
  "autoRefreshEnabled": true,
  "hasToken": true,
  "tokenPreview": "1000.45a7b8cf8630d5..."
}
```

### Test Full Integration

Visit: `http://localhost:3000/chat`

You should see:
- ✅ Zoho Desk data loading without errors
- ✅ Console logs showing token refresh (if it happens)
- ✅ No 401 errors even after 1 hour

## 📊 Monitoring

### Server Logs

Watch for these log messages:

```bash
# Token refresh happening
[Zoho Token] Refreshing access token...
[Zoho Token] ✅ Token refreshed successfully
[Zoho Token] New token expires in: 3600 seconds

# Fallback to static token (if refresh fails)
[Zoho Token] ❌ Failed to refresh token
[Zoho Token] Falling back to static token

# 401 retry mechanism
[Zoho Desk] Token expired, refreshing and retrying...
```

### Browser Console

Open DevTools (F12) and watch for:

```
[Zoho Desk] Initializing with automatic token refresh: enabled
[Zoho Desk] Data fetched successfully
```

## 🚀 Deployment Checklist

### Before Deploying to Production

- [ ] **Secure Environment Variables**
  - Use secrets manager (AWS Secrets Manager, Vercel Env Vars, etc.)
  - Never commit `.env.local` to git (already in `.gitignore`)

- [ ] **Verify Token Refresh**
  - Test that tokens refresh automatically
  - Monitor logs for any refresh failures

- [ ] **Set Up Monitoring**
  - Add error tracking (Sentry, LogRocket, etc.)
  - Set up alerts for 401 errors
  - Monitor token refresh success rate

- [ ] **Security Headers**
  - Ensure API routes are properly secured
  - Consider rate limiting on `/api/zoho-desk/*` endpoints

### Deployment Platforms

#### Vercel
```bash
vercel env add ZOHO_DESK_ORG_ID production
vercel env add ZOHO_DESK_REFRESH_TOKEN production
vercel env add ZOHO_DESK_CLIENT_ID production
vercel env add ZOHO_DESK_CLIENT_SECRET production
vercel env add ZOHO_DESK_DOMAIN production
```

#### Docker
```dockerfile
ENV ZOHO_DESK_ORG_ID=905664638
ENV ZOHO_DESK_REFRESH_TOKEN=<your_token>
ENV ZOHO_DESK_CLIENT_ID=<your_client_id>
ENV ZOHO_DESK_CLIENT_SECRET=<your_secret>
ENV ZOHO_DESK_DOMAIN=desk.zoho.com
```

## 🔐 Security Best Practices

### 1. Rotate Credentials Regularly
- Regenerate OAuth client every 90 days
- Update environment variables immediately

### 2. Least Privilege
Only grant necessary scopes:
- `Desk.tickets.ALL`
- `Desk.contacts.ALL`
- `Desk.basic.READ`
- `Desk.settings.READ`
- `Desk.search.READ`

### 3. Monitor Access
- Review Zoho Desk API logs regularly
- Set up alerts for unusual activity
- Monitor failed refresh attempts

### 4. Secure Storage
- ✅ Never store tokens in code
- ✅ Use environment variables
- ✅ Use secrets managers in production
- ❌ Don't log full tokens (use previews only)

## 🐛 Troubleshooting

### Token Refresh Fails

**Symptoms:**
- Logs show: `[Zoho Token] ❌ Failed to refresh token`
- API returns 401 errors

**Solutions:**
1. **Check refresh token validity:**
   ```bash
   curl -X POST https://accounts.zoho.com/oauth/v2/token \
     -d "refresh_token=YOUR_REFRESH_TOKEN" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "grant_type=refresh_token"
   ```

2. **Regenerate credentials:**
   - Go to [Zoho API Console](https://api-console.zoho.com/)
   - Delete old client
   - Create new Server-based Application
   - Generate new tokens

3. **Update environment variables** with new credentials

### 401 Errors Persist

**Check:**
1. Organization ID is correct
2. Refresh token hasn't been revoked
3. API Console client still exists
4. Scopes match your needs

### Token Manager Not Working

**Debug steps:**
1. Check server logs for initialization:
   ```
   [Zoho Desk] Initializing with automatic token refresh: enabled
   ```

2. Force refresh to test:
   ```bash
   curl -X POST http://localhost:3000/api/zoho-desk/token
   ```

3. Verify environment variables are loaded:
   ```bash
   # In your terminal
   cd mvp-voice-agent-desk
   node -e "console.log(process.env.ZOHO_DESK_REFRESH_TOKEN)"
   ```

## 📚 API Reference

### GET /api/zoho-desk/token
Get current token status

**Response:**
```json
{
  "success": true,
  "autoRefreshEnabled": true,
  "hasToken": true,
  "tokenPreview": "1000.45a7b8cf8630d5...",
  "timestamp": "2025-11-11T17:00:00.000Z"
}
```

### POST /api/zoho-desk/token
Force token refresh

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "tokenPreview": "1000.45a7b8cf8630d5...",
  "timestamp": "2025-11-11T17:00:00.000Z"
}
```

## 🎯 Next Steps

1. **Test the integration** - Wait 1 hour or force refresh
2. **Deploy to staging** - Test in staging environment first
3. **Set up monitoring** - Add error tracking and alerts
4. **Deploy to production** - Use secrets manager for credentials
5. **Monitor performance** - Watch token refresh rates and errors

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for detailed error messages
3. Test token refresh manually using curl commands
4. Regenerate credentials if needed

---

**🎉 Your integration is production-ready!** Tokens will now refresh automatically without any downtime or manual intervention.
