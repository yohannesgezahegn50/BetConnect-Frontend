import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Users, 
  UserCheck, 
  User, 
  Shield, 
  Sparkles, 
  Building2, 
  Heart, 
  Search,
  LogOut,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State for mobile toggle

  const menuConfig = {
    admin: [
      { path: '/admin', label: 'Overview', icon: LayoutDashboard },
      { path: '/admin/agents', label: 'Verify Agents', icon: UserCheck },
      { path: '/browse', label: 'View All Properties', icon: Building2 },
    ],
    agent: [
      { path: '/agent', label: 'Dashboard', icon: Home },
      { path: '/agent/profile', label: 'Profile', icon: User },
      { path: '/ai-chat', label: 'AI Assistant', icon: Sparkles, isAi: true },
    ],
    user: [
      { path: '/user', label: 'Dashboard', icon: Home },
      { path: '/browse', label: 'Browse Homes', icon: Search },
      { path: '/user/saved', label: 'Saved Homes', icon: Heart },
      { path: '/ai-chat', label: 'AI Smart Search', icon: Sparkles, isAi: true },
    ],
  };

  const menu = user ? menuConfig[user.role] || menuConfig.user : [];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 1. MOBILE TRIGGER BUTTON (Visible only on SM/MD) */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-60 p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-lg text-gray-600 dark:text-white active:scale-90 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 2. MOBILE OVERLAY (Darkens screen when menu is open) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* 3. SIDEBAR CONTAINER */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-900 
        h-screen flex flex-col p-6 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:flex
      `}>
        
        {/* Brand Logo - NOW LINKS TO HOME */}
        <Link 
          to="/" 
          className="flex items-center gap-3 mb-10 px-2 group cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            BetConnect
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close menu when link is clicked
              end={item.path.split('/').length <= 2} 
              className={({ isActive }) => {
                const baseClasses = "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[14px] font-semibold transition-all duration-200";
                
                if (item.isAi) {
                  return isActive 
                    ? `${baseClasses} bg-indigo-600 text-white shadow-lg shadow-indigo-200`
                    : `${baseClasses} bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400`;
                }

                return isActive 
                  ? `${baseClasses} bg-blue-600 text-white shadow-md shadow-blue-100` 
                  : `${baseClasses} hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400`;
              }}
            >
              <item.icon size={20} className={item.isAi ? "animate-pulse" : ""} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom User Section */}
        <div className="pt-6 border-t border-gray-100 dark:border-zinc-900">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden flex items-center justify-center border-2 border-white dark:border-zinc-900">
               <User size={20} className="text-gray-500" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{user?.role}</p>
            </div>
          </div>

          {/* REACTIVE SIGN OUT BUTTON */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-bold text-red-500 
            bg-transparent hover:bg-red-50 dark:hover:bg-red-900/10 
            active:scale-95 active:bg-red-100 transition-all duration-150"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}