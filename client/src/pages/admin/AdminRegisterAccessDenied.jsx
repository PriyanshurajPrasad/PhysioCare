import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const AdminRegisterAccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Access Denied Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-red-500/20 rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Glass Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl pointer-events-none"></div>
          
          {/* Icon */}
          <div className="flex justify-center mb-6 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-xl ring-4 ring-red-500/20">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center gap-2">
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
              Access Denied
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Users don't have access to register for the admin panel.
            </p>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Admin registration is restricted to authorized personnel only.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 relative z-10">
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-base sm:text-lg">Back to Login</span>
              </div>
            </button>

            <Link
              to="/"
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold backdrop-blur-sm border border-white/20 hover:border-white/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-base sm:text-lg">Go Home</span>
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                If you believe this is an error, please contact the system administrator.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>Protected Area</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterAccessDenied;
