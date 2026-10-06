import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-slate-800">SkillBridge</span>
            <span className="text-slate-400 text-sm">|</span>
            <span className="text-xs text-slate-500">Connect skills with opportunities.</span>
          </div>

          <div className="flex space-x-6 text-sm text-slate-500">
            <Link to="/projects" className="hover:text-slate-900 transition-colors">
              Browse Projects
            </Link>
            <Link to="/skills" className="hover:text-slate-900 transition-colors">
              Skills
            </Link>
            <Link to="/register" className="hover:text-slate-900 transition-colors">
              Join SkillBridge
            </Link>
          </div>

          <div className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} SkillBridge MVP. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
