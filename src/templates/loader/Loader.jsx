import React from 'react';
import { GoLaw } from 'react-icons/go';

const Loader = () => {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin"></div>
          <GoLaw className="text-2xl text-amber-500 absolute" />
        </div>
        <p className="mt-4 text-slate-300 font-serif text-lg tracking-wide animate-pulse">
          Initializing LexFlow System...
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Establishing secure legal connection
        </p>
      </div>
    );
};

export default Loader;