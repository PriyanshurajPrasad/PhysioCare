import React, { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Menu button and page title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
            </div>
          </div>

          {/* Right side - Search, notifications, profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {adminUser?.name || 'Admin'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{adminUser?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{adminUser?.email || 'admin@example.com'}</p>
                  </div>
                  <button
                    onClick={() => window.location.href = '/admin/profile'}
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 text-left"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
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
