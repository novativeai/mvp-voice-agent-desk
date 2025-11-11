# Quick Start: Voice Agent with Zoho Desk Ticket Creation

Get your ElevenLabs voice agent creating support tickets in Zoho Desk in under 10 minutes!

## ✅ What You Have

- ✅ MVP Voice Agent with ElevenLabs integration
- ✅ Zoho Desk API connection with auto-refresh tokens
- ✅ Custom tool configuration for ticket creation
- ✅ Agent instructions for handling support requests

## 🚀 Quick Setup (3 Steps)

### Step 1: Make Your App Public (Required)

ElevenLabs needs to reach your API from the internet. Choose one:

#### Option A: Ngrok (Fastest - 2 minutes)

```bash
# Install ngrok
brew install ngrok

# Start tunnel
cd "/Users/macbook/Documents/Research & Marketing/mvp-voice-agent-desk"
ngrok http 3000
```

You'll see:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copy that URL** (e.g., `https://abc123.ngrok.io`)

#### Option B: Vercel (Production - 5 minutes)

```bash
# Install and deploy
npm install -g vercel
vercel --prod

# Add environment variables
vercel env add ZOHO_DESK_ORG_ID
vercel env add ZOHO_DESK_REFRESH_TOKEN
vercel env add ZOHO_DESK_CLIENT_ID
vercel env add ZOHO_DESK_CLIENT_SECRET
vercel env add ELEVENLABS_API_KEY
vercel env add NEXT_PUBLIC_ELEVENLABS_AGENT_ID
```

### Step 2: Configure ElevenLabs Agent

#### Method A: Auto-Configure (Easiest)

```bash
# Set your public URL
export NEXT_PUBLIC_APP_URL=https://YOUR_URL_HERE

# Run configuration script
npm run configure-agent
```

#### Method B: Manual Setup (5 minutes)

1. Go to https://elevenlabs.io/app/conversational-ai
2. Select your agent
3. Click **Tools** → **Add Tool** → **Custom Tool**
4. Configure:
   - **Name**: `create_zoho_ticket`
   - **URL**: `https://YOUR_PUBLIC_URL/api/zoho-desk/tickets`
   - **Method**: `POST`
   - **Parameters**:
     - `subject` (string, required)
     - `description` (string, required)
     - `email` (string)
     - `firstName` (string)
     - `lastName` (string)
     - `priority` (enum: High, Medium, Low)

5. Click **Agent** tab → **System Prompt**
6. Add:
   ```
   You can create support tickets in Zoho Desk for customers who need help.

   When to create tickets:
   - Technical issues, bugs, errors
   - Account problems
   - Issues requiring follow-up

   How to create tickets:
   1. Ask: "May I have your email address?"
   2. Use create_zoho_ticket tool
   3. Provide ticket number and next steps
   ```

### Step 3: Test It!

1. **Open**: http://localhost:3000/chat
2. **Wait** for agent to connect
3. **Say**: "I need help, I'm having trouble logging into my account"
4. **Agent will**:
   - Ask for your email
   - Create a ticket
   - Give you the ticket number

5. **Verify** in Zoho Desk dashboard

## 🎯 Example Conversations

### Example 1: Technical Issue

**You**: "I'm getting an error when I export data"
**Agent**: "I'm sorry to hear that. Let me create a support ticket. May I have your email address?"
**You**: "john@example.com"
**Agent**: "Perfect! I've created ticket #10542. Our technical team will contact you at john@example.com within 2 hours."

### Example 2: Account Problem

**You**: "I can't log into my account"
**Agent**: "I understand how frustrating that must be. I'll create a support ticket right away. What's your email address?"
**You**: "sarah@company.com"
**Agent**: "Thank you, Sarah. I've created ticket #10543 with high priority. Our team will help you regain access within 2 hours."

## 📊 What Gets Created

