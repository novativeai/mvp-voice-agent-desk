'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'
import { useConversation } from '@elevenlabs/react'
import { AudioVisualizer } from './AudioVisualizer'
import { ChatHistory, Message } from './ChatHistory'
import { VoiceControls } from './VoiceControls'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface VoiceChatProps {
  agentId?: string
}

// ElevenLabs types
interface ElevenLabsMessage {
  type?: string
  source?: string
  message?: string
  text?: string
  [key: string]: unknown
}

interface ElevenLabsMode {
  mode?: 'speaking' | 'listening'
  [key: string]: unknown
}

interface ElevenLabsStatus {
  status?: string
  [key: string]: unknown
}

interface ElevenLabsErrorContext {
  [key: string]: unknown
}

// Zoho Desk types
interface ZohoDeskDebugData {
  organization: {
    id?: string
    companyName?: string
    accountName?: string
    error?: string
  }
  departments: Array<{
    id: string
    name: string
    description?: string
  }>
  agents: Array<{
    id: string
    name: string
    email: string
    roleId?: string
    photoURL?: string
  }>
  contacts: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }>
  recentTickets: Array<{
    id: string
    ticketNumber: string
    subject: string
    status: string
    priority: string
    createdTime?: string
    modifiedTime?: string
  }>
}

