import Skeleton from "./Skeleton.tsx";
import * as React from "react";

const TableSkeleton: React.FC = () => (
    <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 flex-1" />
            </div>
        ))}
    </div>
);

export default TableSkeleton;