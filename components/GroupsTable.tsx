"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WhatsAppGroup } from "@/types";
import { Users, Clock, MoreHorizontal, Search, Filter, Send, ChevronDown } from "lucide-react";
import { TableSkeleton } from "@/components/TableSkeleton";

interface GroupsTableProps {
  groups: WhatsAppGroup[];
  selectedPhone?: string | undefined;
  onGroupClick?: (group: WhatsAppGroup) => void;
  className?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  loading?: boolean;
  paginationLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

// Project color mapping
const projectColors: Record<string, string> = {
  "Demo": "bg-blue-100 text-blue-700",
  "Clients": "bg-orange-100 text-orange-700",
  "Professional": "bg-purple-100 text-purple-700",
  "Social": "bg-green-100 text-green-700",
  "Health": "bg-red-100 text-red-700",
  "Education": "bg-indigo-100 text-indigo-700",
  "Lifestyle": "bg-pink-100 text-pink-700",
  "General": "bg-gray-100 text-gray-700",
};

// Label color mapping
const labelColors: Record<string, string> = {
  "Active": "bg-green-100 text-green-700",
  "Inactive": "bg-gray-100 text-gray-700",
  "Important": "bg-red-100 text-red-700",
  "Urgent": "bg-orange-100 text-orange-700",
  "Daily": "bg-blue-100 text-blue-700",
  "Community": "bg-purple-100 text-purple-700",
  "Archive": "bg-gray-100 text-gray-700",
  "Wellness": "bg-green-100 text-green-700",
  "Casual": "bg-blue-100 text-blue-700",
  "Monthly": "bg-indigo-100 text-indigo-700",
  "Creative": "bg-pink-100 text-pink-700",
  "Planning": "bg-yellow-100 text-yellow-700",
};

export function GroupsTable({
  groups,
  onGroupClick,
  className,
  selectedPhone,
  page = 1,
  pageSize = 10,
  total = 0,
  totalPages = 0,
  loading = false,
  paginationLoading = false,
  onPageChange,
  onPageSizeChange,
}: GroupsTableProps) {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRowClick = (group: WhatsAppGroup) => {
    setSelectedGroup(group.id);
    onGroupClick?.(group);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-4 border-b">
        {/* Top Row - Title and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-gray-700" />
              <p className="text-2xl font-bold text-gray-900">groups</p>
            </div>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {total}
            </Badge>
            {selectedPhone ? (
              <div className="ml-3 text-sm text-gray-600">{selectedPhone}</div>
            ) : (
              <div className="ml-3 text-sm text-gray-500">All phone numbers</div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-gray-300 hover:bg-gray-50"
            >
              <Send className="w-4 h-4" />
              Bulk message
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-gray-300 hover:bg-gray-50"
            >
              Group Actions
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Bottom Row - Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-gray-300 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="sticky top-0 bg-white border-b">
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[280px]">Group Name</TableHead>
                <TableHead className="w-[120px]">Project</TableHead>
                <TableHead className="w-[160px]">Labels</TableHead>
                <TableHead className="w-[100px]">Members</TableHead>
                <TableHead className="w-[120px]">Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginationLoading ? (
                <TableSkeleton rows={pageSize} />
              ) : filteredGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No groups found
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroups.map((group) => (
                  <TableRow
                    key={group.id}
                    className={cn(
                      "cursor-pointer hover:bg-gray-50 transition-colors border-b",
                      selectedGroup === group.id && "bg-blue-50",
                    )}
                    onClick={() => handleRowClick(group)}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {group.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {group.name}
                            {group.is_active && (
                              <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                          </div>
                          {group.description && (
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                              {group.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs whitespace-nowrap",
                          projectColors[group.project || "General"] ||
                            "bg-gray-100 text-gray-700",
                        )}
                        variant="outline"
                      >
                        #{group.project || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {group.labels && group.labels.length > 0 ? (
                          group.labels.slice(0, 2).map((label: string, index: number) => (
                            <Badge
                              key={index}
                              className={cn(
                                "text-xs",
                                labelColors[label] || "bg-gray-100 text-gray-700",
                              )}
                              variant="outline"
                            >
                              {label.length > 8 ? `${label.substring(0, 8)}...` : label}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            No labels
                          </Badge>
                        )}
                        {group.labels && group.labels.length > 2 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{group.labels.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600 font-medium">
                        {group.member_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {formatTime(group.updated_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{(page - 1) * pageSize + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(page * pageSize, total)}
                </span>{' '}
                of <span className="font-semibold">{total}</span> groups
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm text-gray-600">
                  Per page:
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                  className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(page - 1)}
                disabled={page === 1}
                className="h-8"
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange?.(pageNum)}
                      className={cn(
                        "h-8 w-8 rounded border text-sm font-medium transition-colors",
                        pageNum === page
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(page + 1)}
                disabled={page === totalPages}
                className="h-8"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