export function VoiceChat({ agentId }: VoiceChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const [customStatus, setCustomStatus] = useState<ConnectionStatus>('disconnected')
  const [currentMode, setCurrentMode] = useState<'speaking' | 'listening' | null>(null)
  const [micActive, setMicActive] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [textInput, setTextInput] = useState('')
  const hasAttemptedConnection = React.useRef(false)

  // Zoho Desk state
  const [zohoDeskData, setZohoDeskData] = useState<ZohoDeskDebugData | null>(null)
  const [zohoDeskLoading, setZohoDeskLoading] = useState(true)
  const [zohoDeskError, setZohoDeskError] = useState<string | null>(null)

  // Use the official ElevenLabs React hook
  const conversation = useConversation({
    onConnect: () => {
      console.log('[ElevenLabs] ✅ Connected successfully')
      setCustomStatus('connected')
      setError(null)
      setDebugInfo(prev => [...prev, '✅ Connected - microphone should be active'])
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] ⛔ Disconnected')
      console.trace('[ElevenLabs] Disconnect stack trace:')
      setCustomStatus('disconnected')
      setDebugInfo(prev => [...prev, '⛔ DISCONNECTED - WebRTC connection lost'])
    },
    onError: (message: string, context?: ElevenLabsErrorContext) => {
      console.error('[ElevenLabs] ❌ Error:', message, context)
      setError(message)
      setCustomStatus('error')
    },
    onMessage: (message: ElevenLabsMessage) => {
      // Log ALL messages with full details
      console.log('[ElevenLabs] 📩 RAW MESSAGE:', JSON.stringify(message, null, 2))
      console.log('[ElevenLabs] 📩 Message type:', message.type, 'source:', message.source)

      // Handle different message types
      const messageType = message.type || message.source
      const messageText = message.message || message.text || String(message)

      setDebugInfo(prev => [...prev, `📩 ${messageType}: ${messageText.substring(0, 50)}`])

      if (messageType === 'user_transcript' || messageType === 'user') {
        console.log('[ElevenLabs] 🎤🎤🎤 USER VOICE DETECTED! Text:', messageText)
        setDebugInfo(prev => [...prev, `🎤 YOU SAID: ${messageText}`])
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
          },
        ])
      } else if (messageType === 'agent_response' || messageType === 'agent' || messageType === 'ai') {
        console.log('[ElevenLabs] 🤖 Agent said:', messageText)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: messageText,
            timestamp: new Date(),
          },
        ])
      } else {
        console.log('[ElevenLabs] ⚠️ Unknown message type:', messageType, 'Full message:', message)
      }
    },
    onModeChange: (mode: ElevenLabsMode | 'speaking' | 'listening') => {
      console.log('[ElevenLabs] 🔄 Mode changed:', mode)
      const modeValue = typeof mode === 'string' ? mode : mode.mode
      setCurrentMode(modeValue || null)
      console.log('[ElevenLabs] 🎙️ Current mode:', modeValue)
      setDebugInfo(prev => [...prev, `🔄 Mode: ${modeValue}`])

      // Monitor if we're actually in listening mode
      if (modeValue === 'listening') {
        setMicActive(true)
        console.log('[ElevenLabs] 👂 Now listening for voice input...')
      } else {
        setMicActive(false)
      }
    },
    onStatusChange: (status: ElevenLabsStatus | string) => {
      console.log('[ElevenLabs] 📊 Status changed:', status)

      // Extract the actual status value
      const statusValue = typeof status === 'string' ? status : status?.status

      // Only log significant status changes (not intermediate WebRTC negotiation states)
      if (statusValue === 'connected' || statusValue === 'connecting' || statusValue === 'error') {
        setDebugInfo(prev => [...prev, `📊 Status: ${statusValue}`])
      } else if (statusValue === 'disconnected' && customStatus === 'connected') {
        // Only log disconnect if we were previously connected
        console.error('[ElevenLabs] ⚠️ UNEXPECTED DISCONNECT!')
        setDebugInfo(prev => [...prev, '⚠️ Session ended unexpectedly'])
      }
    },
  })

  const handleDisconnect = useCallback(async () => {
    try {
      await conversation.endSession()
      setMessages([])
      setCurrentMode(null)
      hasAttemptedConnection.current = false // Allow reconnection after manual disconnect
    } catch (err) {
      console.error('Failed to disconnect:', err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleToggleMute = () => {
    // The SDK handles microphone muting automatically based on mode
    // We'll use this for manual mute if needed in the future
    console.log('[ElevenLabs] Manual mute requested (not implemented - SDK handles this)')
  }

  const handleToggleSpeaker = () => {
    // Volume control if needed
    console.log('[ElevenLabs] Speaker toggle requested (not implemented - SDK handles audio)')
  }

  const handleSendText = () => {
    if (!textInput.trim()) return

    console.log('[ElevenLabs] 📝 Sending manual text:', textInput)
    console.log('[ElevenLabs] 📝 Conversation status before send:', conversation.status)
    setDebugInfo(prev => [...prev, `📝 Sending text: ${textInput}`])

    try {
      // Send text message to agent
      conversation.sendUserMessage(textInput)
      console.log('[ElevenLabs] ✅ Message sent successfully')
      setDebugInfo(prev => [...prev, `✅ Message sent`])
    } catch (err) {
      console.error('[ElevenLabs] ❌ Failed to send message:', err)
      setDebugInfo(prev => [...prev, `❌ Send failed: ${err}`])
    }

    setTextInput('')
  }

  // Auto-connect on mount with proper cleanup
  React.useEffect(() => {
    let isMounted = true

    const connect = async () => {
      // Prevent duplicate connections
      if (!isMounted || hasAttemptedConnection.current) return

      hasAttemptedConnection.current = true

      try {
        setCustomStatus('connecting')
        setError(null)

        // Get agent ID
        const currentAgentId = agentId || process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
        if (!currentAgentId) {
          throw new Error('Agent ID not configured')
        }

        console.log('[ElevenLabs] 🚀 Starting session with agentId:', currentAgentId)
        console.log('[ElevenLabs] 🔍 Browser info:', navigator.userAgent)

        // Detect browser
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        const isChrome = /chrome|chromium|crios/i.test(navigator.userAgent) && !/edg/i.test(navigator.userAgent)

        console.log('[ElevenLabs] 🌐 Browser detected - Safari:', isSafari, 'Chrome:', isChrome)

        if (isSafari) {
          console.warn('[ElevenLabs] ⚠️ Safari detected - WebRTC voice input may not work properly!')
          setDebugInfo(prev => [...prev, '⚠️ Safari detected - use Chrome for best results'])
        }

        // Check microphone permission state
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          console.log('[ElevenLabs] 🎤 Microphone permission state:', permissionStatus.state)
          setDebugInfo(prev => [...prev, `🎤 Mic permission: ${permissionStatus.state}`])

          if (permissionStatus.state === 'denied') {
            console.error('[ElevenLabs] ❌ Microphone permission DENIED at system level!')
            setDebugInfo(prev => [...prev, '❌ ERROR: Microphone blocked by system'])
            setDebugInfo(prev => [...prev, '⚠️ Go to System Settings → Privacy → Microphone'])
          }
        } catch (permError) {
          console.warn('[ElevenLabs] Could not query microphone permission:', permError)
        }

        setDebugInfo(prev => [...prev, `🚀 Starting with agent: ${currentAgentId}`])

        // Start conversation with WebRTC (NOT WebSocket)
        const startConfig = {
          agentId: currentAgentId,
          connectionType: 'webrtc' as const, // CRITICAL: Must use WebRTC, WebSocket crashes
        }

        console.log('[ElevenLabs] 📋 Start config:', startConfig)

        const sessionId = await conversation.startSession(startConfig)

        console.log('[ElevenLabs] ✅ Session started. ID:', sessionId)
        console.log('[ElevenLabs] 🔍 Conversation status:', conversation.status)
        console.log('[ElevenLabs] 🔍 Is speaking?:', conversation.isSpeaking)
        setDebugInfo(prev => [...prev, `✅ Session ID: ${sessionId || 'N/A'}`])
        setDebugInfo(prev => [...prev, `📊 Status: ${conversation.status}`])
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to connect:', err)
        setCustomStatus('error')
        setError(err instanceof Error ? err.message : 'Failed to connect')
        hasAttemptedConnection.current = false // Allow retry on error
      }
    }

    connect()

    // Cleanup function
    return () => {
      isMounted = false
      // Note: We don't call endSession here to avoid disconnecting on hot reload
      // The conversation.endSession will be called explicitly by the user via handleDisconnect
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount

  // Fetch Zoho Desk data on mount
  React.useEffect(() => {
    const fetchZohoDeskData = async () => {
      try {
        setZohoDeskLoading(true)
        setZohoDeskError(null)

        const response = await fetch('/api/zoho-desk')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch Zoho Desk data')
        }

        console.log('[Zoho Desk] Data fetched successfully:', result)
        setZohoDeskData(result.data)
      } catch (err) {
        console.error('[Zoho Desk] Failed to fetch data:', err)
        setZohoDeskError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setZohoDeskLoading(false)
      }
    }

    fetchZohoDeskData()
  }, [])

  const getStatusIndicator = () => {
    switch (customStatus) {
      case 'connecting':
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Connecting...</span>
          </div>
        )
      case 'connected':
        return (
          <div className="flex items-center gap-2 text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm">Connected</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Connection Error</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-surface-light/20 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-h3 text-text-primary">Voice Chat</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              AI-powered conversation
            </p>
          </div>
          {getStatusIndicator()}
        </div>
      </div>

      {/* Zoho Desk Debug Panel */}
      <div className="flex-shrink-0 border-b border-surface-light/20 px-6 py-4 bg-blue-950/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-lg text-text-primary mb-3 flex items-center gap-2">
            🎫 Zoho Desk Integration Status
            <button
              onClick={() => {
                setZohoDeskLoading(true)
                fetch('/api/zoho-desk')
                  .then(res => res.json())
                  .then(result => {
                    setZohoDeskData(result.data)
                    setZohoDeskError(null)
                  })
                  .catch(err => setZohoDeskError(err.message))
                  .finally(() => setZohoDeskLoading(false))
              }}
              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Refresh
            </button>
          </h2>

          {zohoDeskLoading && (
            <div className="flex items-center gap-2 text-yellow-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading Zoho Desk data...</span>
            </div>
          )}

          {zohoDeskError && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">
                <strong>Error:</strong> {zohoDeskError}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Make sure ZOHO_DESK_ORG_ID and ZOHO_DESK_ACCESS_TOKEN are set in .env.local
              </p>
            </div>
          )}

          {!zohoDeskLoading && !zohoDeskError && zohoDeskData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Organization Info */}
              <div className="p-4 bg-surface-light/10 rounded-lg border border-surface-light/20">
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  📊 Organization
                </h3>
                {zohoDeskData.organization?.error ? (
                  <p className="text-xs text-red-400">{zohoDeskData.organization.error}</p>
                ) : (
                  <div className="text-xs text-text-secondary space-y-1">
                    <p><strong>Name:</strong> {zohoDeskData.organization?.companyName || 'N/A'}</p>
                    <p><strong>ID:</strong> {zohoDeskData.organization?.id || 'N/A'}</p>
                  </div>
                )}
              </div>

              {/* Departments */}
              <div className="p-4 bg-surface-light/10 rounded-lg border border-surface-light/20">
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  🏢 Departments ({zohoDeskData.departments?.length || 0})
                </h3>
                <div className="text-xs text-text-secondary space-y-1 max-h-32 overflow-y-auto">
                  {zohoDeskData.departments?.length > 0 ? (
                    zohoDeskData.departments.map((dept) => (
                      <p key={dept.id}>• {dept.name} (ID: {dept.id})</p>
                    ))
                  ) : (
                    <p className="text-gray-500">No departments found</p>
                  )}
                </div>
              </div>

              {/* Agents */}
              <div className="p-4 bg-surface-light/10 rounded-lg border border-surface-light/20">
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  👥 Agents ({zohoDeskData.agents?.length || 0})
                </h3>
                <div className="text-xs text-text-secondary space-y-1 max-h-32 overflow-y-auto">
                  {zohoDeskData.agents?.length > 0 ? (
                    zohoDeskData.agents.map((agent) => (
                      <p key={agent.id}>• {agent.name} - {agent.email}</p>
                    ))
                  ) : (
                    <p className="text-gray-500">No agents found</p>
                  )}
                </div>
              </div>

              {/* Contacts */}
              <div className="p-4 bg-surface-light/10 rounded-lg border border-surface-light/20">
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  📇 Recent Contacts ({zohoDeskData.contacts?.length || 0})
                </h3>
                <div className="text-xs text-text-secondary space-y-1 max-h-32 overflow-y-auto">
                  {zohoDeskData.contacts?.length > 0 ? (
                    zohoDeskData.contacts.map((contact) => (
                      <p key={contact.id}>
                        • {contact.firstName} {contact.lastName} - {contact.email}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No contacts found</p>
                  )}
                </div>
              </div>

              {/* Recent Tickets */}
              <div className="p-4 bg-surface-light/10 rounded-lg border border-surface-light/20 md:col-span-2">
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  🎫 Recent Tickets ({zohoDeskData.recentTickets?.length || 0})
                </h3>
                <div className="text-xs text-text-secondary space-y-2 max-h-32 overflow-y-auto">
                  {zohoDeskData.recentTickets?.length > 0 ? (
                    zohoDeskData.recentTickets.map((ticket) => (
                      <div key={ticket.id} className="border-l-2 border-blue-500 pl-2">
                        <p><strong>#{ticket.ticketNumber}:</strong> {ticket.subject}</p>
                        <p className="text-gray-500">
                          Status: {ticket.status} | Priority: {ticket.priority}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No tickets found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        {/* Audio Visualizer */}
        <div className="flex-shrink-0 px-6 pt-6">
          <AudioVisualizer
            isActive={customStatus === 'connected' && currentMode === 'listening'}
            audioLevel={0}
          />
          {/* Mode Indicator */}
          {customStatus === 'connected' && (
            <div className="text-center mt-2">
              <p className="text-body-sm text-text-secondary">
                {currentMode === 'speaking' && '🤖 AI is speaking...'}
                {currentMode === 'listening' && (
                  <span className="flex items-center justify-center gap-2">
                    <span>🎤 Listening to you...</span>
                    {micActive && <span className="text-green-500 animate-pulse">● MIC ACTIVE</span>}
                    <span className="text-xs text-gray-500">(Speak now)</span>
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Debug Panel */}
          {debugInfo.length > 0 && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-xs font-bold text-gray-400 mb-2">Debug Log:</h3>
              <div className="text-xs text-gray-300 space-y-1 max-h-48 overflow-y-auto font-mono">
                {debugInfo.map((info, i) => (
                  <div key={i}>{info}</div>
                ))}
              </div>
              <button
                onClick={() => setDebugInfo([])}
                className="mt-2 text-xs text-gray-500 hover:text-gray-300"
              >
                Clear Log
              </button>
            </div>
          )}
        </div>

        {/* Chat History */}
        <ChatHistory messages={messages} />

        {/* Manual Text Input (Fallback for testing) */}
        {customStatus === 'connected' && (
          <div className="flex-shrink-0 px-6 pb-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="Type message (fallback if voice doesn't work)..."
                  className="flex-1 px-4 py-2 bg-surface-light/20 border border-surface-light/30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
                />
                <button
                  onClick={handleSendText}
                  disabled={!textInput.trim()}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-text-secondary mt-1 text-center">
                Testing: Use this to check if agent responds to text
              </p>
            </div>
          </div>
        )}

        {/* Voice Controls */}
        <div className="flex-shrink-0">
          <VoiceControls
            isConnected={customStatus === 'connected'}
            isMuted={false}
            isSpeakerMuted={false}
            onToggleMute={handleToggleMute}
            onToggleSpeaker={handleToggleSpeaker}
            onEndCall={handleDisconnect}
          />
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="glass-strong px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-body-sm text-text-primary">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
