import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminTopbar from '../admin/AdminTopbar';

const AdminLayout = () => {
  console.log('AdminLayout component rendering...');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Debug indicator */}
      <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        ADMIN LAYOUT ACTIVE
      </div>
      
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <AdminTopbar onMenuToggle={handleSidebarToggle} />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}
    </div>
  );
};

export default AdminLayout;
