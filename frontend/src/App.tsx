import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Records from './components/Records';
import UserManagement from './components/UserManagement';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Wallet,
  ChevronRight
} from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'analyst', 'viewer'] },
    { name: 'Records', path: '/records', icon: Receipt, roles: ['admin', 'analyst'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FinanceFlow</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {filteredNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center justify-between p-3 rounded-xl transition-all group
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">{user?.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="/" element={
        <ProtectedRoute>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 lg:ml-72 p-6 lg:p-10">
              <div className="max-w-6xl mx-auto">
                <Dashboard />
              </div>
            </main>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/records" element={
        <ProtectedRoute roles={['admin', 'analyst']}>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 lg:ml-72 p-6 lg:p-10">
              <div className="max-w-6xl mx-auto">
                <Records />
              </div>
            </main>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute roles={['admin']}>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 lg:ml-72 p-6 lg:p-10">
              <div className="max-w-6xl mx-auto">
                <UserManagement />
              </div>
            </main>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
