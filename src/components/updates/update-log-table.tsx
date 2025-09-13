"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Calendar,
  Clock,
  MoreHorizontal,
  Eye,
  Download,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import Image from 'next/image'

interface UpdateLog {
  id: string
  version: string
  title: string
  description: string
  date: string
  time: string
  author: {
    name: string
    avatar: string
    role: string
  }
  type: 'feature' | 'bugfix' | 'improvement' | 'security' | 'documentation'
  priority: 'low' | 'medium' | 'high' | 'critical'
  images?: {
    url: string
    alt: string
    caption?: string
  }[]
  tags: string[]
  status: 'completed' | 'in-progress' | 'planned'
}

const mockUpdates: UpdateLog[] = [
  {
    id: '1',
    version: 'v1.2.0',
    title: 'Cập nhật công cụ SEO Analyzer',
    description: 'Cập nhật công cụ SEO Analyzer với tính năng mới nhất, cải thiện độ chính xác của kết quả phân tích.',
    date: '2025-01-15',
    time: '14:30',
    author: {
      name: 'Rondev',
      avatar: '/avatars/01.png',
      role: 'Lead Developer'
    },
    type: 'improvement',
    priority: 'high',
    images: [
      {
        url: 'https://i.postimg.cc/BvmJxz50/78-F5-C96-B-AD3-D-4-D9-B-BA7-A-0162-C06-BA01-B.jpg',
        alt: 'Công cụ SEO Analyzer',
        caption: 'Công cụ SEO Analyzer với tính năng mới nhất sử dụng Google Gemini AI và cải thiện độ chính xác của kết quả phân tích.'
      }
    ],
    tags: ['SEO', 'Performance', 'Optimization'],
    status: 'completed'
  },
  {
    id: '2',
    version: 'v1.1.5',
    title: 'Cập nhật trang hướng dẫn sử dụng AI Docs',
    description: 'Cập nhật trang hướng dẫn sử dụng AI Docs với tính năng mới nhất, cải thiện trải nghiệm người dùng.',
    date: '2025-01-10',
    time: '09:15',
    author: {
      name: 'Rondev',
      avatar: '/avatars/02.png',
      role: 'Frontend Developer'
    },
    type: 'bugfix',
    priority: 'medium',
    images: [
      {
        url: 'https://i.postimg.cc/6pvMdvr6/Screenshot-11-9-2025-151931-aidocs-roncodes-site.jpg',
        alt: 'Screenshot trang hướng dẫn sử dụng AI Docs',
        caption: 'Trang hướng dẫn sử dụng AI Docs'
      }
    ],
    tags: ['Bug Fix', 'UI/UX', 'Display'],
    status: 'completed'
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'feature':
      return <TrendingUp className="w-4 h-4 text-green-500" />
    case 'bugfix':
      return <CheckCircle className="w-4 h-4 text-blue-500" />
    case 'improvement':
      return <TrendingUp className="w-4 h-4 text-orange-500" />
    case 'security':
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    case 'documentation':
      return <FileText className="w-4 h-4 text-purple-500" />
    default:
      return <FileText className="w-4 h-4 text-gray-500" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'planned':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function UpdateLogTable() {
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateLog | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Log</h1>
          <p className="text-muted-foreground">
            Lịch sử cập nhật và cải thiện của hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
          >
            Card View
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách cập nhật</CardTitle>
            <CardDescription>
              Chi tiết các phiên bản và cải thiện gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUpdates.map((update) => (
                  <TableRow key={update.id}>
                    <TableCell className="font-medium">{update.version}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(update.type)}
                        <span className="font-medium">{update.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {update.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(update.priority)}>
                        {update.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(update.status)}>
                        {update.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {update.date}
                        <Clock className="w-3 h-3 ml-2" />
                        {update.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={update.author.avatar} alt={update.author.name} />
                          <AvatarFallback>{update.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div className="font-medium">{update.author.name}</div>
                          <div className="text-muted-foreground">{update.author.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedUpdate(update)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View in GitHub
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {mockUpdates.map((update) => (
            <Card key={update.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(update.type)}
                    <div>
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="font-medium text-primary">{update.version}</span>
                        <Badge className={getPriorityColor(update.priority)}>
                          {update.priority}
                        </Badge>
                        <Badge className={getStatusColor(update.status)}>
                          {update.status}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedUpdate(update)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View in GitHub
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{update.description}</p>

                {/* Images Section */}
                {update.images && update.images.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Screenshots & Images</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {update.images.map((image, index) => (
                        <div key={index} className="space-y-2">
                          <div className="relative aspect-video rounded-lg overflow-hidden border">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {image.caption && (
                            <p className="text-xs text-muted-foreground text-center">
                              {image.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {update.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator />

                {/* Author & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={update.author.avatar} alt={update.author.name} />
                      <AvatarFallback>{update.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium">{update.author.name}</div>
                      <div className="text-muted-foreground">{update.author.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {update.date} {update.time}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal/Dialog would go here */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedUpdate.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <span className="font-medium">{selectedUpdate.version}</span>
                    <Badge className={getPriorityColor(selectedUpdate.priority)}>
                      {selectedUpdate.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedUpdate.status)}>
                      {selectedUpdate.status}
                    </Badge>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUpdate(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{selectedUpdate.description}</p>

              {/* Images */}
              {selectedUpdate.images && selectedUpdate.images.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Screenshots & Images</h4>
                  <div className="grid gap-4">
                    {selectedUpdate.images.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative aspect-video rounded-lg overflow-hidden border">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {image.caption && (
                          <p className="text-sm text-muted-foreground">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedUpdate.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUpdate.author.avatar} alt={selectedUpdate.author.name} />
                  <AvatarFallback>{selectedUpdate.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUpdate.author.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUpdate.author.role}</div>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  {selectedUpdate.date} at {selectedUpdate.time}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
