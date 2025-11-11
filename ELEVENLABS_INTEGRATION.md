# ElevenLabs Agent Integration with Zoho Desk

This guide shows you how to configure your ElevenLabs voice agent to automatically create support tickets in Zoho Desk.

## Overview

Your ElevenLabs agent will be able to:
- ✅ Listen to customer issues via voice
- ✅ Automatically create support tickets in Zoho Desk
- ✅ Provide ticket numbers to customers
- ✅ Route tickets to the correct department
- ✅ Set appropriate priority levels

## Prerequisites

- ✅ ElevenLabs account with agent access
- ✅ Your agent ID: `agent_0301k9mb2bb9fcbrgx9413854fwa`
- ✅ Zoho Desk integration working (test at `/chat`)
- ✅ Application deployed and accessible via public URL

## Step 1: Deploy Your App (Required for ElevenLabs)

ElevenLabs needs to reach your API from the internet. You have several options:

### Option A: Use Ngrok (Quick Testing)

```bash
# Install ngrok
brew install ngrok  # Mac
# or download from https://ngrok.com

# Start ngrok tunnel
cd "/Users/macbook/Documents/Research & Marketing/mvp-voice-agent-desk"
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

**Important:** Update the tool URL in Step 2 to use your ngrok URL.

### Option B: Deploy to Vercel (Production)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "/Users/macbook/Documents/Research & Marketing/mvp-voice-agent-desk"
vercel --prod

# Add environment variables
vercel env add ZOHO_DESK_ORG_ID
vercel env add ZOHO_DESK_REFRESH_TOKEN
vercel env add ZOHO_DESK_CLIENT_ID
vercel env add ZOHO_DESK_CLIENT_SECRET
vercel env add ZOHO_DESK_DOMAIN
vercel env add ELEVENLABS_API_KEY
vercel env add NEXT_PUBLIC_ELEVENLABS_AGENT_ID
```

You'll get a URL like: `https://your-app.vercel.app`

### Option C: Other Platforms

- **Railway**: `railway up`
- **Heroku**: `git push heroku main`
- **AWS**: Use Amplify or EC2
- **DigitalOcean**: Use App Platform

## Step 2: Configure Custom Tool in ElevenLabs

### Method A: Via Dashboard (Recommended)

1. **Go to ElevenLabs Dashboard**
   - Visit: https://elevenlabs.io/app/conversational-ai
   - Select your agent: `agent_0301k9mb2bb9fcbrgx9413854fwa`

2. **Add Custom Tool**
   - Click on **"Tools"** tab
   - Click **"Add Tool"** → **"Custom Tool"**

3. **Configure the Tool**

   **Basic Settings:**
   - **Name**: `create_zoho_ticket`
   - **Description**:
     ```
     Creates a support ticket in Zoho Desk when a customer needs help, reports an issue, or requests assistance that requires follow-up. Use this when the customer's issue cannot be resolved immediately in the conversation.
     ```

   **HTTP Configuration:**
   - **URL**: `https://YOUR_DOMAIN.com/api/zoho-desk/tickets`
     - Replace `YOUR_DOMAIN.com` with your actual domain (ngrok, Vercel, etc.)
   - **Method**: `POST`
   - **Headers**:
     ```json
     {
       "Content-Type": "application/json"
     }
     ```

   **Parameters:**

   Click "Add Parameter" for each:

   | Name | Type | Required | Description |
   |------|------|----------|-------------|
   | `subject` | String | ✅ Yes | Brief summary of the issue (max 255 chars) |
   | `description` | String | ✅ Yes | Detailed description of the issue |
   | `email` | String | No | Customer's email address |
   | `phone` | String | No | Customer's phone number |
   | `firstName` | String | No | Customer's first name |
   | `lastName` | String | No | Customer's last name |
   | `priority` | Enum | No | High, Medium, or Low |
   | `departmentId` | String | No | Department ID from Zoho Desk |

4. **Test the Tool**
   - Click **"Test Tool"**
   - Use sample data:
     ```json
     {
       "subject": "Test ticket",
       "description": "This is a test ticket from ElevenLabs",
       "email": "test@example.com",
       "priority": "Low"
     }
     ```
   - Verify it creates a ticket in Zoho Desk

