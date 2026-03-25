import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TestPage = () => {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [backendStatus, setBackendStatus] = useState('Unknown');

  useEffect(() => {
    // Test API connectivity
    const testAPI = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setApiStatus('Connected');
        } else {
          setApiStatus('Error');
        }
      } catch (error) {
        setApiStatus('Failed');
        console.error('API Test Error:', error);
      }
    };

    // Test backend directly
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:4500/api/health');
        if (response.ok) {
          setBackendStatus('Running');
        } else {
          setBackendStatus('Error');
        }
      } catch (error) {
        setBackendStatus('Down');
        console.error('Backend Test Error:', error);
      }
    };

    testAPI();
    testBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">System Status Check</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frontend Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Frontend Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">React App:</span>
                <span className="text-green-600 font-medium">✓ Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Router:</span>
                <span className="text-green-600 font-medium">✓ Working</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Proxy:</span>
                <span className={`font-medium ${
                  apiStatus === 'Connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {apiStatus === 'Connected' ? '✓ Connected' : '✗ Failed'}
                </span>
              </div>
            </div>
          </div>

          {/* Backend Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Backend Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Server:</span>
                <span className={`font-medium ${
                  backendStatus === 'Running' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {backendStatus === 'Running' ? '✓ Running' : '✗ Down'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Port:</span>
                <span className="text-gray-900 font-medium">4500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="text-blue-600 font-medium">MongoDB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/login"
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Admin Login
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
            >
              Public Site
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
          <div className="space-y-3 text-gray-700">
            <p>1. Ensure backend is running: <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code> (from backend folder)</p>
            <p>2. Ensure frontend is running: <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code> (from client folder)</p>
            <p>3. Test admin login at: <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:5173/admin/login</code></p>
            <p>4. Check browser console for any errors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
