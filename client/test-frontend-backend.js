// Test script to verify frontend-backend connection
// Run this in browser console on http://localhost:5175

async function testFrontendBackend() {
  console.log('🧪 Testing Frontend-Backend Connection\n');
  
  try {
    // Test 1: Register new admin
    console.log('📝 Test 1: Register Admin');
    const registerResponse = await fetch('http://localhost:4500/api/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Frontend Test Admin',
        email: 'frontend@test.com',
        password: '123456',
        confirmPassword: '123456'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ Register Response:', {
      status: registerResponse.status,
      data: registerData
    });

    // Test 2: Login with same credentials
    console.log('\n🔐 Test 2: Login Admin');
    const loginResponse = await fetch('http://localhost:4500/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'frontend@test.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login Response:', {
      status: loginResponse.status,
      data: loginData
    });

    // Test 3: Test protected route with token
    if (loginData.token) {
      console.log('\n🛡️ Test 3: Protected Route');
      const protectedResponse = await fetch('http://localhost:4500/api/admin/auth/me', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      const protectedData = await protectedResponse.json();
      console.log('✅ Protected Route Response:', {
        status: protectedResponse.status,
        data: protectedData
      });
    }

  } catch (error) {
    console.error('❌ Test Failed:', error);
  }
}

// Auto-run the test
testFrontendBackend();
