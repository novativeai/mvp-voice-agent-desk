import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json()

    // Validate inputs
    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    // Call ElevenLabs API to get signed URL
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs API error:', error)
      return NextResponse.json(
        { error: 'Failed to get signed URL from ElevenLabs' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      signedUrl: data.signed_url,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    })
  } catch (error) {
    console.error('Signed URL error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
