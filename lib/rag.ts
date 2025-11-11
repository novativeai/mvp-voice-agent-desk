/**
 * RAG (Retrieval-Augmented Generation) Implementation
 * Handles vector database operations and semantic search
 */

import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAI } from 'openai'

// Initialize clients
let pineconeClient: Pinecone | null = null
let openaiClient: OpenAI | null = null

/**
 * Initialize Pinecone client
 */
export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY not configured')
    }

    pineconeClient = new Pinecone({
      apiKey,
    })
  }

  return pineconeClient
}

/**
 * Initialize OpenAI client
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    openaiClient = new OpenAI({
      apiKey,
    })
  }

  return openaiClient
}

/**
 * Generate embeddings for text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAIClient()

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })

  return response.data[0].embedding
}

/**
 * Search for similar documents in vector database
 */
export async function searchSimilarDocuments(
  query: string,
  topK: number = 5,
  namespace?: string
): Promise<SearchResult[]> {
  try {
    const pinecone = getPineconeClient()
    const indexName = process.env.PINECONE_INDEX || 'voice-agent-kb'

    // Get index
    const index = pinecone.Index(indexName)

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query)

    // Search vector database
    const queryResponse = await index.namespace(namespace || '').query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    })

    // Format results
    const results: SearchResult[] = queryResponse.matches.map((match) => ({
      id: match.id,
      score: match.score || 0,
      content: (match.metadata?.content as string) || '',
      metadata: match.metadata || {},
    }))

    return results
  } catch (error) {
    console.error('Search error:', error)
    throw new Error('Failed to search knowledge base')
  }
}

/**
 * Ingest documents into vector database
 */
export async function ingestDocuments(
  documents: Document[],
  namespace?: string
): Promise<void> {
  try {
    const pinecone = getPineconeClient()
    const indexName = process.env.PINECONE_INDEX || 'voice-agent-kb'
    const index = pinecone.Index(indexName)

    // Process documents in batches
    const batchSize = 100
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)

      // Generate embeddings for batch
      const vectors = await Promise.all(
        batch.map(async (doc) => {
          const embedding = await generateEmbedding(doc.content)
          return {
            id: doc.id,
            values: embedding,
            metadata: {
              content: doc.content,
              ...doc.metadata,
            },
          }
        })
      )

      // Upsert to Pinecone
      await index.namespace(namespace || '').upsert(vectors)
    }

    console.log(`Ingested ${documents.length} documents`)
  } catch (error) {
    console.error('Ingestion error:', error)
    throw new Error('Failed to ingest documents')
  }
}

/**
 * Delete documents from vector database
 */
export async function deleteDocuments(
  ids: string[],
  namespace?: string
): Promise<void> {
  try {
    const pinecone = getPineconeClient()
    const indexName = process.env.PINECONE_INDEX || 'voice-agent-kb'
    const index = pinecone.Index(indexName)

    await index.namespace(namespace || '').deleteMany(ids)

    console.log(`Deleted ${ids.length} documents`)
  } catch (error) {
    console.error('Deletion error:', error)
    throw new Error('Failed to delete documents')
  }
}

/**
 * Get context for RAG
 * Searches knowledge base and formats results for LLM
 */
export async function getRAGContext(
  query: string,
  maxResults: number = 3
): Promise<string> {
  const results = await searchSimilarDocuments(query, maxResults)

  if (results.length === 0) {
    return 'No relevant information found in knowledge base.'
  }

  // Format context
  const context = results
    .map((result, index) => {
      return `[${index + 1}] (Score: ${result.score.toFixed(2)})\n${result.content}`
    })
    .join('\n\n')

  return context
}

// ============================================
// Types
// ============================================

export interface SearchResult {
  id: string
  score: number
  content: string
  metadata: Record<string, any>
}

export interface Document {
  id: string
  content: string
  metadata?: Record<string, any>
}
