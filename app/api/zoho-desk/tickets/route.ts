import { NextRequest, NextResponse } from 'next/server'
import { getZohoDeskAPI } from '@/lib/zoho-desk'

/**
 * POST /api/zoho-desk/tickets
 * Create a new ticket in Zoho Desk
 */
export async function POST(request: NextRequest) {
  try {
    const zohoDeskAPI = getZohoDeskAPI()

    if (!zohoDeskAPI) {
      return NextResponse.json(
        {
          error: 'Zoho Desk is not configured',
          message: 'Please add ZOHO_DESK_ORG_ID and ZOHO_DESK_ACCESS_TOKEN to your .env.local file',
        },
        { status: 500 }
      )
    }

    const body = await request.json()

    // Sanitize values - ElevenLabs sometimes sends string "undefined" instead of null
    const sanitize = (value: any) => {
      if (value === 'undefined' || value === undefined || value === null || value === '') {
        return undefined
      }
      return value
    }

    const sanitizedBody = {
      subject: sanitize(body.subject),
      description: sanitize(body.description),
      email: sanitize(body.email),
      firstName: sanitize(body.firstName),
      lastName: sanitize(body.lastName),
      phone: sanitize(body.phone),
      priority: sanitize(body.priority),
      departmentId: sanitize(body.departmentId),
      contactId: sanitize(body.contactId),
      status: sanitize(body.status),
      assigneeId: sanitize(body.assigneeId),
    }

    // Log incoming webhook request for debugging
    console.log('[Webhook] Received request from ElevenLabs:', JSON.stringify({
      subject: sanitizedBody.subject,
      description: sanitizedBody.description?.substring(0, 100) + '...',
      email: sanitizedBody.email,
      firstName: sanitizedBody.firstName,
      lastName: sanitizedBody.lastName,
      phone: sanitizedBody.phone,
      priority: sanitizedBody.priority,
      departmentId: sanitizedBody.departmentId,
    }, null, 2))

    // Validate required fields
    if (!sanitizedBody.subject || !sanitizedBody.description) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'subject and description are required. Received: ' + JSON.stringify({
            subject: sanitizedBody.subject,
            description: sanitizedBody.description,
          }),
        },
        { status: 400 }
      )
    }

    // If no departmentId provided, get the default department
    let departmentId = sanitizedBody.departmentId
    if (!departmentId) {
      try {
        const departments = await zohoDeskAPI.getDepartments()
        const defaultDept = departments.find((dept) => dept.isDefault)
        if (defaultDept) {
          departmentId = defaultDept.id
        }
      } catch (error) {
        console.warn('Could not fetch default department:', error)
      }
    }

    // Create the ticket
    const ticket = await zohoDeskAPI.createTicket({
      subject: sanitizedBody.subject,
      description: sanitizedBody.description,
      departmentId,
      contactId: sanitizedBody.contactId,
      priority: sanitizedBody.priority || 'Medium',
      status: sanitizedBody.status,
      assigneeId: sanitizedBody.assigneeId,
      email: sanitizedBody.email,
      phone: sanitizedBody.phone,
      firstName: sanitizedBody.firstName,
      lastName: sanitizedBody.lastName,
    })

    console.log('[Webhook] ✅ Ticket created successfully:', {
      ticketNumber: ticket.ticketNumber,
      id: ticket.id,
      subject: ticket.subject,
      priority: ticket.priority,
      departmentId: ticket.departmentId,
    })

    return NextResponse.json({
      success: true,
      ticket,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to create Zoho Desk ticket:', error)

    return NextResponse.json(
      {
        error: 'Failed to create ticket',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
