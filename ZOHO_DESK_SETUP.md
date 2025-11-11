# Zoho Desk Integration Setup Guide

This guide will help you set up Zoho Desk integration with your ElevenLabs voice agent.

## Phase 1: Get Zoho Desk Credentials

### Step 1: Get Your Organization ID

1. Log in to [Zoho Desk](https://desk.zoho.com)
2. Go to **Setup** (gear icon) → **Developer Space** → **API**
3. Copy your **Organization ID**

### Step 2: Generate Access Token

You have two options for authentication:

#### Option A: Self Client (Quick Start - Good for Testing)
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Get Started" or "Add Client"
3. Select **Self Client**
4. Choose scope: `Desk.tickets.ALL`, `Desk.contacts.ALL`, `Desk.basic.READ`
5. Set time duration (e.g., 10 minutes for testing)
6. Click "Create"
7. Copy the generated **Access Token**

⚠️ **Note**: Self Client tokens expire quickly. Good for testing only.

#### Option B: Server-based Application (Production)
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Add Client" → **Server-based Applications**
3. Fill in:
   - Client Name: `Voice Agent Desk`
   - Homepage URL: `http://localhost:3000`
   - Authorized Redirect URIs: `http://localhost:3000/api/zoho-callback`
4. Click "Create"
5. Copy your **Client ID** and **Client Secret**
6. Generate authorization code and exchange for access token (see below)

### Step 3: Update Environment Variables

Edit `/mvp-voice-agent-desk/.env.local`:

```bash
# For Self Client (Testing)
ZOHO_DESK_ORG_ID=your_org_id_here
ZOHO_DESK_ACCESS_TOKEN=your_access_token_here
ZOHO_DESK_DOMAIN=desk.zoho.com

# For Server-based Application (Production)
ZOHO_DESK_ORG_ID=your_org_id_here
ZOHO_DESK_CLIENT_ID=your_client_id_here
ZOHO_DESK_CLIENT_SECRET=your_client_secret_here
ZOHO_DESK_REFRESH_TOKEN=your_refresh_token_here
ZOHO_DESK_DOMAIN=desk.zoho.com
```

## Phase 2: Test the Integration

### Step 1: Start the Development Server

```bash
cd mvp-voice-agent-desk
npm install
npm run dev
```

### Step 2: View Zoho Desk Data

1. Navigate to: `http://localhost:3000/chat`
2. You should see the **Zoho Desk Integration Status** panel at the top
3. Verify that it shows:
   - ✅ Organization information
   - ✅ Departments list
   - ✅ Agents list
   - ✅ Recent contacts
   - ✅ Recent tickets

### Step 3: Troubleshooting

If you see errors:

**Error: "Zoho Desk is not configured"**
- Check that `ZOHO_DESK_ORG_ID` and `ZOHO_DESK_ACCESS_TOKEN` are set in `.env.local`
- Restart the dev server after changing `.env.local`

**Error: "401 Unauthorized"**
- Your access token may have expired (Self Client tokens expire quickly)
- Generate a new access token or switch to Server-based Application

**Error: "Invalid orgId"**
- Double-check your Organization ID from Zoho Desk Settings
- Make sure there are no extra spaces or quotes

## Phase 3: Configure ElevenLabs Agent

### Step 1: Get Department and Agent IDs

From the Zoho Desk Integration Status panel on `/chat`, note down:

1. **Department IDs** - These will be used to route tickets
   Example: `1892000000006907` for "Technical Support"

2. **Agent IDs** - These will be used to assign tickets
   Example: `1892000000056007` for "John Doe"

### Step 2: Create Custom Tool for ElevenLabs

ElevenLabs agents can call external APIs. We need to expose our ticket creation endpoint:

The endpoint is already created at: `POST /api/zoho-desk/tickets`

Example request body:
```json
{
  "subject": "Customer needs help with login",
  "description": "Customer reports unable to access their account",
  "departmentId": "1892000000006907",
  "priority": "High",
  "email": "customer@example.com",
  "phone": "+1234567890"
}
```

### Step 3: Configure ElevenLabs Agent

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app)
2. Select your agent
3. Go to **Tools** → **Add Custom Tool**
4. Configure the tool:
   - **Name**: `create_support_ticket`
   - **Description**: `Creates a support ticket in Zoho Desk when the customer needs help`
   - **URL**: `https://your-domain.com/api/zoho-desk/tickets`
   - **Method**: `POST`
   - **Parameters**:
     - `subject` (required, string): Brief summary of the issue
     - `description` (required, string): Detailed description of the issue
     - `departmentId` (optional, string): Department to route ticket to
     - `priority` (optional, enum: High/Medium/Low): Priority level
     - `email` (optional, string): Customer's email
     - `phone` (optional, string): Customer's phone number

