# Novative AI Customer Support Portal

A production-ready AI-powered customer support system with **voice and text chat capabilities**, built with Next.js 14, ElevenLabs Conversational AI, and full **Zoho Desk CRM integration**.

**🎯 Purpose:** Provide 24/7 intelligent customer support for Novative AI clients through Nova, our AI support agent.

**✨ Key Capabilities:**
- Voice and text-based customer support
- Automatic ticket creation in Zoho Desk
- Intelligent department routing
- Smart contact management
- Knowledge base search with RAG

**Design Inspired by:** [ltx.studio](https://ltx.studio/) - Professional, dark-themed aesthetic with modern animations

---

## 🚀 Quick Start

**Get the support portal running:**

1. **Clone repository** → `git clone https://github.com/novativeai/mvp-voice-agent-desk.git`
2. **Install dependencies** → `npm install`
3. **Configure environment** → Copy `.env.example` to `.env.local` and add credentials
4. **Setup ElevenLabs** → Create agent and configure webhook tool
5. **Setup Zoho Desk** → Configure OAuth credentials and departments
6. **Run** → `npm run dev`

📖 **Detailed Guides:**
- [Quick Start Guide](QUICK_START.md)
- [Zoho Desk Setup](ZOHO_DESK_SETUP.md)
- [ElevenLabs Configuration](ELEVENLABS_INTEGRATION.md)

---

## ✨ Features

### 🎨 Design
- **Dark Theme**: Deep navy background (#252830) with electric blue accents (#2b61ff)
- **Typography**: Montserrat (headings) + Inter (body) for optimal readability
- **Animations**: Framer Motion for smooth, professional transitions
- **Glass morphism**: Modern, translucent UI components
- **Responsive**: Mobile-first design with beautiful layouts on all devices

### 🎤 Voice AI Support
- **24/7 Availability**: Nova is always available to help customers
- **Voice & Text**: Support both voice calls and text chat
- **Natural Conversations**: Human-like dialogue with empathy and context awareness
- **Audio Visualization**: Real-time waveform animations during voice calls

### 🎫 Zoho Desk Integration
- **Auto Ticket Creation**: Complex issues automatically create support tickets
- **Smart Contact Management**: Automatic contact lookup and creation
- **Department Routing**: Intelligent routing to Sales, Support, or Development
- **Priority Assessment**: Automatic priority assignment based on issue severity
- **OAuth Token Management**: Automatic token refresh (60s preemptive)

### 🧠 Knowledge Base
- **RAG-Powered Search**: Semantic search through comprehensive documentation
- **Instant Answers**: Nova searches past solutions and documentation
- **Always Up-to-Date**: Knowledge base updates reflect immediately
- **Context-Aware**: Responses tailored to customer's specific situation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- ElevenLabs API key and Agent ID
- (Optional) Pinecone + OpenAI keys for custom RAG

### Installation

1. **Navigate to project:**
   ```bash
   cd mvp-voice-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your API keys to `.env.local`:**
   ```env
   # Required for voice agent
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
   ELEVENLABS_API_KEY=your_elevenlabs_api_key

   # Optional for custom RAG
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_INDEX_NAME=mvp-voice-agent
   OPENAI_API_KEY=your_openai_key
   ```

5. **(Optional) Ingest knowledge base for custom RAG:**
   ```bash
   npm run ingest
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   ```
   Landing Page: http://localhost:3000
   Voice Chat:   http://localhost:3000/chat
   RAG Demo:     http://localhost:3000/demo
   ```

---

## 📁 Project Structure

```
mvp-voice-agent/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── chat/
│   │   └── page.tsx             # Voice chat page
│   ├── demo/
│   │   └── page.tsx             # RAG comparison demo
│   ├── api/
│   │   ├── elevenlabs/
│   │   │   └── signed-url/
│   │   │       └── route.ts     # ElevenLabs signed URL endpoint
│   │   └── rag/
│   │       └── search/
│   │           └── route.ts     # Custom RAG search endpoint
│   └── layout.tsx               # Root layout
├── components/
│   ├── landing/
│   │   ├── Hero.tsx             # Hero section with CTA
│   │   ├── Features.tsx         # Features grid
│   │   └── Footer.tsx           # Footer with links
│   ├── voice/
│   │   ├── VoiceChat.tsx        # Main voice chat component
│   │   ├── AudioVisualizer.tsx  # Real-time waveform
│   │   ├── ChatHistory.tsx      # Conversation transcript
│   │   └── VoiceControls.tsx    # Mute/end call controls
│   ├── rag/
│   │   └── KnowledgeSearch.tsx  # Custom RAG search UI
│   └── ui/
│       ├── Button.tsx           # Reusable button
│       └── GlassCard.tsx        # Glass morphism card
├── lib/
│   ├── elevenlabs.ts            # ElevenLabs client & WebSocket
│   └── rag.ts                   # Pinecone + OpenAI RAG
├── scripts/
│   └── ingest-documents.ts      # Document ingestion script
├── docs/
│   ├── RAG_COMPARISON.md        # Detailed RAG comparison
│   └── sample-knowledge-base.md # Sample docs for ElevenLabs
├── styles/
│   └── globals.css              # Global styles & design system
└── tailwind.config.ts           # Tailwind configuration
```

---

## 🎨 Design System

### Colors

```css
Primary: #2b61ff (Electric Blue)
Background: #252830 (Deep Navy)
Surface: #2d323d
Text Primary: #fdfdfd
Text Secondary: #7a7c81
```

### Typography

```css
Headings: Montserrat (100-900)
Body: Inter (300-900)
Mono: Inconsolata
```

### Components

- **Glass Cards**: Backdrop blur with subtle borders
- **Buttons**: Primary, secondary, and glass variants
- **Animations**: Fade, slide, scale effects
- **Grid Background**: Subtle animated pattern

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Voice AI**: ElevenLabs
- **Vector DB**: Pinecone (for RAG)
- **Embeddings**: OpenAI

---

## 📊 Project Status

### ✅ Phase 1: Landing Page (COMPLETE)
- [x] Project setup with Next.js 14
- [x] Custom design system (ltx.studio inspired)
- [x] Hero section with animations
- [x] Features grid with glass cards
- [x] Footer with links
- [x] Fully responsive design

### ✅ Phase 2: Voice Chat UI (COMPLETE)
- [x] Voice chat interface
- [x] Real-time audio visualizer (Canvas API)
- [x] Chat history/transcript display
- [x] Voice controls (mute, speaker, end call)
- [x] Connection status indicators

### ✅ Phase 3: ElevenLabs Integration (COMPLETE)
- [x] API route for signed URL generation
- [x] WebSocket connection handling
- [x] Bidirectional audio streaming
- [x] Agent configuration
- [x] Error handling and reconnection

### ✅ Phase 4: Dual RAG Implementation (COMPLETE)
- [x] ElevenLabs native RAG documentation
- [x] Pinecone vector database setup
- [x] OpenAI embeddings (text-embedding-3-small)
- [x] Semantic search API endpoint
- [x] Document ingestion script
- [x] Interactive RAG comparison demo
- [x] Knowledge search UI component

**All Phases Complete!** 🎉

---

## 🎯 Getting Started Guide

### Option 1: ElevenLabs Native RAG (Recommended)

**Best for:** Quick setup, voice-only applications

1. **Upload knowledge base to ElevenLabs:**
   - Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
   - Select your agent → Knowledge Base
   - Upload `docs/sample-knowledge-base.md` or your own documents

2. **Configure environment:**
   ```bash
   # .env.local
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
   ELEVENLABS_API_KEY=your_api_key
   ```

3. **Run and test:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/chat
   # Ask: "What are your pricing plans?"
   ```

4. **Done!** Your agent automatically uses the knowledge base.

### Option 2: Custom External RAG

**Best for:** Multi-channel apps, custom search features

1. **Set up Pinecone:**
   - Create account at [Pinecone](https://www.pinecone.io/)
   - Create index: `mvp-voice-agent` (dimensions: 1536, metric: cosine)

2. **Configure all API keys:**
   ```bash
   # .env.local
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
   ELEVENLABS_API_KEY=your_api_key
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_INDEX_NAME=mvp-voice-agent
   OPENAI_API_KEY=your_openai_key
   ```

3. **Ingest documents:**
   ```bash
   npm run ingest
   ```

4. **Test custom RAG:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/demo
   # Try the search interface
   ```

### Option 3: Both Approaches (Learning)

Use both to compare and understand the differences:

1. Set up ElevenLabs native RAG (see Option 1)
2. Set up custom external RAG (see Option 2)
3. Visit `/demo` to compare both approaches
4. Read `docs/RAG_COMPARISON.md` for detailed comparison

---

## 🧠 RAG Implementation Comparison

This project implements **both** RAG approaches for educational purposes:

### ElevenLabs Native RAG

```
✅ Setup: 5 minutes (upload docs to dashboard)
✅ Code: Zero - fully automatic
✅ Cost: Included in ElevenLabs subscription
✅ Use Case: Voice-only applications
✅ Integration: Automatic during conversations
```

### Custom External RAG (Pinecone + OpenAI)

```
⚙️ Setup: 30 minutes (infrastructure + code)
⚙️ Code: Full implementation required
⚙️ Cost: ~$170/month (Pinecone + OpenAI)
⚙️ Use Case: Multi-channel applications
⚙️ Integration: Manual API calls
```

### When to Use Each

| Your Goal | Recommended Approach |
|-----------|---------------------|
| Quick voice agent MVP | ✅ ElevenLabs Native |
| Voice + web chat + API | ⚙️ Custom External |
| Learn the stack | 🎓 Both (this project) |
| Production voice app | ✅ ElevenLabs Native |
| Analytics on searches | ⚙️ Custom External |

**📖 Read the full comparison:** See [docs/RAG_COMPARISON.md](docs/RAG_COMPARISON.md) for detailed analysis.

---

## 📝 Environment Variables

```env
# Required - ElevenLabs Voice Agent
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=sk_xxxxx  # Get from ElevenLabs dashboard
ELEVENLABS_API_KEY=el_xxxxx               # Your API key

# Optional - Custom External RAG
PINECONE_API_KEY=xxxxx                    # From Pinecone dashboard
PINECONE_INDEX_NAME=mvp-voice-agent       # Your index name
OPENAI_API_KEY=sk-xxxxx                   # From OpenAI platform

# Optional - App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AI Voice Agent
```

### How to Get API Keys

1. **ElevenLabs:**
   - Sign up at [elevenlabs.io](https://elevenlabs.io)
   - Go to Profile → API Keys
   - Create a conversational AI agent
   - Copy Agent ID from agent settings

2. **Pinecone (for custom RAG):**
   - Sign up at [pinecone.io](https://www.pinecone.io/)
   - Create a new index (1536 dimensions, cosine metric)
   - Copy API key from dashboard

3. **OpenAI (for custom RAG):**
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Go to API Keys → Create new key
   - Copy and save securely

---

## 🤝 Contributing

This is an MVP project. Feel free to fork and customize for your needs!

---

## 📄 License

MIT

---

## 🙏 Credits

- **Design Inspiration**: [ltx.studio](https://ltx.studio/)
- **Voice AI**: [ElevenLabs](https://elevenlabs.io/)
- **Framework**: [Next.js](https://nextjs.org/)
