'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Headphones, Ticket, Users, Brain, Clock, Sparkles } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'

const features = [
  {
    icon: Headphones,
    title: 'Voice Support 24/7',
    description: 'Talk to Nova anytime via voice or text. Get instant answers about Novative AI services, projects, and technical issues.',
  },
  {
    icon: Ticket,
    title: 'Auto Ticket Creation',
    description: 'Complex issues are automatically converted into support tickets in Zoho Desk with all conversation context preserved.',
  },
  {
    icon: Users,
    title: 'Smart Contact Management',
    description: 'Automatic contact lookup and creation. Your information is saved for faster support on future inquiries.',
  },
  {
    icon: Brain,
    title: 'Knowledge Base Search',
    description: 'Nova searches our comprehensive documentation and past solutions to provide accurate, contextual answers instantly.',
  },
  {
    icon: Sparkles,
    title: 'Intelligent Routing',
    description: 'Tickets are automatically routed to the right department - sales, technical support, or development team.',
  },
  {
    icon: Clock,
    title: 'Instant Response',
    description: 'No more waiting in queues. Get immediate assistance with common questions or create tickets for complex issues.',
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
            How Nova Helps You
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Get instant support for all your Novative AI inquiries - from technical questions to project consultations
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
