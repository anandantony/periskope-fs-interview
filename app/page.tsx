"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";
import { GroupsTable } from "@/components/GroupsTable";
import { SidePanel } from "@/components/SidePanel";
import { useWhatsAppGroups } from "@/lib/hooks";
import { WhatsAppGroup } from "@/types";
import { Loader } from "lucide-react";

export default function HomePage() {
  const [selectedGroup, setSelectedGroup] = useState<WhatsAppGroup | null>(
    null,
  );
  const [selectedPhone, setSelectedPhone] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTermState] = useState("");
  const [selectedProject, setSelectedProjectState] = useState("");
  const [selectedLabels, setSelectedLabelsState] = useState<string[]>([]);
  const { groups, loading, error, paginationLoading, pagination, setPage, setPageSize, projects, labels, projectsLoading, labelsLoading } =
    useWhatsAppGroups({
      phoneNumber: selectedPhone,
      searchTerm: searchTerm,
      projectFilter: selectedProject,
      labelFilter: selectedLabels
    });

  // Connect local state changes to hook functions
  const handleSearchChange = (term: string) => {
    setSearchTermState(term);
  };

  const handleProjectFilterChange = (project: string) => {
    setSelectedProjectState(project);
  };

  const handleLabelFilterChange = (labels: string[]) => {
    setSelectedLabelsState(labels);
  };

  const handleGroupClick = (group: WhatsAppGroup) => {
    setSelectedGroup(group);
  };

  // Only show full loader on initial load with no data
  const showFullLoader = loading && groups.length === 0;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopNav phoneNumber={selectedPhone} onPhoneNumberChange={setSelectedPhone} />
      
      <div className="flex-1 flex">
        <Sidebar />

        <div className="flex-1 flex">
        <div className="flex-1 overflow-auto flex flex-col">
          {showFullLoader && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-4">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-gray-600">Loading WhatsApp groups...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <p className="font-semibold">Error loading groups</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!showFullLoader && !error && (
            <GroupsTable
              groups={groups}
              onGroupClick={handleGroupClick}
              selectedPhone={selectedPhone}
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              paginationLoading={paginationLoading || loading}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onSearchChange={handleSearchChange}
              onProjectFilterChange={handleProjectFilterChange}
              onLabelFilterChange={handleLabelFilterChange}
              projects={projects}
              labels={labels}
              projectsLoading={projectsLoading}
              labelsLoading={labelsLoading}
              className="rounded-none pb-0 border-0"
            />
          )}
        </div>

        <SidePanel selectedGroup={selectedGroup} />
      </div>
      </div>
    </div>
  );
}
