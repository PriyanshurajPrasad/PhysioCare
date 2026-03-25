#!/bin/bash

echo "🧪 TESTING CORS + API CONNECTIVITY FIXES"
echo "========================================"

echo ""
echo "📊 Step 1: Check Backend Status"
curl -s http://localhost:4500/api/health | jq '.' 2>/dev/null || echo "Backend not responding"

echo ""
echo "🔥 Step 2: Test CORS Preflight (OPTIONS)"
curl -X OPTIONS http://localhost:4500/api/admin/auth/register \
  -H "Origin: http://localhost:5175" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v 2>&1 | grep -E "(< HTTP|< Access-Control|< Origin)" || echo "CORS preflight failed"

echo ""
echo "📝 Step 3: Test Registration via Proxy (Frontend Port 5175)"
curl -X POST http://localhost:5175/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5175" \
  -d '{"name":"CORS Test Admin","email":"cors@test.com","password":"123456","confirmPassword":"123456"}' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "🔐 Step 4: Test Login via Proxy"
curl -X POST http://localhost:5175/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5175" \
  -d '{"email":"cors@test.com","password":"123456"}' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "✅ TESTING COMPLETE"
