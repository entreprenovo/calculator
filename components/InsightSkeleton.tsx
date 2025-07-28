
import React from 'react';
import { SparkleIcon } from './icons';

const InsightSkeleton: React.FC = () => (
    <div className="mt-6 p-6 bg-slate-100 rounded-xl border border-emerald-500/30 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
            <SparkleIcon className="text-emerald-500" />
            <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
        </div>
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex-shrink-0 mt-1"></div>
                    <div className="h-4 bg-slate-200 rounded w-full flex-grow"></div>
                </div>
            ))}
        </div>
    </div>
);

export default InsightSkeleton;
