import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { 
  User, 
  MapPin, 
  ExternalLink, 
  Edit3, 
  Award, 
  Github, 
  Linkedin,
  Briefcase
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, skillsData] = await Promise.all([
        api.profile.getMine(),
        api.skills.getMine().catch(() => ({ skills: [] })),
      ]);
      setProfile(profileData);
      setSkills(skillsData.skills || []);
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ErrorMessage error={error} onRetry={fetchProfileData} />

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-800" />
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-12 mb-4 gap-4">
            <div className="flex items-end space-x-4">
              {profile?.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-brand-50 flex items-center justify-center text-brand-700 text-3xl font-bold">
                  {profile?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="mb-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-slate-900">{profile?.name || user?.name}</h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                    {user?.role}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {profile?.title || 'Professional Title Not Set'}
                </p>
              </div>
            </div>

            <div>
              <Link
                to="/profile/edit"
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Location & Social Links */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2 border-t border-slate-100">
            {profile?.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl.startsWith('http') ? profile.githubUrl : `https://${profile.githubUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl.startsWith('http') ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-slate-600 hover:text-brand-600 font-medium transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">About / Bio</h2>
        {profile?.bio ? (
          <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
            {profile.bio}
          </p>
        ) : (
          <p className="text-sm text-slate-400 italic">
            No bio provided yet. Click "Edit Profile" to add information about your background and experience.
          </p>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">Skills ({skills.length})</h2>
          </div>
          <Link
            to="/skills"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Manage Skills &rarr;
          </Link>
        </div>

        {skills.length === 0 ? (
          <p className="text-sm text-slate-400 italic">
            No skills attached yet.{' '}
            <Link to="/skills" className="text-brand-600 hover:underline not-italic">
              Add skills from the platform catalog.
            </Link>
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
