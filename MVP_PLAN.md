# MVP Voice Agent - Step-by-Step Plan

**Tech Stack:** Next.js 14 + ElevenLabs Conversational AI + RAG + TypeScript

**Design Reference:** ltx.studio aesthetic
- Dark theme (Deep navy: `rgb(37,40,48)`)
- Electric blue accent: `#2b61ff`
- Fonts: Montserrat (headings), Inter (body)
- Modern animations & glassmorphism

---

## Phase 1: Project Setup & Landing Page

### Step 1: Initialize Next.js Project
```bash
npx create-next-app@latest mvp-voice-agent --typescript --tailwind --app
cd mvp-voice-agent
npm install framer-motion lucide-react @radix-ui/react-dialog
```

### Step 2: Design System Setup
- Configure Tailwind with custom colors & fonts
- Create design tokens (spacing, colors, typography)
- Set up component library structure

### Step 3: Landing Page Components
- **Hero Section**
  - Gradient headline with animated text
  - CTA button: "Start Voice Chat"
  - Animated background particles/grid

- **Features Section**
  - 3 feature cards with icons
  - Glassmorphism card design

- **Footer**
  - Minimal footer with links

### Design Elements
- Dark background: `bg-[#252830]`
- Accent blue: `text-[#2b61ff]`
- Smooth scroll animations
- Hover effects on cards

---

## Phase 2: Voice Chat Interface

### Step 4: Voice Chat UI
- **Components:**
  - `VoiceChat.tsx` - Main container
  - `AudioVisualizer.tsx` - Waveform animation
  - `ChatHistory.tsx` - Conversation transcript
  - `VoiceControls.tsx` - Mute/unmute, end call

- **Features:**
  - Real-time audio visualization
  - Status indicators (connecting, active, ended)
  - Conversation transcript display
  - Professional animations

---

## Phase 3: ElevenLabs Integration

### Step 5: ElevenLabs Setup
```bash
npm install elevenlabs-js
```

- Create API route: `/api/elevenlabs/signed-url`
- Implement WebSocket connection
- Handle audio streaming

### Step 6: Conversational AI
- **Agent Configuration:**
  - Voice: Professional voice model
  - Language: English
  - Response style: Friendly, helpful

- **Tool Integration:**
  - Knowledge base search (RAG)
  - Custom functions for user queries

---

## Phase 4: RAG Implementation

### Step 7: Vector Database Setup
```bash
npm install @pinecone-database/pinecone openai
```

- Set up Pinecone for vector storage
- Create embedding pipeline
- Index knowledge base documents

### Step 8: RAG Tool for Agent
- **Components:**
  - Document ingestion script
  - Semantic search function
  - Context retrieval for agent

- **Knowledge Base:**
  - Product documentation
  - FAQ database
  - Company information

---

## Phase 5: Polish & Deploy

### Step 9: UI Polish
- Add loading states
- Error handling UI
- Toast notifications
- Responsive design testing

### Step 10: Deploy
```bash
# Vercel deployment
vercel deploy
```

---

## File Structure

```
mvp-voice-agent/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── chat/
│   │   └── page.tsx             # Voice chat page
│   ├── api/
│   │   └── elevenlabs/
│   │       └── signed-url/
│   │           └── route.ts     # Get signed URL
│   └── layout.tsx
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   ├── voice/
│   │   ├── VoiceChat.tsx
│   │   ├── AudioVisualizer.tsx
│   │   ├── ChatHistory.tsx
│   │   └── VoiceControls.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── GlassCard.tsx
├── lib/
│   ├── elevenlabs.ts            # ElevenLabs client
│   ├── rag.ts                   # RAG implementation
│   └── utils.ts
├── styles/
│   └── globals.css
└── public/
    └── assets/
```

---

## MVP Features Checklist

### Core Features
- [ ] Landing page with modern design
- [ ] Voice chat interface
- [ ] ElevenLabs agent integration
- [ ] Real-time audio visualization
- [ ] Conversation transcript
- [ ] RAG-powered knowledge retrieval
- [ ] Responsive design (mobile-first)

### Design Features
- [ ] Dark theme with navy background
- [ ] Electric blue accents
- [ ] Montserrat & Inter fonts
- [ ] Glassmorphism effects
- [ ] Smooth animations (Framer Motion)
- [ ] Hover states & micro-interactions

### Technical Features
- [ ] TypeScript for type safety
- [ ] API routes for backend logic
- [ ] Environment variables management
- [ ] Error boundaries
- [ ] Loading states

---

## Development Timeline

**Total Time: 6-8 hours**

- **Phase 1 (Landing):** 1.5 hours
- **Phase 2 (Voice UI):** 1.5 hours
- **Phase 3 (ElevenLabs):** 2 hours
- **Phase 4 (RAG):** 2 hours
- **Phase 5 (Polish):** 1 hour

---

## Environment Variables

```env
# ElevenLabs
ELEVENLABS_API_KEY=your_api_key
ELEVENLABS_AGENT_ID=your_agent_id

# RAG / Vector DB
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment
PINECONE_INDEX=voice-agent-kb

# OpenAI (for embeddings)
OPENAI_API_KEY=your_openai_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Getting Started

1. **Clone/Create Project:**
   ```bash
   npx create-next-app@latest mvp-voice-agent --typescript --tailwind --app
   cd mvp-voice-agent
   ```

2. **Install Dependencies:**
   ```bash
   npm install framer-motion lucide-react elevenlabs-js @pinecone-database/pinecone openai
   npm install @radix-ui/react-dialog @radix-ui/react-toast
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env.local
   # Add your API keys
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

---

**Next Step:** Start with Phase 1 - Project Setup & Landing Page
