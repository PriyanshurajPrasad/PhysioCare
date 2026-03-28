import React, { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings, Menu, ChevronDown } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const AdminTopbar = ({ onMenuClick, sidebarCollapsed }) => {
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const getAdminUser = () => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const adminUser = getAdminUser();

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/admin/dashboard': 'Dashboard',
      '/admin/appointments': 'Appointments',
      '/admin/messages': 'Messages',
      '/admin/services': 'Services',
      '/admin/testimonials': 'Testimonials',
      '/admin/profile': 'Profile'
    };
    return titles[path] || 'Admin Panel';
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left side - Menu button and page title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Page title */}
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Center - Search bar (hidden on small mobile) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications (hidden on small mobile) */}
            <button className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="User menu"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
                {/* Username (hidden on mobile) */}
                <span className="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-20">
                  {adminUser?.name || 'Admin'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown menu */}
              {showProfileDropdown && (
                <div className="profile-dropdown absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {adminUser?.name || 'Admin User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {adminUser?.email || 'admin@example.com'}
                      </p>
                    </div>
                    <Link
                      to="/admin/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar;
