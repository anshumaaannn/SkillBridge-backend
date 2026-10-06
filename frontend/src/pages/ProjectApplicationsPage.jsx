import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  Calendar, 
  Check, 
  X, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';

export const ProjectApplicationsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projData, appsData] = await Promise.all([
        api.projects.getById(id),
        api.projects.getApplications(id),
      ]);
      setProject(projData);
      setApplications(appsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load project applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdatingId(appId);
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await api.applications.updateStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: updated.status } : app))
      );
      setSuccessMsg(`Application marked as ${newStatus}.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

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
    return <LoadingState message="Loading applications for project..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Project Details
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-1">
        <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
          Review Proposals
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Applications for "{project?.title}"
        </h1>
        <p className="text-sm text-slate-500">
          Review candidates who applied to your project and update their status.
        </p>
      </div>

      <ErrorMessage error={error} onRetry={fetchData} />

      {successMsg && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applications received yet"
          description="Candidates who apply to this project will appear here for your review."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {applications.map((app) => (
            <div key={app.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {app.applicantName || 'Applicant'}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.applicantEmail}</span>
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'recently'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(app.status)}

                  <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                      disabled={updatingId === app.id || app.status === 'ACCEPTED'}
                      className="inline-flex items-center px-2.5 py-1.5 border border-green-200 rounded-md text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 transition-colors"
                      title="Accept application"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                      disabled={updatingId === app.id || app.status === 'REJECTED'}
                      className="inline-flex items-center px-2.5 py-1.5 border border-red-200 rounded-md text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
                      title="Reject application"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>

              {app.message && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700">
                  <span className="font-semibold text-slate-800 block text-xs mb-1">
                    Candidate Pitch / Cover Note:
                  </span>
                  <p className="whitespace-pre-line leading-relaxed">{app.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
