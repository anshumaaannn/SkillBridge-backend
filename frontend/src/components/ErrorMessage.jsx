import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;

  let message = typeof error === 'string' ? error : error?.message || 'An error occurred';

  if (error?.status === 401) {
    message = 'Your session has expired. Please log in again.';
  } else if (error?.status === 403) {
    message = error?.message || "You don't have permission to perform this action.";
  } else if (error?.status === 404) {
    message = error?.message || 'The requested resource was not found.';
  } else if (error?.status === 409) {
    message = error?.message || 'A conflict occurred. Resource already exists.';
  }

  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4 my-4 text-sm text-red-700 flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-red-800 underline hover:text-red-900"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
