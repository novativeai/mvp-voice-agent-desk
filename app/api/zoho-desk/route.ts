import { NextRequest, NextResponse } from 'next/server'
import { getZohoDeskAPI } from '@/lib/zoho-desk'

/**
 * GET /api/zoho-desk
 * Fetch all Zoho Desk information for debugging
 */
export async function GET(request: NextRequest) {
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

    // Fetch all debug information
    const debugInfo = await zohoDeskAPI.getAllDebugInfo()

    return NextResponse.json({
      success: true,
      data: debugInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to fetch Zoho Desk data:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch Zoho Desk data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