5. **Save the Tool**
   - Click **"Save"**

### Method B: Via API (Programmatic)

Use the ElevenLabs API to add the tool:

```bash
curl -X POST "https://api.elevenlabs.io/v1/convai/agents/agent_0301k9mb2bb9fcbrgx9413854fwa/add-tool" \
  -H "xi-api-key: sk_4cc54f5a30b894b1e0dad58557a40fb1b6e326307a97adc1" \
  -H "Content-Type: application/json" \
  -d @elevenlabs-tool-config.json
```

## Step 3: Update Agent Instructions

1. **Go to Agent Settings**
   - Select your agent in ElevenLabs dashboard
   - Click **"Agent"** tab → **"System Prompt"** or **"Instructions"**

2. **Add Ticket Creation Instructions**

   Copy and paste the key sections from `elevenlabs-agent-instructions.md`:

   ```
   ## Support Ticket Creation

   You can create support tickets in Zoho Desk for customers who need follow-up assistance.

   ### When to Create Tickets:
   - Technical issues (bugs, errors, features not working)
   - Account problems (login issues, access problems)
   - Complex requests requiring specialist knowledge
   - Issues that need investigation or follow-up

   ### How to Create Tickets:
   1. Gather information: What happened? What were they trying to do?
   2. Collect contact details: email address or phone number
   3. Use create_zoho_ticket tool with subject, description, and contact info
   4. Confirm with customer: provide ticket number and next steps

   ### Priority Levels:
   - High: Service down, critical issues, security problems
   - Medium: Features not working, moderate impact (default)
   - Low: General questions, feature requests, minor issues

   ### Example Flow:
   Customer: "I'm getting an error when I try to export data"
   You: "I'll create a support ticket for you. May I have your email address?"
   Customer: "john@example.com"
   You: [Use create_zoho_ticket tool]
   You: "I've created ticket #10542. Our team will contact you at john@example.com within 2 hours."
   ```

3. **Save Instructions**
   - Click **"Save"** or **"Update Agent"**

## Step 4: Get Department IDs (Optional but Recommended)

For intelligent routing, get your department IDs:

1. **Go to your app**: http://localhost:3000/chat
2. **Find the Zoho Desk Integration Status panel**
3. **Note down Department IDs**, for example:
   ```
   Technical Support: 1892000000006907
   Billing: 1892000000082069
   Sales: 1892000000045123
   ```

4. **Add to Agent Instructions**:
   ```
   ### Department Routing:
   - Technical issues → departmentId: "1892000000006907"
   - Billing questions → departmentId: "1892000000082069"
   - Sales inquiries → departmentId: "1892000000045123"
   ```

## Step 5: Test the Integration

### Test 1: Via Voice (Recommended)

1. **Open your app**: http://localhost:3000/chat
2. **Wait for the agent to connect**
3. **Say**: "I need help, I'm having trouble with my account"
4. **Follow the conversation** - the agent should:
   - Ask for details about your issue
   - Request your email address
   - Create a ticket
   - Provide you with a ticket number

5. **Verify in Zoho Desk**:
   - Check if ticket appears in your Zoho Desk dashboard
   - Verify all details are correct

### Test 2: Direct API Test

Test the endpoint directly:

```bash
curl -X POST "http://localhost:3000/api/zoho-desk/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test ticket from API",
    "description": "This is a test ticket to verify the integration",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "priority": "Low"
  }'
```

Expected response:
```json
{
  "success": true,
  "ticket": {
    "id": "1892000000143237",
    "ticketNumber": "10542",
    "subject": "Test ticket from API",
    "status": "Open"
  }
}
```

### Test 3: ElevenLabs Tool Test

In ElevenLabs dashboard:
1. Go to **Tools** → **create_zoho_ticket**
2. Click **"Test Tool"**
3. Verify it creates a ticket successfully

## Step 6: Monitor and Optimize

### Monitor Ticket Creation

Watch for:
- Tickets being created successfully
- Correct department routing
- Appropriate priority levels
- Complete customer information

### Check Logs

