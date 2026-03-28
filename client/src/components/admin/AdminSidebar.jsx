import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Package, 
  Star, 
  User,
  LogOut,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { adminAuthService, tokenManager } from '../../services/adminAuthService';

const AdminSidebar = ({ isOpen, isCollapsed, onClose, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getAdminUser = () => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const adminUser = getAdminUser();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      description: 'Overview and statistics'
    },
    {
      title: 'Appointments',
      icon: Calendar,
      path: '/admin/appointments',
      description: 'Manage appointments'
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      path: '/admin/messages',
      description: 'Contact messages'
    },
    {
      title: 'Services',
      icon: Package,
      path: '/admin/services',
      description: 'Manage services'
    },
    {
      title: 'Testimonials',
      icon: Star,
      path: '/admin/testimonials',
      description: 'Patient reviews'
    },
    {
      title: 'Profile',
      icon: User,
      path: '/admin/profile',
      description: 'Account settings'
    }
  ];

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Responsive Sidebar Container */}
      <div className={`
        h-screen flex flex-col bg-white border-r border-gray-200 shadow-sm
        transition-all duration-300 ease-in-out
        ${isMobile ? 'w-64' : ''}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          {/* Logo - Responsive sizing */}
          {!isCollapsed && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">PhysioCare</h1>
                <p className="text-xs sm:text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          
          {/* Collapse toggle - Always visible on mobile/tablet */}
          <button
            onClick={() => {
              if (isMobile) {
                onClose(); // Close sidebar on mobile
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Admin Profile - Responsive */}
        {!isCollapsed && adminUser && (
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {adminUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {adminUser.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {adminUser.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Logo */}
        {isCollapsed && (
          <div className="p-3 sm:p-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        )}

        {/* Navigation - Responsive scrolling */}
        <nav className="flex-1 p-2 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (isMobile) {
                    onClose(); // Close sidebar on mobile navigation
                  }
                }}
                className={`
                  flex items-center px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-2 sm:mr-3'}`} />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{item.title}</p>
                    {!isCollapsed && (
                      <p className="text-xs text-gray-500 hidden sm:block">{item.description}</p>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout - Responsive */}
        {!isCollapsed && (
          <div className="p-3 sm:p-4 border-t border-gray-200 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden text-xs">Out</span>
            </button>
          </div>
        )}

        {/* Collapsed Logout */}
        {isCollapsed && (
          <div className="p-3 sm:p-4 border-t border-gray-200 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 sm:p-2.5 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSidebar;
