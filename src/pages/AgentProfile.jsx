import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, ShieldCheck, Clock, Home } from 'lucide-react';

export default function AgentProfile() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
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
    setLoading(true);
    setError('');
    try {
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
      console.error('Error fetching agent properties', err);
      setError('Could not load your properties.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Agent Profile</h1>
          <p className="text-gray-500 font-medium mt-2">Your info and your posted properties</p>
        </div>

        <Link
          to="/agent"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 text-white font-black hover:bg-black transition"
        >
          <Home size={18} /> Back to Dashboard
        </Link>
      </div>

      {!isApprovedAgent && user?.role === 'agent' && (
        <div className="mb-8 bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-amber-100 flex items-center justify-center">
            <Clock className="text-amber-600" size={22} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-amber-700 uppercase tracking-widest">Approval Pending</p>
            <p className="text-gray-700 font-medium mt-1">
              You can browse your profile, but posting is locked until an admin approves your account.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-100">
            {user?.name ? user.name[0].toUpperCase() : <User size={24} />}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900">{user?.name || 'Agent'}</h2>
              {user?.role === 'agent' && (
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border ${
                    isApprovedAgent
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}
                >
                  <ShieldCheck size={14} /> {isApprovedAgent ? 'Verified Agent' : 'Verification Pending'}
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 font-medium">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                <p className="mt-1 text-gray-800 font-bold truncate">{user?.email || '-'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                <p className="mt-1 text-gray-800 font-bold truncate">{user?.phone || '-'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</p>
                <p className="mt-1 text-gray-800 font-bold truncate">{user?.personalAddress || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-6 py-4 font-semibold">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-gray-900">My Properties</h3>
        <p className="text-sm font-bold text-gray-500">{loading ? 'Loading...' : `${properties.length} total`}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl border-gray-200 bg-white">
            <Home size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">{loading ? 'Loading your properties...' : "You haven't posted any properties yet."}</p>
          </div>
        ) : (
          properties.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase">
                    {item.listingType}
                  </span>
                  <p className="text-xl font-bold text-gray-900">{Number(item.price || 0).toLocaleString()} ETB</p>
                </div>
                <h3 className="font-bold text-lg mb-1">{item.type} in {item.subcity}</h3>
                <p className="text-sm text-gray-500 mb-4">Woreda {item.woreda}, Kebele {item.kebele}</p>

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
    </div>
  );
}
