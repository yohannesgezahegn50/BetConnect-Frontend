import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, Sparkles, Building2, MessageSquare, Home } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const featuredProperties = []; 
  const {isAuthenticated} = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative h-[85vh] flex flex-col items-center justify-center text-white px-4">
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000')" 
          }}
        />
        
        <div className="relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Find Your Perfect Home In Addis
          </h1>
          <p className="text-xl md:text-2xl opacity-90 font-medium">
            Modern real estate marketplace connecting you with trusted agents across Ethiopia
          </p>

          {/* Search Bar */}
          <div className="mt-12 bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl w-full max-w-3xl mx-auto">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl border border-gray-100">
              <Search className="text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Location (e.g. Bole, Woreda 03)" 
                className="w-full p-4 bg-transparent text-gray-900 outline-none"
              />
            </div>
            <select className="bg-gray-50 p-4 rounded-xl text-gray-900 border border-gray-100 outline-none font-semibold">
              <option>All Types</option>
              <option>Apartment</option>
              <option value="house">House</option>
            </select>
            <button 
              onClick={() => navigate("/browse")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* AI Section */}
      <section className="mx-[5%] my-16 bg-blue-900 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl">
        <div className="md:max-w-[60%]">
          <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold uppercase tracking-widest text-sm">
            <Sparkles size={18} />
            <span>Smart Features</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">AI Property Assistant</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Don’t want to search? Chat with our AI to find your perfect match. 
            Tell us your budget and preferred location, and we’ll curate the best listings instantly.
          </p>
        </div>
        <button 
          onClick={() => navigate(isAuthenticated ? "/ai-chat" : "/login")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-transform hover:scale-105 shadow-lg shadow-orange-900/20"
        >
          Start AI Chat 🤖
        </button>
      </section>

      {/* Featured Properties Section */}
      <section className="px-[5%] py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-500 text-lg mt-2">Handpicked listings for you in Addis</p>
          </div>
          <button onClick={() => navigate("/browse")} className="border-2 border-gray-900 px-6 py-2 font-bold hover:bg-gray-900 hover:text-white transition-all">
            View All
          </button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.length > 0 ? (
            featuredProperties.map(p => (
              <div key={p.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                {/* Card UI Logic here */}
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">Fetching real-time data from backend...</p>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-24 text-center px-4">
        <h2 className="text-4xl font-bold mb-16 text-gray-900">How BetConnect Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            { icon: <Search size={40}/>, t: "Search", d: "Find your dream home using filters." },
            { icon: <MessageSquare size={40}/>, t: "Connect", d: "Message verified agents directly." },
            { icon: <Home size={40}/>, t: "Find", d: "Get the keys to your new living space." }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.t}</h3>
              <p className="text-gray-600 leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center border-t border-gray-100">
        <h2 className="text-2xl font-black text-orange-500 mb-2">BetConnect</h2>
        <p className="text-gray-400">© 2026 Ethiopia's Smartest Real Estate Hub.</p>
      </footer>
    </div>
  );
};

export default LandingPage;