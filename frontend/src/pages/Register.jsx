import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // File states
  const [avatar, setAvatar] = useState(null);
  const [coverimage, setCoverimage] = useState(null);

  // Previews
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverimage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullname.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!avatar) {
      setError('Avatar image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar);

    if (coverimage) {
      formData.append('coverimage', coverimage);
    }

    setLoading(true);
    try {
      const response = await api.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        setSuccess('Registration successful! Redirecting to login page...');
        setFullname('');
        setUsername('');
        setEmail('');
        setPassword('');
        setAvatar(null);
        setCoverimage(null);
        setAvatarPreview('');
        setCoverPreview('');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setError(response.data?.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-cream">
      <div className="w-full max-w-lg bg-cream border border-monk-dark/15 rounded p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-monk-dark">
            Create an Account
          </h2>
          <p className="text-sm text-monk-dark/60 mt-2">
            Join MonkTube and start sharing videos today.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-3 rounded mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. johndoe"
              className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors"
              autoComplete="off"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors"
              autoComplete="new-password"
              required
            />
          </div>

          {/* File Uploads Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Avatar upload */}
            <div>
              <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
                Avatar Image *
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full border border-monk-dark/20 bg-monk-light flex items-center justify-center overflow-hidden flex-shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-monk-dark/40 font-bold">Img</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full text-xs text-monk-dark/70 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-monk-dark/30 file:bg-transparent file:text-xs file:font-semibold file:text-monk-dark hover:file:bg-monk-dark/5"
                  required
                />
              </div>
            </div>

            {/* Cover image upload */}
            <div>
              <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
                Cover Image (Optional)
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded border border-monk-dark/20 bg-monk-light flex items-center justify-center overflow-hidden flex-shrink-0">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-monk-dark/40 font-bold">Img</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="w-full text-xs text-monk-dark/70 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-monk-dark/30 file:bg-transparent file:text-xs file:font-semibold file:text-monk-dark hover:file:bg-monk-dark/5"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-monk-accent text-cream font-bold py-2.5 px-4 rounded border border-transparent shadow hover:bg-monk-accent/95 transition-all text-sm tracking-wide disabled:opacity-50 mt-6 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center text-monk-dark/70 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-monk-accent font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
