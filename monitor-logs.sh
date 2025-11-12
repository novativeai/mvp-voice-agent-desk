#!/bin/bash

# Vercel Log Monitor Script
# This script fetches real-time logs from your Vercel deployment

PROJECT_NAME="novative-voice-desk"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"

if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN not set"
  echo ""
  echo "To get your Vercel token:"
  echo "1. Go to https://vercel.com/account/tokens"
  echo "2. Create a new token"
  echo "3. Run: export VERCEL_TOKEN='your-token-here'"
  echo ""
  echo "Then run this script again: ./monitor-logs.sh"
  exit 1
fi

echo "🔍 Fetching latest deployment for $PROJECT_NAME..."
echo ""

# Get latest deployment
DEPLOYMENT=$(curl -s \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=$PROJECT_NAME&limit=1" | \
  jq -r '.deployments[0]')

DEPLOYMENT_ID=$(echo "$DEPLOYMENT" | jq -r '.uid')
DEPLOYMENT_URL=$(echo "$DEPLOYMENT" | jq -r '.url')
DEPLOYMENT_STATE=$(echo "$DEPLOYMENT" | jq -r '.readyState')

echo "📦 Latest Deployment:"
echo "   ID: $DEPLOYMENT_ID"
echo "   URL: https://$DEPLOYMENT_URL"
echo "   State: $DEPLOYMENT_STATE"
echo ""

if [ "$DEPLOYMENT_STATE" != "READY" ]; then
  echo "⏳ Deployment is still building..."
  echo "   State: $DEPLOYMENT_STATE"
  exit 0
fi

echo "📊 Fetching function logs for /api/zoho-desk/tickets..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Fetch logs for the tickets API endpoint
curl -s \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v2/deployments/$DEPLOYMENT_ID/events?follow=1&limit=100" | \
  jq -r '.[] | select(.source == "LAMBDA" or .source == "BUILD" or .source == "STATIC") |
    "\(.createdAt) | \(.type) | \(.payload.text // .payload.statusCode // "")"'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Log monitoring complete"
echo ""
echo "💡 To monitor logs in real-time:"
echo "   vercel logs https://$DEPLOYMENT_URL --follow"
