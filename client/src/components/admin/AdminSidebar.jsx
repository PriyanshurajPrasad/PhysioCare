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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';

const AdminSidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }) => {
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
      description: 'Manage testimonials'
    },
    {
      title: 'Profile',
      icon: User,
      path: '/admin/profile',
      description: 'Account settings'
    }
  ];

  const handleLogout = () => {
    adminAuthService.logoutAdmin();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {/* Logo */}
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">PhysioCare</h1>
              <p className="text-gray-400 text-xs">Admin</p>
            </div>
          </div>
        )}
        
        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white transition-colors duration-200 rounded"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Admin Profile and Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        {/* Admin Profile */}
        {!isCollapsed && (
          <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {adminUser?.name || 'Admin User'}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {adminUser?.email || 'admin@example.com'}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-2 sm:p-4">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center space-x-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center lg:justify-start' : 'justify-start'}
                `}
              >
                <item.icon className={`
                  w-5 h-5 flex-shrink-0
                  ${isCollapsed ? 'lg:w-5 lg:h-5' : 'w-5 h-5'}
                `} />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 truncate">{item.description}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-lg
            bg-red-600 text-white font-medium text-sm
            hover:bg-red-700 transition-colors duration-200
            ${isCollapsed ? 'lg:justify-center' : 'justify-center'}
          `}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
