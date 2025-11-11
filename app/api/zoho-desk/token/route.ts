import { NextRequest, NextResponse } from 'next/server'
import { tokenManager } from '@/lib/zoho-token-manager'

/**
 * GET /api/zoho-desk/token
 * Get current token status and refresh if needed
 */
export async function GET(request: NextRequest) {
  try {
    const hasRefreshCreds = !!(
      process.env.ZOHO_DESK_REFRESH_TOKEN &&
      process.env.ZOHO_DESK_CLIENT_ID &&
      process.env.ZOHO_DESK_CLIENT_SECRET
    )

    const hasStaticToken = !!process.env.ZOHO_DESK_ACCESS_TOKEN

    if (!hasStaticToken && !hasRefreshCreds) {
      return NextResponse.json(
        {
          error: 'No token configuration found',
          message: 'Please configure either ZOHO_DESK_ACCESS_TOKEN or refresh credentials',
        },
        { status: 500 }
      )
    }

    // Get a fresh token (will auto-refresh if needed)
    const accessToken = await tokenManager.getAccessToken()

    return NextResponse.json({
      success: true,
      autoRefreshEnabled: hasRefreshCreds,
      hasToken: !!accessToken,
      tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to get token status:', error)

    return NextResponse.json(
      {
        error: 'Failed to get token status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/zoho-desk/token
 * Force refresh the access token
 */
export async function POST(request: NextRequest) {
  try {
    const hasRefreshCreds = !!(
      process.env.ZOHO_DESK_REFRESH_TOKEN &&
      process.env.ZOHO_DESK_CLIENT_ID &&
      process.env.ZOHO_DESK_CLIENT_SECRET
    )

    if (!hasRefreshCreds) {
      return NextResponse.json(
        {
          error: 'Token refresh not configured',
          message: 'Please configure ZOHO_DESK_REFRESH_TOKEN, CLIENT_ID, and CLIENT_SECRET',
        },
        { status: 500 }
      )
    }

    // Clear cached token to force refresh
    tokenManager.clearToken()

    // Get new token
    const newAccessToken = await tokenManager.getAccessToken()

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      tokenPreview: `${newAccessToken.substring(0, 20)}...`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to refresh token:', error)

    return NextResponse.json(
      {
        error: 'Failed to refresh token',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
