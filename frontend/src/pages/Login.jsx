import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-cream">
      <div className="w-full max-w-md bg-cream border border-monk-dark/15 rounded p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-monk-dark">
            Log In to Monk<span className="text-monk-accent">Tube</span>
          </h2>
          <p className="text-sm text-monk-dark/60 mt-2">
            Welcome back! Please enter your details.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email / Username Input */}
          <div>
            <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. email@example.com"
              className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors"
              autoComplete="off"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-monk-accent text-cream font-bold py-2.5 px-4 rounded border border-transparent shadow hover:bg-monk-accent/95 transition-all text-sm tracking-wide disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-center text-monk-dark/70 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-monk-accent font-semibold hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
