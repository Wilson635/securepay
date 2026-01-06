import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

export const TableSkeleton: React.FC = () => (
    <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
            <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 flex-1" />
                </div>
            </div>
        ))}
    </div>
);
