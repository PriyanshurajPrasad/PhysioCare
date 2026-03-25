@echo off
echo 🧪 Testing Admin Login Endpoint
echo ================================

echo.
echo 📝 Test 1: Successful Login
curl -X POST http://localhost:4500/api/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"testadmin@example.com\", \"password\": \"test123456\"}" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo 📝 Test 2: Wrong Password
curl -X POST http://localhost:4500/api/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"testadmin@example.com\", \"password\": \"wrongpassword\"}" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo 📝 Test 3: Admin Not Found
curl -X POST http://localhost:4500/api/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"nonexistent@example.com\", \"password\": \"test123456\"}" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo 📝 Test 4: Missing Fields
curl -X POST http://localhost:4500/api/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"testadmin@example.com\"}" ^
  -w "\nStatus: %%{http_code}\n" ^
  -s

echo.
echo ✅ Login tests completed!
echo.
echo 🔍 Check backend console for detailed logs
echo 🌐 Test via browser: http://localhost:5173/admin/login
echo.
