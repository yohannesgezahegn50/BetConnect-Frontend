import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  Search, 
  Home, 
  Building2, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Clock 
} from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ rental: 0, sale: 0, saved: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real data for stats and recent listings
        const [propsRes, bookmarksRes] = await Promise.all([
          API.get('/properties?limit=5'),
          API.get('/bookmarks/mine') // Assuming Dev 3 finished this
        ]);

        const allProps = propsRes.data.properties;
        setRecent(allProps.slice(0, 3));
        
        // Calculate counts for the hero cards
        setStats({
          rental: allProps.filter(p => p.listingType === 'rent').length,
          sale: allProps.filter(p => p.listingType === 'sale').length,
          saved: bookmarksRes.data?.length || 0
        });
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Home, Sweet Home, {user?.name?.split(' ')[0]}! 🏠
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Explore {stats.rental + stats.sale} new properties added this week.
          </p>
        </div>
        <button 
          onClick={() => navigate('/ai-chat')}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Sparkles size={20} />
          Use AI Smart Search
        </button>
      </div>

      {/* Hero Stats - Data Driven */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-xl shadow-blue-100 relative overflow-hidden group">
          <Building2 size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-blue-100 font-bold uppercase tracking-widest text-xs">Available Rentals</p>
          <p className="text-6xl font-black mt-2">{stats.rental}</p>
          <Link to="/browse?type=rent" className="flex items-center gap-2 mt-6 text-sm font-bold hover:gap-3 transition-all">
            Browse Apartments <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
          <Home size={48} className="text-orange-500 mb-6" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">For Sale</p>
          <p className="text-5xl font-black text-gray-900 mt-2">{stats.sale}</p>
          <Link to="/browse?type=sale" className="flex items-center gap-2 mt-6 text-sm font-bold text-orange-600">
            View Houses <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
          <Heart size={48} className="text-red-500 mb-6" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">My Saved Homes</p>
          <p className="text-5xl font-black text-gray-900 mt-2">{stats.saved}</p>
          <Link to="/user/saved" className="flex items-center gap-2 mt-6 text-sm font-bold text-red-600">
            View Wishlist <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Recent Activity & Quick Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
            <Link to="/browse" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recent.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <img 
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=200'} 
                  className="w-24 h-24 rounded-xl object-cover" 
                  alt="property"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {item.listingType}
                  </span>
                  <h4 className="font-bold text-gray-900 mt-1">{item.type} in {item.subcity}</h4>
                  <p className="text-sm text-gray-500">Woreda {item.woreda}, Kebele {item.kebele}</p>
                </div>
                <div className="text-right px-4">
                  <p className="font-black text-gray-900">{item.price.toLocaleString()} ETB</p>
                  <button className="text-blue-600 hover:text-blue-700 mt-2">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Search Card */}
        <div className="bg-gray-900 rounded-3xl p-8 text-white h-fit">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
            <Search size={24} className="text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Quick Search</h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Find houses by location or price range instantly.
          </p>
          <div className="space-y-3">
            {['Bole', 'CMC', 'Yeka', 'Lebu'].map(loc => (
              <button 
                key={loc}
                onClick={() => navigate(`/browse?subcity=${loc}`)}
                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-between"
              >
                {loc} Properties <ArrowRight size={14} className="opacity-40" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}