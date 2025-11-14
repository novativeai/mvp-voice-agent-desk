#!/usr/bin/env tsx
/**
 * Verification script to check if ticket #104 was created successfully
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const [key, ...valueParts] = trimmed.split('=')
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  })
  console.log('✅ Loaded environment variables from .env.local\n')
} catch (error) {
  console.warn('⚠️  Could not load .env.local file:', error instanceof Error ? error.message : error)
}

import { getZohoDeskAPI } from '../lib/zoho-desk'

async function verifyTicket() {
  console.log('🔍 Fetching recent tickets from Zoho Desk...\n')

  const zohoDeskAPI = getZohoDeskAPI()

  if (!zohoDeskAPI) {
    console.error('❌ Zoho Desk API not configured')
    console.error('Please check your .env.local file for ZOHO_DESK credentials')
    process.exit(1)
  }

  try {
    // Fetch the 10 most recent tickets
    const tickets = await zohoDeskAPI.getTickets(20)

    console.log(`📋 Found ${tickets.length} recent tickets:\n`)

    // Display all tickets
    tickets.forEach((ticket) => {
      const isTargetTicket = ticket.ticketNumber === '104'
      const marker = isTargetTicket ? '✅' : '  '

      console.log(`${marker} Ticket #${ticket.ticketNumber}`)
      console.log(`   ID: ${ticket.id}`)
      console.log(`   Subject: ${ticket.subject}`)
      console.log(`   Priority: ${ticket.priority}`)
      console.log(`   Status: ${ticket.status}`)
      console.log(`   Created: ${ticket.createdTime}`)
      console.log(`   Department: ${ticket.departmentId || 'N/A'}`)
      console.log()
    })

    // Check if ticket #104 exists
    const ticket104 = tickets.find((t) => t.ticketNumber === '104')

    if (ticket104) {
      console.log('✅ SUCCESS: Ticket #104 was found!')
      console.log('\n📝 Ticket Details:')
      console.log(JSON.stringify(ticket104, null, 2))

      // Verify it matches the expected data from logs
      console.log('\n🔍 Verification:')
      console.log(`   Expected ID: 1214071000000437001`)
      console.log(`   Actual ID: ${ticket104.id}`)
      console.log(`   Match: ${ticket104.id === '1214071000000437001' ? '✅' : '❌'}`)

      console.log(`\n   Expected Subject: E-commerce web application development for computer hardware sales`)
      console.log(`   Actual Subject: ${ticket104.subject}`)
      console.log(`   Match: ${ticket104.subject.includes('E-commerce') ? '✅' : '❌'}`)

      console.log(`\n   Expected Priority: Medium`)
      console.log(`   Actual Priority: ${ticket104.priority}`)
      console.log(`   Match: ${ticket104.priority === 'Medium' ? '✅' : '❌'}`)

      console.log(`\n   Expected Department: 1214071000000402481`)
      console.log(`   Actual Department: ${ticket104.departmentId}`)
      console.log(`   Match: ${ticket104.departmentId === '1214071000000402481' ? '✅' : '❌'}`)

      process.exit(0)
    } else {
      console.log('❌ FAILURE: Ticket #104 was NOT found in the recent tickets list')
      console.log('\n🔍 Troubleshooting:')
      console.log('   1. Check if the ticket was created in a different Zoho Desk organization')
      console.log('   2. Verify the ticket wasn\'t deleted')
      console.log('   3. Check if there are more than 20 tickets and #104 is older')

      // Try to fetch it directly by ID
      console.log('\n🔄 Attempting to fetch ticket #104 by ID (1214071000000437001)...')
      try {
        const directTicket = await zohoDeskAPI.getTicket('1214071000000437001')
        console.log('✅ Found ticket by direct ID lookup:')
        console.log(JSON.stringify(directTicket, null, 2))
      } catch (error) {
        console.log('❌ Could not fetch ticket by ID:', error instanceof Error ? error.message : error)
      }

      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error fetching tickets:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    process.exit(1)
  }
}

// Run the verification
verifyTicket()
