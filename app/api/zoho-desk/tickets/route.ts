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

    // Validate required fields
    if (!body.subject || !body.description) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'subject and description are required',
        },
        { status: 400 }
      )
    }

    // Create the ticket
    const ticket = await zohoDeskAPI.createTicket({
      subject: body.subject,
      description: body.description,
      departmentId: body.departmentId,
      contactId: body.contactId,
      priority: body.priority || 'Medium',
      status: body.status,
      assigneeId: body.assigneeId,
      email: body.email,
      phone: body.phone,
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
