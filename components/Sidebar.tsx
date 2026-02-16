'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Phone, 
  Archive,
  Star,
  Search
} from 'lucide-react'

const sidebarItems = [
  { icon: MessageSquare, label: 'Chats', active: true },
  { icon: Users, label: 'Groups', active: false },
  { icon: Phone, label: 'Calls', active: false },
  { icon: Archive, label: 'Archived', active: false },
  { icon: Star, label: 'Starred', active: false },
]

const sidebarBottomItems = [
  { icon: Settings, label: 'Settings', active: false },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn(
      "w-64 bg-white border-r border-gray-200 flex flex-col h-full",
      className
    )}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">WhatsApp</h1>
            <p className="text-xs text-gray-500">+1 234 567 8900</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant={item.active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start mb-1",
              item.active && "bg-green-50 text-green-700 hover:bg-green-100"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      <Separator />

      {/* Bottom Items */}
      <div className="p-2">
        {sidebarBottomItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
