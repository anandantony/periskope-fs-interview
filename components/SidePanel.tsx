'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WhatsAppGroup } from '@/types'
import { 
  Users, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Settings,
  MoreHorizontal,
  Archive,
  Star,
  Bell,
  Search
} from 'lucide-react'

interface SidePanelProps {
  selectedGroup?: WhatsAppGroup | null
  className?: string
}

export function SidePanel({ selectedGroup, className }: SidePanelProps) {
  if (!selectedGroup) {
    return (
      <div className={cn(
        "w-80 bg-gray-50 border-l border-gray-200 flex items-center justify-center",
        className
      )}>
        <div className="text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">Select a group to view details</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "w-80 bg-white border-l border-gray-200 flex flex-col h-full",
      className
    )}>
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {selectedGroup.name}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <Badge 
                  variant={selectedGroup.is_active ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    selectedGroup.is_active 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {selectedGroup.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <Separator />

      {/* Group Info */}
      <CardContent className="flex-1 space-y-6">
        {/* Description */}
        {selectedGroup.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{selectedGroup.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Members</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {selectedGroup.member_count}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Messages</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">1.2k</p>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{selectedGroup.phone_number}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Created {new Date(selectedGroup.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              View Members
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Group Settings
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-4">
          <Button variant="ghost" size="sm" className="flex-1">
            <Star className="w-4 h-4 mr-1" />
            Star
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Bell className="w-4 h-4 mr-1" />
            Mute
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Archive className="w-4 h-4 mr-1" />
            Archive
          </Button>
        </div>
      </CardContent>
    </div>
  )
}
