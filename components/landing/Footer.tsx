'use client'

import React from 'react'
import { Github, Twitter, Linkedin } from 'lucide-react'

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
]

const footerLinks = {
  Product: ['Features', 'Pricing', 'API Docs', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'Compliance'],
}

export function Footer() {
  return (
    <footer className="relative border-t border-surface-light/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-heading text-h4 text-text-primary mb-4">
              AI Voice Agent
            </h3>
            <p className="text-body-sm text-text-secondary mb-6">
              Next-generation voice AI powered by ElevenLabs
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-surface-light/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-text-secondary" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium text-text-primary mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-body-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-light/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-text-secondary">
            © 2025 AI Voice Agent. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-body-sm text-text-secondary">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
