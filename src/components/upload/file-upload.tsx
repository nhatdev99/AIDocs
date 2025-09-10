"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, File, BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FileWithPreview } from "@/types/file";

interface FileUploadProps {
  onFilesUploaded?: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

export function FileUpload({
  onFilesUploaded,
  maxFiles = 10,
  acceptedFileTypes = [".pdf", ".docx", ".xlsx", ".doc"]
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      // Create a FileWithPreview object that maintains File prototype
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      }) as FileWithPreview;
      return fileWithPreview;
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [file.name]: currentProgress + 10 };
        });
      }, 200);
    });

    onFilesUploaded?.(newFiles);
  }, [onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': acceptedFileTypes.includes('.pdf') ? ['.pdf'] : [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': acceptedFileTypes.includes('.docx') ? ['.docx'] : [],
      'application/vnd.ms-excel': acceptedFileTypes.includes('.xlsx') ? ['.xlsx'] : [],
      'application/msword': acceptedFileTypes.includes('.doc') ? ['.doc'] : []
    },
    maxFiles,
    multiple: true
  });

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const getFileIcon = (fileName: string | undefined | null) => {
    if (!fileName || typeof fileName !== 'string') {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }

    const extension = fileName.toLowerCase().split('.').pop();
    if (!extension) {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }

    switch (extension) {
      case 'pdf':
        return <File className="w-5 h-5 text-red-500" />;
      case 'xlsx':
        return <BarChart3 className="w-5 h-5 text-green-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number | undefined | null) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isDragActive ? "Drop files here" : "Upload your files"}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOCX, XLSX (Max {maxFiles} files)
          </p>
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <Button variant="outline" {...getRootProps()}>
          <input {...getInputProps()} />
          <Upload className="w-4 h-4 mr-2" />
          Browse Files
        </Button>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => {
              const progress = uploadProgress[file.name] || 100;
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      {progress < 100 && (
                        <div className="mt-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading... {progress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.name)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
