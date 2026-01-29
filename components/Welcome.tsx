import React from 'react';
import { BrainCircuit, ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-elite-black text-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-elite-accent/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-elite-success/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="z-10 max-w-2xl flex flex-col items-center animate-fade-in-up">
        <div className="bg-elite-gray p-4 rounded-2xl mb-8 border border-white/5 shadow-2xl">
          <BrainCircuit size={64} className="text-elite-accent" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
          Elite Life Architect AI
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg font-light leading-relaxed">
          The sole strategic engine you will ever need. <br/>
          <span className="text-elite-accent font-medium">Radical. Unconventional. Absolute.</span>
        </p>

        <ul className="text-left text-sm text-gray-500 mb-10 space-y-2 border-l-2 border-elite-gray pl-4">
          <li>• Deconstructs Identity & Psyche</li>
          <li>• Maps "Black Swan" Career Pivots</li>
          <li>• Designs Out-of-the-box Strategies</li>
          <li>• Exposes Fatal Blind Spots</li>
        </ul>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-elite-accent rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-elite-accent hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
        >
          <span>Begin Assessment</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-6 text-xs text-gray-600 uppercase tracking-widest">
          Est. Time: 5-10 Minutes
        </p>
      </div>
    </div>
  );
};

export default Welcome;