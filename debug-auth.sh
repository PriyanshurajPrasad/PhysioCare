#!/bin/bash

echo "🧪 COMPREHENSIVE AUTHENTICATION DEBUG"
echo "=================================="

echo ""
echo "📊 Backend Status Check..."
curl -s http://localhost:4500/api/health || echo "❌ Backend not responding on port 4500"

echo ""
echo "📝 Test 1: Direct Backend Registration"
curl -X POST http://localhost:4500/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Debug Admin","email":"debug@test.com","password":"123456","confirmPassword":"123456"}' \
  -w "\nStatus: %{http_code}\nResponse: %{response_code}\n" \
  -s

echo ""
echo "🔐 Test 2: Direct Backend Login"
curl -X POST http://localhost:4500/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"debug@test.com","password":"123456"}' \
  -w "\nStatus: %{http_code}\nResponse: %{response_code}\n" \
  -s

echo ""
echo "🌐 Frontend Status Check..."
curl -s http://localhost:5173 || curl -s http://localhost:5174 || curl -s http://localhost:5175 || echo "❌ Frontend not responding"

echo ""
echo "🔗 Test 3: Frontend Proxy Registration"
curl -X POST http://localhost:5173/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Proxy Admin","email":"proxy@test.com","password":"123456","confirmPassword":"123456"}' \
  -w "\nStatus: %{http_code}\nResponse: %{response_code}\n" \
  -s 2>/dev/null || \
curl -X POST http://localhost:5174/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Proxy Admin","email":"proxy@test.com","password":"123456","confirmPassword":"123456"}' \
  -w "\nStatus: %{http_code}\nResponse: %{response_code}\n" \
  -s 2>/dev/null || \
curl -X POST http://localhost:5175/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Proxy Admin","email":"proxy@test.com","password":"123456","confirmPassword":"123456"}' \
  -w "\nStatus: %{http_code}\nResponse: %{response_code}\n" \
  -s

echo ""
echo "🔍 Test 4: Frontend Proxy Login"
curl -X POST http://localhost:5173/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"proxy@test.com","password":"123456"}' \
  -w "\nStatus: %{http_code}\nResponse: %{response_code}\n" \
  -s 2>/dev/null || \
curl -X POST http://localhost:5174/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"proxy@test.com","password":"123456"}' \
  -w "\nStatus: %{http_code}\nResponse: %{response_code}\n" \
  -s 2>/dev/null || \
curl -X POST http://localhost:5175/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"proxy@test.com","password":"123456"}' \
  -w "\nStatus: %{http_code}\nResponse: %{response_code}\n" \
  -s

echo ""
echo "✅ DEBUG COMPLETE"
