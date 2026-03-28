import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-collapse sidebar on mobile
      if (width < 1024) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen z-50
        ${sidebarCollapsed ? 'w-16 md:w-20' : 'w-64 md:w-72'} 
        bg-white border-r border-gray-200 shadow-sm
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isMobile ? 'shadow-2xl' : ''}
      `}>
        <AdminSidebar 
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area - Responsive Spacing */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-16 md:ml-20' : 'lg:ml-64 md:ml-72'}
        ${isMobile ? 'ml-0' : ''}
      `}>
        {/* Responsive Topbar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
          <AdminTopbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            isScrolled={isScrolled}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
          />
        </div>

        {/* Page Content - Responsive Padding */}
        <main className="px-3 sm:px-4 md:px-6 py-4 md:py-6 min-h-[calc(100vh-73px)]">
          <div className="max-w-7xl xl:max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
