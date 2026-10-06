import React from 'react';

export const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-slate-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-3"></div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};
