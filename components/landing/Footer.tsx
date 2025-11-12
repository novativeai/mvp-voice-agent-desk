'use client'

import React from 'react'
import { Globe, Linkedin, Mail } from 'lucide-react'

const socialLinks = [
  { icon: Globe, href: 'https://novative.ai', label: 'Website' },
  { icon: Linkedin, href: 'https://linkedin.com/company/novative-ai', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contact@novative.ai', label: 'Email' },
]

const footerLinks = {
  Support: [
    { name: 'Talk to Nova', href: '/chat' },
    { name: 'Help Center', href: '/demo' },
  ],
  Services: [
    { name: 'AI Solutions', href: 'https://novative.ai' },
    { name: 'Custom Development', href: 'https://novative.ai' },
  ],
  Contact: [
    { name: 'Email Us', href: 'mailto:contact@novative.ai' },
    { name: 'Visit Website', href: 'https://novative.ai' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-surface-light/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-heading text-h4 text-text-primary mb-4">
              Novative AI
            </h3>
            <p className="text-body-sm text-text-secondary mb-6">
              AI Solutions & Custom Development. Get support from Nova, our intelligent assistant.
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
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-body-sm text-text-secondary hover:text-primary transition-colors"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.name}
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
            © 2025 Novative AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-body-sm text-text-secondary">
            <a href="mailto:contact@novative.ai" className="hover:text-primary transition-colors">
              contact@novative.ai
            </a>
            <a href="https://novative.ai" className="hover:text-primary transition-colors">
              www.novative.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
