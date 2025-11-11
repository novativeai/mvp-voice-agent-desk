'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, BookOpen, Tag, Calendar } from 'lucide-react'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'

interface SearchResult {
  id: string
  score: number
  content: string
  metadata: {
    category?: string
    title?: string
    tags?: string[]
  }
}

interface KnowledgeSearchProps {
  placeholder?: string
  maxResults?: number
}

export function KnowledgeSearch({
  placeholder = 'Search knowledge base...',
  maxResults = 5,
}: KnowledgeSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setIsSearching(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch('/api/rag/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          topK: maxResults,
          format: 'raw',
        }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-primary/30 text-primary-light">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500'
    if (score >= 0.6) return 'text-yellow-500'
    return 'text-orange-500'
  }

  const getRelevanceLabel = (score: number) => {
    if (score >= 0.8) return 'Highly Relevant'
    if (score >= 0.6) return 'Relevant'
    return 'Somewhat Relevant'
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-32 py-4 bg-surface/50 backdrop-blur-sm border border-surface-light/20 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={isSearching}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSearching || !query.trim()}
              icon={isSearching ? Loader2 : undefined}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence mode="popLayout">
        {hasSearched && !isSearching && results.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No results found for "{query}"</p>
            <p className="text-text-muted text-sm mt-2">
              Try different keywords or check your knowledge base
            </p>
          </motion.div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-body-lg text-text-primary font-medium">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-body-sm text-text-muted">
                Searching for: <span className="text-primary">"{query}"</span>
              </p>
            </div>

            <div className="space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard intensity="medium" hover>
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {result.metadata.title && (
                            <h4 className="text-body-lg font-semibold text-text-primary mb-1">
                              {result.metadata.title}
                            </h4>
                          )}
                          {result.metadata.category && (
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-primary" />
                              <span className="text-body-sm text-primary capitalize">
                                {result.metadata.category}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div
                            className={`text-body-sm font-medium ${getRelevanceColor(
                              result.score
                            )}`}
                          >
                            {(result.score * 100).toFixed(0)}%
                          </div>
                          <div className="text-body-xs text-text-muted">
                            {getRelevanceLabel(result.score)}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-body-sm text-text-secondary leading-relaxed">
                        {highlightText(
                          result.content.length > 300
                            ? result.content.substring(0, 300) + '...'
                            : result.content,
                          query
                        )}
                      </div>

                      {/* Tags */}
                      {result.metadata.tags && result.metadata.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="w-4 h-4 text-text-muted" />
                          {result.metadata.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary/10 text-primary text-body-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-surface-light/10">
                        <span className="text-body-xs text-text-muted">
                          Document ID: {result.id}
                        </span>
                        <button className="text-body-sm text-primary hover:text-primary-light transition-colors">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Banner */}
      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <BookOpen className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <p className="text-text-secondary mb-2">
            Search the knowledge base using custom RAG
          </p>
          <p className="text-body-sm text-text-muted max-w-md mx-auto">
            This demonstrates the external Pinecone + OpenAI RAG implementation.
            Compare with ElevenLabs native RAG during voice conversations.
          </p>
        </motion.div>
      )}
    </div>
  )
}
