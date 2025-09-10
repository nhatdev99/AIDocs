"use client";

import { FileText, File, BarChart3, MoreVertical, Download, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx';
  size: number;
  uploadedAt: Date;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  processingResult?: unknown;
}

interface FileListProps {
  files: UploadedFile[];
  onProcessFile?: (fileId: string, action: string) => void;
  onDeleteFile?: (fileId: string) => void;
  onDownloadFile?: (fileId: string) => void;
}

export function FileList({
  files,
  onProcessFile,
  onDeleteFile,
  onDownloadFile
}: FileListProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="w-5 h-5 text-red-500" />;
      case 'xlsx':
        return <BarChart3 className="w-5 h-5 text-green-500" />;
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Badge variant="secondary">Uploaded</Badge>;
      case 'processing':
        return <Badge variant="default">Processing</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatFileSize = (bytes: number | undefined | null) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | undefined | null) => {
    if (!date) return 'Unknown date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionsForFileType = (type: string) => {
    switch (type) {
      case 'pdf':
        return [
          { label: 'Analyze', action: 'analyze' },
          { label: 'Summarize', action: 'summarize' },
        ];
      case 'docx':
        return [
          { label: 'Analyze', action: 'analyze' },
          { label: 'Summarize', action: 'summarize' },
          { label: 'Rewrite', action: 'rewrite' },
        ];
      case 'xlsx':
        return [
          { label: 'Calculate SUM', action: 'sum' },
          { label: 'Calculate Average', action: 'average' },
          { label: 'Sort Data', action: 'sort' },
          { label: 'Filter Data', action: 'filter' },
          { label: 'Create Chart', action: 'chart' },
        ];
      default:
        return [];
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Management</CardTitle>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No files uploaded yet</p>
            <p className="text-sm">Upload files to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium truncate">{file.name}</p>
                      {getStatusBadge(file.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === 'uploaded' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Play className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {getActionsForFileType(file.type).map((action) => (
                          <DropdownMenuItem
                            key={action.action}
                            onClick={() => onProcessFile?.(file.id, action.action)}
                          >
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onDownloadFile?.(file.id)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteFile?.(file.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
