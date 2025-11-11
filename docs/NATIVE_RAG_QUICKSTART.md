# ElevenLabs Native RAG - Quick Start Guide

## Why Native RAG?

ElevenLabs Native RAG is the **recommended approach** for voice agent applications:

✅ **5-minute setup** - Just upload docs to dashboard
✅ **Zero code required** - Fully automatic
✅ **No extra costs** - Included in subscription
✅ **Optimized for voice** - Built specifically for conversational AI
✅ **Instant updates** - Edit knowledge base anytime

---

## Step-by-Step Setup

### Step 1: Create ElevenLabs Account (2 minutes)

1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up for an account
3. Navigate to **Conversational AI** section

### Step 2: Create Voice Agent (3 minutes)

1. Click **"Create Agent"**
2. Choose your configuration:
   ```
   Name: Customer Support Agent
   Voice: Choose from library (try "Rachel" or "Adam")
   Language: English (or your preference)
   ```
3. Configure agent personality:
   ```
   System Prompt Example:
   "You are a helpful customer support agent. You answer questions
   about our products, pricing, and services. You are friendly,
   professional, and concise. Use the knowledge base to provide
   accurate information."
   ```
4. Save your agent

### Step 3: Upload Knowledge Base (5 minutes)

1. In your agent settings, go to **"Knowledge Base"** tab
2. Click **"Add Knowledge"**
3. Upload your knowledge base:

   **Option A: Use sample file**
   ```
   Upload: docs/sample-knowledge-base.md
   (Provided in this project)
   ```

   **Option B: Upload your own documents**
   ```
   Supported formats:
   - PDF
   - TXT
   - DOCX
   - Markdown
   - Web URLs
   ```

4. Enable knowledge base:
   ```
   Toggle: "Use Knowledge Base" → ON
   ```

5. Configure retrieval settings (optional):
   ```
   Citation Style: Inline citations
   Retrieval Mode: Automatic
   Max Context Length: Auto
   ```

### Step 4: Get API Credentials (2 minutes)

1. Go to **Profile** → **API Keys**
2. Click **"Generate API Key"**
3. Copy your API key (starts with `el_`)
4. Go back to your agent
5. Copy your **Agent ID** (from agent settings URL)

### Step 5: Configure Application (1 minute)

1. Open your `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your credentials:
   ```env
   # Required for ElevenLabs Native RAG
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
   ELEVENLABS_API_KEY=el_your_api_key_here

   # Optional (not needed for native RAG)
   # PINECONE_API_KEY=
   # OPENAI_API_KEY=
   ```

3. Save the file

### Step 6: Run Your Application (1 minute)

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Open browser
# Visit: http://localhost:3000
```

### Step 7: Test Your Voice Agent (2 minutes)

1. Click **"Start Voice Chat"** button
2. Allow microphone access when prompted
3. Wait for "Connected" status (green indicator)
4. Start speaking to your agent!

**Try these questions:**
- "What are your pricing plans?"
- "How do I get started?"
- "What languages do you support?"
- "Tell me about security features"
- "What are common use cases?"

---

## How Native RAG Works

```
┌─────────────────────────────────────────────────┐
│  YOU SPEAK: "What are your pricing plans?"      │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  ElevenLabs Speech-to-Text                      │
│  Transcribes: "what are your pricing plans"     │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Knowledge Base Search (Automatic)              │
│  ├─ Generates embedding from query              │
│  ├─ Searches uploaded documents                 │
│  └─ Retrieves relevant sections                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  LLM Response Generation                        │
│  ├─ Takes retrieved context                     │
│  ├─ Applies system prompt                       │
│  └─ Generates natural response                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Text-to-Speech                                 │
│  Converts response to natural voice             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  YOU HEAR: "We offer three pricing tiers..."    │
└─────────────────────────────────────────────────┘
```

**Total time:** ~2-3 seconds
**Your code:** 0 lines - all automatic!

---

## Knowledge Base Best Practices

### Content Organization

**Good structure:**
```markdown
# Topic Name

## Overview
Clear introduction to the topic

## Details
Specific information in short paragraphs

## Examples
Concrete examples when relevant

## Related Information
Cross-references to other topics
```

**Tips:**
- Use clear headings (H1, H2, H3)
- Keep paragraphs short (2-4 sentences)
- Use bullet points for lists
- Include specific numbers and data
- Avoid ambiguous language

### Document Size

```
Recommended per document:
├─ Minimum: 100 words
├─ Optimal: 500-2,000 words
└─ Maximum: 10,000 words

Total knowledge base:
├─ Minimum: 5-10 documents
├─ Optimal: 20-50 documents
└─ Maximum: ~10MB total size
```