Each ticket includes:
- ✅ **Subject**: Brief summary
- ✅ **Description**: Full details
- ✅ **Contact**: Auto-created from email
- ✅ **Priority**: High/Medium/Low
- ✅ **Channel**: Phone (voice agent)
- ✅ **Status**: Open
- ✅ **Department**: Auto-routed (if configured)

## 🔍 Monitoring

### Check Ticket Creation

Visit: http://localhost:3000/chat

You'll see:
- 🎫 Recent tickets panel
- 📊 Ticket count
- ✅ Live ticket status

### View Server Logs

```bash
# Watch for:
[Zoho Desk] Searching for contact with email: customer@example.com
[Zoho Desk] Creating new contact
[Zoho Desk] Created new contact: 1892000000042033
```

### Check ElevenLabs

Dashboard → Agent → Logs

Look for:
- Tool invocations
- Success/failure rates
- Response times

## ⚙️ Advanced Configuration

### Add Department Routing

1. Get department IDs from http://localhost:3000/chat
2. Update agent instructions:
   ```
   Technical issues → departmentId: "1892000000006907"
   Billing → departmentId: "1892000000082069"
   Sales → departmentId: "1892000000045123"
   ```

### Customize Priority Rules

Update agent with keyword-based priorities:
```
- "urgent", "critical", "down" → High
- "not working", "error" → Medium
- "question", "request" → Low
```

### Add Custom Fields

Modify `/api/zoho-desk/tickets/route.ts` to include:
- Customer type (free, paid, enterprise)
- Product/service affected
- Severity level
- SLA requirements

## 🐛 Troubleshooting

### "Connection refused" Error

**Problem**: App not publicly accessible

**Fix**:
```bash
# Make sure ngrok is running
ngrok http 3000

# Or check Vercel deployment
vercel --prod
```

### Agent Doesn't Create Ticket

**Problem**: Tool not configured or agent doesn't know when to use it

**Fix**:
1. Verify tool exists in ElevenLabs dashboard
2. Check tool name is exactly `create_zoho_ticket`
3. Add clearer instructions to agent prompt

### Ticket Missing Information

**Problem**: Agent creates ticket without email/details

**Fix**:
1. Update agent instructions to always ask for email
2. Make information gathering mandatory
3. Add validation before creating ticket

### Wrong Priority/Department

**Problem**: Tickets routed incorrectly

**Fix**:
1. Add keyword-based routing logic to agent
2. Update priority guidelines
3. Test with different scenarios

## 📚 Full Documentation

- **Complete Guide**: [ELEVENLABS_INTEGRATION.md](ELEVENLABS_INTEGRATION.md)
- **Agent Instructions**: [elevenlabs-agent-instructions.md](elevenlabs-agent-instructions.md)
- **Tool Config**: [elevenlabs-tool-config.json](elevenlabs-tool-config.json)
- **Production Setup**: [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)
- **Zoho Desk Setup**: [ZOHO_DESK_SETUP.md](ZOHO_DESK_SETUP.md)

## ✨ Tips for Success

1. **Always get email** - Agent should ask before creating ticket
2. **Be specific** - Good descriptions help support team
3. **Set right priority** - Use High sparingly
4. **Route correctly** - Send to right department
5. **Confirm creation** - Always provide ticket number
6. **Test regularly** - Verify end-to-end flow
7. **Monitor quality** - Review tickets weekly

## 🎉 You're Ready!

Your voice agent can now:
- ✅ Listen to customer issues
- ✅ Gather information intelligently
- ✅ Create tickets automatically
- ✅ Provide ticket numbers
- ✅ Route to correct teams
- ✅ Set appropriate priorities

**Start testing**: http://localhost:3000/chat

---

Need help? Check the full documentation or test the API directly:

```bash
curl -X POST "http://localhost:3000/api/zoho-desk/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test ticket",
    "description": "Testing the integration",
    "email": "test@example.com",
    "priority": "Low"
  }'
```
