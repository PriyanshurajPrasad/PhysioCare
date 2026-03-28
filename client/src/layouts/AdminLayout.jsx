import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen z-50
        ${sidebarCollapsed ? 'w-20' : 'w-64'} 
        bg-gray-800 border-r border-gray-700
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar 
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <AdminTopbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Page Content */}
        <main className="p-4 bg-gray-100 min-h-screen">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
