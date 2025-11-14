#!/usr/bin/env tsx
/**
 * Diagnostic script to identify which Zoho Desk organization we're connected to
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
  console.error('❌ Could not load .env.local file:', error)
  process.exit(1)
}

import { getZohoDeskAPI } from '../lib/zoho-desk'

async function diagnoseOrganization() {
  console.log('🔍 ZOHO DESK ORGANIZATION DIAGNOSTIC\n')
  console.log('=' .repeat(60))

  // Show configuration
  console.log('\n📋 CONFIGURATION:')
  console.log(`   Org ID: ${process.env.ZOHO_DESK_ORG_ID}`)
  console.log(`   Domain: ${process.env.ZOHO_DESK_DOMAIN}`)
  console.log(`   Has Access Token: ${process.env.ZOHO_DESK_ACCESS_TOKEN ? '✅' : '❌'}`)
  console.log(`   Has Refresh Token: ${process.env.ZOHO_DESK_REFRESH_TOKEN ? '✅' : '❌'}`)
  console.log(`   Has Client ID: ${process.env.ZOHO_DESK_CLIENT_ID ? '✅' : '❌'}`)
  console.log(`   Has Client Secret: ${process.env.ZOHO_DESK_CLIENT_SECRET ? '✅' : '❌'}`)

  const zohoDeskAPI = getZohoDeskAPI()

  if (!zohoDeskAPI) {
    console.error('\n❌ Zoho Desk API not configured')
    process.exit(1)
  }

  try {
    console.log('\n' + '=' .repeat(60))
    console.log('\n🏢 ORGANIZATION INFORMATION:')

    const orgInfo = await zohoDeskAPI.getOrganizationInfo()
    console.log('\n   Full Organization Details:')
    console.log(JSON.stringify(orgInfo, null, 2))

    console.log('\n' + '=' .repeat(60))
    console.log('\n🏢 DEPARTMENTS:')

    const departments = await zohoDeskAPI.getDepartments()
    console.log(`\n   Found ${departments.length} departments:`)
    departments.forEach((dept, index) => {
      console.log(`\n   ${index + 1}. ${dept.name}`)
      console.log(`      ID: ${dept.id}`)
      console.log(`      Default: ${dept.isDefault ? '✅' : '❌'}`)
      if (dept.description) console.log(`      Description: ${dept.description}`)
    })

    // Check if the department from the ticket exists
    const targetDeptId = '1214071000000402481'
    const targetDept = departments.find(d => d.id === targetDeptId)
    if (targetDept) {
      console.log(`\n   ✅ Department ${targetDeptId} EXISTS: ${targetDept.name}`)
    } else {
      console.log(`\n   ❌ Department ${targetDeptId} NOT FOUND in this organization!`)
      console.log(`      This suggests ticket #104 was created in a DIFFERENT organization!`)
    }

    console.log('\n' + '=' .repeat(60))
    console.log('\n👥 CONTACTS:')

    const contacts = await zohoDeskAPI.getContacts(10)
    console.log(`\n   Found ${contacts.length} recent contacts:`)
    contacts.forEach((contact, index) => {
      const isTargetContact = contact.id === '1214071000000436001'
      const marker = isTargetContact ? '✅' : '  '
      console.log(`\n   ${marker} ${index + 1}. ${contact.firstName} ${contact.lastName}`)
      console.log(`      ID: ${contact.id}`)
      console.log(`      Email: ${contact.email}`)
      if (contact.phone) console.log(`      Phone: ${contact.phone}`)
    })

    // Check for the specific contact
    const targetContactId = '1214071000000436001'
    const targetContact = contacts.find(c => c.id === targetContactId)
    if (targetContact) {
      console.log(`\n   ✅ Contact ${targetContactId} EXISTS (John from ticket #104)`)
    } else {
      console.log(`\n   ⚠️  Contact ${targetContactId} NOT in recent contacts list`)
      console.log(`      Searching for john@gmail.com...`)
      const searchResult = await zohoDeskAPI.searchContactByEmail('john@gmail.com')
      if (searchResult) {
        console.log(`      ✅ Found: ${searchResult.firstName} ${searchResult.lastName} (ID: ${searchResult.id})`)
      } else {
        console.log(`      ❌ Not found by email search`)
      }
    }

    console.log('\n' + '=' .repeat(60))
    console.log('\n🎫 RECENT TICKETS:')

    const tickets = await zohoDeskAPI.getTickets(10)
    console.log(`\n   Found ${tickets.length} recent tickets:`)
    tickets.forEach((ticket, index) => {
      const isTargetTicket = ticket.ticketNumber === '104'
      const marker = isTargetTicket ? '✅' : '  '
      console.log(`\n   ${marker} Ticket #${ticket.ticketNumber}`)
      console.log(`      ID: ${ticket.id}`)
      console.log(`      Subject: ${ticket.subject.substring(0, 60)}${ticket.subject.length > 60 ? '...' : ''}`)
      console.log(`      Department: ${ticket.departmentId}`)
      console.log(`      Status: ${ticket.status}`)
    })

    console.log('\n' + '=' .repeat(60))
    console.log('\n🔗 TICKET #104 WEB URL:')

    const ticket104 = await zohoDeskAPI.getTicket('1214071000000437001')
    console.log(`\n   ${ticket104.webUrl}`)
    console.log('\n   👆 Try opening this URL in your browser to see if you can access it')
    console.log('      If you get an "access denied" error, the ticket is in a different org!')

    console.log('\n' + '=' .repeat(60))
    console.log('\n✅ DIAGNOSTIC COMPLETE')
    console.log('\n💡 TROUBLESHOOTING:')
    console.log('   1. Check if the Web URL above is accessible')
    console.log('   2. Verify the Org ID matches your Zoho Desk organization')
    console.log('   3. Check if you\'re logged into the correct Zoho account')
    console.log('   4. Ensure you\'re looking at the correct department in the UI')

  } catch (error) {
    console.error('\n❌ Error during diagnostic:', error)
    if (error instanceof Error) {
      console.error('   Details:', error.message)
    }
    process.exit(1)
  }
}

diagnoseOrganization()
