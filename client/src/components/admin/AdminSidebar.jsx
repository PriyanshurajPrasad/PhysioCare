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
          className="p-2 text-gray-400 hover:text-white rounded transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Admin Profile */}
      {!isCollapsed && adminUser && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {adminUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {adminUser.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {adminUser.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={onClose}
            className={`
              flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200 group
              ${isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }
            `}
            title={isCollapsed ? item.title : ''}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-gray-400 truncate">{item.description}</p>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium
                   text-gray-300 hover:bg-red-600 hover:text-white rounded-lg
                   transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
