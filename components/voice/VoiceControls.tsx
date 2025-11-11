'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react'
import { Button } from '../ui/Button'

interface VoiceControlsProps {
  isConnected: boolean
  isMuted: boolean
  isSpeakerMuted: boolean
  onToggleMute: () => void
  onToggleSpeaker: () => void
  onEndCall: () => void
}

export function VoiceControls({
  isConnected,
  isMuted,
  isSpeakerMuted,
  onToggleMute,
  onToggleSpeaker,
  onEndCall,
}: VoiceControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-4 p-6"
    >
      {/* Mute/Unmute Microphone */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleMute}
        disabled={!isConnected}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center transition-all
          ${
            isMuted
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
              : 'glass-strong text-primary hover:bg-primary/10'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
      >
        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </motion.button>

      {/* End Call */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEndCall}
        disabled={!isConnected}
        className="
          w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center
          hover:bg-red-600 transition-all shadow-lg hover:shadow-glow
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        aria-label="End call"
      >
        <PhoneOff className="w-7 h-7" />
      </motion.button>

      {/* Mute/Unmute Speaker */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleSpeaker}
        disabled={!isConnected}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center transition-all
          ${
            isSpeakerMuted
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
              : 'glass-strong text-primary hover:bg-primary/10'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
      >
        {isSpeakerMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </motion.button>
    </motion.div>
  )
}
