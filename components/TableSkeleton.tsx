"use client";

interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({ rows = 10 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b hover:bg-gray-50">
          {/* Checkbox */}
          <td className="px-4 py-4">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          </td>
          {/* Group Name */}
          <td className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
              </div>
            </div>
          </td>
          {/* Project */}
          <td className="px-4 py-4">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          </td>
          {/* Labels */}
          <td className="px-4 py-4">
            <div className="flex gap-1">
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-14 animate-pulse" />
            </div>
          </td>
          {/* Members */}
          <td className="px-4 py-4">
            <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
          </td>
          {/* Last Active */}
          <td className="px-4 py-4">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          </td>
          {/* Actions */}
          <td className="px-4 py-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
}