### Content Types

**What works well:**
- ✅ FAQs and common questions
- ✅ Product specifications
- ✅ Pricing information
- ✅ How-to guides
- ✅ Troubleshooting steps
- ✅ Company policies
- ✅ Contact information

**What doesn't work:**
- ❌ Real-time data (stock prices, weather)
- ❌ User-specific data (account info)
- ❌ Rapidly changing content
- ❌ Images without descriptions
- ❌ Complex tables (use bullet points instead)

---

## Updating Your Knowledge Base

### Adding New Content

1. Go to ElevenLabs Dashboard → Your Agent → Knowledge Base
2. Click **"Add Knowledge"**
3. Upload new document or paste text
4. Changes are **live immediately** - no deployment needed!

### Editing Existing Content

1. In Knowledge Base tab, find the document
2. Click **"Edit"** or delete and re-upload
3. Save changes
4. Test by asking the agent about updated content

### Best Practices

```
Update frequency by content type:

Static content (company history, mission):
└─ Review: Quarterly

Product info (features, specs):
└─ Review: Monthly or when product changes

Pricing and plans:
└─ Review: Immediately when changed

Support articles:
└─ Review: Weekly or as issues arise

Seasonal content:
└─ Review: At season start/end
```

---

## Testing Your Knowledge Base

### Manual Testing

**Ask direct questions:**
```
Good test questions:
✅ "What is your pricing for the enterprise plan?"
✅ "How long does setup take?"
✅ "What payment methods do you accept?"

Bad test questions (too vague):
❌ "Tell me about your company"
❌ "What do you do?"
❌ "Help me"
```

**Ask edge cases:**
```
Test specificity:
✅ "What's the response time for the basic plan?"
✅ "Do you support Japanese language?"
✅ "Is there a free trial?"

Test unknowns:
✅ "What's your refund policy?" (if not in KB)
✅ "Do you integrate with Salesforce?" (if not documented)
```

### Check Agent Responses

**Good responses include:**
- ✅ Specific information from knowledge base
- ✅ Natural, conversational tone
- ✅ Citations when configured
- ✅ Appropriate length (not too long)

**Fix if responses:**
- ❌ Say "I don't know" (add content to KB)
- ❌ Hallucinate information (improve system prompt)
- ❌ Are too generic (add more specific details to KB)
- ❌ Are too long (break into shorter sections)

### Analytics

Check ElevenLabs Dashboard for:
```
Metrics to monitor:
├─ Conversation count
├─ Average conversation length
├─ Knowledge base usage rate
├─ Citation frequency
└─ Escalation to human rate

Red flags:
├─ Low KB usage → Improve prompts or KB content
├─ High escalation rate → Add more KB content
├─ Very long conversations → Simplify responses
└─ Low satisfaction → Review transcripts
```

---

## Common Questions

### Q: How much does it cost?

**A:** Included in your ElevenLabs subscription. No additional charges for:
- Knowledge base storage
- Embedding generation
- Search queries
- Updates to knowledge base

You only pay for conversation minutes (based on your plan).

---

### Q: How large can my knowledge base be?

**A:**
- Total size: ~10MB per agent
- Documents: Hundreds of documents supported
- Best practice: 20-50 well-organized documents

---

### Q: How do I know if the agent used the knowledge base?

**A:**
1. Enable citations in agent settings
2. Agent will mention "according to the knowledge base" or cite sources
3. Check analytics in dashboard for KB usage metrics

---

### Q: Can I use multiple knowledge bases?

**A:**
- One knowledge base per agent
- Create multiple agents for different topics/departments
- Use metadata/categories to organize within one KB

---

### Q: What if the agent gives wrong information?

**A:**
1. Check if information is in knowledge base
2. If incorrect, update the KB document
3. If missing, add new content
4. Adjust system prompt if needed
5. Test again

---

### Q: Can I add real-time data?

**A:**
No, native RAG is for static knowledge. For real-time data:
- Use ElevenLabs function calling (API integrations)
- Or switch to custom RAG with live data sources

---

### Q: How often should I update the knowledge base?

**A:**
- Immediate: Price changes, critical updates
- Weekly: Support content, FAQs
- Monthly: Product information
- Quarterly: Company info, policies

---

## Troubleshooting

### Agent Doesn't Use Knowledge Base

**Check:**
1. Knowledge Base is enabled in agent settings
2. Documents are successfully uploaded (see list)
3. System prompt encourages KB usage:
   ```
   "Use the knowledge base to answer questions accurately.
   If you're not sure, check the knowledge base first."
   ```

