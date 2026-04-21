import { useState, useEffect } from 'react';
import API from '../services/api';
import { Shield, Users, UserCheck, Clock } from 'lucide-react';

export default function AdminDashboard() {

  const [pendingAgents, setPendingAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingAgents = async () => {
      try{
        const res = await API.get('/admin/agents/pending');
        setPendingAgents(res.data || []);

      }catch(err){
        console.error("Error fetching pending agents:", err);
      }finally{
        setLoading(false);
      }
    };
    fetchPendingAgents();
  }, []);

  const approveAgent = async (id) => {
    try{
      await API.put(`/admin/agents/${id}/approve`);
      setPendingAgents(prev => prev.filter(agent => (agent._id || agent.id) !== id));
      alert("✅ Agent Approved Successfully!");
    }catch{
      alert("❌ Failed to approve agent. Please try again.");
    }

  };

  const rejectAgent = async (id) => {
    try{
      await API.put(`/admin/agents/${id}/reject`);
      setPendingAgents(prev => prev.filter(agent => (agent._id || agent.id) !== id));
      alert("❌ Agent Rejected");
    }catch{
      alert("❌ Reject route not available on this backend.");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-4">
            <Shield className="text-blue-600" size={42} />
            <div>
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
              <p className="text-gray-600 mt-2 text-xl">Platform Management</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Pending Agents</p>
          <p className="text-5xl font-bold text-orange-600">{pendingAgents.length}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <Users className="text-blue-600 mb-6" size={40} />
          <p className="text-4xl font-bold">248</p>
          <p className="text-gray-600 mt-2">Total Users</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <UserCheck className="text-green-600 mb-6" size={40} />
          <p className="text-4xl font-bold">87</p>
          <p className="text-gray-600 mt-2">Approved Agents</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <Clock className="text-orange-600 mb-6" size={40} />
          <p className="text-4xl font-bold">3</p>
          <p className="text-gray-600 mt-2">Pending Today</p>
        </div>
      </div>

      {/* Pending Agents Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
        <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
          <UserCheck className="text-orange-600" size={32} />
          Pending Agent Approvals
        </h2>

        {pendingAgents.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No pending agents at the moment. Great job!
          </div>
        ) : (
          <div className="space-y-6">
            {pendingAgents.map((agent) => (
              <div
                key={agent._id || agent.id}
                className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 hover:bg-gray-100 transition p-7 rounded-2xl border border-gray-200"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-gray-600 mt-1">{agent.email}</p>
                  <p className="text-gray-400 mt-1">Phone: {agent.phone}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Applied on: {agent.createdAt}
                  </p>
                </div>

                <div className="flex gap-4 mt-6 md:mt-0">
                  <button
                    onClick={() => approveAgent(agent._id || agent.id)}
                    className="px-10 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition shadow-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectAgent(agent._id || agent.id)}
                    className="px-10 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}