import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import dashboardPreview from '../assets/dashboard_preview.png';

const FEATURES = [
  { title: 'Upload Videos', desc: 'Upload any MP4 with a thumbnail. Duration is detected automatically by the browser before sending to the server.' },
  { title: 'Watch Anytime', desc: 'Stream videos directly in an HTML5 player — no third-party plugins, no ads, no interruptions.' },
  { title: 'Publish Control', desc: 'Toggle a video between Published and Unpublished with a single click — visible only to you when unpublished.' },
  { title: 'Edit & Delete', desc: 'Update title, description or replace the video file and thumbnail at any time. Delete with a confirmation step.' },
  { title: 'Secure Auth', desc: 'JWT-based login. Access token stored in localStorage, auto-refreshed on expiry, passwords bcrypt-hashed.' },
  { title: 'Live Search', desc: 'The dashboard search bar filters videos by title in real time with a debounce to avoid excess API calls.' },
];

const TECH = ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Cloudinary', 'Multer', 'Tailwind CSS'];

/* Divider row — same left/right layout used across all sections */
const Row = ({ label, children, alt, id }) => (
  <div id={id} className={`border-t border-premium-border ${alt ? 'bg-premium-border/10' : ''}`}>
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 flex flex-col md:flex-row gap-16">
      {/* Left label */}
      <div className="md:w-64 flex-shrink-0">
        <p className="text-xs font-bold tracking-[0.2em] text-premium-heading uppercase leading-snug">{label}</p>
      </div>
      {/* Right content */}
      <div className="flex-1">{children}</div>
    </div>
  </div>
);

const Landing = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex-1 flex flex-col bg-premium-bg text-premium-body selection:bg-premium-accent selection:text-white">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-12 py-20 lg:py-32 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column */}
          <div className="animate-fade-in">
            <span className="text-xs font-bold tracking-[0.3em] text-premium-accent uppercase">MONKTUBE</span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-premium-heading mt-6 leading-[1.1]">
              Elevate your <br />
              video workflow.
            </h1>
            <p className="text-xl md:text-2xl text-premium-body mt-8 font-light italic leading-relaxed">
              "Upload, manage and share videos seamlessly with a secure full-stack platform."
            </p>
            <p className="text-base text-premium-body/80 mt-6 max-w-lg leading-relaxed">
              MonkTube is a modern video-sharing platform built using React, Node.js, Express, MongoDB, JWT Authentication and Cloudinary. Designed to demonstrate production-ready full-stack development.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-12">
              <Link to="/login"
                className="px-10 py-4 bg-premium-heading text-white font-medium rounded-full hover:scale-105 transition-transform text-center">
                Live Demo
              </Link>
              <a href="https://github.com/Kush1309" target="_blank" rel="noopener noreferrer"
                className="px-10 py-4 bg-transparent text-premium-heading border border-premium-heading font-medium rounded-full hover:bg-premium-heading hover:text-white transition-all text-center">
                View Source Code
              </a>
            </div>

            <p className="text-xs text-premium-body/60 mt-10 tracking-widest uppercase">
              Built with React • Node.js • MongoDB • Cloudinary
            </p>
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center items-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative group">
              {/* Decorative Accent */}
              <div className="absolute -top-10 -right-10 w-32 h-32 border border-premium-accent/20 rounded-full animate-float" />
              <div className="absolute -bottom-12 -left-10 w-24 h-24 border border-premium-accent/10 rounded-full animate-float-delayed" style={{ animationDelay: '1s' }} />

              {/* Dashboard Preview Image */}
              <div className="relative z-10 w-full max-w-[550px] aspect-square rounded-[2rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] group-hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] transition-shadow duration-500 animate-float">
                <img
                  src={dashboardPreview}
                  alt="MonkTube Dashboard Preview"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Everything you need ──────────────────────────────────── */}
      <Row id="features" label="Everything you need" alt>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {FEATURES.map(({ title, desc }) => (
            <div key={title} className="group">
              <p className="text-lg font-medium text-premium-heading group-hover:text-premium-accent transition-colors">{title}</p>
              <p className="text-sm text-premium-body/70 mt-3 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Row>

      {/* ── About MonkTube ───────────────────────────────────────── */}
      <Row id="tech" label="Tech Stack">
        <div className="flex flex-wrap gap-4">
          {TECH.map((t) => (
            <span key={t}
              className="px-6 py-2 bg-white border border-premium-border text-premium-heading text-xs font-semibold rounded-full hover:border-premium-accent transition-colors">
              {t}
            </span>
          ))}
        </div>
        <p className="text-base text-premium-body/80 mt-10 leading-loose">
          MonkTube is a full-stack video sharing platform built as a B.Tech major project.
          It demonstrates real-world backend engineering — RESTful APIs with Express, secure
          JWT authentication, MongoDB for data persistence, file uploads via Multer, and cloud
          media storage on Cloudinary.
        </p>
      </Row>

      {/* ── Developer ────────────────────────────────────────────── */}
      <Row id="about" label="Meet the Developer" alt>
        <div className="flex flex-col sm:flex-row gap-10 items-start">
          {/* Photo */}
          <div className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-premium-accent rounded-full scale-105 opacity-0 group-hover:opacity-20 transition-opacity" />
            <img
              src="https://github.com/Kush1309.png"
              alt="Kushagra Saxena"
              className="w-24 h-24 rounded-full border-2 border-white shadow-lg object-cover relative z-10"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=Kushagra+Saxena&background=B8860B&color=fff&size=96`;
              }}
            />
          </div>
          {/* Info */}
          <div className="flex-1">
            <p className="text-2xl font-medium text-premium-heading">Kushagra Saxena</p>
            <p className="text-sm text-premium-accent font-semibold tracking-widest uppercase mt-2">B.Tech Student · MERN Stack Developer</p>
            <p className="text-base text-premium-body/80 mt-6 leading-relaxed max-w-2xl">
              Passionate about building production-ready full-stack applications. MonkTube is my major
              project demonstrating the complete MERN stack — from database design and JWT auth to
              cloud integrations and a fully connected React frontend.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              <a href="https://github.com/Kush1309" target="_blank" rel="noopener noreferrer"
                className="text-sm font-bold text-premium-heading hover:text-premium-accent border-b border-transparent hover:border-premium-accent transition-all pb-1">
                GitHub Profile
              </a>
              <a href="https://github.com/Kush1309" target="_blank" rel="noopener noreferrer"
                className="text-sm font-bold text-premium-heading hover:text-premium-accent border-b border-transparent hover:border-premium-accent transition-all pb-1">
                View Source Code
              </a>
            </div>
          </div>
        </div>
      </Row>

    </div>
  );
};

export default Landing;
