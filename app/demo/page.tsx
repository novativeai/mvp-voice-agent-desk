'use client'

import { KnowledgeSearch } from '@/components/rag/KnowledgeSearch'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Database, Zap } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-surface-light/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-h3 text-text-primary">RAG Comparison Demo</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Compare ElevenLabs Native vs. Custom External RAG
            </p>
          </div>
          <Link href="/">
            <Button variant="glass" size="sm">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Intro Section */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-h2 text-text-primary mb-4">
            Two Ways to Implement{' '}
            <span className="gradient-text">Knowledge Retrieval</span>
          </h2>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            This demo showcases both approaches to RAG (Retrieval-Augmented Generation).
            Try the custom search below, then compare with the voice agent that uses
            ElevenLabs native RAG.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* ElevenLabs Native RAG */}
          <GlassCard intensity="medium">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-h4 text-text-primary">
                    ElevenLabs Native RAG
                  </h3>
                  <p className="text-body-sm text-primary">Automatic & Built-in</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-body-sm text-text-secondary leading-relaxed">
                  Upload your knowledge base to ElevenLabs dashboard. The voice agent
                  automatically searches and retrieves relevant context during
                  conversations. Zero code required.
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">
                      Setup in 5 minutes - just upload docs
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">
                      Automatic retrieval during calls
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">
                      No additional infrastructure costs
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">
                      Real-time updates via dashboard
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/chat">
                <Button variant="primary" className="w-full">
                  Try Voice Agent with Native RAG
                </Button>
              </Link>

              <div className="mt-4 p-3 bg-surface/30 rounded-lg">
                <p className="text-body-xs text-text-muted">
                  <strong className="text-text-secondary">How to test:</strong> Go to
                  voice chat and ask questions like "What are your pricing plans?" or
                  "How do I get started?"
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Custom External RAG */}
          <GlassCard intensity="medium">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                  <Database className="w-6 h-6 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-heading text-h4 text-text-primary">
                    Custom External RAG
                  </h3>
                  <p className="text-body-sm text-accent-purple">
                    Programmatic & Flexible
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-body-sm text-text-secondary leading-relaxed">
                  Full-featured RAG with Pinecone vector database and OpenAI embeddings.
                  Complete programmatic control over search, ranking, and filtering.
                  Perfect for multi-channel applications.
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-accent-purple mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">
                      Full API control and customization
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-accent-purple mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">
                      Use across web, mobile, and voice
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-accent-purple mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">
                      Advanced filtering by metadata
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-accent-purple mt-0.5 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">
                      Analytics on search patterns
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-accent-purple/10 rounded-lg border border-accent-purple/20">
                <p className="text-body-xs text-text-secondary">
                  <strong className="text-accent-purple">Try it below:</strong> Search
                  the knowledge base using the custom RAG implementation powered by
                  Pinecone + OpenAI
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Interactive Custom RAG Search */}
        <div className="mb-12">
          <GlassCard intensity="strong">
            <div className="p-8">
              <div className="mb-6">
                <h3 className="font-heading text-h3 text-text-primary mb-2">
                  Try Custom RAG Search
                </h3>
                <p className="text-body-sm text-text-secondary">
                  Search the knowledge base using Pinecone vector similarity search
                </p>
              </div>

              <KnowledgeSearch
                placeholder="Ask about pricing, features, setup, use cases..."
                maxResults={5}
              />
            </div>
          </GlassCard>
        </div>

        {/* Example Queries */}
        <div className="mb-12">
          <h3 className="font-heading text-h4 text-text-primary mb-4 text-center">
            Try These Example Queries
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'What are your pricing plans?',
              'How do I get started?',
              'What languages do you support?',
              'Tell me about use cases',
              'What are the technical specs?',
              'How secure is the platform?',
            ].map((query) => (
              <button
                key={query}
                className="p-4 glass hover:bg-surface/20 rounded-lg text-body-sm text-text-secondary hover:text-primary transition-all text-left group"
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement
                  if (input) {
                    input.value = query
                    input.focus()
                    // Trigger change event
                    const event = new Event('input', { bubbles: true })
                    input.dispatchEvent(event)
                  }
                }}
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  {query}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Documentation Link */}
        <div className="text-center">
          <GlassCard intensity="medium">
            <div className="p-8">
              <h3 className="font-heading text-h4 text-text-primary mb-3">
                Learn More About Both Approaches
              </h3>
              <p className="text-body-sm text-text-secondary mb-6 max-w-2xl mx-auto">
                Read the comprehensive comparison guide to understand when to use each
                approach, cost differences, and implementation details.
              </p>
              <a
                href="/docs/RAG_COMPARISON.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="glass">View RAG Comparison Guide</Button>
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
