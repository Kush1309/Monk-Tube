import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VideoCard = ({ video, currentUser, onDelete, onTogglePublish }) => {
  const { _id, title, description, thumbnail, duration, isPublished, owner } = video;
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  // Check ownership — use String() to safely compare ObjectId vs string
  const videoOwnerId = String(owner?._id || owner || '');
  const currentUserId = String(currentUser?._id || '');
  const isOwner = currentUser && videoOwnerId && currentUserId && videoOwnerId === currentUserId;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Format video duration: seconds → MM:SS or HH:MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      if (onDelete) await onDelete(_id);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    setMenuOpen(false);
    if (onTogglePublish) await onTogglePublish(_id, isPublished);
  };

  return (
    <>
      {/* Card */}
      <div className="group relative flex flex-col bg-cream border border-monk-dark/15 rounded overflow-hidden hover:border-monk-accent/50 hover:shadow-sm transition-all duration-200">

        {/* ── Three-dots menu (owner only) ── */}
        {isOwner && (
          <div className="absolute top-2 right-2 z-10" ref={menuRef}>
            <button
              id={`menu-btn-${_id}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen((o) => !o); }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-cream hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Options"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <circle cx="10" cy="4"  r="1.5" />
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="10" cy="16" r="1.5" />
              </svg>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-cream border border-monk-dark/15 rounded shadow-md z-20 overflow-hidden">
                {/* View */}
                <button
                  onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate(`/videos/${_id}`); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-monk-dark hover:bg-monk-light transition-colors"
                >
                  👁 View Details
                </button>

                {/* Edit */}
                <button
                  onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate(`/videos/${_id}/edit`); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-monk-dark hover:bg-monk-light transition-colors"
                >
                  ✏️ Edit Details
                </button>

                {/* Toggle Publish */}
                <button
                  onClick={(e) => { e.preventDefault(); handleToggle(); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-monk-dark hover:bg-monk-light transition-colors"
                >
                  {isPublished ? '🔒 Unpublish' : '🌐 Publish'}
                </button>

                {/* Divider */}
                <div className="border-t border-monk-dark/10 mx-2" />

                {/* Delete */}
                <button
                  onClick={(e) => { e.preventDefault(); setMenuOpen(false); setShowDeleteModal(true); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  🗑️ Delete Video
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Thumbnail ── */}
        <Link to={`/videos/${_id}`} className="block">
          <div className="relative aspect-video w-full bg-monk-dark/5 overflow-hidden">
            <img
              src={thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60'}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
            />

            {/* Duration badge */}
            {duration ? (
              <span className="absolute bottom-2 left-2 bg-black/70 text-cream text-[10px] font-semibold px-1.5 py-0.5 rounded">
                {formatDuration(duration)}
              </span>
            ) : null}


          </div>

          {/* ── Info ── */}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-monk-dark group-hover:text-monk-accent transition-colors line-clamp-1 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-monk-dark/55 mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </Link>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-cream border border-monk-dark/15 rounded p-6 shadow-lg text-center">
            <h3 className="text-base font-bold text-monk-dark">Delete Video?</h3>
            <p className="text-sm text-monk-dark/70 mt-2">
              Are you sure you want to delete <strong>"{title}"</strong>?
              <br />This action <span className="text-red-600 font-semibold">cannot be undone</span>.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="bg-transparent border border-monk-dark/30 text-monk-dark px-4 py-2 text-xs font-semibold rounded hover:bg-monk-dark/5 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 text-xs font-semibold rounded hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
