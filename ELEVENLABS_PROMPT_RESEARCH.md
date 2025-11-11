# ElevenLabs System Prompt Research & Implementation

**Date:** 2025-11-12
**Purpose:** Research ElevenLabs conversational AI system prompt best practices and create optimized prompt for Novative AI support agent

---

## Research Summary

### ElevenLabs 2025 Best Practices

Based on official ElevenLabs documentation, conversational AI system prompts should follow a structured approach using **6 core building blocks**:

#### 1. **Personality**
Defines the agent's identity, character traits, role, and relevant background. This creates consistency in how the agent presents itself.

**Key elements:**
- Agent name and role
- Character traits (friendly, professional, patient, etc.)
- Domain expertise and background
- Communication style

#### 2. **Environment**
Specifies the communication context, channel, and situational factors that affect interactions.

**Key elements:**
- Communication medium (voice, text, chat)
- Customer context (stressed, multitasking, time-sensitive)
- Environmental factors (background noise, connection issues)
- Business context

#### 3. **Tone**
Controls linguistic style, speech patterns, and conversational elements for natural dialogue.

**Key elements:**
- Conversational markers (brief affirmations, natural fillers)
- Speech patterns (contractions, pauses, emphasis)
- Formality level (professional vs. casual)
- TTS optimization (spelling out emails, breaking phone numbers)

#### 4. **Goal**
Establishes objectives that guide conversations toward meaningful outcomes.

**Key elements:**
- Primary objectives in priority order
- Success criteria
- Desired outcomes for each interaction type
- Escalation paths

#### 5. **Guardrails**
Sets boundaries ensuring interactions remain appropriate, ethical, and on-brand.

**Key elements:**
- Must-do behaviors (required actions)
- Must-not-do behaviors (prohibited actions)
- Escalation triggers
- Topic boundaries
- Privacy and security guidelines

#### 6. **Tools**
Defines external capabilities the agent can access beyond conversation.

**Key elements:**
- Tool names and descriptions
- When to use each tool
- Parameter specifications
- Example usage flows
- Response handling

---

## Common Mistakes to Avoid

### ❌ Mistake #1: Recycling Human Training Playbooks
**Problem:** Using the same instructions designed for human employees rarely works for AI agents.

**Why it fails:**
- Humans have implicit knowledge and context that AI lacks
- Human instructions assume common sense and real-world experience
- Instructions for humans are often too abstract for AI

**Solution:** Be explicit, structured, and provide clear decision trees for AI agents.

### ❌ Mistake #2: Dense, Unstructured Prompts
**Problem:** Long paragraphs without clear sections or hierarchy.

**Why it fails:**
- Hard for LLMs to parse and prioritize information
- Important instructions get buried in text
- Contradictory instructions may conflict

**Solution:** Use labeled sections, bullet points, and clear hierarchies.

### ❌ Mistake #3: Ignoring TTS Optimization
**Problem:** Writing prompts as if the agent is typing, not speaking.

**Why it fails:**
- Unnatural speech patterns (too formal, robotic)
- Poor pronunciation of special formats (emails, phone numbers)
- Missing natural speech markers (pauses, affirmations)

**Solution:** Include natural speech markers, fillers, and TTS-optimized formatting instructions.

### ❌ Mistake #4: No Clear Prioritization
**Problem:** All objectives treated equally without priority order.

**Why it fails:**
- Agent doesn't know what to do first when multiple goals conflict
- Critical actions (like collecting email) may be skipped
- Conversations lack clear direction

**Solution:** Number objectives in priority order, with clear "MUST do first" items.

---

## Natural Speech & TTS Optimization

### Natural Conversational Markers

**Brief affirmations:**
- "Got it"
- "I understand"
- "Okay"
- "Sure"
- "Right"

**Natural fillers:**
- "Let me see"
- "Actually"
- "You know what"
- "Hmm..."
- "Well"

**Thoughtful pauses:**
- "Let me... check that for you"
- "Okay, so... what I'm hearing is..."
- "Right, so... here's what we can do"

### TTS-Optimized Formatting

**Email addresses:**
- ❌ "john@example.com"
- ✅ "That's j-o-h-n at example dot com"

**Phone numbers:**
- ❌ "5551234567"
- ✅ "555... 123... 4567"

**Emphasis and pauses:**
- Use ellipses (...) for natural pauses
- Use CAPS sparingly for emphasis
- Use punctuation for rhythm (commas, periods)

**Contractions:**
- ❌ "I will," "you are," "we will"
- ✅ "I'll," "you're," "we'll"

---

## Prompt Structure Best Practices

### Formatting Guidelines

