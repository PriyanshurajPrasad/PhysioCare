@echo off
echo 🧪 Testing Admin Dashboard Authorization
echo ========================================

echo.
echo 📝 Step 1: Login to get token
curl -X POST http://localhost:4500/api/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"testadmin@example.com\", \"password\": \"test123456\"}" ^
  -s | jq -r '.token' > token.txt

echo.
echo 📝 Step 2: Test dashboard without token (should fail)
curl -X GET http://localhost:4500/api/admin/dashboard/stats ^
  -H "Content-Type: application/json" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo 📝 Step 3: Test dashboard with token (should succeed)
set /p token=<token.txt
curl -X GET http://localhost:4500/api/admin/dashboard/stats ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %%token%%" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo 📝 Step 4: Test dashboard with invalid token (should fail)
curl -X GET http://localhost:4500/api/admin/dashboard/stats ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer invalid-token-here" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo ✅ Authorization tests completed!
echo 🔍 Check backend console for detailed logs
echo 🌐 Test via browser: http://localhost:5173/admin/login
echo.

del token.txt
