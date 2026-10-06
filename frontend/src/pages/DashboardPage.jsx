import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { 
  Briefcase, 
  Award, 
  FileText, 
  User, 
  ArrowRight, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  FolderOpen
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [skills, setSkills] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [profile, setProfile] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [skillsRes, myProjectsRes, allProjectsRes, appsRes, profileRes] = await Promise.all([
        api.skills.getMine().catch(() => ({ skills: [] })),
        api.projects.getMine().catch(() => []),
        api.projects.getAll().catch(() => []),
        api.applications.getMine().catch(() => []),
        api.profile.getMine().catch(() => null),
      ]);

      setSkills(skillsRes.skills || []);
      setMyProjects(myProjectsRes || []);
      setAllProjects(allProjectsRes || []);
      setMyApplications(appsRes || []);
      setProfile(profileRes);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Greeting */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome, {profile?.name || user?.name}!
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
              {user?.role}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {profile?.title || 'Student & Professional on SkillBridge'} {profile?.location && `• ${profile.location}`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create Project
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <User className="w-4 h-4 mr-1.5" />
            View Profile
          </Link>
        </div>
      </div>

      <ErrorMessage error={error} onRetry={fetchDashboardData} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          to="/skills"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              My Skills
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{skills.length}</div>
          <p className="mt-1 text-xs text-slate-500">Platform skills attached</p>
        </Link>

        <Link
          to="/projects"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Open Projects
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{allProjects.length}</div>
          <p className="mt-1 text-xs text-slate-500">Available to browse & apply</p>
        </Link>

        <Link
          to="/projects"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              My Projects
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{myProjects.length}</div>
          <p className="mt-1 text-xs text-slate-500">Projects created by you</p>
        </Link>

        <Link
          to="/applications"
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              My Applications
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{myApplications.length}</div>
          <p className="mt-1 text-xs text-slate-500">Submitted proposals</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Applications */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Recent Applications</h2>
            <Link to="/applications" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View all &rarr;
            </Link>
          </div>

          {myApplications.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No applications yet"
              description="Browse open projects and submit a proposal to get started."
              actionText="Browse Projects"
              actionLink="/projects"
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {myApplications.slice(0, 4).map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <Link
                      to={`/projects/${app.projectId}`}
                      className="text-sm font-medium text-slate-900 hover:text-brand-600 line-clamp-1"
                    >
                      {app.projectTitle}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {app.message || 'No pitch message included'}
                    </p>
                  </div>
                  <div className="ml-4 shrink-0">
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: My Projects or Quick Skills */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Created Projects</h2>
            <Link to="/projects/new" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              + Post New
            </Link>
          </div>

          {myProjects.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No projects posted yet"
              description="Have work you need completed? Post a project to receive proposals."
              actionText="Create Project"
              actionLink="/projects/new"
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {myProjects.slice(0, 4).map((proj) => (
                <div key={proj.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <Link
                      to={`/projects/${proj.id}`}
                      className="text-sm font-medium text-slate-900 hover:text-brand-600 line-clamp-1"
                    >
                      {proj.title}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>${proj.budget?.toFixed(2)}</span>
                      <span>•</span>
                      <span className="uppercase text-slate-400 font-semibold">{proj.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/projects/${proj.id}/applications`}
                      className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      Applications
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
