import React, { useEffect, useState } from 'react';
import api from '../services/api';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchVideos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/videos', {
        params: { query: debouncedQuery },
      });
      if (response.data?.success) {
        setVideos(response.data.data || []);
      } else {
        setError('Failed to fetch videos.');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.response?.data?.message || 'Could not load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [debouncedQuery]);

  // ── Delete handler: remove from list after confirmed API call ──
  const handleDelete = async (videoId) => {
    try {
      const response = await api.delete(`/videos/${videoId}`);
      if (response.data?.success) {
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
      } else {
        alert(response.data?.message || 'Failed to delete video.');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      alert(err.response?.data?.message || 'Could not delete video. Please try again.');
    }
  };

  // ── Toggle publish handler: flip isPublished in local state ──
  const handleTogglePublish = async (videoId, currentState) => {
    try {
      const response = await api.patch(`/videos/${videoId}/toggle-publish`);
      if (response.data?.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === videoId ? { ...v, isPublished: response.data.data.isPublished } : v
          )
        );
      } else {
        alert(response.data?.message || 'Failed to update publish status.');
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
      alert(err.response?.data?.message || 'Could not update publish status.');
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-6 py-8 bg-cream max-w-7xl mx-auto w-full">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-monk-dark tracking-tight">
            Video Dashboard
          </h2>
          <p className="text-sm text-monk-dark/60 mt-1">
            Explore shared content or publish your own.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search videos by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Video Grid */}
      {loading ? (
        <div className="py-20">
          <Loader message="Fetching video gallery..." />
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              currentUser={user}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-monk-dark/15 rounded bg-cream/50">
          <svg
            className="mx-auto h-12 w-12 text-monk-dark/30"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-monk-dark">No videos found</h3>
          <p className="mt-1 text-sm text-monk-dark/60">
            {debouncedQuery ? 'Try adjusting your search.' : 'Get started by uploading a video.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
