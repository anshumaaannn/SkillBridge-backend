import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  User, 
  Award, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  PlusCircle
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand-700 bg-brand-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'text-brand-700 bg-brand-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Skill<span className="text-brand-600">Bridge</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <div className="hidden md:flex md:items-center md:space-x-1 ml-8">
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/projects" className={navLinkClass}>
                  Projects
                </NavLink>
                <NavLink to="/skills" className={navLinkClass}>
                  Skills
                </NavLink>
                <NavLink to="/applications" className={navLinkClass}>
                  Applications
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </div>
            )}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/projects/new"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Post Project
                </Link>

                <div className="h-6 w-px bg-slate-200" />

                <div className="flex items-center space-x-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">{user?.name}</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="pb-3 border-b border-slate-200 mb-2">
                <div className="font-medium text-slate-900">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email} • {user?.role}</div>
              </div>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/projects" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                Browse Projects
              </NavLink>
              <NavLink to="/projects/new" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                + Post a Project
              </NavLink>
              <NavLink to="/skills" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                My Skills
              </NavLink>
              <NavLink to="/applications" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                Applications
              </NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
                Profile
              </NavLink>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
