import { useMemo, useState, useEffect } from 'react';
import API from '../services/api';
import PostPropertyModal from '../components/agent/PostPropertyModal';
import { Plus, Home, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isApprovedAgent = useMemo(() => {
    if (!user || user.role !== 'agent') return false;
    return user.status === 'approved';
  }, [user]);

  const currentUserId = useMemo(() => user?._id || user?.id || user?.userId || null, [user]);

  const extractPropertyList = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.properties)) return payload.properties;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  };

  const filterByAgent = (list) => {
    if (!currentUserId) return list;
    return (list || []).filter((p) => {
      const agent = p?.agent;
      const agentId = typeof agent === 'string' ? agent : agent?._id || agent?.id;
      return agentId ? String(agentId) === String(currentUserId) : true;
    });
  };

  const fetchMyProperties = async () => {
    try {
      setError('');
      setLoading(true);

      try {
        const mineRes = await API.get('/properties/mine');
        setProperties(extractPropertyList(mineRes.data));
        return;
      } catch (mineErr) {
        if (mineErr?.response?.status !== 404) throw mineErr;
      }

      const res = await API.get('/properties?limit=100');
      const list = extractPropertyList(res.data);
      setProperties(filterByAgent(list));
    } catch (err) {
      console.error('Error fetching properties', err);
      setError('Could not load your properties. Please try again.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  if (user?.role === 'agent' && !isApprovedAgent) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Clock className="text-amber-600" size={24} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Waiting for Admin Approval
              </h1>
              <p className="text-gray-600 mt-2 font-medium leading-relaxed">
                Your agent account is currently <span className="font-bold text-amber-700">pending verification</span>.
                Once an admin approves your account, you’ll be able to post properties and manage listings.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Your Profile</p>
              <div className="mt-4 space-y-2">
                <p className="text-lg font-black text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600 font-medium">{user?.email}</p>
                <p className="text-sm text-gray-600 font-medium">{user?.phone}</p>
                {user?.personalAddress && (
                  <p className="text-sm text-gray-600 font-medium">{user.personalAddress}</p>
                )}
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white overflow-hidden relative">
              <ShieldCheck size={140} className="absolute -right-8 -bottom-10 opacity-10" />
              <p className="text-blue-100 font-bold uppercase tracking-widest text-xs">What happens next</p>
              <ul className="mt-4 space-y-2 text-sm font-medium text-white/90">
                <li>1) Admin reviews your agent application</li>
                <li>2) Status becomes <span className="font-black">approved</span></li>
                <li>3) You can post listings with AI descriptions</li>
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-sm font-bold">
                <Sparkles size={16} className="text-orange-200" /> AI listing generation unlocks after approval
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your listings and generate AI descriptions</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus size={20} /> Post New Property
        </button>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-6 py-4 font-semibold">
          {error}
        </div>
      )}

      {/* Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl border-gray-200">
             <Home size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500">{loading ? 'Loading your properties...' : "You haven't posted any properties yet."}</p>
          </div>
        ) : (
          properties.map(item => (
            <div key={item._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase">
                    {item.listingType}
                  </span>
                  <p className="text-xl font-bold text-gray-900">{item.price.toLocaleString()} ETB</p>
                </div>
                <h3 className="font-bold text-lg mb-1">{item.type} in {item.subcity}</h3>
                <p className="text-sm text-gray-500 mb-4">Woreda {item.woreda}, Kebele {item.kebele}</p>
                
                {/* AI GENERATED CONTENT */}
                <div className="bg-gray-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 flex items-center gap-1 mb-1">
                    <Sparkles size={12} /> AI GENERATED DESCRIPTION
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    {item.aiDescription ? `"${item.aiDescription}"` : <span className="text-gray-400">No AI description available.</span>}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <PostPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchMyProperties}
      />
    </div>
  );
}