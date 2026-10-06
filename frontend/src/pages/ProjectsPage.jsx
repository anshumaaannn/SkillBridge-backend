import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { 
  Briefcase, 
  PlusCircle, 
  Search, 
  DollarSign, 
  Calendar, 
  User, 
  ArrowRight,
  FolderOpen
} from 'lucide-react';

export const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('all'); // 'all' or 'my'
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = tab === 'my' ? await api.projects.getMine() : await api.projects.getAll();
      setProjects(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [tab]);

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase();
    return (
      project.title?.toLowerCase().includes(term) ||
      project.description?.toLowerCase().includes(term) ||
      project.ownerName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Opportunities</h1>
          <p className="mt-1 text-sm text-slate-500">
            Discover real-world projects posted by clients and students.
          </p>
        </div>

        <Link
          to="/projects/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Create Project
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'all'
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setTab('my')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'my'
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Projects
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="block w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      <ErrorMessage error={error} onRetry={fetchProjects} />

      {/* Projects List */}
      {loading ? (
        <LoadingState message="Loading projects..." />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={tab === 'my' ? FolderOpen : Briefcase}
          title={tab === 'my' ? 'You have not created any projects' : 'No projects found'}
          description={
            tab === 'my'
              ? 'Have work that needs to be done? Post a project to find skilled talent.'
              : searchTerm
              ? 'No projects match your search criteria. Try a different query.'
              : 'There are currently no projects available.'
          }
          actionText={tab === 'my' ? 'Create a Project' : undefined}
          actionLink={tab === 'my' ? '/projects/new' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isOwner = user?.id === project.ownerId;
            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow transition-all flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {project.status || 'OPEN'}
                    </span>
                    {isOwner && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                        Your Project
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-2">
                    {project.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1 font-semibold text-slate-900 text-sm">
                      <span>${project.budget != null ? project.budget.toFixed(2) : '0.00'}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{project.ownerName || 'Client'}</span>
                    </div>
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="w-full inline-flex items-center justify-center px-3 py-2 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
                  >
                    View Details
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
