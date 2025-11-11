'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bot } from 'lucide-react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatHistoryProps {
  messages: Message[]
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
    >
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}

            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'glass-strong text-text-primary'
              }`}
            >
              <p className="text-body whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-text-primary" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Bot className="w-16 h-16 text-text-secondary mb-4 opacity-50" />
          <p className="text-body-lg text-text-secondary">
            Start speaking to begin the conversation
          </p>
        </div>
      )}
    </div>
  )
}
