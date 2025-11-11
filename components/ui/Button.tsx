'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light shadow-lg hover:shadow-glow',
    secondary: 'bg-surface text-text-primary hover:bg-surface-light border border-surface-light',
    glass: 'glass text-text-primary hover:bg-surface-light/20',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </button>
  )
}
