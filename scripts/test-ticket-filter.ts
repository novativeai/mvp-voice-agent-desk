#!/usr/bin/env tsx
/**
 * Test if /tickets endpoint returns tickets from ALL departments or just default
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
} catch (error) {
  console.error('Failed to load .env.local:', error)
  process.exit(1)
}

import { getZohoDeskAPI } from '../lib/zoho-desk'

async function testTicketFiltering() {
  console.log('🧪 TESTING TICKET DEPARTMENT FILTERING\n')
  console.log('=' .repeat(60))

  const zohoDeskAPI = getZohoDeskAPI()

  if (!zohoDeskAPI) {
    console.error('❌ Zoho Desk API not configured')
    process.exit(1)
  }

  try {
    console.log('\n📋 Test 1: Fetch tickets WITHOUT department filter')
    console.log('   Endpoint: /tickets?limit=20&sortBy=-createdTime\n')

    const ticketsNoFilter = await zohoDeskAPI.getTickets(20)

    console.log(`   Found ${ticketsNoFilter.length} tickets:`)
    ticketsNoFilter.forEach((ticket) => {
      const isDept1 = ticket.departmentId === '1214071000000006907' // NovativeAI (Default)
      const isDept2 = ticket.departmentId === '1214071000000402481' // Production
      const marker = isDept2 ? '🎯' : '  '

      console.log(`   ${marker} #${ticket.ticketNumber} - Dept: ${ticket.departmentId} ${isDept1 ? '(Default)' : isDept2 ? '(Production)' : ''}`)
    })

    // Check if ticket #104 is in the list
    const ticket104 = ticketsNoFilter.find(t => t.ticketNumber === '104')
    if (ticket104) {
      console.log('\n   ✅ Ticket #104 IS INCLUDED (Production department)')
    } else {
      console.log('\n   ❌ Ticket #104 NOT INCLUDED (filtered out by department!)')
    }

    // Count tickets by department
    const deptCounts: Record<string, number> = {}
    ticketsNoFilter.forEach(ticket => {
      const deptId = ticket.departmentId || 'null'
      deptCounts[deptId] = (deptCounts[deptId] || 0) + 1
    })

    console.log('\n   Department Distribution:')
    Object.entries(deptCounts).forEach(([deptId, count]) => {
      const isDefault = deptId === '1214071000000006907'
      const isProduction = deptId === '1214071000000402481'
      const label = isDefault ? '(Default)' : isProduction ? '(Production)' : ''
      console.log(`   - ${deptId} ${label}: ${count} tickets`)
    })

    console.log('\n' + '=' .repeat(60))
    console.log('\n💡 CONCLUSION:')

    if (ticket104) {
      console.log('   ✅ API returns tickets from ALL departments')
      console.log('   ✅ Ticket #104 will appear in chat UI')
    } else {
      console.log('   ❌ API only returns tickets from DEFAULT department')
      console.log('   ❌ Ticket #104 will NOT appear in chat UI')
      console.log('\n   🔧 SOLUTION NEEDED:')
      console.log('   - Add department filter to API call')
      console.log('   - OR fetch tickets from each department separately')
      console.log('   - OR use a different API endpoint that returns all tickets')
    }

  } catch (error) {
    console.error('\n❌ Error during test:', error)
    if (error instanceof Error) {
      console.error('   Details:', error.message)
    }
    process.exit(1)
  }
}

testTicketFiltering()
