# Vercel Log Monitoring Guide

## 🎯 Quick Access

**Your Production URL:** https://novative-voice-desk.vercel.app

**Vercel Dashboard:** https://vercel.com/novativeai/mvp-voice-agent-desk

---

## 📊 Method 1: Vercel Dashboard (Easiest)

### View Logs via Web Interface

1. Go to [Vercel Dashboard](https://vercel.com/novativeai/mvp-voice-agent-desk)
2. Click on the **latest deployment** (top of the list)
3. Navigate to the **"Functions"** tab
4. Click on `/api/zoho-desk/tickets`
5. View **real-time logs** and execution history

### What to Look For

When the ElevenLabs agent calls the webhook, you'll see:

```
[Webhook] Received request from ElevenLabs: {
  "subject": "...",
  "description": "...",
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  ...
}
```

Then either:

**✅ Success:**
```
[Zoho Desk] Searching for contact with email: customer@example.com
[Zoho Desk] Found existing contact: 1234567890
[Zoho Desk] Using contactId for ticket: 1234567890
[Zoho Desk] Ticket payload: {...}
[Webhook] ✅ Ticket created successfully: {
  "ticketNumber": "#12345",
  "id": "...",
  ...
}
```

**❌ Error:**
```
[Zoho Desk] ❌ Contact creation/search failed: Error message here
Failed to create Zoho Desk ticket: Error: ...
```

---

## 🖥️ Method 2: Vercel CLI (From Terminal)

### One-Time Setup

```bash
# Login to Vercel
vercel login

# Link the project
cd "/Users/macbook/Documents/Research & Marketing/mvp-voice-agent-desk"
vercel link
```

### View Logs

```bash
# Check latest logs (last 100 entries)
./check-logs.sh

# Follow logs in real-time
vercel logs https://novative-voice-desk.vercel.app --follow

# Filter for webhook calls only
vercel logs https://novative-voice-desk.vercel.app --follow | grep -i 'webhook'

# Filter for errors only
vercel logs https://novative-voice-desk.vercel.app --follow | grep -i 'error'
```

---

## 🔧 Method 3: Vercel API (Advanced)

### Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Copy the token

### Set Token

```bash
export VERCEL_TOKEN='your-token-here'
```

### Fetch Logs

```bash
./monitor-logs.sh
```

---

## 🐛 Debugging Webhook Issues

### Test Webhook Endpoint Directly

```bash
curl -X POST https://novative-voice-desk.vercel.app/api/zoho-desk/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test ticket",
    "description": "Testing webhook endpoint",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "priority": "Medium"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "ticket": {
    "id": "...",
    "ticketNumber": "#12345",
    "subject": "Test ticket",
    "status": "Open",
    "priority": "Medium"
  },
  "timestamp": "2025-11-12T..."
}
```

### Common Issues

#### 1. **422 Error: contactId missing**

**Cause:** Contact creation failed or email validation error

**Check logs for:**
```
[Zoho Desk] ❌ Contact creation/search failed
```

**Solution:** Verify email format and Zoho Desk permissions

#### 2. **401 Error: Unauthorized**

**Cause:** Zoho Desk token expired

**Check logs for:**
```
[Zoho Desk] Token expired, refreshing and retrying...
```

**Solution:** System auto-refreshes, but verify refresh token is valid

#### 3. **No logs appearing**

**Cause:** Tool not enabled in ElevenLabs or webhook not called

**Solution:**
1. Check ElevenLabs dashboard → Tools → Verify `create_zoho_ticket` is enabled
2. Test a call and explicitly ask to create a ticket
3. Check Vercel logs for any incoming requests

---

## 📈 Monitoring Best Practices

### Real-Time Monitoring During Development

```bash
# Terminal 1: Follow logs
vercel logs https://novative-voice-desk.vercel.app --follow

# Terminal 2: Test webhook calls
# Make test calls via ElevenLabs agent
```

### After Each Deployment

1. Check Vercel deployment status:
   - Visit https://vercel.com/novativeai/mvp-voice-agent-desk
   - Verify deployment is "Ready" (green checkmark)

2. Test webhook endpoint:
   ```bash
   curl -X POST https://novative-voice-desk.vercel.app/api/zoho-desk/tickets \
     -H "Content-Type: application/json" \
     -d '{"subject":"Deploy test","description":"Testing after deploy","email":"test@example.com"}'
   ```

3. Check function logs for any errors

### Production Monitoring

Set up alerts in Vercel dashboard:
1. Go to project settings
2. Navigate to "Integrations"
3. Add notification integrations (Slack, Discord, etc.)
4. Configure alerts for function errors

---

## 🔍 Log Analysis

### Successful Ticket Creation Flow

```
1. [Webhook] Received request from ElevenLabs
2. [Zoho Desk] Searching for contact with email
3. [Zoho Desk] Found existing contact OR Created new contact
4. [Zoho Desk] Using contactId for ticket
5. [Zoho Desk] Ticket payload: {...}
6. [Webhook] ✅ Ticket created successfully
```

### Failed Ticket Creation Flow

```
1. [Webhook] Received request from ElevenLabs
2. [Zoho Desk] Searching for contact with email
3. [Zoho Desk] ❌ Contact creation/search failed: [ERROR]
4. Failed to create Zoho Desk ticket: [ERROR]
```

---

## 📞 Quick Debugging Commands

```bash
# Check latest deployment
vercel ls

# View function logs
vercel logs https://novative-voice-desk.vercel.app

# Test webhook endpoint
curl -X POST https://novative-voice-desk.vercel.app/api/zoho-desk/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","description":"Test","email":"test@example.com"}'

# Check Zoho Desk debug endpoint
curl https://novative-voice-desk.vercel.app/api/zoho-desk/debug

# Git status
git status

# Push changes and trigger deployment
git add . && git commit -m "Fix" && git push
```

---

## 🎯 What to Monitor

### Key Metrics

1. **Webhook Call Success Rate**
   - Count of "[Webhook] Received request"
   - Count of "[Webhook] ✅ Ticket created"
   - Calculate success rate

2. **Contact Creation**
   - New contacts: "[Zoho Desk] ✅ Created new contact"
   - Existing contacts: "[Zoho Desk] Found existing contact"

3. **Error Rate**
   - Count of "[Zoho Desk] ❌"
   - Types of errors (422, 401, etc.)

4. **Department Routing**
   - Which departments receive most tickets
   - Verify correct routing logic

5. **Priority Distribution**
   - High/Medium/Low distribution
   - Verify appropriate priority selection

---

## 💡 Tips

1. **Keep logs open during testing** - Always have logs following in a terminal when testing
2. **Check both Vercel and Zoho** - Verify tickets actually appear in Zoho Desk
3. **Test edge cases** - New contacts, existing contacts, missing names, etc.
4. **Monitor function execution time** - Should be < 3 seconds for good UX
5. **Set up alerts** - Get notified of errors automatically

---

**Last Updated:** 2025-11-12
**Deployed URL:** https://novative-voice-desk.vercel.app
**Project:** MVP Voice Agent with Zoho Desk Integration