**Server logs**:
```bash
cd "/Users/macbook/Documents/Research & Marketing/mvp-voice-agent-desk"
npm run dev

# Watch for:
[Zoho Desk] Searching for contact with email: customer@example.com
[Zoho Desk] Found existing contact: 1892000000042032
[Zoho Desk] Creating new contact
[Zoho Desk] Created new contact: 1892000000042033
```

**ElevenLabs logs**:
- Go to ElevenLabs dashboard → Agent → Logs
- Check for tool invocations and responses

### Optimize Agent Behavior

Based on testing, adjust:
- Agent instructions for clearer ticket creation flow
- Priority rules based on keywords
- Department routing logic
- Information gathering questions

## Common Issues and Solutions

### Issue 1: "Tool not found" Error

**Cause**: Tool not properly registered with ElevenLabs

**Solution**:
1. Verify tool is added in ElevenLabs dashboard
2. Check tool name matches exactly: `create_zoho_ticket`
3. Re-save agent configuration

### Issue 2: "Failed to create ticket" Error

**Cause**: API endpoint not reachable or authentication failed

**Solution**:
1. Verify your app is publicly accessible (test with ngrok/Vercel URL)
2. Check Zoho Desk credentials in `.env.local`
3. Test token refresh: `curl http://YOUR_DOMAIN/api/zoho-desk/token`

### Issue 3: Agent Doesn't Call the Tool

**Cause**: Agent doesn't recognize when to use the tool

**Solution**:
1. Make tool description more explicit in ElevenLabs dashboard
2. Update agent instructions with clear examples
3. Add trigger phrases in instructions

### Issue 4: Missing Customer Information

**Cause**: Agent creates ticket without email/phone

**Solution**:
1. Update agent instructions to always ask for email
2. Make email collection mandatory before creating ticket
3. Add validation in agent flow

### Issue 5: Wrong Priority or Department

**Cause**: Agent doesn't understand priority/routing rules

**Solution**:
1. Add clear priority guidelines to agent instructions
2. Include department routing examples
3. Add keyword-based routing logic

## Production Checklist

Before going live:

- [ ] App deployed to production URL (Vercel, Railway, etc.)
- [ ] All environment variables configured on production
- [ ] Tool URL updated with production domain
- [ ] Tested ticket creation end-to-end
- [ ] Agent instructions finalized and tested
- [ ] Department routing configured
- [ ] Priority rules documented
- [ ] Error handling tested
- [ ] Monitoring set up (error tracking)
- [ ] Team trained on new workflow

## Advanced Configuration

### Add Department Routing Logic

Update agent instructions with smart routing:

```
When creating tickets, automatically route based on keywords:

Technical Issues (technical, bug, error, crash, slow, not working):
→ departmentId: "1892000000006907"

Billing Issues (payment, invoice, charge, subscription, refund):
→ departmentId: "1892000000082069"

Sales Inquiries (buy, purchase, upgrade, pricing, enterprise):
→ departmentId: "1892000000045123"
```

### Add Custom Fields

If you have custom fields in Zoho Desk:

1. Update `/api/zoho-desk/tickets/route.ts` to accept custom fields
2. Update tool parameters in ElevenLabs
3. Update agent instructions with custom field logic

### Integrate with CRM

Link tickets to CRM records:

1. Search for customer in CRM by email
2. Include CRM customer ID in ticket description
3. Add CRM link to ticket for context

## Next Steps

1. ✅ Complete Steps 1-6 above
2. ✅ Test thoroughly with real conversations
3. ✅ Train your support team on the new workflow
4. ✅ Monitor ticket quality and adjust agent instructions
5. ✅ Set up analytics to track ticket creation rates
6. ✅ Optimize based on customer feedback

## Support

- **Tool Configuration**: [elevenlabs-tool-config.json](elevenlabs-tool-config.json)
- **Agent Instructions**: [elevenlabs-agent-instructions.md](elevenlabs-agent-instructions.md)
- **Production Setup**: [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)
- **Zoho Desk Setup**: [ZOHO_DESK_SETUP.md](ZOHO_DESK_SETUP.md)

---

**🎉 Your voice agent can now create support tickets automatically!**
