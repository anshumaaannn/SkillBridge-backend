import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorMessage } from '../components/ErrorMessage';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'FREELANCER',
    professionalTitle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        professionalTitle: formData.professionalTitle || undefined,
      });

      // Auto login after successful registration
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex w-10 h-10 rounded-lg bg-brand-600 items-center justify-center text-white font-bold text-xl shadow-sm mb-3">
            S
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create your SkillBridge account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <ErrorMessage error={error} />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                I want to join as:
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium cursor-pointer transition-colors ${
                    formData.role === 'FREELANCER'
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="FREELANCER"
                    checked={formData.role === 'FREELANCER'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  Freelancer / Student
                </label>
                <label
                  className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium cursor-pointer transition-colors ${
                    formData.role === 'CLIENT'
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="CLIENT"
                    checked={formData.role === 'CLIENT'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  Client / Hirer
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="professionalTitle" className="block text-sm font-medium text-slate-700">
                Professional Title (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input
                  id="professionalTitle"
                  name="professionalTitle"
                  type="text"
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer, CS Student"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
