import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user', 
    personalAddress: ''

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      
      const user = await register(formData);

      if (user.role === 'agent') {
        navigate('/agent');
      } else {
        navigate('/user');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Join BetConnect as a User or Agent</p>

        {/* Role Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'user' })}
            className={`flex-1 py-3 rounded-xl font-bold transition ${
              formData.role === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'agent' })}
            className={`flex-1 py-3 rounded-xl font-bold transition ${
              formData.role === 'agent' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Agent
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number (e.g. 09...)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
            required
          />
          
          {/* Conditional Field: Only for Agents */}
          {formData.role === 'agent' && (
            <input
              name="personalAddress"
              type="text"
              placeholder="Business/Personal Address"
              value={formData.personalAddress}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border border-blue-100 bg-blue-50/30 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              required
            />
          )}

          <input
            name="password"
            type="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-200 disabled:opacity-70 mt-4"
          >
            {loading ? 'Creating your account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}