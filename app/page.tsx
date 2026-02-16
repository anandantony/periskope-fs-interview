"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { GroupsTable } from "@/components/GroupsTable";
import { SidePanel } from "@/components/SidePanel";
import { WhatsAppGroup } from "@/types";

// Mock data for demonstration
const mockGroups: WhatsAppGroup[] = [
  {
    id: 1,
    name: "Family Group",
    description: "Close family members chat",
    member_count: 12,
    phone_number: "+1 234 567 8900",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-02-16T14:20:00Z",
    is_active: true,
  },
  {
    id: 2,
    name: "Work Team",
    description: "Project team discussions",
    member_count: 8,
    phone_number: "+1 234 567 8900",
    created_at: "2024-01-20T09:15:00Z",
    updated_at: "2024-02-16T11:45:00Z",
    is_active: true,
  },
  {
    id: 3,
    name: "Friends Circle",
    description: "School and college friends",
    member_count: 25,
    phone_number: "+1 234 567 8900",
    created_at: "2024-01-10T16:20:00Z",
    updated_at: "2024-02-15T20:30:00Z",
    is_active: true,
  },
  {
    id: 4,
    name: "Book Club",
    description: "Monthly book discussions",
    member_count: 6,
    phone_number: "+1 234 567 8900",
    created_at: "2024-01-25T18:00:00Z",
    updated_at: "2024-02-14T19:15:00Z",
    is_active: true,
  },
  {
    id: 5,
    name: "Fitness Group",
    description: "Workout motivation and tips",
    member_count: 15,
    phone_number: "+1 234 567 8900",
    created_at: "2024-01-18T07:30:00Z",
    updated_at: "2024-02-16T06:45:00Z",
    is_active: true,
  },
  {
    id: 6,
    name: "Tech Enthusiasts",
    description: "Latest tech news and discussions",
    member_count: 32,
    phone_number: "+1 234 567 8900",
    created_at: "2024-01-12T12:00:00Z",
    updated_at: "2024-02-16T09:20:00Z",
    is_active: false,
  },
  {
    id: 7,
    name: "Recipe Exchange",
    description: "Share and discover recipes",
    member_count: 18,
    phone_number: "+1 234 567 8900",
    created_at: "2024-01-22T14:30:00Z",
    updated_at: "2024-02-13T16:45:00Z",
    is_active: true,
  },
  {
    id: 8,
    name: "Travel Planning",
    description: "Upcoming trip discussions",
    member_count: 10,
    phone_number: "+1 234 567 8900",
    created_at: "2024-01-28T10:15:00Z",
    updated_at: "2024-02-16T13:30:00Z",
    is_active: true,
  },
];

export default function HomePage() {
  const [selectedGroup, setSelectedGroup] = useState<WhatsAppGroup | null>(
    null,
  );

  const handleGroupClick = (group: WhatsAppGroup) => {
    setSelectedGroup(group);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex">
        <div className="flex-1 p-6 overflow-auto">
          <GroupsTable groups={mockGroups} onGroupClick={handleGroupClick} />
        </div>

        <SidePanel selectedGroup={selectedGroup} />
      </div>
    </div>
  );
}
