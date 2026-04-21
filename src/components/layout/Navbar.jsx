import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  Bell, 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  Clock,
  User as UserIcon 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  // Determine portal name and theme color
  const portalInfo = {
    admin: { title: 'System Administration', color: 'text-blue-600' },
    agent: { title: 'Agent Dashboard', color: 'text-emerald-600' },
    user: { title: 'Property Finder', color: 'text-indigo-600' },
  };

  const currentPortal = portalInfo[user?.role] || portalInfo.user;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-8 justify-between sticky top-0 z-40">
      
      {/* Left: Search & Context */}
      <div className="flex items-center gap-8 flex-1">
        <div>
           <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {currentPortal.title}
          </h2>
          <p className="text-xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </p>
        </div>

        {/* Global Search Bar - Figma Standard */}
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-2xl w-full max-w-md focus-within:border-blue-300 focus-within:bg-white transition-all">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search listings, agents, or locations..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full text-gray-600"
          />
        </div>
      </div>

      {/* Right: Status & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Agent Verification Status Badge */}
        {user?.role === 'agent' && (
          <div className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
            user?.status === 'approved' 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}>
            {user?.status === 'approved' ? (
              <><CheckCircle2 size={14} /> Verified Agent</>
            ) : (
              <><Clock size={14} /> Verification Pending</>
            )}
          </div>
        )}

        {/* Icons Hub */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
          <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* User Profile Dropdown Design */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tighter mt-1">
               {user?.role} Portal
            </p>
          </div>
          
          <div className="relative">
            <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100 transition-transform group-hover:scale-105">
              {user?.name ? user.name[0].toUpperCase() : <UserIcon size={20}/>}
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}