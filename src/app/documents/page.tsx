"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FileUpload } from "@/components/upload/file-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Brain, PenTool, RefreshCw } from "lucide-react";
import {
  processDocxWithAnalysis,
  processDocxWithSummary,
  processDocxWithRewrite,
  type DocxProcessingResult
} from "@/lib/file-processors/docx-processor";
import { FileWithPreview } from "@/types/file";

export default function DocumentsPage() {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [processingResult, setProcessingResult] = useState<DocxProcessingResult | null>(null);
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
      const result = await processDocxWithAnalysis(selectedFile);
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
      const result = await processDocxWithSummary(selectedFile);
      setProcessingResult(result);
      setActiveTab("results");
    } catch (error) {
      console.error("Summarization failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRewrite = async (style?: string) => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await processDocxWithRewrite(selectedFile, style);
      setProcessingResult(result);
      setActiveTab("results");
    } catch (error) {
      console.error("Rewrite failed:", error);
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
          <h1 className="text-3xl font-bold tracking-tight">Xử lý tệp DOCX</h1>
          <p className="text-muted-foreground">
            Tải lên và xử lý tệp DOCX với phân tích bằng AI, tóm tắt và viết lại.
          </p>
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
                <CardTitle>Tải lên tệp DOCX</CardTitle>
                <CardDescription>
                  Chọn tệp DOCX để phân tích, tóm tắt hoặc viết lại bằng AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFilesUploaded={handleFilesUploaded}
                  maxFiles={1}
                  acceptedFileTypes={['.docx']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Các hành động có sẵn</CardTitle>
                <CardDescription>
                  Những gì bạn có thể làm với tệp DOCX của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
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
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <PenTool className="w-8 h-8 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Viết lại</h4>
                      <p className="text-sm text-muted-foreground">
                        Viết lại nội dung để cải thiện tính rõ ràng, cấu trúc và khả năng đọc hiểu.
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
                    Chọn cách bạn muốn xử lý tệp này
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">DOCX</Badge>
                  </div>

                  <div className="grid gap-4 mt-6 md:grid-cols-3">
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
                      <span>Phân tích tài liệu</span>
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

                    <Button
                      onClick={() => handleRewrite()}
                      disabled={isProcessing}
                      variant="outline"
                      className="h-auto p-4 flex-col space-y-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <PenTool className="w-6 h-6" />
                      )}
                      <span>Viết lại</span>
                      <span className="text-xs opacity-70">Cải thiện nội dung</span>
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
                    {processingResult.analysis && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Brain className="w-5 h-5 text-blue-500" />
                            <span>Phân tích tài liệu</span>
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
                            <span>Tóm tắt tài liệu</span>
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

                    {processingResult.rewritten && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <PenTool className="w-5 h-5 text-purple-500" />
                            <span>Nội dung đã viết lại</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            value={processingResult.rewritten}
                            readOnly
                            className="min-h-[200px] resize-none"
                          />
                        </CardContent>
                      </Card>
                    )}

                    {processingResult.content && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Nội dung gốc</CardTitle>
                          <CardDescription>
                            Văn bản được trích xuất từ tệp DOCX đã tải lên
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
