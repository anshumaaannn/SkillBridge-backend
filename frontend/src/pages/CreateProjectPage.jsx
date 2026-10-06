import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const CreateProjectPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
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
    if (!formData.title || !formData.description) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : 0.0,
      };

      const res = await api.projects.create(payload);
      navigate(`/projects/${res.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Post a New Project</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <ErrorMessage error={error} />

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Build REST API for Inventory System"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe requirements, deliverables, tech stack preferences, and any milestones..."
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-700">
              Budget ($ USD)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              min="0"
              step="0.01"
              value={formData.budget}
              onChange={handleChange}
              placeholder="500.00"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <Link
              to="/projects"
              className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Publish Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
