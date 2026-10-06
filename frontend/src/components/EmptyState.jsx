import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white my-4">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-500">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {(actionText && actionLink) && (
        <div className="mt-5">
          <Link
            to={actionLink}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            {actionText}
          </Link>
        </div>
      )}
      {(actionText && onAction) && (
        <div className="mt-5">
          <button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
