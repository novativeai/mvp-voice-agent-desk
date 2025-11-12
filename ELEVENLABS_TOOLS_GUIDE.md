# ElevenLabs Tools Configuration Guide

**Date:** 2025-11-12
**Issue:** Dashboard shows "No tools found" despite having tool configuration files
**Goal:** Understand the 3 tool types and configure `create_zoho_ticket` tool correctly

---

## Why Is the Dashboard Empty?

Your ElevenLabs agent dashboard shows **"No tools found"** for one of these reasons:

### 1. ❌ The Configuration Script Hasn't Been Run Yet

**File:** `scripts/configure-elevenlabs-agent.ts`

This script attempts to:
- POST tool configuration to `/v1/convai/agents/{AGENT_ID}/tools`
- Update the agent's system prompt with instructions

**To run it:**
```bash
cd /Users/macbook/Documents/Research\ &\ Marketing/mvp-voice-agent-desk
export NEXT_PUBLIC_APP_URL=https://novative-voice-desk.vercel.app
npm run configure-agent
```

### 2. ⚠️ API Endpoint May Have Changed

**Important:** ElevenLabs deprecated the old `prompt.tools` field. The API now uses:
- **New:** `prompt.tool_ids` (references pre-created tools by ID)
- **New:** `prompt.built_in_tools` (for system tools like end_call)
- **Old (Deprecated):** `prompt.tools` (inline tool definitions)

**What this means:**
- You must **create tools separately** first (via dashboard or API)
- Then **reference them by ID** in the agent configuration
- Cannot send both `tool_ids` and `tools` (will error)

### 3. 🔧 Tools Must Be Created via Dashboard UI

The safest approach is to manually create the tool in the ElevenLabs dashboard, which is what you're looking at now.

---

## The 3 Tool Types Explained

### 🔗 1. Webhook Tool (Server Tool)

**What it is:**
- Calls external REST APIs from the server-side
- Your agent makes HTTP requests to your backend
- Returns data to the agent for use in conversation

**When to use:**
- Creating tickets (like your Zoho Desk integration)
- Fetching data from databases
- Calling 3rd party APIs (weather, flight info, order status)
- Performing actions on external systems

**Your use case:** ✅ **This is what you need for `create_zoho_ticket`**

**Configuration:**
```
Tool Type: Webhook (Server Tool)
Name: create_zoho_ticket
URL: https://novative-voice-desk.vercel.app/api/zoho-desk/tickets
Method: POST
Headers: Content-Type: application/json
```

**Parameters to define:**
```json
{
  "subject": {
    "type": "string",
    "description": "Brief summary of issue (max 255 chars)",
    "required": true
  },
  "description": {
    "type": "string",
    "description": "Detailed explanation with error messages and context",
    "required": true
  },
  "email": {
    "type": "string",
    "description": "Customer's email for follow-up",
    "required": false
  },
  "firstName": {
    "type": "string",
    "description": "Customer's first name",
    "required": false
  },
  "lastName": {
    "type": "string",
    "description": "Customer's last name",
    "required": false
  },
  "phone": {
    "type": "string",
    "description": "Customer's phone number",
    "required": false
  },
  "priority": {
    "type": "string",
    "enum": ["High", "Medium", "Low"],
    "description": "High=critical/down, Medium=moderate impact, Low=minor",
    "required": false
  },
  "departmentId": {
    "type": "string",
    "description": "Department ID for routing (leave empty for default)",
    "required": false
  }
}
```

**Expected response:**
```json
{
  "success": true,
  "ticket": {
    "id": "string",
    "ticketNumber": "string",
    "subject": "string",
    "status": "string"
  }
}
```

---

### �� 2. Client Tool

**What it is:**
- Runs JavaScript code directly in the user's browser
- Interacts with the web page DOM
- Triggered by the agent during conversation

**When to use:**
- Opening modals/popups on the webpage
- Navigating to different pages
- Highlighting elements on screen
- Submitting forms
- Updating UI components
- Showing/hiding sections

**Examples:**
- "Show pricing page" → navigates browser to /pricing
- "Open contact form" → displays modal with form
- "Highlight the feature" → scrolls and highlights element

**Your use case:** ❌ **Not needed for your current setup** (unless you want UI interactions)

**Configuration:**
```
Tool Type: Client Tool
Name: show_pricing_modal
Function: (args) => { document.getElementById('pricing-modal').style.display = 'block'; }
Wait for response: Optional (if you need data back from client)
```

**How it works:**
1. Agent decides to call client tool
2. JavaScript function executes in browser
3. Optionally returns data to agent

