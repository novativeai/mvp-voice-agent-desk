/**
 * Zoho Desk Token Manager
 * Handles automatic token refresh for production use
 */

interface TokenData {
  accessToken: string
  expiresAt: number // Unix timestamp
}

class ZohoTokenManager {
  private static instance: ZohoTokenManager
  private tokenData: TokenData | null = null
  private refreshPromise: Promise<string> | null = null

  private constructor() {}

  static getInstance(): ZohoTokenManager {
    if (!ZohoTokenManager.instance) {
      ZohoTokenManager.instance = new ZohoTokenManager()
    }
    return ZohoTokenManager.instance
  }

  /**
   * Get a valid access token (refreshes if needed)
   */
  async getAccessToken(): Promise<string> {
    // If we have a valid token that hasn't expired, return it
    if (this.tokenData && Date.now() < this.tokenData.expiresAt - 60000) {
      // 60 seconds buffer before expiry
      return this.tokenData.accessToken
    }

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // Start a new refresh
    this.refreshPromise = this.refreshToken()
    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  private async refreshToken(): Promise<string> {
    const refreshToken = process.env.ZOHO_DESK_REFRESH_TOKEN
    const clientId = process.env.ZOHO_DESK_CLIENT_ID
    const clientSecret = process.env.ZOHO_DESK_CLIENT_SECRET

    if (!refreshToken || !clientId || !clientSecret) {
      // Fall back to static token if refresh not configured
      const staticToken = process.env.ZOHO_DESK_ACCESS_TOKEN
      if (!staticToken) {
        throw new Error('No Zoho Desk access token or refresh credentials configured')
      }
      console.warn('[Zoho Token] Using static token (no refresh configured)')
      return staticToken
    }

    console.log('[Zoho Token] Refreshing access token...')

    try {
      const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Token refresh failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      if (!data.access_token) {
        throw new Error('No access token in refresh response')
      }

      // Store the new token with expiry time
      this.tokenData = {
        accessToken: data.access_token,
        expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
      }

      console.log('[Zoho Token] ✅ Token refreshed successfully')
      console.log('[Zoho Token] New token expires in:', data.expires_in, 'seconds')

      return this.tokenData.accessToken
    } catch (error) {
      console.error('[Zoho Token] ❌ Failed to refresh token:', error)

      // Fall back to static token if refresh fails
      const staticToken = process.env.ZOHO_DESK_ACCESS_TOKEN
      if (staticToken) {
        console.warn('[Zoho Token] Falling back to static token')
        return staticToken
      }

      throw error
    }
  }

  /**
   * Set a new access token manually (for initial setup)
   */
  setAccessToken(token: string, expiresIn: number = 3600) {
    this.tokenData = {
      accessToken: token,
      expiresAt: Date.now() + expiresIn * 1000,
    }
  }

  /**
   * Clear cached token (force refresh on next request)
   */
  clearToken() {
    this.tokenData = null
  }
}

export const tokenManager = ZohoTokenManager.getInstance()
