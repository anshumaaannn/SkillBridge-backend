import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, Save } from 'lucide-react';

export const EditProfilePage = () => {
  const { updateLocalUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    profileImageUrl: '',
    githubUrl: '',
    linkedinUrl: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profile.getMine();
        setFormData({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          location: data.location || '',
          profileImageUrl: data.profileImageUrl || '',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updated = await api.profile.updateMine(formData);
      if (updated.name) {
        updateLocalUser({ name: updated.name });
      }
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading profile details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/profile"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Profile
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Edit Profile</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <ErrorMessage error={error} />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Display Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Professional Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Backend Java Engineer, CS Undergraduate"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore, India"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
              Bio / Summary
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell others about your background, interests, and what you're working on..."
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="profileImageUrl" className="block text-sm font-medium text-slate-700">
              Profile Image URL
            </label>
            <input
              type="url"
              id="profileImageUrl"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700">
                GitHub URL / Username
              </label>
              <input
                type="text"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-700">
                LinkedIn URL
              </label>
              <input
                type="text"
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <Link
              to="/profile"
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
