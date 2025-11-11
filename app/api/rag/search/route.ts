import { NextRequest, NextResponse } from 'next/server'
import { searchSimilarDocuments, getRAGContext } from '@/lib/rag'

export async function POST(request: NextRequest) {
  try {
    const { query, topK = 5, format = 'results' } = await request.json()

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Return formatted context or raw results
    if (format === 'context') {
      const context = await getRAGContext(query, topK)
      return NextResponse.json({ context })
    } else {
      const results = await searchSimilarDocuments(query, topK)
      return NextResponse.json({ results })
    }
  } catch (error) {
    console.error('RAG search error:', error)
    return NextResponse.json(
      {
        error: 'Failed to search knowledge base',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
