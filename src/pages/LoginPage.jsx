import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleType, setRoleType] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try{
      const loggedUser = await login(email, password);

      if(loggedUser.role === 'admin') navigate('/admin');
      else if(loggedUser.role === 'agent'){
        navigate('/agent');
      }else navigate('/user');
    }catch(err){
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Sign in to your portal</p>

        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button
            onClick={() => setRoleType('user')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              roleType === 'user' ? 'bg-white shadow' : 'text-gray-500'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRoleType('agent')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              roleType === 'agent' ? 'bg-white shadow' : 'text-gray-500'
            }`}
          >
            Agent
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}