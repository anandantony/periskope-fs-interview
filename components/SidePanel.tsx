"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WhatsAppGroup } from "@/types";
import { Users, Calendar, MessageSquare, Settings, MoreHorizontal, LogOut } from "lucide-react";

interface SidePanelProps {
  selectedGroup?: WhatsAppGroup | null;
  className?: string;
}

export function SidePanel({ selectedGroup, className }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "logs">("overview");
  const tabs: Array<"overview" | "members" | "logs"> = ["overview", "members", "logs"];

  const createdAtText = (() => {
    if (!selectedGroup?.created_at) return "";
    const d = new Date(selectedGroup.created_at);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  })();

  if (!selectedGroup) {
    return (
      <div
        className={cn(
          "w-96 bg-gray-50 border-l border-gray-200 flex items-center justify-center",
          className,
        )}
      >
        <div className="text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">Select a group to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-96 bg-white border-l border-gray-200 flex flex-col h-full", className)}>
      {/* Header */}
      <CardHeader className="pt-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">{selectedGroup.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold text-gray-900 truncate">
                {selectedGroup.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  className={cn(
                    "text-xs",
                    selectedGroup.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800",
                  )}
                  variant="outline"
                >
                  {selectedGroup.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </CardHeader>

      <Separator className="mt-4" />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-600 hover:text-gray-900",
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <CardContent className="flex-1 overflow-auto py-4 space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Description */}
            {selectedGroup.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600">{selectedGroup.description}</p>
              </div>
            )}

            {/* Project */}
            {selectedGroup.project && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Project</h3>
                <Badge className="bg-blue-100 text-blue-800">#{selectedGroup.project}</Badge>
              </div>
            )}

            {/* Labels */}
            {selectedGroup.labels && selectedGroup.labels.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGroup.labels.map((label: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-600">Members</div>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {selectedGroup.member_count}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-600">Status</div>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  {selectedGroup.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Created {createdAtText}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Group Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Leave Group
              </Button>
            </div>
          </>
        )}

        {activeTab === "members" && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Members ({selectedGroup.member_count})
            </h3>
            <p className="text-sm text-gray-500">Member list not implemented</p>
          </div>
        )}

        {activeTab === "logs" && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity Logs</h3>
            <p className="text-sm text-gray-500">Activity logs not implemented</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
