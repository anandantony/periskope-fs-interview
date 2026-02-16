"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Users,
  Settings,
  Phone,
  FileText,
  HelpCircle,
  LayoutGrid,
  Search,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "#" },
  { icon: MessageCircle, label: "Chats", href: "#" },
  { icon: Users, label: "Groups", href: "#", active: true },
  { icon: Phone, label: "Contacts", href: "#" },
  { icon: FileText, label: "Logs", href: "#" },
  { icon: FileText, label: "Files", href: "#" },
];

const sidebarBottomItems = [
  { icon: Settings, label: "Settings", href: "#" },
  { icon: HelpCircle, label: "Help & Support", href: "#" },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "w-64 bg-white border-r border-gray-200 flex flex-col h-full",
        className,
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-green-500 font-bold text-sm">P</span>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base">Periskope</h1>
            <p className="text-xs text-gray-500">WhatsApp Admin</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <Separator />

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant={item.active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-gray-700 hover:bg-gray-100",
              item.active &&
                "bg-green-50 text-green-700 hover:bg-green-100 font-semibold",
            )}
            asChild={false}
          >
            <a href={item.href} className="w-full flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          </Button>
        ))}
      </nav>

      <Separator />

      {/* Bottom Items */}
      <div className="px-2 py-4 space-y-1">
        {sidebarBottomItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
            asChild={false}
          >
            <a href={item.href} className="w-full flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
