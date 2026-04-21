import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import Auth
import { Shield, Sparkles, Search, LayoutDashboard, User } from 'lucide-react';

export default function PublicNavbar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth(); // 2. Get Auth State

  const isActive = (path) => location.pathname === path;

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            BetConnect
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
          <Link
            to="/browse"
            className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              isActive('/browse') ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Search size={16} /> Browse Homes
          </Link>

          <Link
            to="/ai-chat"
            className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              isActive('/ai-chat') ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Sparkles size={16} /> AI Assistant
          </Link>
        </nav>

        {/* Right Side: Auth Logic */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            /* IF LOGGED IN: Show Dashboard Link and Avatar */
            <Link
              to={`/${user?.role}`} // Redirects to /admin, /agent, or /user
              className="flex items-center gap-3 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
            >
              <LayoutDashboard size={18} className="text-blue-400" />
              Go to Dashboard
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] ml-1">
                {user?.name?.[0].toUpperCase()}
              </div>
            </Link>
          ) : (
            /* IF NOT LOGGED IN: Show Login/Register */
            <>
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}