1. **Use labeled sections** with clear headings (Markdown # or ## headings)
2. **Prefer bulleted lists** over dense paragraphs
3. **Use visual separators** (---) between major sections
4. **Highlight critical items** with ✅ ❌ ⚠️ emojis or **bold**
5. **Provide examples** for complex instructions
6. **Number priorities** when order matters (1, 2, 3...)

### Content Guidelines

1. **Be explicit and specific** - Don't assume the agent "knows" anything
2. **Provide decision trees** for complex routing logic
3. **Include example conversations** showing desired behavior
4. **Define all terminology** - Don't use jargon without explanation
5. **Set clear boundaries** - Explicitly state what NOT to do
6. **Give context for each instruction** - Explain the "why" when it matters

---

## Implementation for Novative AI

### Current Prompt Analysis

**File:** `scripts/configure-elevenlabs-agent.ts` → `agentInstructions`

**Strengths:**
- ✅ Clear tool usage instructions
- ✅ Priority guidelines
- ✅ Example conversation
- ✅ When to create tickets

**Missing elements:**
- ❌ No personality definition
- ❌ No environment context
- ❌ No tone guidelines (speaks like documentation, not a person)
- ❌ No clear goal hierarchy
- ❌ No guardrails (what NOT to do)
- ❌ Missing natural speech optimization
- ❌ No conversation opening/closing scripts
- ❌ Doesn't emphasize email collection as PRIMARY goal

### New Prompt Design

**File:** `system-prompt.txt`

**Implemented all 6 building blocks:**

#### 1. Personality ✅
- Name: "Nova"
- Traits: Professional yet friendly, patient, proactive, detail-oriented, empathetic
- Role: First point of contact for Novative AI support
- Domain: AI solutions, software development, integrations, maintenance

#### 2. Environment ✅
- Medium: Voice call
- Customer context: May be stressed, multitasking, experiencing issues
- Environmental factors: Background noise, connection issues
- Business context: Novative AI services

#### 3. Tone ✅
- Natural conversational markers: "Got it," "Actually," "Let me see"
- Contractions: "I'll," "you're," "we'll"
- TTS optimization: Spell out emails, break phone numbers
- Warm and reassuring: Acknowledge frustration, show urgency

#### 4. Goal ✅
- **Priority 1:** COLLECT EMAIL FIRST (emphasized multiple times)
- Priority 2: Understand issue completely
- Priority 3: Resolve simple issues immediately
- Priority 4: Create tickets with correct routing
- Priority 5: Ensure satisfaction and set expectations

#### 5. Guardrails ✅
- **MUST do:** Ask for email first, create tickets for technical issues, route correctly, be empathetic
- **MUST NOT do:** Make specific resolution promises, share sensitive info, discuss pricing without context, create duplicates, ask for email twice
- **Escalation triggers:** Production down, data loss, security issues, payment failures

#### 6. Tools ✅
- Tool name: `create_zoho_ticket`
- When to use: Technical issues, bugs, feature requests, complex issues
- Department routing: 3 departments with IDs and decision logic
- Priority guidelines: High/Medium/Low with response times
- Required parameters: subject, description
- Optional parameters: email, firstName, lastName, phone, priority, departmentId
- Complete example conversation with actual tool call

### Key Improvements

1. **Email Collection Priority**
   - Moved to Goal #1 (was buried in old prompt)
   - Emphasized in guardrails
   - Included in conversation opening script
   - Explicitly stated: "NEVER ask for email twice"

2. **Natural Speech Patterns**
   - Added conversational markers and fillers
   - Included TTS optimization instructions
   - Provided natural dialogue examples
   - Added conversation opening/closing scripts

3. **Department Routing Enhancement**
   - Integrated department IDs from `support-agent-guide.txt`
   - Provided clear decision logic with examples
   - Explained the "why" behind each department choice

4. **Personality & Brand Voice**
   - Created "Nova" as agent persona
   - Defined character traits aligned with brand
   - Set tone expectations (professional but warm)
   - Added empathy and emotional intelligence instructions

5. **Clear Boundaries**
   - Explicit list of prohibited actions
   - Escalation triggers clearly defined
   - Privacy and security guidelines included
   - Scope limitations established

---

## Prompt Length & Token Considerations

**Old prompt:** ~1,200 characters (~300 tokens)
**New prompt:** ~11,000 characters (~2,750 tokens)

**Justification for length:**
- Comprehensive structure prevents ambiguity
- Examples reduce hallucination and improve accuracy
- ElevenLabs recommendation: Be explicit, provide examples
- One-time cost (prompt is static, not per-turn)
- Prevents costly mistakes (wrong department routing, missed emails)

**Cost-benefit analysis:**
- Additional ~2,450 tokens per session start
- At typical rates: ~$0.01 per session
- Prevents support ticket routing errors (high cost in customer satisfaction)
- Reduces need for human intervention (high cost in time)
- **Result:** ROI positive

---

## Testing Recommendations

### Test Scenarios

1. **Email Collection Priority**
   - ✅ Agent asks for email BEFORE helping with issue
   - ✅ Agent uses saved email when creating ticket (doesn't ask twice)

2. **Department Routing Accuracy**
   - ✅ Bug report → After-sales Maintenance (1214071000000390035)
   - ✅ Feature request → Production (1214071000000402481)
   - ✅ General inquiry → NovativeAI (1214071000000006907)

3. **Priority Assessment**
   - ✅ "System is down" → High priority
   - ✅ "Feature not working but has workaround" → Medium
   - ✅ "General question" → Low

4. **Natural Conversation Flow**
   - ✅ Uses brief affirmations ("Got it")
   - ✅ Uses contractions ("I'll help")
   - ✅ Includes natural pauses ("Let me... check that")
   - ✅ Spells out emails correctly

5. **Guardrails Adherence**
   - ✅ Doesn't promise specific resolution times (only response times)
   - ✅ Doesn't share sensitive information
   - ✅ Escalates appropriately for critical issues

### Metrics to Track

- **Email collection rate:** % of conversations where email is collected
- **Email collection timing:** Average position in conversation (should be 1-2)
- **Duplicate email asks:** Count of times agent asks for email twice (should be 0)
- **Department routing accuracy:** % correctly routed to intended department
- **Priority accuracy:** % of High/Medium/Low assignments that match human judgment
- **Natural speech score:** User feedback on conversation naturalness
- **Ticket creation accuracy:** % of tickets with complete information

---

## Migration Plan

### Current State
- System prompt embedded in agent configuration via ElevenLabs dashboard or API
- Instructions appended via `configure-elevenlabs-agent.ts` script
- RAG knowledge base contains `support-agent-guide.txt`

### Recommended Approach

**Option 1: Replace Entire System Prompt** (Recommended)
1. Copy contents of `system-prompt.txt`
2. Go to ElevenLabs dashboard → Agent → System Prompt
3. Replace existing prompt entirely with new prompt
4. Test thoroughly with all scenarios
5. Monitor first 50-100 conversations for issues

**Option 2: Gradual Migration**
1. Keep existing tool instructions
2. Add Personality + Environment + Tone sections first
3. Test for natural speech improvements
4. Add Goal + Guardrails sections
5. Test for email collection and boundaries
6. Finally integrate Tools section
7. Test end-to-end

**Option 3: A/B Testing** (if ElevenLabs supports multiple agent versions)
1. Create Agent A with old prompt
2. Create Agent B with new prompt
3. Split traffic 50/50
4. Compare metrics after 100 conversations each
5. Choose winner based on data

### Rollback Plan

If issues arise:
1. Old prompt saved in `scripts/configure-elevenlabs-agent.ts` → `agentInstructions`
2. Can revert via ElevenLabs dashboard or API call
3. RAG knowledge base unchanged (`support-agent-guide.txt`)
4. Monitor error logs and user feedback

---

## Next Steps

1. ✅ **Review new prompt** - `system-prompt.txt`
2. ⏳ **Upload to ElevenLabs** - Replace current system prompt in agent configuration
3. ⏳ **Test all scenarios** - Use test script or manual testing
4. ⏳ **Monitor initial conversations** - Check logs for issues
5. ⏳ **Collect feedback** - User satisfaction scores, ticket accuracy
6. ⏳ **Iterate based on data** - Refine prompt based on real-world performance

---

## Resources

- **New System Prompt:** `system-prompt.txt`
- **Old Prompt Reference:** `scripts/configure-elevenlabs-agent.ts` (lines 98-155)
- **Knowledge Base:** `knowledge-base/support-agent-guide.txt` (for RAG context)
- **Tool Configuration:** `elevenlabs-tool-config.json`
- **Integration Guide:** `ELEVENLABS_INTEGRATION.md`

---

## Conclusion

The new system prompt follows ElevenLabs 2025 best practices by implementing all 6 building blocks (Personality, Environment, Tone, Goal, Guardrails, Tools) with:

- ✅ Clear personality and brand voice
- ✅ Natural, TTS-optimized speech patterns
- ✅ Explicit goal hierarchy with email collection as Priority #1
- ✅ Comprehensive guardrails preventing common mistakes
- ✅ Detailed tool usage instructions with department routing logic
- ✅ Example conversations showing desired behavior
- ✅ Clear opening and closing scripts

This comprehensive structure should result in:
- Higher email collection rates
- More accurate department routing
- More natural conversations
- Better customer satisfaction
- Fewer support tickets requiring manual routing

**Recommendation:** Proceed with migration using Option 1 (full replacement) with close monitoring of first 50-100 conversations.

---

**Document prepared by:** Claude Code
**Date:** November 12, 2025
**Status:** Ready for implementation
