/**
 * Document Ingestion Script
 * Ingests documents into Pinecone vector database
 *
 * Usage: npx tsx scripts/ingest-documents.ts
 */

import { ingestDocuments, Document } from '../lib/rag'
import * as fs from 'fs'
import * as path from 'path'

// Sample knowledge base documents
const sampleDocuments: Document[] = [
  {
    id: 'doc-1',
    content: `
      Our AI Voice Agent is powered by ElevenLabs Conversational AI technology.
      It provides natural, human-like conversations with real-time responses.
      The system supports multiple languages and can be customized for various use cases.
    `,
    metadata: {
      category: 'product',
      title: 'AI Voice Agent Overview',
      tags: ['features', 'technology'],
    },
  },
  {
    id: 'doc-2',
    content: `
      Pricing plans:
      - Starter: $29/month - Up to 1,000 minutes of voice conversations
      - Professional: $99/month - Up to 5,000 minutes
      - Enterprise: Custom pricing - Unlimited conversations with dedicated support
    `,
    metadata: {
      category: 'pricing',
      title: 'Pricing Information',
      tags: ['pricing', 'plans'],
    },
  },
  {
    id: 'doc-3',
    content: `
      Technical specifications:
      - Response time: <500ms average
      - Accuracy: 99.5% in intent recognition
      - Languages supported: 29+ languages including English, Spanish, French, German, Japanese
      - Integration: REST API and WebSocket support
      - Security: End-to-end encryption, GDPR compliant
    `,
    metadata: {
      category: 'technical',
      title: 'Technical Specifications',
      tags: ['specs', 'capabilities'],
    },
  },
  {
    id: 'doc-4',
    content: `
      Common use cases:
      - Customer support automation
      - Sales and lead qualification
      - Appointment scheduling
      - FAQ and information retrieval
      - Order tracking and status updates
      - Technical support and troubleshooting
    `,
    metadata: {
      category: 'use-cases',
      title: 'Use Cases',
      tags: ['applications', 'solutions'],
    },
  },
  {
    id: 'doc-5',
    content: `
      Getting started:
      1. Sign up for an account at our website
      2. Get your API key from the dashboard
      3. Configure your agent with custom prompts
      4. Test your agent in the sandbox environment
      5. Deploy to production
      6. Monitor analytics and performance metrics
    `,
    metadata: {
      category: 'onboarding',
      title: 'Getting Started Guide',
      tags: ['setup', 'tutorial'],
    },
  },
]

async function main() {
  console.log('Starting document ingestion...')

  try {
    // Check if custom documents file exists
    const customDocsPath = path.join(__dirname, '../data/documents.json')
    let documents = sampleDocuments

    if (fs.existsSync(customDocsPath)) {
      console.log('Loading custom documents from data/documents.json')
      const customDocs = JSON.parse(fs.readFileSync(customDocsPath, 'utf-8'))
      documents = customDocs
    }

    console.log(`Ingesting ${documents.length} documents...`)

    // Ingest documents
    await ingestDocuments(documents)

    console.log('✅ Document ingestion complete!')
    console.log(`Ingested ${documents.length} documents into Pinecone`)
  } catch (error) {
    console.error('❌ Ingestion failed:', error)
    process.exit(1)
  }
}

main()
