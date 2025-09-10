"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FileUpload } from "@/components/upload/file-upload";
import { FileWithPreview } from "@/types/file";
import { FileList } from "@/components/upload/file-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx';
  size: number;
  uploadedAt: Date;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processingResult?: any;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFilesUploaded = (newFiles: FileWithPreview[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: file.name.toLowerCase().split('.').pop() as 'pdf' | 'docx' | 'xlsx',
      size: file.size,
      uploadedAt: new Date(),
      status: 'uploaded',
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const handleProcessFile = (fileId: string, action: string) => {
    setFiles(prev => prev.map(file =>
      file.id === fileId
        ? { ...file, status: 'processing' as const }
        : file
    ));

    // Here you would call your AI processing functions
    console.log(`Processing file ${fileId} with action: ${action}`);

    // Simulate processing completion
    setTimeout(() => {
      setFiles(prev => prev.map(file =>
        file.id === fileId
          ? {
              ...file,
              status: 'completed' as const,
              processingResult: { action, completedAt: new Date() }
            }
          : file
      ));
    }, 3000);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleDownloadFile = (fileId: string) => {
    // Here you would implement file download logic
    console.log(`Downloading file ${fileId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tải lên tệp</h1>
          <p className="text-muted-foreground">
            Tải lên và xử lý tệp DOCX, PDF và Excel với AI.
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Tải lên</TabsTrigger>
            <TabsTrigger value="manage">Quản lý</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tải lên tệp</CardTitle>
                <CardDescription>
                  Kéo và thả hoặc tìm kiếm để tải lên tệp PDF, DOCX hoặc XLSX.
                  Kích thước tệp tối đa: 10MB mỗi tệp.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFilesUploaded={handleFilesUploaded}
                  maxFiles={10}
                  acceptedFileTypes={['.pdf', '.docx', '.xlsx']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Các loại tệp được hỗ trợ</CardTitle>
                <CardDescription>
                  Tìm hiểu về loại tệp này có thể làm gì với xử lý AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Tệp PDF</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Trích xuất và phân tích văn bản</li>
                      <li>• Tóm tắt tài liệu</li>
                      <li>• Xác định ý tưởng chính</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-600">Tệp DOCX</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Phân tích nội dung</li>
                      <li>• Tóm tắt tài liệu</li>
                      <li>• Viết lại nội dung</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">Tệp Excel</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Tính toán dữ liệu (SUM, AVG)</li>
                      <li>• Sắp xếp và lọc dữ liệu</li>
                      <li>• Tạo biểu đồ</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <FileList
              files={files}
              onProcessFile={handleProcessFile}
              onDeleteFile={handleDeleteFile}
              onDownloadFile={handleDownloadFile}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
