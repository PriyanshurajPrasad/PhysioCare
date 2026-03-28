import React, { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminTopbar = ({ onMenuClick, isScrolled, sidebarCollapsed, isMobile }) => {
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
    <div className={`
      sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ease-in-out
      ${isScrolled ? 'shadow-lg shadow-gray-900/5' : 'shadow-sm'}
    `}>
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side - Mobile menu button and page title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
            
            {/* Page title - Responsive text */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
                <p className="text-xs sm:text-sm text-gray-500">Welcome back, {adminUser?.name || 'Admin'}</p>
              </div>
            </div>
          </div>

          {/* Right side - Search, notifications, profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search bar - Responsive */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32 sm:w-48 md:w-64 text-sm"
                  aria-label="Search"
                />
              </div>
            </div>

            {/* Notifications - Responsive */}
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile dropdown - Responsive */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Profile menu"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-[120px]">{adminUser?.name || 'Admin'}</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px]">{adminUser?.email || 'admin@example.com'}</p>
                </div>
              </button>

              {/* Dropdown menu - Responsive positioning */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900 truncate">{adminUser?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{adminUser?.email || 'admin@example.com'}</p>
                  </div>
                  <button className="w-full px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                    <span className="sm:hidden text-xs">Profile</span>
                  </button>
                  <button className="w-full px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                    <span className="sm:hidden text-xs">Settings</span>
                  </button>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                      <span className="sm:hidden text-xs">Out</span>
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
