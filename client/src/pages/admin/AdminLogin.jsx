import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Heart, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import adminService from '../../services/adminService';
import { tokenManager } from '../../services/adminAuthService';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (tokenManager.isAuthenticated()) {
      console.log('🚀 User already authenticated, redirecting to dashboard');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting admin login');
      const response = await adminService.loginAdmin(formData);
      console.log('✅ Login response received');
      
      if (response.data?.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
        console.log('🔑 Token stored, redirecting to:', from);
        
        // Prevent redirect loop: if redirect target is login, use dashboard instead
        const safeRedirect = from === '/admin/login' || from === '/admin' ? '/admin/dashboard' : from;
        console.log('🎯 Safe redirect target:', safeRedirect);
        
        navigate(safeRedirect, { replace: true });
      } else {
        console.error('❌ Login failed');
        setError(response.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('❌ Login error:', err.response?.data?.message || err.message || 'Login failed. Please try again.');
      
      // Use custom error message if available, otherwise fall back to default
      let errorMessage = err.customMessage || err.response?.data?.message || err.message || 'Login failed. Please try again.';
      
      // Add specific handling for timeout errors
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = 'Login request timed out. This is likely due to server cold start. Please try again in a few seconds.';
      }
      
      console.log('📝 Final error message to display:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Glass Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none"></div>
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 sm:mb-6 shadow-xl ring-4 ring-white/10">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back 👋</h1>
            <p className="text-gray-300 text-base sm:text-lg">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm flex items-center">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-100">Authentication Failed</h3>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm text-base sm:text-lg"
                  placeholder="admin@example.com"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  required
                  className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm text-base sm:text-lg"
                  placeholder="•••••••"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                    <span className="text-base sm:text-lg">Signing in...</span>
                  </>
                ) : (
                  <span className="text-base sm:text-lg">Sign In</span>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 sm:mt-8 relative z-10">
            <p className="text-gray-400 text-sm sm:text-base">
              Don't have an account?{' '}
              <Link 
                to="/admin/register" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 relative group"
              >
                Register here
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