**Fix:**
- Re-upload documents if needed
- Simplify document structure
- Make headings more descriptive

---

### Agent Can't Find Information

**Possible causes:**
1. Information not in knowledge base → Add it
2. Query is too different from KB content → Rephrase KB
3. Document structure is confusing → Reorganize
4. Content is buried in large documents → Split into smaller docs

**Fix:**
- Ask the same question different ways
- Check what words the user actually says
- Mirror user language in KB documents
- Add synonyms and variations

---

### Slow Response Time

**Normal latency:**
```
Speech-to-text: 100-200ms
KB search: 100-200ms
LLM generation: 500-1000ms
Text-to-speech: 200-300ms
Total: 1-2 seconds
```

**If slower:**
1. Check your internet connection
2. Try a different voice (some are faster)
3. Simplify system prompt
4. Reduce KB size if extremely large
5. Contact ElevenLabs support

---

### Citations Not Working

**Enable citations:**
1. Agent Settings → Knowledge Base
2. Citation Style: Choose format
3. Save and test

**If still not working:**
- System prompt must not suppress citations
- Try: "Cite your sources when using the knowledge base"

---

## Next Steps

### ✅ You've Set Up Native RAG!

Now you can:

1. **Customize Content**
   - Replace sample KB with your own content
   - Add company-specific information
   - Include your actual pricing, features, etc.

2. **Improve Agent Personality**
   - Adjust system prompt
   - Choose different voice
   - Configure conversation style

3. **Test Thoroughly**
   - Try various questions
   - Test edge cases
   - Have colleagues test
   - Gather feedback

4. **Monitor & Optimize**
   - Check analytics weekly
   - Update KB based on common questions
   - Refine system prompt
   - Add missing information

5. **Deploy to Production**
   - Deploy Next.js app to Vercel
   - Configure production environment variables
   - Set up custom domain
   - Monitor usage and costs

---

## Advanced Tips

### Optimization

**Speed up responses:**
```
System prompt tips:
├─ "Be concise" → Shorter responses
├─ "Answer directly" → Skip unnecessary context
└─ "One minute maximum" → Keep calls brief

Knowledge base tips:
├─ Front-load important info in documents
├─ Use clear headings
└─ Keep paragraphs short (2-3 sentences)
```

**Improve accuracy:**
```
System prompt tips:
├─ "Always check the knowledge base first"
├─ "If unsure, say you don't know"
└─ "Never make up information"

Knowledge base tips:
├─ Include common variations of questions
├─ Add "Related: see XYZ" cross-references
└─ Update based on real user questions
```

### Multi-Agent Setup

For complex use cases, create multiple agents:

```
Agent 1: Sales
├─ KB: Products, pricing, demos
└─ Prompt: "You are a sales representative..."

Agent 2: Support
├─ KB: Troubleshooting, how-tos
└─ Prompt: "You are a support specialist..."

Agent 3: Billing
├─ KB: Payment, refunds, invoices
└─ Prompt: "You are a billing specialist..."
```

Then route users to appropriate agent based on their needs.

---

## Resources

### This Project
- `docs/sample-knowledge-base.md` - Ready-to-use KB
- `docs/RAG_COMPARISON.md` - Native vs Custom RAG
- `README.md` - Full setup guide

### ElevenLabs Documentation
- [Conversational AI Docs](https://elevenlabs.io/docs/conversational-ai)
- [Knowledge Base Guide](https://elevenlabs.io/docs/knowledge-base)
- [API Reference](https://elevenlabs.io/docs/api-reference)

### Community
- [ElevenLabs Discord](https://discord.gg/elevenlabs)
- [GitHub Issues](https://github.com/elevenlabs)

---

## Success Checklist

Before going live, ensure:

- [ ] Knowledge base uploaded and enabled
- [ ] System prompt is clear and helpful
- [ ] Voice is appropriate for your brand
- [ ] Tested with 20+ different questions
- [ ] Edge cases handled (unknown questions)
- [ ] Response time is acceptable (<3s)
- [ ] Accuracy is high (>90% correct answers)
- [ ] Tone matches your brand
- [ ] Analytics are configured
- [ ] Team is trained on updates
- [ ] Backup plan for escalations

---

**You're all set!** 🎉

Your voice agent with ElevenLabs Native RAG is ready to handle real conversations. The setup is complete, and you can now focus on:

1. Customizing content
2. Testing with real users
3. Monitoring performance
4. Iterating based on feedback

No complicated infrastructure, no custom code, no extra costs. Just a powerful voice agent with accurate, knowledge-based responses.

**Happy building!** 🚀
