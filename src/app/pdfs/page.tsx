"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FileUpload } from "@/components/upload/file-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, File, Brain, FileText, RefreshCw, BookOpen } from "lucide-react";
import {
  processPdfWithAnalysis,
  processPdfWithSummary,
  type PdfProcessingResult
} from "@/lib/file-processors/pdf-processor";
import { FileWithPreview } from "@/types/file";

export default function PDFsPage() {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [processingResult, setProcessingResult] = useState<PdfProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFilesUploaded = (files: FileWithPreview[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setProcessingResult(null);
      setActiveTab("process");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await processPdfWithAnalysis(selectedFile);
      setProcessingResult(result);
      setActiveTab("results");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await processPdfWithSummary(selectedFile);
      setProcessingResult(result);
      setActiveTab("results");
    } catch (error) {
      console.error("Summarization failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetProcessing = () => {
    setSelectedFile(null);
    setProcessingResult(null);
    setActiveTab("upload");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xử lý tệp PDF</h1>
          <p className="text-muted-foreground">
            Tải lên và xử lý tệp PDF với phân tích bằng AI và tóm tắt.
          </p>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600 text-lg">⚠️</span>
              <div className="flex-1">
                <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                  💡 Tính năng về PDFs đang được tôi phát triển thêm. Vui lòng sử dụng chức năng của docx và excel. Hoặc chuyển đổi từ PDF sang docx để phân tích.
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Tải lên</TabsTrigger>
            <TabsTrigger value="process" disabled={!selectedFile}>Xử lý</TabsTrigger>
            <TabsTrigger value="results" disabled={!processingResult}>Kết quả</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tải lên tệp PDF</CardTitle>
                <CardDescription>
                  Chọn tệp PDF để phân tích hoặc tóm tắt bằng AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFilesUploaded={handleFilesUploaded}
                  maxFiles={1}
                  acceptedFileTypes={['.pdf']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Các hành động có sẵn</CardTitle>
                <CardDescription>
                  Những gì bạn có thể làm với tệp PDF của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Brain className="w-8 h-8 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Phân tích bằng AI</h4>
                      <p className="text-sm text-muted-foreground">
                        Trích xuất ý tưởng, xác định chủ đề chính và hiểu cấu trúc tài liệu.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <FileText className="w-8 h-8 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Tóm tắt</h4>
                      <p className="text-sm text-muted-foreground">
                        Tạo tóm tắt ngắn gọn nắm bắt thông tin thiết yếu.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            {selectedFile && (
              <Card>
                <CardHeader>
                  <CardTitle>Tệp đã chọn</CardTitle>
                  <CardDescription>
                    Chọn cách bạn muốn xử lý tệp PDF này
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                    <div className="flex items-center space-x-3">
                      <File className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">PDF</Badge>
                  </div>

                  <div className="grid gap-4 mt-6 md:grid-cols-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isProcessing}
                      className="h-auto p-4 flex-col space-y-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Brain className="w-6 h-6" />
                      )}
                      <span>Phân tích PDF</span>
                      <span className="text-xs opacity-70">Trích xuất ý tưởng & chủ đề</span>
                    </Button>

                    <Button
                      onClick={handleSummarize}
                      disabled={isProcessing}
                      variant="outline"
                      className="h-auto p-4 flex-col space-y-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                      <span>Tóm tắt</span>
                      <span className="text-xs opacity-70">Tạo tóm tắt</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {processingResult && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Kết quả xử lý</h2>
                  <Button onClick={resetProcessing} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Xử lý tệp khác
                  </Button>
                </div>

                {processingResult.error ? (
                  <Card className="border-red-200">
                    <CardContent className="pt-6">
                      <div className="text-center text-red-600">
                        <p className="font-medium">Lỗi xử lý</p>
                        <p className="text-sm mt-1">{processingResult.error}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {/* File Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BookOpen className="w-5 h-5 text-red-500" />
                          <span>Thông tin file PDF</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Tên file</p>
                            <p className="font-medium truncate">{selectedFile?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Số trang</p>
                            <p className="font-medium">{processingResult.pageCount}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Kích thước</p>
                            <p className="font-medium">
                              {(selectedFile?.size || 0) / 1024 < 1024
                                ? `${((selectedFile?.size || 0) / 1024).toFixed(1)} KB`
                                : `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB`}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Trạng thái parsing</p>
                            <p className="font-medium">
                              {processingResult.success ? '✅ Thành công' :
                                processingResult.info?.ParsingStatus ? '⚠️ Fallback thông minh' : '❌ Thất bại'}
                            </p>
                          </div>
                        </div>

                        {/* Parsing Status Warning */}
                        {processingResult.info?.ParsingStatus && (
                          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <span className="text-yellow-600 text-lg">⚠️</span>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                  Sử dụng nội dung dự đoán
                                </h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                  File PDF không thể trích xuất văn bản trực tiếp. Hệ thống đã phân tích tên file
                                  để tạo nội dung dự đoán. Kết quả AI dựa trên thông tin này có thể không chính xác 100%.
                                </p>
                                <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                                  💡 Để có kết quả chính xác hơn: Sử dụng file PDF chứa văn bản thuần túy
                                  hoặc chuyển đổi file sang định dạng Word trước khi upload.
                                </div>
                                <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                                  💡 Tính năng về PDFs đang được tôi phát triển thêm. Vui lòng sử dụng chức năng của docx và excel. Hoặc chuyển đổi từ PDF sang docx để phân tích.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PDF Metadata */}
                        {processingResult.info && Object.keys(processingResult.info).length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Thông tin metadata:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(processingResult.info).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {processingResult.analysis && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Brain className="w-5 h-5 text-blue-500" />
                            <span>Phân tích PDF</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            value={processingResult.analysis}
                            readOnly
                            className="min-h-[200px] resize-none"
                          />
                        </CardContent>
                      </Card>
                    )}

                    {processingResult.summary && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-green-500" />
                              <span>Tóm tắt PDF</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            value={processingResult.summary}
                            readOnly
                            className="min-h-[150px] resize-none"
                          />
                        </CardContent>
                      </Card>
                    )}

                    {processingResult.content && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Nội dung văn bản được trích xuất</CardTitle>
                          <CardDescription>
                            Văn bản được trích xuất từ tệp PDF đã tải lên
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            value={processingResult.content}
                            readOnly
                            className="min-h-[200px] resize-none"
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
