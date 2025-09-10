"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FileUpload } from "@/components/upload/file-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DataChart } from "@/components/charts/data-chart";
import { Loader2, Calculator, SortAsc, Filter, BarChart3, RefreshCw, FileSpreadsheet } from "lucide-react";
import {
  processExcelFile,
  calculateSum,
  calculateAverage,
  findMinMax,
  sortData,
  filterData,
  generateChartData,
  type ExcelProcessingResult
} from "@/lib/file-processors/excel-processor";
import { FileWithPreview } from "@/types/file";

export default function ExcelPage() {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [processingResult, setProcessingResult] = useState<ExcelProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [sortColumn, setSortColumn] = useState<number>(0);
  const [sortAscending, setSortAscending] = useState(true);
  const [filterColumn, setFilterColumn] = useState<number>(0);
  const [filterValue, setFilterValue] = useState("");
  const [chartXAxis, setChartXAxis] = useState<number>(0);
  const [chartYAxis, setChartYAxis] = useState<number>(1);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  const handleFilesUploaded = (files: FileWithPreview[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setProcessingResult(null);
      setActiveTab("process");
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await processExcelFile(selectedFile);

      if (!result.error) {
        // Calculate initial statistics
        const sum = calculateSum(result.data);
        const average = calculateAverage(result.data);
        const { min, max } = findMinMax(result.data);

        setProcessingResult({
          ...result,
          calculations: {
            sum,
            average,
            min,
            max,
          },
        });
      } else {
        setProcessingResult(result);
      }

      setActiveTab("data");
    } catch (error) {
      console.error("Processing failed:", error);
      setProcessingResult({
        data: {
          headers: [],
          rows: [],
          sheetName: '',
          totalRows: 0,
          totalColumns: 0,
        },
        error: "Failed to process Excel file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSort = () => {
    if (!processingResult?.data) return;

    const sortedData = sortData(processingResult.data, sortColumn, sortAscending);
    setProcessingResult(prev => prev ? {
      ...prev,
      sortedData,
    } : null);
  };

  const handleFilter = () => {
    if (!processingResult?.data || !filterValue) return;

    const filteredData = filterData(processingResult.data, filterColumn, filterValue);
    setProcessingResult(prev => prev ? {
      ...prev,
      filteredData,
    } : null);
  };

  const handleGenerateChart = () => {
    if (!processingResult?.data) return;

    const chartData = generateChartData(processingResult.data, chartXAxis, chartYAxis);
    setProcessingResult(prev => prev ? {
      ...prev,
      chartData,
    } : null);
  };

  const resetProcessing = () => {
    setSelectedFile(null);
    setProcessingResult(null);
    setActiveTab("upload");
    setSortColumn(0);
    setSortAscending(true);
    setFilterColumn(0);
    setFilterValue("");
    setChartXAxis(0);
    setChartYAxis(1);
  };

  const displayData = processingResult?.filteredData || processingResult?.sortedData || processingResult?.data;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xử lý tệp Excel</h1>
          <p className="text-muted-foreground">
            Tải lên và xử lý tệp Excel với tính toán, sắp xếp, lọc và trực quan hóa dữ liệu.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Tải lên</TabsTrigger>
            <TabsTrigger value="process" disabled={!selectedFile}>Xử lý</TabsTrigger>
            <TabsTrigger value="data" disabled={!processingResult}>Dữ liệu</TabsTrigger>
            <TabsTrigger value="charts" disabled={!processingResult}>Biểu đồ</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tải lên tệp Excel</CardTitle>
                <CardDescription>
                  Chọn tệp Excel (.xlsx) để xử lý và phân tích.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFilesUploaded={handleFilesUploaded}
                  maxFiles={1}
                  acceptedFileTypes={['.xlsx']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Các hành động có sẵn</CardTitle>
                <CardDescription>
                  Những gì bạn có thể làm với tệp Excel của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Calculator className="w-8 h-8 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Tính toán</h4>
                      <p className="text-sm text-muted-foreground">
                        Tổng, trung bình, min/max giá trị cho cột số.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <SortAsc className="w-8 h-8 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Sắp xếp & Lọc</h4>
                      <p className="text-sm text-muted-foreground">
                        Sắp xếp dữ liệu theo cột và lọc hàng theo giá trị.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Filter className="w-8 h-8 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Lọc dữ liệu</h4>
                      <p className="text-sm text-muted-foreground">
                        Lọc dữ liệu dựa trên các tiêu chí cụ thể.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <BarChart3 className="w-8 h-8 text-orange-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Biểu đồ & Trực quan hóa</h4>
                      <p className="text-sm text-muted-foreground">
                        Tạo biểu đồ và trực quan hóa dữ liệu.
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
                    Xử lý tệp Excel của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Excel</Badge>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={handleProcessFile}
                      disabled={isProcessing}
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Xử lý...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Xử lý tệp Excel
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {processingResult && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Phân tích dữ liệu</h2>
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
                    {/* Data Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Tổng quan dữ liệu</CardTitle>
                        <CardDescription>
                          Thông tin cơ bản về dữ liệu Excel của bạn
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{displayData?.totalRows}</p>
                            <p className="text-sm text-muted-foreground">Tổng số hàng</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{displayData?.totalColumns}</p>
                            <p className="text-sm text-muted-foreground">Cột</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{displayData?.sheetName}</p>
                            <p className="text-sm text-muted-foreground">Tên bảng</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">
                              {Object.keys(processingResult.calculations?.sum || {}).length}
                            </p>
                            <p className="text-sm text-muted-foreground">Cột số</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Calculations */}
                    {processingResult.calculations && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Tính toán</CardTitle>
                          <CardDescription>
                            Tính toán thống kê cho cột số
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {Object.keys(processingResult.calculations.sum || {}).map(column => (
                              <div key={column} className="space-y-2">
                                <h4 className="font-medium">{column}</h4>
                                <div className="space-y-1 text-sm">
                                  <p>Tổng: <span className="font-medium">{processingResult.calculations?.sum?.[column]?.toFixed(2)}</span></p>
                                  <p>Trung bình: <span className="font-medium">{processingResult.calculations?.average?.[column]?.toFixed(2)}</span></p>
                                  <p>Nhỏ nhất: <span className="font-medium">{processingResult.calculations?.min?.[column]?.toFixed(2)}</span></p>
                                  <p>Lớn nhất: <span className="font-medium">{processingResult.calculations?.max?.[column]?.toFixed(2)}</span></p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Data Table Preview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Xem dữ liệu</CardTitle>
                        <CardDescription>
                          Ưu tiên 10 hàng đầu của dữ liệu của bạn
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50 dark:bg-gray-800">
                                {displayData?.headers.map((header, index) => (
                                  <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {displayData?.rows.slice(0, 10).map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                                      {cell || '-'}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {displayData && displayData.rows.length > 10 && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Showing first 10 rows of {displayData.rows.length} total rows
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sort & Filter Controls */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Xử lý dữ liệu</CardTitle>
                        <CardDescription>
                          Sắp xếp và lọc dữ liệu của bạn
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          {/* Sort */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Sắp xếp dữ liệu</h4>
                            <div className="flex space-x-2">
                              <Select value={sortColumn.toString()} onValueChange={(value) => setSortColumn(Number(value))}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn cột" />
                                </SelectTrigger>
                                <SelectContent>
                                  {displayData?.headers.map((header, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSortAscending(!sortAscending)}
                              >
                                <SortAsc className={`w-4 h-4 ${sortAscending ? '' : 'rotate-180'}`} />
                              </Button>
                              <Button onClick={handleSort}>
                                Sắp xếp
                              </Button>
                            </div>
                          </div>

                          {/* Filter */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Lọc dữ liệu</h4>
                            <div className="flex space-x-2">
                              <Select value={filterColumn.toString()} onValueChange={(value) => setFilterColumn(Number(value))}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn cột" />
                                </SelectTrigger>
                                <SelectContent>
                                  {displayData?.headers.map((header, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Filter value"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                              />
                              <Button onClick={handleFilter} disabled={!filterValue}>
                                Lọc
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            {processingResult && !processingResult.error && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Trực quan hóa dữ liệu</h2>
                  <Button onClick={resetProcessing} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Xử lý tệp khác
                  </Button>
                </div>

                {/* Chart Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cấu hình biểu đồ</CardTitle>
                    <CardDescription>
                      Cấu hình các tham số của biểu đồ của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cột trục X</label>
                        <Select value={chartXAxis.toString()} onValueChange={(value) => setChartXAxis(Number(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {displayData?.headers.map((header, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cột trục Y</label>
                        <Select value={chartYAxis.toString()} onValueChange={(value) => setChartYAxis(Number(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {displayData?.headers.map((header, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Loại biểu đồ</label>
                        <Select value={chartType} onValueChange={(value: 'bar' | 'line' | 'pie') => setChartType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bar">Biểu đồ cột</SelectItem>
                            <SelectItem value="line">Biểu đồ đường</SelectItem>
                            <SelectItem value="pie">Biểu đồ tròn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <Button onClick={handleGenerateChart} className="w-full">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Tạo biểu đồ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chart Display */}
                {processingResult.chartData && (
                  <DataChart
                    data={processingResult.chartData}
                    chartType={chartType}
                    title={`${processingResult.chartData.yAxis} vs ${processingResult.chartData.xAxis}`}
                    description={`Trực quan hóa dữ liệu bằng ${chartType} biểu đồ`}
                  />
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
