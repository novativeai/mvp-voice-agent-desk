/**
 * Configure ElevenLabs Agent with Zoho Desk Tool
 *
 * This script automatically adds the create_zoho_ticket tool to your ElevenLabs agent
 * and updates the agent's system prompt with ticket creation instructions.
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
const API_BASE_URL = 'https://api.elevenlabs.io/v1'

// Your app's public URL (ngrok, Vercel, etc.)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface ToolParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum'
  description: string
  required: boolean
  enum_values?: string[]
}

interface CustomTool {
  name: string
  description: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  parameters: ToolParameter[]
}

const createZohoTicketTool: CustomTool = {
  name: 'create_zoho_ticket',
  description:
    'Creates a support ticket in Zoho Desk when a customer needs help, reports an issue, or requests assistance that requires follow-up. Use this when the customer\'s issue cannot be resolved immediately in the conversation.',
  url: `${APP_URL}/api/zoho-desk/tickets`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  parameters: [
    {
      name: 'subject',
      type: 'string',
      description:
        'Brief summary of the customer\'s issue or request (max 255 characters)',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description:
        'Detailed description of the issue, including any error messages, steps taken, or context provided by the customer',
      required: true,
    },
    {
      name: 'email',
      type: 'string',
      description: 'Customer\'s email address for follow-up communication',
      required: false,
    },
    {
      name: 'phone',
      type: 'string',
      description: 'Customer\'s phone number',
      required: false,
    },
    {
      name: 'firstName',
      type: 'string',
      description: 'Customer\'s first name',
      required: false,
    },
    {
      name: 'lastName',
      type: 'string',
      description: 'Customer\'s last name',
      required: false,
    },
    {
      name: 'priority',
      type: 'enum',
      description:
        'Urgency level: High (service down, critical issue), Medium (feature not working, moderate impact), Low (general inquiry, minor issue)',
      required: false,
      enum_values: ['High', 'Medium', 'Low'],
    },
    {
      name: 'departmentId',
      type: 'string',
      description:
        'Department to route the ticket to. Leave empty for default routing.',
      required: false,
    },
  ],
}

const agentInstructions = `
## Support Ticket Creation

You have the ability to create support tickets in Zoho Desk for customers who need follow-up assistance.

### When to Create Tickets:

✅ Technical issues (bugs, errors, features not working)
✅ Account problems (login issues, password reset failures, access problems)
✅ Complex requests requiring specialist knowledge
✅ Issues that need investigation or follow-up
✅ Billing or subscription problems

❌ Don't create tickets for simple questions you can answer immediately

### How to Create Tickets:

1. **Acknowledge the issue** with empathy
2. **Gather information**:
   - What happened?
   - What were they trying to do?
   - Any error messages?
3. **Collect contact details**: Email address (required for follow-up)
4. **Use create_zoho_ticket tool** with:
   - subject: Brief summary
   - description: Detailed explanation
   - email: Customer's email
   - firstName/lastName: Customer's name
   - priority: High/Medium/Low based on impact
5. **Confirm with customer**:
   - Provide ticket number
   - Explain next steps
   - Give estimated response time

### Priority Guidelines:

- **High**: Service down, security issues, payment failures, data loss, critical features broken
  → Response within 2 hours
- **Medium** (default): Feature not working but workaround exists, performance issues, non-critical bugs
  → Response within 24 hours
- **Low**: General questions, feature requests, cosmetic issues
  → Response within 48 hours

### Example Conversation:

Customer: "I'm getting an error when I try to export my data."
You: "I'm sorry you're experiencing that issue. Let me create a support ticket so our technical team can investigate. May I have your email address?"
Customer: "john@example.com"
You: [Use create_zoho_ticket tool with subject="Data export error", description="Customer receiving error when attempting to export data", email="john@example.com", priority="High"]
You: "Perfect! I've created ticket #10542 for you. Our technical team will investigate and contact you at john@example.com within 2 hours. Is there anything else I can help with?"

### Important:
- Always ask for email before creating ticket
- Be empathetic and helpful
- Provide clear next steps
- Don't create duplicate tickets
- Don't promise specific resolution times beyond the response time guidelines
`

async function configureAgent() {
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY not found in environment variables')
    process.exit(1)
  }

  if (!AGENT_ID) {
    console.error(
      '❌ NEXT_PUBLIC_ELEVENLABS_AGENT_ID not found in environment variables'
    )
    process.exit(1)
  }

  console.log('🚀 Configuring ElevenLabs Agent with Zoho Desk Integration')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📋 Agent ID: ${AGENT_ID}`)
  console.log(`🌐 App URL: ${APP_URL}`)
  console.log('')

  try {
    // Step 1: Add custom tool
    console.log('⏳ Step 1: Adding create_zoho_ticket tool...')

    const toolResponse = await fetch(
      `${API_BASE_URL}/convai/agents/${AGENT_ID}/tools`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'custom',
          config: createZohoTicketTool,
        }),
      }
    )

    if (!toolResponse.ok) {
      const error = await toolResponse.text()
      throw new Error(`Failed to add tool: ${toolResponse.status} - ${error}`)
    }

    const toolData = await toolResponse.json()
    console.log('✅ Tool added successfully!')
    console.log(`   Tool ID: ${toolData.tool_id || 'N/A'}`)
    console.log('')

    // Step 2: Update agent instructions
    console.log('⏳ Step 2: Updating agent instructions...')

    // Get current agent config
    const getAgentResponse = await fetch(
      `${API_BASE_URL}/convai/agents/${AGENT_ID}`,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    )

    if (!getAgentResponse.ok) {
      throw new Error('Failed to get agent config')
    }

    const agentData = await getAgentResponse.json()
    const currentPrompt = agentData.prompt || ''

    // Append new instructions
    const updatedPrompt = `${currentPrompt}\n\n${agentInstructions}`

    // Update agent
    const updateAgentResponse = await fetch(
      `${API_BASE_URL}/convai/agents/${AGENT_ID}`,
      {
        method: 'PATCH',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: updatedPrompt,
        }),
      }
    )

    if (!updateAgentResponse.ok) {
      const error = await updateAgentResponse.text()
      console.warn(`⚠️  Could not update agent prompt: ${error}`)
      console.log('   Please add instructions manually from elevenlabs-agent-instructions.md')
    } else {
      console.log('✅ Agent instructions updated successfully!')
    }

    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 Configuration Complete!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Test the integration at: http://localhost:3000/chat')
    console.log('2. Say: "I need help with my account"')
    console.log('3. Verify ticket is created in Zoho Desk')
    console.log('')
    console.log('📚 Documentation:')
    console.log('   - Full guide: ELEVENLABS_INTEGRATION.md')
    console.log('   - Agent instructions: elevenlabs-agent-instructions.md')
    console.log('   - Tool config: elevenlabs-tool-config.json')
  } catch (error) {
    console.error('❌ Configuration failed:', error)
    console.log('')
    console.log('Manual setup instructions:')
    console.log('1. Go to https://elevenlabs.io/app/conversational-ai')
    console.log(`2. Select agent: ${AGENT_ID}`)
    console.log('3. Follow steps in ELEVENLABS_INTEGRATION.md')
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  configureAgent()
}

export { configureAgent, createZohoTicketTool, agentInstructions }
