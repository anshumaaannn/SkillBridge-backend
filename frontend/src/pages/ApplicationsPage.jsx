import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { FileText, Clock, CheckCircle, XCircle, ArrowRight, ExternalLink } from 'lucide-react';

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.applications.getMine();
      setApplications(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-600" />
            Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingState message="Loading your applications..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Project Applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track the status of proposals you have submitted to client projects.
        </p>
      </div>

      <ErrorMessage error={error} onRetry={fetchApplications} />

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="You haven't applied to any projects yet"
          description="Browse available project postings on SkillBridge and submit your first pitch."
          actionText="Browse Open Projects"
          actionLink="/projects"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {applications.map((app) => (
            <div key={app.id} className="p-6 space-y-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Link
                  to={`/projects/${app.projectId}`}
                  className="text-base font-bold text-slate-900 hover:text-brand-600 flex items-center space-x-1.5"
                >
                  <span>{app.projectTitle}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <div className="flex items-center space-x-3 shrink-0">
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {app.message && (
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700 block text-xs mb-1">Your Proposal:</span>
                  <p className="whitespace-pre-line">{app.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</span>
                <Link
                  to={`/projects/${app.projectId}`}
                  className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center"
                >
                  View Project <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