---

### 🔌 3. Integration Tool

**What it is:**
- Pre-built integrations with popular services
- ElevenLabs maintains the connection
- Usually OAuth-based authentication

**When to use:**
- Connecting to services ElevenLabs already supports
- Avoiding custom webhook development
- Using official integrations (Google Calendar, Salesforce, etc.)

**Examples:**
- Google Calendar (schedule meetings)
- Salesforce (create leads)
- Shopify (check order status)
- HubSpot (update CRM)

**Your use case:** ⚠️ **Zoho Desk is NOT in the pre-built integrations** (you need webhook tool)

**Configuration:**
```
Tool Type: Integration
Select service: [Choose from dropdown]
Authenticate: [Follow OAuth flow]
Configure: [Service-specific settings]
```

---

## Recommended Action: Add Webhook Tool via Dashboard

Since your dashboard shows "No tools found", here's the step-by-step to add your Zoho Desk tool:

### Step 1: Click "Add webhook tool"

From your screenshot, click the **"Add webhook tool"** button (first option).

### Step 2: Fill in the Tool Details

**Basic Information:**
```
Tool Name: create_zoho_ticket

Tool Description (very important for LLM):
Creates a support ticket in Zoho Desk when a customer needs help, reports an issue, or requests assistance that requires follow-up. Use this when the customer's issue cannot be resolved immediately in the conversation.
```

**Endpoint Configuration:**
```
URL: https://novative-voice-desk.vercel.app/api/zoho-desk/tickets
Method: POST
```

**Headers:**
```
Content-Type: application/json
```

### Step 3: Add Parameters (One by One)

Click "Add Parameter" for each:

#### Parameter 1: subject ✅ Required
```
Name: subject
Type: string
Description: Brief summary of the customer's issue or request (max 255 characters)
Required: ✅ Yes
```

#### Parameter 2: description ✅ Required
```
Name: description
Type: string
Description: Detailed description of the issue, including any error messages, steps taken, or context provided by the customer
Required: ✅ Yes
```

#### Parameter 3: email (Optional)
```
Name: email
Type: string
Description: Customer's email address for follow-up communication
Required: ❌ No
```

#### Parameter 4: firstName (Optional)
```
Name: firstName
Type: string
Description: Customer's first name
Required: ❌ No
```

#### Parameter 5: lastName (Optional)
```
Name: lastName
Type: string
Description: Customer's last name
Required: ❌ No
```

#### Parameter 6: phone (Optional)
```
Name: phone
Type: string
Description: Customer's phone number
Required: ❌ No
```

#### Parameter 7: priority (Optional with enum)
```
Name: priority
Type: string (enum)
Enum values: High, Medium, Low
Description: Urgency level: High (service down, critical issue), Medium (feature not working, moderate impact), Low (general inquiry, minor issue)
Default: Medium
Required: ❌ No
```

#### Parameter 8: departmentId (Optional)
```
Name: departmentId
Type: string
Description: Department ID to route the ticket to. Use 1214071000000006907 for general inquiries, 1214071000000390035 for bugs/support, 1214071000000402481 for new features. Leave empty for default routing.
Required: ❌ No
```

### Step 4: Configure Response Schema (Optional but Recommended)

Tell the agent what response to expect:

```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean"
    },
    "ticket": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "ticketNumber": { "type": "string" },
        "subject": { "type": "string" },
        "status": { "type": "string" }
      }
    },
    "message": {
      "type": "string"
    }
  }
}
```

### Step 5: Save the Tool

Click **"Save"** or **"Create Tool"** button.

The tool should now appear in your tools list!

---

## Alternative: Use the Configuration Script

If you prefer automation, try running the configuration script:

### Step 1: Set Environment Variables

```bash
export ELEVENLABS_API_KEY="your_api_key_here"
export NEXT_PUBLIC_ELEVENLABS_AGENT_ID="your_agent_id_here"
export NEXT_PUBLIC_APP_URL="https://novative-voice-desk.vercel.app"
```

**Check .env.local:**
```bash
cat .env.local | grep ELEVENLABS
```

### Step 2: Run the Script

```bash
cd "/Users/macbook/Documents/Research & Marketing/mvp-voice-agent-desk"
npm run configure-agent
```

### Step 3: Check Output

**If successful:**
```
✅ Tool added successfully!
   Tool ID: tool_abc123xyz
✅ Agent instructions updated successfully!
```

**If it fails:**
- Check API key is valid
- Check agent ID is correct
- Verify the API endpoint hasn't changed
- Fall back to manual dashboard configuration

