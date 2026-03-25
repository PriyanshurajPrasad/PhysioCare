const http = require('http');

// Test data
const testAdmin = {
  name: 'Test Admin',
  email: 'testadmin@example.com',
  password: 'test123456',
  confirmPassword: 'test123456'
};

// Function to make HTTP request
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test registration
async function testRegistration() {
  console.log('🧪 Testing Admin Registration...\n');

  const options = {
    hostname: 'localhost',
    port: 4500,
    path: '/api/admin/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, testAdmin);
    
    console.log('📊 Registration Response:');
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 201) {
      console.log('✅ Registration successful!');
      return true;
    } else {
      console.log('❌ Registration failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
    return false;
  }
}

// Test login
async function testLogin(email = testAdmin.email, password = testAdmin.password) {
  console.log('\n🧪 Testing Admin Login...\n');

  const options = {
    hostname: 'localhost',
    port: 4500,
    path: '/api/admin/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const loginData = { email, password };

  try {
    const response = await makeRequest(options, loginData);
    
    console.log('📊 Login Response:');
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('✅ Login successful!');
      console.log('🔑 Token received:', !!response.data.token);
      console.log('👤 Admin data:', !!response.data.admin);
      return true;
    } else {
      console.log('❌ Login failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    return false;
  }
}

// Run complete test suite
async function runCompleteTest() {
  console.log('🚀 Starting Complete Admin Auth Test Suite');
  console.log('=' .repeat(60));

  // Test 1: Registration
  const registrationSuccess = await testRegistration();

  // Test 2: Login with correct credentials
  const loginSuccess = await testLogin();

  // Test 3: Login with wrong password
  console.log('\n🧪 Testing Login with Wrong Password...\n');
  await testLogin(testAdmin.email, 'wrongpassword');

  // Test 4: Login with non-existent admin
  console.log('\n🧪 Testing Login with Non-existent Admin...\n');
  await testLogin('nonexistent@example.com', testAdmin.password);

  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Test Results:');
  console.log(`✅ Registration: ${registrationSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Login: ${loginSuccess ? 'PASS' : 'FAIL'}`);
  
  if (registrationSuccess && loginSuccess) {
    console.log('\n🎉 All tests passed! Admin auth is working correctly.');
    console.log('📝 You can now test via browser: http://localhost:5173/admin/login');
  } else {
    console.log('\n❌ Some tests failed. Check backend logs for details.');
  }
}

// Run tests
runCompleteTest();
