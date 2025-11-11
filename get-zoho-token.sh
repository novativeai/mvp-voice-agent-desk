#!/bin/bash

# Zoho Desk OAuth Token Generator
# This script exchanges your authorization code for an access token

echo "🔐 Zoho Desk Token Generator"
echo "================================"
echo ""
echo "Step 1: Open this URL in your browser:"
echo ""
echo "https://accounts.zoho.com/oauth/v2/auth?scope=Desk.tickets.ALL,Desk.contacts.ALL,Desk.basic.READ,Desk.settings.READ,Desk.search.READ&client_id=1000.GNFLOVJOPNE1YZ0Y4SVQ6ZPLHNLYFN&response_type=code&access_type=offline&redirect_uri=http://localhost:3000/oauth/callback&prompt=consent"
echo ""
echo "Step 2: After granting permissions, you'll be redirected to:"
echo "http://localhost:3000/oauth/callback?code=XXXXX"
echo ""
echo "Copy the code value (everything after 'code=')"
echo ""
read -p "Paste your authorization code here: " AUTH_CODE

echo ""
echo "⏳ Exchanging authorization code for access token..."
echo ""

# Make the OAuth token request
RESPONSE=$(curl -s -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "client_id=1000.GNFLOVJOPNE1YZ0Y4SVQ6ZPLHNLYFN" \
  -d "client_secret=a756e38a5c1610c6c3b6e755f739443cdc75350e07" \
  -d "code=${AUTH_CODE}" \
  -d "redirect_uri=http://localhost:3000/oauth/callback" \
  -d "grant_type=authorization_code")

echo "📦 Full Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Extract access token
ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ "$ACCESS_TOKEN" != "null" ] && [ ! -z "$ACCESS_TOKEN" ]; then
  echo "✅ Success! Your access token:"
  echo ""
  echo "$ACCESS_TOKEN"
  echo ""
  echo "📝 Now update your .env.local file:"
  echo "ZOHO_DESK_ACCESS_TOKEN=$ACCESS_TOKEN"
  echo ""

  # Ask if user wants to auto-update .env.local
  read -p "Would you like me to update .env.local automatically? (y/n): " UPDATE_ENV

  if [ "$UPDATE_ENV" = "y" ] || [ "$UPDATE_ENV" = "Y" ]; then
    # Update .env.local
    if [ -f ".env.local" ]; then
      sed -i.backup "s|ZOHO_DESK_ACCESS_TOKEN=.*|ZOHO_DESK_ACCESS_TOKEN=$ACCESS_TOKEN|g" .env.local
      echo "✅ Updated .env.local file!"
      echo "📄 Backup saved as .env.local.backup"
    else
      echo "❌ .env.local file not found in current directory"
    fi
  fi
else
  echo "❌ Error: Could not get access token"
  echo "Response: $RESPONSE"
  echo ""
  echo "Common issues:"
  echo "- Authorization code expired (they expire in 2 minutes)"
  echo "- Code already used (codes can only be used once)"
  echo "- Invalid client credentials"
fi
