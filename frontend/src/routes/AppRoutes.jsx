import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import UploadVideo from '../pages/UploadVideo';
import VideoDetails from '../pages/VideoDetails';
import EditVideo from '../pages/EditVideo';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Dynamic Header */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col w-full">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Require Authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadVideo />} />
            <Route path="/videos/:videoId" element={<VideoDetails />} />
            <Route path="/videos/:videoId/edit" element={<EditVideo />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Dynamic Footer */}
      <Footer />
    </div>
  );
};

export default AppRoutes;
