import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Loader from '../components/Loader';

const VideoDetails = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal & toggle states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const fetchVideoDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/users/videos/${videoId}`);
      if (response.data?.success) {
        setVideo(response.data.data);
      } else {
        setError('Video not found.');
      }
    } catch (err) {
      console.error('Error fetching video details:', err);
      setError(err.response?.data?.message || 'Could not load video details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api.delete(`/users/videos/${videoId}`);
      if (response.data?.success) {
        setShowDeleteModal(false);
        navigate('/dashboard');
      } else {
        alert(response.data?.message || 'Failed to delete video.');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      alert(err.response?.data?.message || 'Error occurred while trying to delete.');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      const response = await api.patch(`/users/videos/${videoId}/toggle-publish`);
      if (response.data?.success) {
        setVideo((prev) => ({
          ...prev,
          isPublished: response.data.data.isPublished,
        }));
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
      alert(err.response?.data?.message || 'Error updating publish status.');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 bg-cream">
        <Loader message="Loading video player..." />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex-1 px-4 py-12 text-center bg-cream">
        <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded text-sm">
          {error || 'Video could not be loaded.'}
        </div>
        <Link to="/dashboard" className="inline-block mt-6 text-monk-accent hover:underline text-sm font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Check if current user owns the video
  // Use String() coercion because video.owner is a plain ObjectId string from backend,
  // but user._id from JWT decode can sometimes be an object — strict === fails silently.
  const videoOwnerId = String(video.owner?._id || video.owner || '');
  const currentUserId = String(user?._id || '');
  const isOwner = user && videoOwnerId && currentUserId && videoOwnerId === currentUserId;

  return (
    <div className="flex-1 px-4 sm:px-6 py-8 bg-cream max-w-5xl mx-auto w-full text-monk-dark">
      {/* Back button */}
      <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-monk-accent hover:underline mb-6">
        &larr; Back to Dashboard
      </Link>

      {/* Video Player */}
      <div className="w-full aspect-video bg-black rounded overflow-hidden shadow border border-monk-dark/10">
        <video
          src={video.videoFile}
          controls
          className="w-full h-full"
          poster={video.thumbnail}
          autoPlay
        />
      </div>

      {/* Video Info Panel */}
      <div className="mt-6 flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-monk-dark/10">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{video.title}</h2>
          <p className="text-xs text-monk-dark/50 mt-1">
            Uploaded on {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Unknown date'}
          </p>
        </div>

        {/* Owner Action Buttons */}
        {isOwner && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Publish Toggle Button */}
            <button
              onClick={handleTogglePublish}
              disabled={toggling}
              className={`text-xs font-semibold px-3.5 py-2 rounded shadow-sm border transition-all cursor-pointer ${video.isPublished
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                }`}
            >
              Status: {video.isPublished ? 'Published' : 'Unpublished'}
            </button>

            {/* Edit Button */}
            <Link
              to={`/videos/${video._id}/edit`}
              className="text-xs font-semibold bg-transparent text-monk-dark border border-monk-dark/30 hover:bg-monk-dark/5 px-3.5 py-2 rounded shadow-sm transition-all"
            >
              Edit Details
            </Link>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-3.5 py-2 rounded shadow-sm transition-all cursor-pointer"
            >
              Delete Video
            </button>
          </div>
        )}
      </div>

      {/* Video Description */}
      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-monk-dark/60 mb-2">Description</h3>
        <p className="text-sm leading-relaxed text-monk-dark/80 bg-monk-light/40 p-4 rounded border border-monk-dark/10 whitespace-pre-wrap">
          {video.description || 'No description provided.'}
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-cream border border-monk-dark/15 rounded p-6 shadow-md text-center">
            <h3 className="text-lg font-bold text-monk-dark">Delete Video</h3>
            <p className="text-sm text-monk-dark/70 mt-2">
              Are you sure you want to delete <strong>"{video.title}"</strong>? This action cannot be undone.
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
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-cream px-4 py-2 text-xs font-semibold rounded hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
