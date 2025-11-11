# RAG Implementation Comparison

This project implements **two different RAG approaches** for educational purposes.

## Overview

| Feature | ElevenLabs Native RAG | Custom External RAG |
|---------|----------------------|---------------------|
| **Setup Complexity** | Very Simple | Complex |
| **Code Required** | None | Significant |
| **Knowledge Base Location** | ElevenLabs Dashboard | Pinecone Vector DB |
| **Automatic During Calls** | ✅ Yes | ❌ No (manual) |
| **External Search API** | ❌ No | ✅ Yes |
| **Cost** | Included in ElevenLabs | Separate (Pinecone + OpenAI) |
| **Update Frequency** | Real-time via dashboard | Manual ingestion |
| **Customization** | Limited | Full control |

---

## Approach 1: ElevenLabs Native RAG (Recommended for Voice Agent)

### How It Works

```
User speaks → ElevenLabs Agent → Automatically searches knowledge base
                                 ↓
                          Retrieves relevant context
                                 ↓
                          Generates response with context
                                 ↓
                          Speaks answer to user
```

### Setup Steps

**1. Create Knowledge Base in ElevenLabs Dashboard**

```bash
# Navigate to:
https://elevenlabs.io/app/conversational-ai

# Steps:
1. Select your agent
2. Go to "Knowledge Base" section
3. Click "Add Knowledge"
4. Upload documents (PDF, TXT, DOCX) or paste text
5. ElevenLabs automatically creates embeddings
```

**2. Configure Agent to Use Knowledge Base**

```
Agent Settings → Knowledge Base → Enable
```

**3. That's it! No code needed.**

The agent automatically:
- Searches the knowledge base during conversations
- Retrieves relevant information
- Incorporates it into responses
- Cites sources when configured

### Example Conversation

```
User: "What's your pricing?"

Agent: (automatically searches knowledge base)
       "We offer three pricing tiers:
       - Starter: $29/month for up to 1,000 minutes
       - Professional: $99/month for up to 5,000 minutes
       - Enterprise: Custom pricing with unlimited conversations"

(No additional API calls or code required)
```

### Advantages
- ✅ Zero code implementation
- ✅ Automatic context retrieval
- ✅ Built-in citation support
- ✅ Real-time updates via dashboard
- ✅ Optimized for voice conversations
- ✅ No additional infrastructure costs

### Limitations
- ❌ Can't access knowledge base from other parts of your app
- ❌ Limited to ElevenLabs conversations
- ❌ Less control over retrieval logic
- ❌ Can't show users what was retrieved

---

## Approach 2: Custom External RAG (This Implementation)

### How It Works

```
User query → Your API → Generate embedding (OpenAI)
                            ↓
                    Search vectors (Pinecone)
                            ↓
                    Retrieve similar documents
                            ↓
                    Format context
                            ↓
                    Return to application
```

### Architecture

```typescript
// 1. Ingest documents (one-time or periodic)
import { ingestDocuments } from '@/lib/rag'

await ingestDocuments([
  {
    id: 'doc-1',
    content: 'Product information...',
    metadata: { category: 'product', title: 'Overview' }
  }
])

// 2. Search at runtime
import { searchSimilarDocuments, getRAGContext } from '@/lib/rag'

const results = await searchSimilarDocuments('pricing plans', 5)
const context = await getRAGContext('pricing plans', 3)
```

### Setup Steps

**1. Configure Environment Variables**

```bash
# .env.local
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=mvp-voice-agent
OPENAI_API_KEY=your_openai_key
```

**2. Create Pinecone Index**

```bash
# Pinecone Dashboard → Create Index
Name: mvp-voice-agent
Dimensions: 1536 (for text-embedding-3-small)
Metric: cosine
```

**3. Ingest Documents**

```bash
npm run ingest
```

**4. Use in Your Application**

```typescript
// API endpoint
const response = await fetch('/api/rag/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'What are the pricing plans?',
    topK: 5
  })
})

const { results } = await response.json()
```

### Advantages
- ✅ Full programmatic control
- ✅ Can be used across entire application
- ✅ Custom filtering and ranking
- ✅ Show users what was retrieved
- ✅ Use same knowledge base for multiple services
- ✅ Advanced analytics on searches

### Limitations
- ❌ More complex setup
- ❌ Additional infrastructure costs
- ❌ Manual integration with voice agent
- ❌ Requires more maintenance

---

## Use Cases for Each Approach

### Use ElevenLabs Native RAG When:

**Scenario 1: Pure Voice Agent**
```
Goal: Voice assistant that answers questions
Solution: Upload knowledge base to ElevenLabs
Result: Agent automatically uses context in conversations
```

