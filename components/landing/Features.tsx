'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Shield, MessageSquare, TrendingUp, Globe } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'

const features = [
  {
    icon: Brain,
    title: 'Advanced RAG',
    description: 'Retrieval-Augmented Generation for accurate, context-aware responses from your knowledge base.',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Lightning-fast response times with WebSocket streaming for natural conversations.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with GDPR, SOC 2, and HIPAA standards.',
  },
  {
    icon: MessageSquare,
    title: 'Natural Dialogue',
    description: 'Human-like conversations with emotion detection and context preservation.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights into conversation quality, sentiment, and performance metrics.',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Communicate in 29+ languages with native pronunciation and cultural awareness.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-h1 text-text-primary mb-4">
            Powerful Features
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Everything you need to deliver exceptional voice-powered customer experiences
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassCard hover intensity="medium" className="p-8 h-full">
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-h4 text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body text-text-secondary flex-grow">
                    {feature.description}
                  </p>

                  {/* Hover Indicator */}
                  <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
