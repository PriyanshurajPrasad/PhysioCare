@echo off
echo 🧪 Testing Admin Registration Endpoint...
echo.

REM Test 1: Valid registration
echo 📝 Test 1: Valid Registration
curl -X POST http://localhost:4500/api/admin/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Test Admin\", \"email\": \"testadmin@example.com\", \"password\": \"test123456\", \"confirmPassword\": \"test123456\"}" ^
  -w "\nStatus: %%{http_code}\nResponse Time: %%{time_total}s\n" ^
  -s

echo.
echo 📝 Test 2: Duplicate Email
curl -X POST http://localhost:4500/api/admin/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Test Admin 2\", \"email\": \"testadmin@example.com\", \"password\": \"test123456\", \"confirmPassword\": \"test123456\"}" ^
  -w "\nStatus: %%{http_code}\nResponse Time: %%{time_total}s\n" ^
  -s

echo.
echo 📝 Test 3: Invalid Email
curl -X POST http://localhost:4500/api/admin/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Test Admin 3\", \"email\": \"invalid-email\", \"password\": \"test123456\", \"confirmPassword\": \"test123456\"}" ^
  -w "\nStatus: %%{http_code}\nResponse Time: %%{time_total}s\n" ^
  -s

echo.
echo 📝 Test 4: Password Mismatch
curl -X POST http://localhost:4500/api/admin/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Test Admin 4\", \"email\": \"testadmin4@example.com\", \"password\": \"test123456\", \"confirmPassword\": \"different123\"}" ^
  -w "\nStatus: %%{http_code}\nResponse Time: %%{time_total}s\n" ^
  -s

echo.
echo ✅ Registration tests completed!
echo.
echo 🔍 Check MongoDB 'admins' collection for new documents:
echo    db.admins.find().pretty()
echo.
