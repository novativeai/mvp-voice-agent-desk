'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AudioVisualizerProps {
  isActive: boolean
  audioLevel?: number
}

export function AudioVisualizer({ isActive, audioLevel = 0 }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bars = 50
    const barWidth = canvas.width / bars
    const centerY = canvas.height / 2

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth
        
        // Create wave effect
        const time = Date.now() / 1000
        const phase = (i / bars) * Math.PI * 2
        const wave = Math.sin(time * 2 + phase)
        
        // Height based on audio level and wave
        const baseHeight = isActive ? 20 : 5
        const height = baseHeight + (isActive ? wave * 30 * (audioLevel || 0.5) : 0)
        
        // Gradient color
        const gradient = ctx.createLinearGradient(0, centerY - height, 0, centerY + height)
        gradient.addColorStop(0, '#2b61ff')
        gradient.addColorStop(0.5, '#8b5cf6')
        gradient.addColorStop(1, '#2b61ff')

        ctx.fillStyle = gradient
        ctx.fillRect(x, centerY - height / 2, barWidth - 2, height)
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, audioLevel])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full h-32 glass-strong rounded-xl overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={128}
        className="w-full h-full"
      />
      
      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 bg-primary/10 animate-pulse-slow pointer-events-none" />
      )}
    </motion.div>
  )
}
