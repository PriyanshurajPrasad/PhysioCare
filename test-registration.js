const { spawn } = require('child_process');
const http = require('http');

// Test data
const testData = {
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
    const response = await makeRequest(options, testData);
    
    console.log('📊 Registration Response:');
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 201) {
      console.log('✅ Registration successful!');
      console.log('📝 Admin created in MongoDB "admins" collection');
      console.log('🔑 Token generated:', !!response.data.token);
    } else {
      console.log('❌ Registration failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test login
async function testLogin() {
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

  const loginData = {
    email: testData.email,
    password: testData.password
  };

  try {
    const response = await makeRequest(options, loginData);
    
    console.log('📊 Login Response:');
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('✅ Login successful!');
      console.log('🔑 Token generated:', !!response.data.token);
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Admin Registration Tests\n');
  console.log('📝 Test Data:', JSON.stringify(testData, null, 2));
  console.log('=' .repeat(50));

  await testRegistration();
  await testLogin();

  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Tests completed!');
  console.log('📋 Check MongoDB Compass for new admin in "admins" collection');
  console.log('🔍 Verify passwordHash field is present and properly hashed');
}

runTests();
