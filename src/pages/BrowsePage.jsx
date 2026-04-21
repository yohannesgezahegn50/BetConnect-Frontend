import React, { useState, useEffect } from 'react';
import API from '../services/api';
// import "../App.css"; // Removed custom CSS to use Tailwind


const BrowsePage = () => {
  const [properties, setProperties] = useState([]);
  const [price, setPrice] = useState(30000000);
  const [filters, setFilters] = useState({
    subcity: '',
    listingType: '',
    maxPrice: 30000000
  })

  useEffect(()=> {
    const fetchProperties = async () => {
      try{
        const {subcity, listingType, maxPrice} = filters;
        const res = await API.get(`/properties?subcity=${subcity}&listingType=${listingType}&maxPrice=${maxPrice}`);
        setProperties(res.data?.properties || []);
      }catch(err){
        console.error("Error fetching properties:", err);
        setProperties([]);
      }
    };
    fetchProperties();
  }, [filters]);


  return (
    <div className="w-screen h-[calc(100vh-65px)] flex">
      <div className="flex w-full pt-16.25">
        
        <aside className="w-100 bg-white text-black p-8 border-r border-gray-200 overflow-y-auto">
          <h3 className="text-lg font-semibold text-black mb-6">Filters</h3>
          
          <div className="mb-5 text-black bg-white">
            <label className="block text-sm font-semibold text-black mb-2">Listing Type</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg outline-none"><option>All</option><option>For Sale</option><option>For Rent</option></select>
          </div>

          <div className="mb-5 text-black bg-white">
            <label className="block text-sm font-semibold text-black mb-2">Property Type</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg outline-none">
              <option>All Types</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Commercial</option>
            </select>
          </div>

          
          <div className="mb-5">
            <label className="block text-sm font-bold text-black mb-3 underline">Price Range</label>
            <div className="text-sm text-gray-600 mb-3">
              0 - {Number(price).toLocaleString()} ETB
            </div>
            <div className="relative">
              <input 
                type="range" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min="0" 
                max="30000000" 
                step="100000"
                value={price}
                onChange={(e) => {
                  const newPrice = Number(e.target.value);
                  setPrice(newPrice);
                  setFilters(prev => ({ ...prev, maxPrice: newPrice }));
                }}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-black mb-2">Location</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg outline-none"><option>All Subcities</option><option>Bole</option><option>Yeka</option><option>Arada</option></select>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-black mb-2">Bedrooms</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg outline-none"><option>Any</option><option>2+</option><option>3+</option><option>4+</option></select>
          </div>

          
          <div className="mb-5">
            <label className="block text-sm font-semibold text-black mb-2">Size (m²)</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg outline-none"><option>Any</option><option>100+m²</option><option>200+m²</option><option>500+m²</option></select>
          </div>

          <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-bold cursor-pointer hover:bg-orange-600 transition-colors">
            Apply Filter
          </button>
        </aside>

        
            <main className="flex-1 text-black bg-gray-50 p-10 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {(properties || []).map((house) => (
                  <div key={house._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img src={house.images[0] || 'default-house.jpg'} alt="House" className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <p className="text-orange-500 text-xl font-bold mb-2">{house.price.toLocaleString()} ETB</p>
                      <h4 className="text-gray-900 text-lg font-semibold mb-1">{house.type} in {house.subcity}</h4>
                      <p className="text-gray-600 text-sm mb-2">Woreda: {house.woreda}, Kebele: {house.kebele}</p>
                      {/* AI Description injection */}
                      <p className="text-xs italic text-blue-600">{house.aiDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </main>
      </div>
    </div>
  );
};

export default BrowsePage;