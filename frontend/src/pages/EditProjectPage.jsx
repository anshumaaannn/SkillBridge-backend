import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, Save } from 'lucide-react';

export const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    status: 'OPEN',
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await api.projects.getById(id);
        if (user && project.ownerId !== user.id) {
          setError('You are not authorized to edit this project.');
          setLoading(false);
          return;
        }
        setFormData({
          title: project.title || '',
          description: project.description || '',
          budget: project.budget != null ? project.budget.toString() : '',
          status: project.status || 'OPEN',
        });
      } catch (err) {
        setError(err.message || 'Failed to load project.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user]);

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

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : 0.0,
        status: formData.status,
      };

      await api.projects.update(id, payload);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading project details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Project
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Edit Project</h1>
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
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Project Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-white"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <Link
              to={`/projects/${id}`}
              className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
