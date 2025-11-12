#!/bin/bash

# Simple Vercel Log Checker using Vercel CLI
# Much simpler than the API approach

echo "🔍 Checking Vercel deployment logs..."
echo ""

# Check if logged in
if ! vercel whoami &>/dev/null; then
  echo "❌ Not logged in to Vercel CLI"
  echo ""
  echo "To login:"
  echo "  vercel login"
  echo ""
  echo "Or use a token:"
  echo "  vercel --token YOUR_TOKEN_HERE"
  exit 1
fi

echo "📦 Getting latest deployment..."
cd "/Users/macbook/Documents/Research & Marketing/mvp-voice-agent-desk"

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --yes 2>/dev/null | grep "https://" | head -1 | awk '{print $2}')

if [ -z "$DEPLOYMENT_URL" ]; then
  echo "❌ No deployments found"
  echo ""
  echo "💡 Your app is deployed at: https://novative-voice-desk.vercel.app"
  echo ""
  echo "To view logs via dashboard:"
  echo "  1. Go to https://vercel.com/novativeai/mvp-voice-agent-desk"
  echo "  2. Click on the latest deployment"
  echo "  3. Go to 'Functions' tab"
  echo "  4. Click on '/api/zoho-desk/tickets'"
  echo "  5. View logs in real-time"
  exit 0
fi

echo "🌐 Deployment: $DEPLOYMENT_URL"
echo ""
echo "📊 Fetching logs (last 100 entries)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

vercel logs "$DEPLOYMENT_URL" --output raw 2>/dev/null | tail -100

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 To follow logs in real-time:"
echo "   vercel logs $DEPLOYMENT_URL --follow"
echo ""
echo "💡 To filter for webhook calls only:"
echo "   vercel logs $DEPLOYMENT_URL --follow | grep -i 'webhook'"
