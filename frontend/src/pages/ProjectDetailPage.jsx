import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { 
  ArrowLeft, 
  DollarSign, 
  User, 
  Calendar, 
  Edit3, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Users,
  Briefcase
} from 'lucide-react';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application form state (for non-owners)
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  // Deletion state
  const [deleting, setDeleting] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.projects.getById(id);
      setProject(data);
    } catch (err) {
      setError(err.message || 'Failed to load project.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError(null);
    setApplySuccess(false);

    try {
      await api.projects.apply(id, { message });
      setApplySuccess(true);
      setMessage('');
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await api.projects.delete(id);
      navigate('/projects');
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading project details..." />;
  }

  if (error && !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorMessage error={error} onRetry={fetchProject} />
        <Link to="/projects" className="mt-4 inline-flex items-center text-sm font-medium text-brand-600">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to all projects
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === project.ownerId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>

        {isOwner && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/projects/${id}/applications`}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Users className="w-4 h-4 mr-1.5 text-slate-500" />
              View Applications
            </Link>
            <Link
              to={`/projects/${id}/edit`}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-1.5 text-slate-500" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-3 py-1.5 border border-red-200 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <ErrorMessage error={error} />

      {/* Main Project Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {project.status || 'OPEN'}
            </span>
            {isOwner && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                You are the Owner
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2">
            <div className="flex items-center space-x-1 font-semibold text-slate-900 text-base">
              <span>Budget: ${project.budget != null ? project.budget.toFixed(2) : '0.00'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4 text-slate-400" />
              <span>Posted by <strong className="text-slate-700">{project.ownerName || 'Client'}</strong></span>
            </div>
            {project.createdAt && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">Project Description</h2>
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-lg border border-slate-100">
            {project.description}
          </div>
        </div>
      </div>

      {/* Application Submission Section (for non-owners) */}
      {!isOwner && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">Apply to this Project</h2>
          </div>

          <p className="text-sm text-slate-500">
            Explain why you are the best fit for this project, relevant skills, and your estimated turnaround time.
          </p>

          <ErrorMessage error={applyError} />

          {applySuccess ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Application submitted successfully!</p>
                <p className="text-xs text-emerald-700 mt-1">
                  The project owner has received your proposal. You can track status updates in your{' '}
                  <Link to="/applications" className="underline font-semibold">
                    Applications
                  </Link>{' '}
                  page.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4 pt-2">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                  Your Proposal Pitch (Optional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself, your experience with this tech stack, and why you're interested..."
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={applying}
                className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none disabled:opacity-50 transition-colors"
              >
                {applying ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
