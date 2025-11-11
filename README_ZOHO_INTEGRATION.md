# MVP Voice Agent with Zoho Desk Integration

This project extends the original `mvp-voice-agent` with full Zoho Desk support ticket integration.

## What's New in mvp-voice-agent-desk

### ✅ Phase 1: Complete Integration (Done!)

1. **Zoho Desk API Integration**
   - Full REST API client in [lib/zoho-desk.ts](lib/zoho-desk.ts)
   - Automatic contact search/creation
   - Support for all ticket operations (create, update, list, get)
   - Organization, department, agent, and contact management

2. **Debug Dashboard**
   - Real-time Zoho Desk data display on `/chat` page
   - Shows:
     - Organization info
     - All departments
     - All agents
     - Recent contacts
     - Recent tickets
   - Refresh button to reload data
   - Clear error messages for troubleshooting

3. **API Endpoints**
   - `GET /api/zoho-desk` - Fetch all Zoho Desk info for debugging
   - `POST /api/zoho-desk/tickets` - Create new support tickets
   - Ready for ElevenLabs agent integration

4. **Best Practices Implementation**
   - Contact search before ticket creation (per Zoho docs)
   - Automatic contact creation if not found
   - Proper error handling and logging
   - Secure credential management via environment variables
   - Channel set to "Phone" for voice agent tickets

## Quick Start

### 1. Install Dependencies

```bash
cd mvp-voice-agent-desk
npm install
```

### 2. Configure Zoho Desk

Follow the comprehensive guide in [ZOHO_DESK_SETUP.md](ZOHO_DESK_SETUP.md)

Quick version:
1. Get your Zoho Desk Organization ID
2. Generate an Access Token from Zoho API Console
3. Update `.env.local`:

```bash
ZOHO_DESK_ORG_ID=your_org_id_here
ZOHO_DESK_ACCESS_TOKEN=your_access_token_here
ZOHO_DESK_DOMAIN=desk.zoho.com
```

### 3. Start the App

```bash
npm run dev
```

### 4. Test the Integration

Navigate to `http://localhost:3000/chat`

You should see:
- ✅ Zoho Desk Integration Status panel at the top
- ✅ All your departments, agents, contacts, and recent tickets
- ✅ Voice chat interface below

## Architecture

```
mvp-voice-agent-desk/
├── lib/
│   └── zoho-desk.ts              # Zoho Desk API client
├── app/
│   ├── api/
│   │   └── zoho-desk/
│   │       ├── route.ts          # GET /api/zoho-desk
│   │       └── tickets/
│   │           └── route.ts      # POST /api/zoho-desk/tickets
│   └── chat/
│       └── page.tsx              # Chat page with Zoho Desk UI
├── components/
│   └── voice/
│       └── VoiceChat.tsx         # Enhanced with Zoho Desk display
├── .env.local                    # Your credentials (not in git)
└── ZOHO_DESK_SETUP.md           # Complete setup guide
```

## API Reference

### Get All Zoho Desk Data

```bash
curl http://localhost:3000/api/zoho-desk
```

Response:
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

### Create Ticket

```bash
curl -X POST http://localhost:3000/api/zoho-desk/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Login issue",
    "description": "Cannot access account",
    "email": "customer@example.com",
    "phone": "+1234567890",
    "priority": "High",
    "departmentId": "your_department_id"
  }'
```

Response:
```json
{
  "success": true,
  "ticket": {
    "id": "1892000000143237",
    "ticketNumber": "10521",
    "subject": "Login issue",
    "status": "Open",
    ...
  }
}
```

## Connecting ElevenLabs Agent

### Step 1: Note Your Department IDs

From the debug panel on `/chat`, copy the Department IDs you want to use for ticket routing.

### Step 2: Configure Custom Tool in ElevenLabs

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app)
2. Select your agent → **Tools** → **Add Custom Tool**
3. Configure:
   - **Name**: `create_support_ticket`
   - **URL**: `https://your-domain.com/api/zoho-desk/tickets`
   - **Method**: `POST`
   - **Parameters**:
     ```json
     {
       "subject": "string (required)",
       "description": "string (required)",
       "email": "string (optional)",
       "phone": "string (optional)",
       "priority": "enum: High|Medium|Low",
       "departmentId": "string (optional)",
       "firstName": "string (optional)",
       "lastName": "string (optional)"
     }
     ```

### Step 3: Update Agent Instructions

Add to your agent's system prompt:

```
When a customer requests support or reports an issue that requires follow-up:

1. Gather information:
   - Customer's name
   - Email address or phone number
   - Clear description of the issue
   - Priority level (High, Medium, Low)

2. Create a support ticket using the create_support_ticket tool

3. Inform the customer:
   - Ticket number
   - Expected response time
   - Next steps

Example triggers:
- "I need help with..."
- "There's a problem with..."
- "I can't access..."
- "Something is broken..."
```

## Features

### Smart Contact Management
- Automatically searches for existing contacts by email
- Creates new contacts if they don't exist
- Links tickets to the correct contact record

### Comprehensive Debugging
- Real-time display of all Zoho Desk entities
- Error messages with troubleshooting hints
- Refresh button to reload data
- Console logging for all API calls

### Production-Ready
- Proper error handling
- Environment-based configuration
- Secure credential storage
- TypeScript for type safety

## Next Steps

- [ ] Deploy to production with HTTPS
- [ ] Implement OAuth refresh token flow for long-lived access
- [ ] Add ticket status tracking in the chat UI
- [ ] Create analytics dashboard for ticket metrics
- [ ] Add support for ticket updates and replies
- [ ] Implement intelligent department routing
- [ ] Add agent availability checking

## Troubleshooting

### "Zoho Desk is not configured"
- Check that `.env.local` has `ZOHO_DESK_ORG_ID` and `ZOHO_DESK_ACCESS_TOKEN`
- Restart the dev server after updating `.env.local`

### "401 Unauthorized"
- Your access token may have expired
- Generate a new token from [Zoho API Console](https://api-console.zoho.com/)

### No departments/agents showing
- Verify your Organization ID is correct
- Check that your access token has the required scopes
- Ensure you have data in your Zoho Desk account

## Support

For detailed setup instructions, see [ZOHO_DESK_SETUP.md](ZOHO_DESK_SETUP.md)

For Zoho Desk API documentation, see: https://desk.zoho.com/DeskAPIDocument

## License

Same as original mvp-voice-agent project
