/**
 * Zoho Desk API Integration
 *
 * This module handles all interactions with the Zoho Desk API
 * Documentation: https://desk.zoho.com/DeskAPIDocument
 */

import { tokenManager } from './zoho-token-manager'

interface ZohoDeskConfig {
  orgId: string
  accessToken?: string // Optional, will use token manager if not provided
  domain: string
}

interface ZohoDeskTicket {
  id: string
  ticketNumber: string
  subject: string
  description: string
  status: string
  priority: string
  contactId?: string
  departmentId?: string
  assigneeId?: string
  createdTime: string
  modifiedTime: string
}

interface ZohoDeskDepartment {
  id: string
  name: string
  description?: string
}

interface ZohoDeskAgent {
  id: string
  name: string
  email: string
  roleId?: string
  photoURL?: string
}

interface ZohoDeskContact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
}

interface ZohoDeskOrganization {
  id: string
  companyName: string
  accountName?: string
}

class ZohoDeskAPI {
  private config: ZohoDeskConfig

  constructor(config: ZohoDeskConfig) {
    this.config = config
  }

  private get baseUrl(): string {
    return `https://${this.config.domain}/api/v1`
  }

  private async getHeaders(): Promise<HeadersInit> {
    // Get fresh token from token manager (auto-refreshes if needed)
    const accessToken = this.config.accessToken || await tokenManager.getAccessToken()

    return {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'orgId': this.config.orgId,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Generic API request handler with automatic token refresh
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      // Get fresh headers (with auto-refreshed token if needed)
      const headers = await this.getHeaders()

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()

        // If 401 Unauthorized, clear token cache and retry once
        if (response.status === 401 && !options.headers?.['X-Retry-After-Refresh']) {
          console.log('[Zoho Desk] Token expired, refreshing and retrying...')
          tokenManager.clearToken()

          // Retry with fresh token
          return this.request(endpoint, {
            ...options,
            headers: {
              ...options.headers,
              'X-Retry-After-Refresh': 'true',
            },
          })
        }

        throw new Error(`Zoho Desk API Error: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Zoho Desk API request failed:', error)
      throw error
    }
  }

  /**
   * Get organization info
   */
  async getOrganizationInfo(): Promise<any> {
    return this.request(`/organizations/${this.config.orgId}`)
  }

  /**
   * Get all departments
   */
  async getDepartments(): Promise<ZohoDeskDepartment[]> {
    const response = await this.request<{ data: ZohoDeskDepartment[] }>('/departments')
    return response.data || []
  }

  /**
   * Get all agents
   */
  async getAgents(): Promise<ZohoDeskAgent[]> {
    const response = await this.request<{ data: ZohoDeskAgent[] }>('/agents')
    return response.data || []
  }

  /**
   * Get all contacts
   */
  async getContacts(limit: number = 10): Promise<ZohoDeskContact[]> {
    const response = await this.request<{ data: ZohoDeskContact[] }>(
      `/contacts?limit=${limit}`
    )
    return response.data || []
  }

  /**
   * Get recent tickets
   */
  async getTickets(limit: number = 10): Promise<ZohoDeskTicket[]> {
    const response = await this.request<{ data: ZohoDeskTicket[] }>(
      `/tickets?limit=${limit}&sortBy=createdTime`
    )
    return response.data || []
  }

  /**
   * Get ticket by ID
   */
  async getTicket(ticketId: string): Promise<ZohoDeskTicket> {
    return this.request(`/tickets/${ticketId}`)
  }

  /**
   * Search for contact by email
   */
  async searchContactByEmail(email: string): Promise<ZohoDeskContact | null> {
    try {
      const response = await this.request<{ data: ZohoDeskContact[] }>(
        `/contacts/search?email=${encodeURIComponent(email)}`
      )
      return response.data && response.data.length > 0 ? response.data[0] : null
    } catch (error) {
      console.error('Failed to search contact:', error)
      return null
    }
  }

  /**
   * Create a new contact
   */
  async createContact(contactData: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }): Promise<ZohoDeskContact> {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
  }

  /**
   * Create a new ticket
   * Best practice: Automatically searches for or creates contact if email is provided
   */
  async createTicket(ticketData: {
    subject: string
    description: string
    departmentId?: string
    contactId?: string
    priority?: 'High' | 'Medium' | 'Low'
    status?: string
    assigneeId?: string
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    channel?: string
    category?: string
  }): Promise<ZohoDeskTicket> {
    let finalContactId = ticketData.contactId

    // Best practice: If email is provided but no contactId, search for or create contact
    if (ticketData.email && !finalContactId) {
      console.log('[Zoho Desk] Searching for contact with email:', ticketData.email)
      const existingContact = await this.searchContactByEmail(ticketData.email)

      if (existingContact) {
        console.log('[Zoho Desk] Found existing contact:', existingContact.id)
        finalContactId = existingContact.id
      } else if (ticketData.firstName || ticketData.lastName) {
        // Create new contact if we have name information
        console.log('[Zoho Desk] Creating new contact')
        const newContact = await this.createContact({
          firstName: ticketData.firstName || 'Unknown',
          lastName: ticketData.lastName || 'Customer',
          email: ticketData.email,
          phone: ticketData.phone,
        })
        finalContactId = newContact.id
        console.log('[Zoho Desk] Created new contact:', finalContactId)
      }
    }

    // Prepare ticket data
    const ticket = {
      subject: ticketData.subject,
      description: ticketData.description,
      departmentId: ticketData.departmentId,
      contactId: finalContactId,
      priority: ticketData.priority || 'Medium',
      status: ticketData.status || 'Open',
      assigneeId: ticketData.assigneeId,
      email: ticketData.email,
      phone: ticketData.phone,
      channel: ticketData.channel || 'Phone', // Voice agent = Phone channel
      category: ticketData.category,
    }

    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    })
  }

  /**
   * Update an existing ticket
   */
  async updateTicket(
    ticketId: string,
    updates: Partial<ZohoDeskTicket>
  ): Promise<ZohoDeskTicket> {
    return this.request(`/tickets/${ticketId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  /**
   * Get all information for debugging
   */
  async getAllDebugInfo(): Promise<{
    organization: any
    departments: ZohoDeskDepartment[]
    agents: ZohoDeskAgent[]
    contacts: ZohoDeskContact[]
    recentTickets: ZohoDeskTicket[]
  }> {
    try {
      const [organization, departments, agents, contacts, recentTickets] = await Promise.all([
        this.getOrganizationInfo().catch(e => ({ error: e.message })),
        this.getDepartments().catch(e => []),
        this.getAgents().catch(e => []),
        this.getContacts(5).catch(e => []),
        this.getTickets(5).catch(e => []),
      ])

      return {
        organization,
        departments,
        agents,
        contacts,
        recentTickets,
      }
    } catch (error) {
      console.error('Failed to fetch Zoho Desk debug info:', error)
      throw error
    }
  }
}

/**
 * Get the Zoho Desk API instance with automatic token refresh
 */
export function getZohoDeskAPI(): ZohoDeskAPI | null {
  const orgId = process.env.ZOHO_DESK_ORG_ID
  const domain = process.env.ZOHO_DESK_DOMAIN || 'desk.zoho.com'

  if (!orgId) {
    console.warn('Zoho Desk Organization ID not configured')
    return null
  }

  // Check if we have either a static token or refresh credentials
  const hasStaticToken = !!process.env.ZOHO_DESK_ACCESS_TOKEN
  const hasRefreshCreds = !!(
    process.env.ZOHO_DESK_REFRESH_TOKEN &&
    process.env.ZOHO_DESK_CLIENT_ID &&
    process.env.ZOHO_DESK_CLIENT_SECRET
  )

  if (!hasStaticToken && !hasRefreshCreds) {
    console.warn('Zoho Desk credentials not configured (need access token or refresh credentials)')
    return null
  }

  console.log('[Zoho Desk] Initializing with automatic token refresh:', hasRefreshCreds ? 'enabled' : 'disabled')

  return new ZohoDeskAPI({
    orgId,
    domain,
    // Don't pass access token - let token manager handle it
  })
}

export type {
  ZohoDeskTicket,
  ZohoDeskDepartment,
  ZohoDeskAgent,
  ZohoDeskContact,
  ZohoDeskOrganization,
}

export { ZohoDeskAPI }
