import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegistrationTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testRegistration = async () => {
    setLoading(true);
    setTestResult('Testing registration...');
    
    try {
      const response = await fetch('/api/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Admin',
          email: 'testadmin@example.com',
          password: 'test123456',
          confirmPassword: 'test123456'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ SUCCESS: ${data.message}\nAdmin created: ${data.data.admin.email}\nToken: ${data.data.token ? 'Generated' : 'Missing'}`);
      } else {
        setTestResult(`❌ ERROR: ${data.message}\n${data.errors ? JSON.stringify(data.errors, null, 2) : ''}`);
      }
    } catch (error) {
      setTestResult(`❌ NETWORK ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Registration Test</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Registration Endpoint</h2>
          <p className="text-gray-600 mb-4">
            This will test the admin registration endpoint with sample data.
          </p>
          
          <button
            onClick={testRegistration}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Registration'}
          </button>
        </div>
        
        {testResult && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Result</h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {testResult}
            </pre>
          </div>
        )}
        
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Manual Test Steps</h2>
          <ol className="space-y-2 text-gray-700">
            <li>1. Visit <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:5173/admin/register</code></li>
            <li>2. Fill form with: Test Admin, testadmin@example.com, test123456</li>
            <li>3. Submit and check if it redirects to dashboard</li>
            <li>4. Check MongoDB "admins" collection for new document</li>
          </ol>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <Link
            to="/admin/register"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            Go to Registration Page
          </Link>
          <Link
            to="/test"
            className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
          >
            Back to Test Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationTest;
