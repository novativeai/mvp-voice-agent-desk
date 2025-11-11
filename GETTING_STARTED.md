# Getting Started with ElevenLabs Native RAG

## Welcome! 👋

This voice agent MVP uses **ElevenLabs Native RAG** - the simplest and most powerful approach for voice AI with knowledge bases.

**No complex setup. No additional services. Just upload your docs and go!**

---

## ✅ Prerequisites Checklist

Before you start, you'll need:

- [ ] Node.js 18+ installed ([download](https://nodejs.org))
- [ ] An ElevenLabs account ([sign up](https://elevenlabs.io))
- [ ] 15 minutes of your time

---

## 🚀 5-Minute Setup

### Step 1: ElevenLabs Setup (5 min)

1. **Create account** at [elevenlabs.io](https://elevenlabs.io)

2. **Create a Conversational AI agent:**
   - Go to: Conversational AI → Create Agent
   - Choose a voice (try "Rachel" or "Adam")
   - Add system prompt:
     ```
     You are a helpful AI assistant. Answer questions using
     the knowledge base provided. Be friendly and concise.
     ```

3. **Upload knowledge base:**
   - In agent settings → Knowledge Base tab
   - Click "Add Knowledge"
   - Upload: `docs/sample-knowledge-base.md` (from this project)
   - Enable "Use Knowledge Base"

4. **Get your credentials:**
   - Copy your **Agent ID** from the agent settings page
   - Go to Profile → API Keys
   - Create and copy your **API Key**

### Step 2: Application Setup (2 min)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   ```

3. **Add your ElevenLabs credentials to `.env.local`:**
   ```env
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
   ELEVENLABS_API_KEY=your_api_key_here
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## ✨ Test Your Agent

1. Click **"Start Voice Chat"**
2. Allow microphone access
3. Wait for **"Connected"** status (green dot)
4. Ask a question!

### Try These Questions:

- "What are your pricing plans?"
- "How do I get started?"
- "What languages do you support?"
- "Tell me about your security features"
- "What are common use cases?"

The agent will automatically search your knowledge base and provide accurate answers!

---

## 📚 What You Get

### Landing Page (/)
- Professional hero section
- Feature showcase
- Call-to-action buttons

### Voice Chat (/chat)
- Real-time voice conversation
- Audio visualizer
- Chat transcript
- Voice controls (mute, end call)

### RAG Demo (/demo)
- Compare Native vs Custom RAG
- Interactive search interface
- See how both approaches work

---

## 🎯 Next Steps

### 1. Customize Your Knowledge Base

Replace the sample content with your own:

**Option A: Upload to ElevenLabs (Recommended)**
- Edit `docs/sample-knowledge-base.md` with your content
- Upload to ElevenLabs dashboard
- Changes are live immediately!

**Option B: Create new documents**
- Support FAQs
- Product information
- Company policies
- Pricing details
- How-to guides

### 2. Customize Agent Personality

Edit the system prompt in ElevenLabs dashboard:

```
Example prompts:

Professional:
"You are a professional customer support agent. Be helpful,
concise, and always refer to the knowledge base for accuracy."

Friendly:
"You are a friendly AI assistant! Help users with enthusiasm
and always use the knowledge base to ensure accuracy."

Technical:
"You are a technical support specialist. Provide detailed,
accurate answers using the knowledge base. Be precise."
```

### 3. Test Thoroughly

- [ ] Test with 20+ different questions
- [ ] Try edge cases (questions not in KB)
- [ ] Test different phrasings
- [ ] Have colleagues test
- [ ] Check response accuracy
- [ ] Verify tone and personality

### 4. Deploy to Production

When ready to launch:

```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
vercel deploy

# Or deploy to your preferred platform
```

Update environment variables on your hosting platform with production API keys.

---

## 📖 Documentation

### Essential Reading

1. **[NATIVE_RAG_QUICKSTART.md](docs/NATIVE_RAG_QUICKSTART.md)**
   - Complete guide to using ElevenLabs Native RAG
   - Best practices for knowledge bases
   - Troubleshooting tips
   - **Start here!**

2. **[README.md](README.md)**
   - Full project documentation
   - Architecture overview
   - Tech stack details

3. **[RAG_COMPARISON.md](docs/RAG_COMPARISON.md)**
   - Native RAG vs Custom RAG
   - When to use each approach
   - Cost and performance comparison

### Advanced Topics

4. **[IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)**
   - Technical implementation details
   - File structure and purpose
   - How everything works together

---

## 🆘 Need Help?

### Common Issues

**Agent not responding?**
- Check that knowledge base is enabled in ElevenLabs
- Verify API keys are correct in `.env.local`
- Make sure you allowed microphone access

**Agent can't find information?**
- Check that documents are uploaded to ElevenLabs
- Verify content is in the knowledge base
- Try rephrasing your question

**Connection errors?**
- Check your internet connection
- Verify API key is valid
- Try refreshing the page

### Get Support

1. Check the troubleshooting section in [NATIVE_RAG_QUICKSTART.md](docs/NATIVE_RAG_QUICKSTART.md)
2. Review ElevenLabs documentation: [elevenlabs.io/docs](https://elevenlabs.io/docs)
3. Join ElevenLabs Discord community
4. Check GitHub issues (if this is open source)

---

## ✨ You're All Set!

Your voice agent with ElevenLabs Native RAG is ready to use!

**What makes this special:**
- ✅ No complex infrastructure
- ✅ No custom RAG coding needed
- ✅ Automatic knowledge retrieval
- ✅ Updates in seconds
- ✅ Production-ready from day one

**Time to launch:** Already complete!
**Code you wrote for RAG:** Zero lines!
**Infrastructure to manage:** None!

Just customize your knowledge base and start talking to your AI agent.

---

## 🔥 Pro Tips

### For Best Results:

**Knowledge Base Content:**
- Write clear, concise answers
- Use bullet points for lists
- Include specific numbers and data
- Organize with clear headings
- Update regularly based on user questions

**System Prompt:**
- Keep it under 200 words
- Be specific about tone
- Encourage KB usage
- Set clear boundaries
- Test different variations

**Testing:**
- Ask questions 5 different ways
- Test with voice AND text
- Try intentionally hard questions
- Have non-technical people test
- Monitor real conversations

**Optimization:**
- Review analytics weekly
- Update KB based on common questions
- Refine system prompt monthly
- Test new features in sandbox first
- Keep conversations under 2 minutes

---

**Ready to build?** Start with [NATIVE_RAG_QUICKSTART.md](docs/NATIVE_RAG_QUICKSTART.md)!

**Questions?** Check the [README.md](README.md) for full documentation.

**Want to compare?** Visit [/demo](http://localhost:3000/demo) to see Native vs Custom RAG.

---

**Happy building!** 🚀
