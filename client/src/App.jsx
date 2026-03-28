import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import TestPage from './pages/TestPage';
import RegistrationTest from './pages/RegistrationTest';

// Public pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Reviews from './pages/public/Reviews';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegisterAccessDenied from './pages/admin/AdminRegisterAccessDenied';
import Dashboard from './pages/admin/Dashboard';
import Appointments from './pages/admin/Appointments';
import Messages from './pages/admin/Messages';
import AdminServices from './pages/admin/Services';
import Testimonials from './pages/admin/Testimonials';
import Profile from './pages/admin/Profile';

// User pages
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with PublicLayout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* User Auth Routes (standalone, no layout) */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />

          {/* User Routes - redirect /user to /user/login */}
          <Route path="/user" element={<Navigate to="/user/login" replace />} />

          {/* Protected User Routes */}
          <Route path="/user" element={
            <UserProtectedRoute>
              {/* User dashboard and other user pages will go here */}
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">User Dashboard</h1>
                  <p className="text-gray-600">User panel coming soon...</p>
                </div>
              </div>
            </UserProtectedRoute>
          }>
            <Route path="dashboard" element={<div>User Dashboard</div>} />
          </Route>

          {/* Admin Auth Routes (standalone, no layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegisterAccessDenied />} />

          {/* Admin Routes - redirect /admin to /admin/login */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

          {/* Protected Admin Routes with AdminLayout */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="messages" element={<Messages />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Test Page */}
          <Route path="/test" element={<TestPage />} />
          <Route path="/test-registration" element={<RegistrationTest />} />

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
