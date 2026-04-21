import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { 
  Heart, 
  Trash2, 
  MapPin, 
  Home, 
  Sparkles, 
  ArrowRight,
  Search
} from 'lucide-react';

export default function SavedHomesPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      const res = await API.get('/bookmarks/mine');
      // Assuming backend returns an array of objects where 'property' is populated
      setBookmarks(res.data); 
    } catch (err) {
      console.error("Error fetching bookmarks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const removeBookmark = async (id) => {
    try {
      await API.delete(`/bookmarks/${id}`);
      // Optimistic UI update: remove from local state immediately
      setBookmarks(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Could not remove bookmark. Try again.");
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            My Saved Homes <Heart className="text-red-500 fill-red-500" size={32} />
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            You have {bookmarks.length} properties saved in your wishlist.
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button 
            onClick={() => navigate('/browse')}
            className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
          >
            Find more properties <ArrowRight size={18} />
          </button>
        )}
      </div>

      {/* Main Content */}
      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved homes yet</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            Explore our marketplace and click the heart icon on properties you love to see them here.
          </p>
          <button 
            onClick={() => navigate('/browse')}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto"
          >
            <Search size={20} /> Start Browsing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarks.map((bookmark) => {
            const property = bookmark.property; // The populated property object
            return (
              <div key={bookmark._id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all relative">
                {/* Image Section */}
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={property?.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="property"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter text-blue-600">
                    For {property?.listingType}
                  </div>
                  <button 
                    onClick={() => removeBookmark(bookmark._id)}
                    className="absolute top-4 right-4 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 p-2.5 rounded-xl transition-colors shadow-sm"
                    title="Remove from saved"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-2xl font-black text-gray-900">
                      {property?.price?.toLocaleString()} <span className="text-sm font-bold text-gray-400">ETB</span>
                    </p>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-800 truncate">
                    {property?.type} in {property?.subcity}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2 mb-4">
                    <MapPin size={14} />
                    <span>Woreda {property?.woreda}, {property?.kebele}</span>
                  </div>

                  {/* AI Snippet - Keeps the "AI Party" alive */}
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 mb-6">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                      <Sparkles size={12} /> AI Insights
                    </p>
                    <p className="text-xs text-indigo-900 leading-relaxed line-clamp-2 italic">
                      "{property?.aiDescription}"
                    </p>
                  </div>

                  <Link 
                    to={`/browse`} // In a real app, go to property details
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-2xl transition-colors"
                  >
                    View Full Details <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}