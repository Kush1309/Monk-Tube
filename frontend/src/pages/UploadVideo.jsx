import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

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
          resolve(60); // Default fallback of 60 seconds if error occurs
        };
        videoElement.src = URL.createObjectURL(file);
      } catch (e) {
        console.error('Failed to parse duration:', e);
        resolve(60); // Fallback
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);

    if (!title.trim() || !description.trim() || !videoFile || !thumbnail) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      // 1. Get the video duration dynamically
      const duration = await getVideoDuration(videoFile);

      // 2. Prepare FormData payload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', duration.toString());
      formData.append('videoFile', videoFile);
      formData.append('thumbnail', thumbnail);

      // 3. Post to API with upload progress configuration
      const response = await api.post('/videos', formData, {
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
        setSuccess('Video uploaded and published successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(response.data?.message || 'Failed to publish video.');
      }
    } catch (err) {
      console.error('Video upload error:', err);
      setError(err.response?.data?.message || 'Server error uploading video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-cream">
      <div className="w-full max-w-lg bg-cream border border-monk-dark/15 rounded p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-monk-dark">
            Upload Video
          </h2>
          <p className="text-sm text-monk-dark/60 mt-1">
            Share your knowledge or work on MonkTube.
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
              disabled={loading}
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
              placeholder="Provide a detailed description of the video..."
              rows="4"
              className="w-full bg-cream border border-monk-dark/20 rounded px-3.5 py-2 text-sm text-monk-dark focus:outline-none focus:border-monk-accent transition-colors resize-y"
              required
              disabled={loading}
            />
          </div>

          {/* Video file */}
          <div>
            <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
              Video File (.mp4, etc.) *
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full text-sm text-monk-dark/70 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border file:border-monk-dark/30 file:bg-transparent file:text-xs file:font-semibold file:text-monk-dark hover:file:bg-monk-dark/5"
              required
              disabled={loading}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-xs font-semibold text-monk-dark/80 uppercase tracking-wider mb-2">
              Thumbnail Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full text-sm text-monk-dark/70 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border file:border-monk-dark/30 file:bg-transparent file:text-xs file:font-semibold file:text-monk-dark hover:file:bg-monk-dark/5"
              required
              disabled={loading}
            />
          </div>

          {/* Progress Bar */}
          {loading && uploadProgress > 0 && (
            <div className="w-full bg-monk-light rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-monk-accent h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-right text-[10px] font-bold text-monk-accent mt-1">
                {uploadProgress}% Uploaded
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-monk-accent text-cream font-bold py-2.5 px-4 rounded border border-transparent shadow hover:bg-monk-accent/95 transition-all text-sm tracking-wide disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Uploading & Processing...' : 'Publish Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