**Scenario 2: Frequently Updated Content**
```
Goal: Knowledge base changes often
Solution: Update docs in ElevenLabs dashboard
Result: Immediate availability to agent (no re-ingestion)
```

**Scenario 3: Quick MVP**
```
Goal: Launch fast with minimal code
Solution: ElevenLabs handles everything
Result: Production-ready in minutes
```

### Use Custom External RAG When:

**Scenario 1: Multi-Channel Application**
```
Goal: Same knowledge base for web chat, voice, and API
Solution: Central Pinecone database
Result: Unified knowledge across all channels
```

**Scenario 2: Search UI Component**
```
Goal: Show users search results before they ask
Solution: Custom RAG with UI component
Result: Interactive knowledge base search
```

**Scenario 3: Custom Retrieval Logic**
```
Goal: Filter by user role, subscription, or region
Solution: Custom RAG with metadata filtering
Result: Personalized results per user
```

**Scenario 4: Analytics & Monitoring**
```
Goal: Track what users search for
Solution: Custom RAG with logging
Result: Insights into user needs
```

---

## Hybrid Approach (Recommended for Learning)

You can use **both** approaches together:

### Configuration

```typescript
// 1. ElevenLabs agent uses its native knowledge base
//    → Automatic during voice conversations

// 2. Custom RAG for external queries
//    → Manual searches from your application

// Example: Search before connecting to agent
const relatedDocs = await searchSimilarDocuments(userQuery, 3)
// Show results in UI
// Then connect to voice agent for conversation
```

### Example Flow

```
1. User types question in web UI
   ↓
2. Custom RAG searches Pinecone
   ↓
3. Display relevant articles to user
   ↓
4. User clicks "Talk to Agent" button
   ↓
5. ElevenLabs agent uses its native knowledge base
   ↓
6. Voice conversation with automatic context retrieval
```

---

## Cost Comparison

### ElevenLabs Native RAG
```
Cost: Included in ElevenLabs subscription
No additional charges for embeddings or storage
```

### Custom External RAG
```
Pinecone: ~$70/month (Starter plan)
OpenAI Embeddings: ~$0.0001 per 1K tokens
Example: 1 million tokens = ~$100/month

Total: ~$170/month + OpenAI usage
```

---

## Migration Path

### Starting with ElevenLabs → Moving to Custom

```typescript
// Phase 1: Use ElevenLabs native (fastest launch)
// Upload docs to dashboard

// Phase 2: Add custom RAG for specific features
// Keep ElevenLabs for voice, add Pinecone for web

// Phase 3: Evaluate if custom RAG is needed
// If voice-only → stay with ElevenLabs
// If multi-channel → expand custom RAG
```

### Starting with Custom → Adding ElevenLabs

```typescript
// Phase 1: Build custom RAG infrastructure
// Already done in this project

// Phase 2: Duplicate knowledge base to ElevenLabs
// Upload same docs to dashboard

// Phase 3: Use ElevenLabs native for voice
// Remove manual RAG calls during voice conversations
```

---

## Implementation in This Project

This MVP demonstrates **both approaches**:

### Files for Custom RAG
- `lib/rag.ts` - Pinecone + OpenAI integration
- `app/api/rag/search/route.ts` - REST API endpoint
- `scripts/ingest-documents.ts` - Document ingestion
- `components/rag/KnowledgeSearch.tsx` - UI component (optional)

### Files for ElevenLabs Native RAG
- `lib/elevenlabs.ts` - Voice agent connection
- `components/voice/VoiceChat.tsx` - Voice interface
- Configuration in ElevenLabs dashboard (manual setup)

### Recommendation for This MVP

**For the voice agent → Use ElevenLabs Native RAG**
- Upload the same 5 sample documents to ElevenLabs dashboard
- Agent automatically retrieves context during calls
- Zero additional code

**For learning purposes → Keep Custom RAG**
- Demonstrates vector database concepts
- Shows how embeddings work
- Provides API for external queries
- Useful for comparison

---

## Next Steps

1. **Try ElevenLabs Native RAG:**
   ```bash
   # Go to ElevenLabs dashboard
   # Upload docs/sample-knowledge-base.md
   # Test voice agent with questions
   ```

2. **Try Custom RAG:**
   ```bash
   npm run ingest
   # Test API: POST /api/rag/search
   ```

3. **Compare Results:**
   - Ask same question to both systems
   - Compare response quality
   - Measure latency
   - Evaluate ease of use

4. **Choose Approach:**
   - Voice-only → ElevenLabs Native
   - Multi-channel → Custom RAG
   - Both → Hybrid approach
