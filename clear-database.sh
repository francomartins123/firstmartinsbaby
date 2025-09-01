#!/bin/bash
# Clear all data from the baby guessing database

SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc0MDU3MSwiZXhwIjoyMDcyMzE2NTcxfQ.1r9ogiANAuXT8o2xBBHD47W6k9CEBOkwV4vCsGJg57Q"
SUPABASE_URL="https://nldazeppgrqnzxpiicrw.supabase.co"

echo "🧹 Clearing database..."

# Delete all guesses first (to avoid foreign key constraints)
echo "Deleting guesses..."
curl -X DELETE \
  "${SUPABASE_URL}/rest/v1/guesses?id=neq.00000000-0000-0000-0000-000000000000" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -s

# Delete all participants
echo "Deleting participants..."
curl -X DELETE \
  "${SUPABASE_URL}/rest/v1/participants?id=neq.00000000-0000-0000-0000-000000000000" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -s

echo "✅ Database cleared successfully!"