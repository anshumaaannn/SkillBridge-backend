import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Award, Plus, X, Check, Search } from 'lucide-react';

export const SkillsPage = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchSkillsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mineRes, allRes] = await Promise.all([
        api.skills.getMine(),
        api.skills.getAll(),
      ]);
      setUserSkills(mineRes.skills || []);
      setAllSkills(allRes || []);
    } catch (err) {
      setError(err.message || 'Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const handleAddSkill = async (skillId) => {
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.skills.add(skillId);
      setUserSkills(res.skills || []);
      setSuccessMessage('Skill added successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add skill.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.skills.remove(skillId);
      setUserSkills(res.skills || []);
      setSuccessMessage('Skill removed successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to remove skill.');
    } finally {
      setActionLoading(false);
    }
  };

  const userSkillIds = new Set(userSkills.map((s) => s.id));
  const availableSkills = allSkills
    .filter((s) => !userSkillIds.has(s.id))
    .filter((s) => s.name.toLowerCase().includes(searchFilter.toLowerCase()));

  if (loading) {
    return <LoadingState message="Loading skills catalog..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Skills Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Attach skills from the platform catalog to showcase your technical competencies to clients.
        </p>
      </div>

      <ErrorMessage error={error} onRetry={fetchSkillsData} />

      {successMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Current User's Skills */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">
              Your Attached Skills ({userSkills.length})
            </h2>
          </div>
        </div>

        {userSkills.length === 0 ? (
          <EmptyState
            icon={Award}
            title="You haven't added any skills yet"
            description="Select skills from the catalog below to add them to your profile."
          />
        ) : (
          <div className="flex flex-wrap gap-2.5 pt-2">
            {userSkills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center pl-3 pr-2 py-1.5 rounded-lg text-sm font-medium bg-brand-50 text-brand-800 border border-brand-200 shadow-sm group"
              >
                <span>{skill.name}</span>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="ml-2 p-0.5 rounded-full text-brand-500 hover:text-red-600 hover:bg-white transition-colors focus:outline-none"
                  title={`Remove ${skill.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Available Skills Catalog */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Available Skills Catalog</h2>
            <p className="text-xs text-slate-500">
              Select existing platform skills to attach to your profile.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search skills..."
              className="block w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>

        {availableSkills.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            {allSkills.length === userSkills.length
              ? 'You have attached all available skills from the catalog!'
              : 'No matching skills found in the catalog.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
            {availableSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                disabled={actionLoading}
                onClick={() => handleAddSkill(skill.id)}
                className="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-slate-50/50 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-800 transition-colors group text-left disabled:opacity-50"
              >
                <span className="truncate">{skill.name}</span>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-brand-600 shrink-0 ml-1.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
