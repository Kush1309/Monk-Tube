import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`w-full sticky top-0 z-50 py-6 px-6 sm:px-12 transition-all duration-300 ${isHome ? 'bg-transparent' : 'bg-premium-bg/80 backdrop-blur-md border-b border-premium-border/50'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="group">
          <span className="text-2xl font-bold tracking-[0.2em] text-premium-heading transition-all group-hover:opacity-70">
            MONKTUBE
          </span>
        </Link>

        {/* Navigation Links (Desktop) - Only on Landing Page */}
        {!user && isHome && (
          <div className="hidden md:flex items-center space-x-10">
            <a href="#features" className="text-sm font-medium text-premium-body hover:text-premium-accent transition-colors">Features</a>
            <a href="#tech" className="text-sm font-medium text-premium-body hover:text-premium-accent transition-colors">Tech Stack</a>
            <a href="#about" className="text-sm font-medium text-premium-body hover:text-premium-accent transition-colors">About</a>
            <a href="https://github.com/Kush1309" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-premium-body hover:text-premium-accent transition-colors">GitHub</a>
          </div>
        )}

        {/* User Info / Controls */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link
                to="/upload"
                className="text-sm bg-premium-accent text-white font-medium px-5 py-2 rounded-full hover:opacity-90 transition-all"
              >
                Upload
              </Link>

              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border border-premium-border object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-premium-accent text-white flex items-center justify-center font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-premium-body hover:text-premium-heading transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-sm font-medium text-premium-body hover:text-premium-heading transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-premium-heading text-white font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
