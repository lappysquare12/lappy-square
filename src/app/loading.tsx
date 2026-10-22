'use client';

import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="w-full fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div className="h-0.5 w-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 w-1/3 animate-[shimmer_1s_infinite_linear]" />
      </div>
    </div>
  );
}