---

## After Adding the Tool

### 1. Verify Tool Appears in Dashboard

Go back to the Tools tab in ElevenLabs dashboard. You should see:

```
create_zoho_ticket
Webhook • https://novative-voice-desk.vercel.app/api/zoho-desk/tickets
```

### 2. Update System Prompt

If not already done, update your agent's system prompt with the contents of `system-prompt.txt`:

1. Go to **Agent** tab → **System Prompt**
2. Copy contents of `system-prompt.txt`
3. Replace existing prompt
4. Save

**Why this matters:**
- The **Tool** defines WHAT the API does technically
- The **System Prompt** tells the agent WHEN and HOW to use it

### 3. Test the Tool

**Test conversation:**
```
You: "Our app is crashing when users upload files"

Agent should:
1. Ask for email
2. Ask clarifying questions
3. Call create_zoho_ticket with appropriate parameters
4. Confirm ticket creation with ticket number
```

**Check:**
- ✅ Tool was called by agent
- ✅ API received correct parameters
- ✅ Ticket created in Zoho Desk
- ✅ Agent told customer the ticket number

---

## Troubleshooting

### Tool not being called by agent

**Possible causes:**
1. **System prompt doesn't mention the tool**
   - Solution: Update system prompt with tool usage instructions

2. **Tool description is unclear**
   - Solution: Make description more specific about when to use it

3. **LLM model is too weak**
   - Solution: Use GPT-4o mini or Claude 3.5 Sonnet (recommended for tools)

### Tool called but API returns error

**Check API endpoint:**
```bash
curl -X POST https://novative-voice-desk.vercel.app/api/zoho-desk/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test ticket",
    "description": "Testing API endpoint",
    "priority": "Low"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "ticket": {
    "id": "...",
    "ticketNumber": "#12345",
    ...
  }
}
```

**Common errors:**
- 401 Unauthorized → Zoho token expired (check token refresh)
- 422 Validation Error → Missing required field (check departmentId auto-assignment)
- 500 Server Error → Check Vercel logs

### Tool appears in dashboard but agent can't use it

**Check agent configuration:**
1. Go to **Agent** tab → **Settings**
2. Verify the tool is **enabled** for this agent
3. Check if tool is in `tool_ids` array (API v2)

---

## Summary & Recommendations

### Current State
- ❌ Dashboard shows "No tools found"
- ✅ Tool configuration file exists: `elevenlabs-tool-config.json`
- ✅ Configuration script exists: `scripts/configure-elevenlabs-agent.ts`
- ✅ API endpoint working: `https://novative-voice-desk.vercel.app/api/zoho-desk/tickets`
- ✅ System prompt created: `system-prompt.txt`

### What You Need
- **Tool Type:** Webhook (Server Tool)
- **Purpose:** Call your Vercel API to create Zoho Desk tickets
- **Integration Type:** Custom REST API (not pre-built integration)

### Recommended Path Forward

**Option 1: Manual Dashboard Configuration** (Recommended - Most Reliable)
1. Click **"Add webhook tool"** in dashboard
2. Follow Step-by-Step guide above
3. Add all 8 parameters
4. Configure response schema
5. Save and test

**Option 2: Automated Script**
1. Verify environment variables in `.env.local`
2. Run `npm run configure-agent`
3. Check for success message
4. Verify tool appears in dashboard

**Option 3: Hybrid**
1. Try script first
2. If it fails, fall back to manual configuration
3. Use `elevenlabs-tool-config.json` as reference

### Next Steps After Tool Is Added

1. ✅ Upload system prompt from `system-prompt.txt`
2. ✅ Test with sample conversation
3. ✅ Monitor first 10 conversations for tool usage
4. ✅ Check Zoho Desk for created tickets
5. ✅ Verify department routing is correct

---

## Quick Reference: The 3 Tool Types

| Tool Type | What It Does | When to Use | Your Need |
|-----------|--------------|-------------|-----------|
| **Webhook** | Calls external REST APIs | Creating tickets, fetching data, 3rd party APIs | ✅ **YES** |
| **Client** | Runs JavaScript in browser | UI interactions, DOM manipulation | ❌ No |
| **Integration** | Pre-built service connections | Google Calendar, Salesforce, etc. | ❌ No (Zoho Desk not available) |

---

**Prepared by:** Claude Code
**Date:** November 12, 2025
**Status:** Ready for implementation

**Recommended Action:** Click "Add webhook tool" and follow the configuration guide above.
