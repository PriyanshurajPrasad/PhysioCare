@echo off
echo 🧪 Testing Admin Registration Endpoint
echo.

echo 📝 Test 1: Valid Registration
curl -X POST http://localhost:4500/api/admin/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Test Admin\", \"email\": \"testadmin@example.com\", \"password\": \"test123456\", \"confirmPassword\": \"test123456\"}" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo 📝 Test 2: Duplicate Email (should fail)
curl -X POST http://localhost:4500/api/admin/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Test Admin 2\", \"email\": \"testadmin@example.com\", \"password\": \"test123456\", \"confirmPassword\": \"test123456\"}" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo 📝 Test 3: Login with registered credentials
curl -X POST http://localhost:4500/api/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"testadmin@example.com\", \"password\": \"test123456\"}" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo ✅ Tests completed!
echo 🔍 Check MongoDB "admins" collection for new document
echo 🌐 Test via browser: http://localhost:5173/admin/register
echo.
