"use client";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  File,
  BarChart3,
  Upload,
  Brain,
  AlertCircle,
  CheckCircle,
  Zap,
  BookOpen,
  Settings,
  Eye,
  Search,
  Calculator,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Documentation() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent h-20 mt-10">
            Hướng Dẫn Sử Dụng AI Document Analyzer & SEO Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sơ lượt cách dùng công cụ phân tích tài liệu thông minh và SEO Analyzer với sức mạnh của Google Gemini AI
          </p>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Phiên bản 1.2.0 - SEO Analyzer
          </Badge>
        </div>



        {/* Quick Start */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
              <Zap className="w-5 h-5 mr-2" />
              Bắt Đầu Nhanh
            </CardTitle>
            <CardDescription>
              Các bước cơ bản để bắt đầu sử dụng hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload File</h3>
                <p className="text-sm text-muted-foreground">Chọn và tải lên file PDF, DOCX hoặc XLSX của bạn</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Chọn Chế Độ</h3>
                <p className="text-sm text-muted-foreground">Chọn loại xử lý phù hợp với file của bạn</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Nhận Kết Quả</h3>
                <p className="text-sm text-muted-foreground">Xem phân tích và kết quả từ AI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Analyzer Guide */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700 dark:text-green-300">
              <Search className="w-5 h-5 mr-2" />
              Công Cụ SEO Analyzer
            </CardTitle>
            <CardDescription>
              Phân tích SEO chuyên nghiệp với sức mạnh của Google Gemini AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="https://i.postimg.cc/BvmJxz50/78-F5-C96-B-AD3-D-4-D9-B-BA7-A-0162-C06-BA01-B.jpg"
                    alt="SEO Analyzer Interface"
                    width={200}
                    height={150}
                    className="rounded-lg border shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Phân Tích Từ Khóa</h4>
                      <p className="text-sm text-muted-foreground">Phân tích từ khóa theo cấp độ: Primary, Secondary, Long-tail</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Đánh Giá SEO Score</h4>
                      <p className="text-sm text-muted-foreground">Điểm SEO tổng thể, độ dễ đọc, mật độ từ khóa</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Đề Xuất Cải Thiện</h4>
                      <p className="text-sm text-muted-foreground">Gợi ý Meta Title, Meta Description, cấu trúc Heading</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hướng Dẫn Sử Dụng</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Nhập Nội Dung</h4>
                      <p className="text-sm text-muted-foreground">Dán HTML hoặc văn bản cần phân tích SEO</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Chạy Phân Tích</h4>
                      <p className="text-sm text-muted-foreground">AI sẽ phân tích trong 20-30 giây</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Xem Kết Quả</h4>
                      <p className="text-sm text-muted-foreground">Điểm SEO, từ khóa, lỗi và đề xuất cải thiện</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex flex-col gap-2">
                    <Button className="w-full" onClick={() => router.push('/seo')}>
                      <Search className="w-4 h-4 mr-2" />
                      Sử Dụng SEO Analyzer
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => router.push('/updates')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Xem Update Log
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Features Grid */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Tính Năng SEO Chi Tiết</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Search className="w-4 h-4 text-blue-500 mr-2" />
                    Từ Khóa
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Từ khóa chính (Primary)</li>
                    <li>• Từ khóa phụ (Secondary)</li>
                    <li>• Từ khóa dài (Long-tail)</li>
                    <li>• Phân tích mật độ từ khóa</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                    Đánh Giá
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Điểm SEO tổng thể</li>
                    <li>• Độ dễ đọc nội dung</li>
                    <li>• Cấu trúc Heading</li>
                    <li>• Tối ưu hóa Meta</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    Đề Xuất
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Meta Title gợi ý</li>
                    <li>• Meta Description</li>
                    <li>• Cải thiện cấu trúc</li>
                    <li>• Chiến lược từ khóa</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Types Support */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* PDF Section */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700 dark:text-red-300">
                <File className="w-5 h-5 mr-2" />
                PDF Documents
              </CardTitle>
              <CardDescription>
                Phân tích và tóm tắt tài liệu PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Trích xuất nội dung văn bản</h4>
                    <p className="text-sm text-muted-foreground">Tự động đọc và phân tích nội dung PDF</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Phân tích với AI</h4>
                    <p className="text-sm text-muted-foreground">Tóm tắt và trích xuất thông tin chính</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Metadata extraction</h4>
                    <p className="text-sm text-muted-foreground">Thông tin về tác giả, ngày tạo, số trang</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => router.push('/pdfs')}>
                <Eye className="w-4 h-4 mr-2" />
                Sử dụng
              </Button>
            </CardContent>
          </Card>

          {/* DOCX Section */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                <FileText className="w-5 h-5 mr-2" />
                Word Documents
              </CardTitle>
              <CardDescription>
                Xử lý và phân tích file DOCX
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Phân tích nội dung</h4>
                    <p className="text-sm text-muted-foreground">Trích xuất và phân tích văn bản</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Tóm tắt thông minh</h4>
                    <p className="text-sm text-muted-foreground">Tạo bản tóm tắt ngắn gọn với AI</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Viết lại nội dung</h4>
                    <p className="text-sm text-muted-foreground">Tái cấu trúc và cải thiện văn bản</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => router.push('/documents')}>
                <FileText className="w-4 h-4 mr-2" />
                Sử dụng
              </Button>
            </CardContent>
          </Card>

          {/* Excel Section */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                <BarChart3 className="w-5 h-5 mr-2" />
                Excel Spreadsheets
              </CardTitle>
              <CardDescription>
                Phân tích dữ liệu và tạo biểu đồ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Tính toán tự động</h4>
                    <p className="text-sm text-muted-foreground">SUM, AVERAGE, MIN, MAX</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Sắp xếp và lọc</h4>
                    <p className="text-sm text-muted-foreground">Tổ chức dữ liệu thông minh</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Trực quan hóa dữ liệu</h4>
                    <p className="text-sm text-muted-foreground">Biểu đồ cột, đường, tròn</p>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => router.push('/excel')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Sử dụng
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Hướng Dẫn Chi Tiết
            </CardTitle>
            <CardDescription>
              Các bước cụ thể để sử dụng từng tính năng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                1. Upload Files
              </h3>
              <div className="pl-7 space-y-2 text-sm">
                <p>• Chọn nút <strong>&quot;Upload Files&quot;</strong> trong sidebar</p>
                <p>• Kéo thả file hoặc click để chọn file</p>
                <p>• Hỗ trợ định dạng: <Badge variant="secondary">PDF</Badge> <Badge variant="secondary">DOCX</Badge> <Badge variant="secondary">XLSX</Badge></p>
                <p>• Kích thước tối đa: <strong>10MB</strong> cho mỗi file</p>
                <p>• Có thể upload nhiều file cùng lúc</p>
              </div>
            </div>

            {/* Processing Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                2. Xử Lý File
              </h3>
              <div className="pl-7 space-y-3">
                <div>
                  <h4 className="font-medium text-purple-700 dark:text-purple-300">PDF Files:</h4>
                  <p className="text-sm">• Phân tích nội dung và trích xuất thông tin</p>
                  <p className="text-sm">• Tóm tắt tài liệu tự động</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">DOCX Files:</h4>
                  <p className="text-sm">• Phân tích cấu trúc văn bản</p>
                  <p className="text-sm">• Tóm tắt và viết lại nội dung</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-300">Excel Files:</h4>
                  <p className="text-sm">• Tính toán số liệu tự động</p>
                  <p className="text-sm">• Tạo biểu đồ trực quan</p>
                </div>
              </div>
            </div>

            {/* AI Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Search className="w-5 h-5 mr-2 text-orange-600" />
                3. Tính Năng AI
              </h3>
              <div className="pl-7 space-y-2 text-sm">
                <p>• <strong>Phân tích</strong>: Trích xuất thông tin chính và nhận xét sâu sắc</p>
                <p>• <strong>Tóm tắt</strong>: Tạo bản tóm tắt ngắn gọn và dễ hiểu</p>
                <p>• <strong>Viết lại</strong>: Cải thiện cấu trúc và ngôn ngữ của văn bản</p>
                <p>• <strong>Tính toán</strong>: Thực hiện các phép tính phức tạp</p>
                <p>• <strong>Trực quan hóa</strong>: Tạo biểu đồ từ dữ liệu Excel</p>
                <p>• <strong>SEO Analysis</strong>: Phân tích SEO chuyên nghiệp với Gemini AI</p>
              </div>
            </div>

            {/* SEO Analysis Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                4. SEO Analyzer
              </h3>
              <div className="pl-7 space-y-3">
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-300">Cách sử dụng:</h4>
                  <p className="text-sm">• Chọn menu <strong>&quot;Phân tích SEO&quot;</strong> trong sidebar</p>
                  <p className="text-sm">• Dán nội dung HTML hoặc văn bản cần phân tích</p>
                  <p className="text-sm">• Click <strong>&quot;Phân tích SEO&quot;</strong> để bắt đầu</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-300">Kết quả nhận được:</h4>
                  <p className="text-sm">• Điểm SEO tổng thể và độ dễ đọc</p>
                  <p className="text-sm">• Phân tích từ khóa theo cấp độ</p>
                  <p className="text-sm">• Đề xuất Meta Title và Description</p>
                  <p className="text-sm">• Gợi ý cải thiện cấu trúc nội dung</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Best Practices */}
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-300">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tips & Best Practices
            </CardTitle>
            <CardDescription>
              Những mẹo để sử dụng hệ thống hiệu quả nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    File Quality
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Sử dụng file có văn bản rõ ràng</li>
                    <li>• Tránh file có hình ảnh phức tạp</li>
                    <li>• Đảm bảo file không bị hỏng</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Calculator className="w-4 h-4 text-blue-500 mr-2" />
                    Excel Optimization
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Sử dụng tiêu đề cột rõ ràng</li>
                    <li>• Tránh dữ liệu rỗng hoặc lỗi</li>
                    <li>• Định dạng số liệu nhất quán</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <FileText className="w-4 h-4 text-purple-500 mr-2" />
                    Content Structure
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Tài liệu có cấu trúc rõ ràng</li>
                    <li>• Sử dụng heading và subheading</li>
                    <li>• Tránh font và format lạ</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <PieChart className="w-4 h-4 text-orange-500 mr-2" />
                    Performance Tips
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Upload file nhỏ hơn 10MB</li>
                    <li>• Xử lý từng file một lúc</li>
                    <li>• Sử dụng kết nối internet ổn định</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5 mr-2" />
              Troubleshooting
            </CardTitle>
            <CardDescription>
              Giải quyết các vấn đề thường gặp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
                <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">
                  File không thể xử lý được?
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                  Nếu file PDF không chứa văn bản thuần (chỉ có hình ảnh), hệ thống sẽ:
                </p>
                <ul className="text-sm space-y-1 text-red-600 dark:text-red-400 ml-4">
                  <li>• Phân tích tên file để dự đoán chủ đề</li>
                  <li>• Tạo nội dung dự đoán thông minh</li>
                  <li>• AI vẫn cung cấp phân tích dựa trên thông tin có sẵn</li>
                </ul>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Lỗi Upload</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Kiểm tra kích thước file nhỏ hơn( <strong>10MB</strong>)</li>
                    <li>• Đảm bảo định dạng được hỗ trợ</li>
                    <li>• Kiểm tra kết nối internet</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Kết Quả AI Không Chính Xác</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Sử dụng file có nội dung rõ ràng</li>
                    <li>• Tránh file có định dạng phức tạp</li>
                    <li>• Kiểm tra lại nội dung gốc</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sẵn Sàng Bắt Đầu?</CardTitle>
            <CardDescription className="text-center">
              Bắt đầu phân tích tài liệu và tối ưu hóa SEO với AI Document Analyzer
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button size="lg" className="flex items-center" onClick={() => router.push('/upload')}>
                <Upload className="w-5 h-5 mr-2" />
                Upload Files
              </Button>
              <Button size="lg" variant="outline" className="flex items-center" onClick={() => router.push('/seo')}>
                <Search className="w-5 h-5 mr-2" />
                SEO Analyzer
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Khám phá các tính năng AI Document Analyzer và SEO Analysis
            </p>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground border-t pt-8">
          <p>AI Document Analyzer v1.2.0 - Powered by Google Gemini AI</p>
          <p className="mt-2">Hỗ trợ: PDF, DOCX, XLSX, SEO Analysis | Tối đa 10MB/file | Phân tích AI thông minh</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
