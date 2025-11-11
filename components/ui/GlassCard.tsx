import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  intensity?: 'light' | 'medium' | 'strong'
}

export function GlassCard({ 
  children, 
  className = '', 
  hover = false,
  intensity = 'medium'
}: GlassCardProps) {
  const intensityStyles = {
    light: 'bg-surface/5 backdrop-blur-sm border-surface-light/10',
    medium: 'bg-surface/10 backdrop-blur-lg border-surface-light/20',
    strong: 'bg-surface/30 backdrop-blur-xl border-surface-light/30',
  }
  
  const baseStyles = `rounded-xl border transition-all duration-300 ${intensityStyles[intensity]}`
  const hoverStyles = hover ? 'hover:transform hover:scale-[1.02] hover:shadow-xl' : ''
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  )
}
