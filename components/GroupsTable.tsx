'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WhatsAppGroup } from '@/types'
import { Users, Clock, MoreHorizontal } from 'lucide-react'

interface GroupsTableProps {
  groups: WhatsAppGroup[]
  onGroupClick?: (group: WhatsAppGroup) => void
  className?: string
}

export function GroupsTable({ groups, onGroupClick, className }: GroupsTableProps) {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)

  const handleRowClick = (group: WhatsAppGroup) => {
    setSelectedGroup(group.id)
    onGroupClick?.(group)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2" />
          WhatsApp Groups
          <Badge variant="secondary" className="ml-2">
            {groups.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead className="w-[300px]">Group Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow
                  key={group.id}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedGroup === group.id && "bg-blue-50"
                  )}
                  onClick={() => handleRowClick(group)}
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {group.name}
                        </div>
                        {group.description && (
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {group.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      {group.member_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {group.phone_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(group.updated_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={group.is_active ? "default" : "secondary"}
                      className={cn(
                        group.is_active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      {group.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