5. Add instructions to your agent's system prompt:
```
When a customer needs support that requires follow-up or technical assistance:
1. Gather necessary information: customer's issue, contact details
2. Use the create_support_ticket tool to create a ticket in Zoho Desk
3. Provide the ticket number to the customer
4. Assure them that a support agent will follow up shortly

Example scenarios to create tickets:
- Technical issues that can't be resolved immediately
- Account access problems
- Billing inquiries
- Feature requests
- Bug reports
```

### Step 4: Test the Agent

1. Start a conversation with your voice agent
2. Request support: "I need help with my account"
3. The agent should:
   - Ask for details about your issue
   - Gather your contact information
   - Create a ticket in Zoho Desk
   - Provide you with the ticket number
4. Verify the ticket appears in your Zoho Desk dashboard

## Phase 4: Advanced Configuration

### Department Routing Logic

Create intelligent routing based on keywords:

```typescript
// Example routing logic
const routeDepartment = (issue: string) => {
  if (issue.includes('payment') || issue.includes('billing')) {
    return 'BILLING_DEPT_ID'
  } else if (issue.includes('technical') || issue.includes('bug')) {
    return 'TECHNICAL_DEPT_ID'
  } else {
    return 'GENERAL_SUPPORT_DEPT_ID'
  }
}
```

### Agent Assignment

Route to specific agents based on:
- Current availability
- Expertise area
- Workload balancing

### Custom Fields

Add custom fields to tickets:

```json
{
  "subject": "Login issue",
  "description": "Cannot access account",
  "cf": {
    "cf_severityLevel": "Critical",
    "cf_affectedProduct": "Mobile App",
    "cf_customerType": "Enterprise"
  }
}
```

## API Endpoints Reference

### GET /api/zoho-desk
Fetch all Zoho Desk information for debugging

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {...},
    "departments": [...],
    "agents": [...],
    "contacts": [...],
    "recentTickets": [...]
  }
}
```

### POST /api/zoho-desk/tickets
Create a new support ticket

**Request:**
```json
{
  "subject": "string (required)",
  "description": "string (required)",
  "departmentId": "string (optional)",
  "contactId": "string (optional)",
  "priority": "High|Medium|Low (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "assigneeId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "ticket": {
    "id": "1892000000143237",
    "ticketNumber": "10521",
    "subject": "...",
    "status": "Open",
    ...
  }
}
```

## Security Best Practices

1. **Never commit credentials**: Always use `.env.local` (already in `.gitignore`)
2. **Use Server-based OAuth**: For production, use refresh tokens instead of static access tokens
3. **Implement rate limiting**: Add rate limiting to your API routes
4. **Validate inputs**: Always validate and sanitize user inputs before creating tickets
5. **Use HTTPS**: Always use HTTPS in production
6. **Rotate tokens**: Regularly rotate your access tokens

## Monitoring and Logging

The integration includes comprehensive logging:
- Check browser console for Zoho Desk API calls
- Check server logs for API responses
- Monitor the debug panel on `/chat` for real-time status

## Troubleshooting Common Issues

### Issue: Tokens Keep Expiring
**Solution**: Switch from Self Client to Server-based Application and implement refresh token logic

### Issue: Cannot Create Tickets
**Solution**:
- Verify `departmentId` exists in your Zoho Desk
- Ensure your access token has `Desk.tickets.CREATE` scope
- Check that required fields (subject, description) are provided

### Issue: Wrong Department Routing
**Solution**:
- Print department IDs from the debug panel
- Update your routing logic with correct IDs
- Test with different keywords

## Next Steps

1. ✅ Set up Zoho Desk credentials
2. ✅ Verify integration on `/chat` page
3. ✅ Configure ElevenLabs agent with custom tool
4. ⏭️ Deploy to production with proper OAuth
5. ⏭️ Add monitoring and analytics
6. ⏭️ Train support agents on the new workflow
