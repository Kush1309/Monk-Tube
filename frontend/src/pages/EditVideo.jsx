import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Loader from '../components/Loader';

const EditVideo = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  // UI States
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Client-side parser for video duration
  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      try {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src);
          resolve(Math.round(videoElement.duration || 0));
        };
        videoElement.onerror = () => {
          resolve(60);
        };
        videoElement.src = URL.createObjectURL(file);
      } catch (e) {
        console.error('Failed to parse duration:', e);
        resolve(60);
      }
    });
  };

  const fetchVideoDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/users/videos/${videoId}`);
      if (response.data?.success) {
        const video = response.data.data;
        // Verify owner access — use String() to avoid ObjectId vs string type mismatch
        const videoOwnerId = String(video.owner?._id || video.owner || '');
        const currentUserId = String(user?._id || '');
        const isOwner = user && videoOwnerId && currentUserId && videoOwnerId === currentUserId;
        if (!isOwner) {
          setError('Unauthorized: You do not own this video.');
          return;
        }
        setTitle(video.title);
        setDescription(video.description);
      } else {
        setError('Video not found.');
      }
    } catch (err) {
      console.error('Error fetching video for edit:', err);
      setError(err.response?.data?.message || 'Could not load video details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      if (videoFile) {
        const duration = await getVideoDuration(videoFile);
        formData.append('duration', duration.toString());
        formData.append('videoFile', videoFile);
      }

      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const response = await api.patch(`/users/videos/${videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || progressEvent.loaded;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data?.success) {
        setSuccess('Video updated successfully!');
        setTimeout(() => {
          navigate(`/videos/${videoId}`);
        }, 1500);
      } else {
        setError(response.data?.message || 'Failed to update video.');
      }
    } catch (err) {
      console.error('Error updating video:', err);
      setError(err.response?.data?.message || 'Server error updating video.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 bg-cream">
        <Loader message="Loading details..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-cream">
      <div className="w-full max-w-lg bg-cream border border-monk-dark/15 rounded p-6 sm:p-8 shadow-sm">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-monk-dark">
              Edit Video Details
            </h2>
            <p className="text-sm text-monk-dark/60 mt-1">
              Modify video title, description, or files.
            </p>
          </div>
          <Link to={`/videos/${videoId}`} className="text-xs font-semibold text-monk-accent hover:underline">
            Cancel
          </Link>
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

        {/* Form only available if user is authorized owner */}
        {!error && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
                Video Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to MERN Stack"
                className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors"
                required
                disabled={updating}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details..."
                rows="4"
                className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors resize-y"
                required
                disabled={updating}
              />
            </div>

            {/* Optional video re-upload */}
            <div>
              <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
                Replace Video File (Optional)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-full text-sm text-monk-dark/70 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border file:border-monk-dark/30 file:bg-transparent file:text-xs file:font-semibold file:text-monk-dark hover:file:bg-monk-dark/5"
                disabled={updating}
              />
            </div>

            {/* Optional thumbnail re-upload */}
            <div>
              <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
                Replace Thumbnail Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="w-full text-sm text-monk-dark/70 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border file:border-monk-dark/30 file:bg-transparent file:text-xs file:font-semibold file:text-monk-dark hover:file:bg-monk-dark/5"
                disabled={updating}
              />
            </div>

            {/* Progress bar */}
            {updating && uploadProgress > 0 && (
              <div className="w-full bg-monk-light rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-monk-accent h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-right text-[10px] font-bold text-monk-accent mt-1">
                  {uploadProgress}% Updated
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={updating}
              className="w-full bg-monk-accent text-cream font-bold py-2.5 px-4 rounded border border-transparent shadow hover:bg-monk-accent/95 transition-all text-sm tracking-wide disabled:opacity-50 cursor-pointer"
            >
              {updating ? 'Updating Video...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditVideo;
