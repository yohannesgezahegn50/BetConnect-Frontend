import React, { useMemo, useState } from 'react';
import API from '../../services/api';
import { X, Sparkles, Home, Info, AlignLeft, Link2, Trash2, CheckCircle2 } from 'lucide-react';

export default function PostPropertyModal({ isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('form'); // 'form' | 'success'
  const [submitError, setSubmitError] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [imageUrlDraft, setImageUrlDraft] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  
  const [formData, setFormData] = useState({
    listingType: 'rent',
    type: 'apartment', 
    subcity: 'Bole',
    woreda: '',
    kebele: '',
    price: '',
    size: '',
    floor: '',
    specialName: '',
    description: '',
    bedrooms: '',
    bathrooms: '',  
  });

  const requiredFields = useMemo(
    () => ['subcity', 'woreda', 'kebele', 'price', 'size', 'floor', 'specialName', 'type', 'listingType'],
    []
  );

  const resetForm = () => {
    setMode('form');
    setSubmitError('');
    setAiDescription('');
    setImageUrlDraft('');
    setImageUrls([]);
    setFormData({
      listingType: 'rent',
      type: 'apartment',
      subcity: 'Bole',
      woreda: '',
      kebele: '',
      price: '',
      size: '',
      floor: '',
      specialName: '',
      description: '',
      bedrooms: '',
      bathrooms: '',
    });
  };

  const isProbablyUrl = (value) => /^https?:\/\//i.test(String(value || '').trim());

  const addImageUrl = () => {
    const trimmed = String(imageUrlDraft || '').trim();
    if (!trimmed) return;
    if (!isProbablyUrl(trimmed)) {
      setSubmitError('Please enter a valid image URL starting with http(s)://');
      return;
    }
    if (imageUrls.includes(trimmed)) {
      setImageUrlDraft('');
      return;
    }
    setImageUrls((prev) => [...prev, trimmed]);
    setImageUrlDraft('');
  };

  const removeImageUrl = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    // Client-side validation for required fields
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ''
    );

    if (missingFields.length > 0) {
      setSubmitError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        images: imageUrls,
      };

      // Normalize numeric inputs where appropriate
      const numericFields = ['price', 'size', 'floor', 'bedrooms', 'bathrooms'];
      numericFields.forEach((key) => {
        if (payload[key] !== '' && payload[key] !== null && payload[key] !== undefined) {
          const parsed = Number(payload[key]);
          if (!Number.isNaN(parsed)) payload[key] = parsed;
        }
      });

      const res = await API.post('/properties', payload);

      const aiText =
        res?.data?.aiDescription ||
        res?.data?.property?.aiDescription ||
        res?.data?.data?.aiDescription ||
        res?.data?.description ||
        '';

      setAiDescription(aiText);
      setMode('success');

      if (typeof onRefresh === 'function') {
        try {
          await onRefresh();
        } catch {
          // ignore refresh errors; the success modal still shows
        }
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          err.response?.data?.errors?.map((e) => e.msg).join(', ') ||
          'Please check all required fields'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-8 md:p-12 relative shadow-2xl">
        
        <button onClick={handleClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
          <X size={28} />
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
               <Home className="text-white" size={22} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">List a Property</h2>
          </div>
          <p className="text-gray-500 font-medium">This information will be used by our AI to create your listing.</p>
        </div>

        {mode === 'success' ? (
          <div className="space-y-8">
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="text-emerald-600" size={26} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900">Property Posted!</h3>
                <p className="text-gray-600 font-medium mt-1">
                  Here is the AI-generated description for your listing.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-blue-100 rounded-3xl p-6">
              <p className="text-xs font-black text-blue-600 flex items-center gap-2 mb-3 uppercase tracking-widest">
                <Sparkles size={16} /> AI GENERATED DESCRIPTION
              </p>
              <p className="text-gray-800 leading-relaxed italic whitespace-pre-line">
                {aiDescription || 'No AI description was returned by the server.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

          {submitError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-sm font-semibold text-red-700">
              {submitError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Listing Type</label>
              <select name="listingType" value={formData.listingType} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold outline-none">
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Property Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold outline-none">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Subcity</label>
                <select name="subcity" value={formData.subcity} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-white border border-gray-200 font-semibold outline-none">
                  <option value="Bole">Bole</option>
                  <option value="Yeka">Yeka</option>
                  <option value="Kirkos">Kirkos</option>
                  <option value="Nifas Silk">Nifas Silk</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Woreda</label>
                <input name="woreda" type="text" placeholder="e.g. 03" onChange={handleChange} className="w-full p-3.5 rounded-xl bg-white border border-gray-200 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Kebele</label>
                <input name="kebele" type="text" placeholder="e.g. 15" onChange={handleChange} className="w-full p-3.5 rounded-xl bg-white border border-gray-200 outline-none" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                <Info size={12} /> Specific Area (specialName)
              </label>
              <input name="specialName" type="text" placeholder="e.g. Near Edna Mall" onChange={handleChange} className="w-full p-4 rounded-xl bg-white border border-gray-200 outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Price (ETB)</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 font-bold text-blue-600 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Size (m²)</label>
              <input name="size" type="number" value={formData.size} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Floor</label>
              <input name="floor" type="number" value={formData.floor} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Beds</label>
              <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Baths</label>
              <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft size={14} /> Agent's Notes (description)
            </label>
            <textarea 
              name="description" 
              rows="3" 
              placeholder="Add any extra details like 'Negotiable price', 'Parking included', etc." 
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white outline-none transition-all"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Property Gallery</label>
            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={imageUrlDraft}
                    onChange={(e) => setImageUrlDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImageUrl();
                      }
                    }}
                    placeholder="Paste an image URL (https://...)"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border border-gray-200 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black transition"
                >
                  Add
                </button>
              </div>

              {imageUrls.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, idx) => (
                    <div key={url} className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white">
                      <img
                        src={url}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(idx)}
                        className="absolute top-2 right-2 p-2 rounded-xl bg-white/90 border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="px-3 py-2 text-[10px] font-bold text-gray-500 truncate border-t border-gray-100">
                        {url}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm font-bold text-gray-400">
                  Add one or more image URLs to preview your gallery.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <>AI is analyzing property...</>
            ) : (
              <><Sparkles size={24} className="text-blue-400" /> List Property</>
            )}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}