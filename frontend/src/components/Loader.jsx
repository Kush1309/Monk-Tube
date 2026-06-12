import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Simple, standard rotating border loader */}
      <div className="w-10 h-10 border-4 border-monk-light border-t-monk-accent rounded-full animate-spin"></div>
      <p className="mt-3 text-sm font-medium text-monk-dark/70 tracking-wide">{message}</p>
    </div>
  );
};

export default Loader;
