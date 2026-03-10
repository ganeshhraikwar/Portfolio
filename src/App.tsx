import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/AdminProjects';
import AdminProfile from './pages/AdminProfile';
import AdminMessages from './pages/AdminMessages';
import AdminReviews from './pages/AdminReviews';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/projects" 
                  element={
                    <ProtectedRoute>
                      <AdminProjects />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/profile" 
                  element={
                    <ProtectedRoute>
                      <AdminProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/messages" 
                  element={
                    <ProtectedRoute>
                      <AdminMessages />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/reviews" 
                  element={
                    <ProtectedRoute>
                      <AdminReviews />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}
