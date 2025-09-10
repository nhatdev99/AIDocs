# AI Document Analyzer 📄🤖

AI Document Analyzer là một ứng dụng web thông minh được xây dựng bằng Next.js 15, cho phép người dùng upload và phân tích các tài liệu PDF, DOCX và Excel sử dụng sức mạnh của AI (Google Gemini).

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-blue.svg)

## ✨ Tính Năng Chính

### 📁 Hỗ Trợ Đa Định Dạng
- **PDF Documents**: Trích xuất văn bản, phân tích nội dung, tóm tắt tài liệu
- **Word Documents**: Phân tích cấu trúc, tóm tắt, viết lại nội dung
- **Excel Spreadsheets**: Tính toán số liệu, sắp xếp, lọc dữ liệu, tạo biểu đồ

### 🧠 Tính Năng AI Thông Minh
- **Phân tích nội dung**: AI tự động phân tích và trích xuất thông tin chính
- **Tóm tắt thông minh**: Tạo bản tóm tắt ngắn gọn và dễ hiểu
- **Viết lại nội dung**: Cải thiện cấu trúc và ngôn ngữ của văn bản
- **Tính toán tự động**: Thực hiện các phép tính phức tạp
- **Trực quan hóa dữ liệu**: Tạo biểu đồ từ dữ liệu Excel

### 🎨 Giao Diện Hiện Đại
- **Dark/Light Mode**: Chuyển đổi giao diện theo sở thích
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- **Intuitive UI**: Giao diện trực quan với Shadcn/UI components
- **Real-time Feedback**: Phản hồi tức thời cho người dùng

## 🛠️ Yêu Cầu Hệ Thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Git**: >= 2.0.0
- **Modern Browser**: Chrome, Firefox, Safari, Edge (có hỗ trợ ES2020)

## 📦 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/nhatdev99/AIDocs.git
cd AIDOCS
```

### 2. Cài Đặt Dependencies

```bash
npm install
```

### 3. Cấu Hình Môi Trường

Tạo file `.env.local` trong thư mục gốc và thêm các biến môi trường sau:

```env
# Google Gemini AI API Key (Bắt buộc)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Next.js Environment
NODE_ENV=development

# Optional: Custom Port
PORT=3000
```

#### 🔑 Lấy Google Gemini API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới
3. Copy và paste vào file `.env.local`

### 4. Chạy Dự Án

```bash
# Development mode (với hot reload)
npm run dev

# Production build
npm run build
npm start

# Hoặc build production bỏ qua ESLint
npm run build:production
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 🚀 Cách Sử Dụng

### 1. Upload Files

1. Truy cập trang **Upload Files** từ sidebar
2. Kéo thả file hoặc click để chọn file
3. Hỗ trợ định dạng: `.pdf`, `.docx`, `.xlsx`
4. Kích thước tối đa: **10MB** cho mỗi file

### 2. Xử Lý File

#### PDF Files
- Chọn tab **PDFs** trong sidebar
- Upload file PDF
- Chọn chế độ: **Analyze** hoặc **Summarize**
- Xem kết quả phân tích từ AI

#### Word Documents
- Chọn tab **Documents** trong sidebar
- Upload file DOCX
- Chọn chế độ: **Analyze**, **Summarize**, hoặc **Rewrite**
- Nhận kết quả được tối ưu hóa bởi AI

#### Excel Files
- Chọn tab **Excel** trong sidebar
- Upload file XLSX
- Chọn các thao tác: **Calculate**, **Sort**, **Filter**, **Chart**
- Xem biểu đồ và kết quả tính toán

### 3. AI Features

- **Analyze**: Phân tích sâu về nội dung và cấu trúc
- **Summarize**: Tạo bản tóm tắt ngắn gọn
- **Rewrite**: Viết lại với ngôn ngữ tự nhiên hơn
- **Calculate**: Thực hiện các phép tính SUM, AVERAGE, MIN, MAX
- **Visualize**: Tạo biểu đồ cột, đường, tròn từ dữ liệu

## 📡 API Endpoints

### PDF Processing
```
POST /api/pdf/parse
Content-Type: multipart/form-data

Body: FormData with 'file' field (PDF file)
Response: JSON with extracted content and metadata
```

### AI Processing
```
POST /api/ai/analyze
Content-Type: application/json

Body: { "content": "text content", "type": "pdf|docx|excel" }
Response: JSON with AI analysis results
```

## 🏗️ Cấu Trúc Dự Án

```
ai-document-analyzer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── pdf/
│   │   │       └── parse/
│   │   ├── documents/         # DOCX Processing Page
│   │   ├── pdfs/             # PDF Processing Page
│   │   ├── excel/            # Excel Processing Page
│   │   ├── upload/           # File Upload Page
│   │   ├── layout.tsx        # Root Layout
│   │   └── page.tsx          # Homepage (Documentation)
│   ├── components/           # React Components
│   │   ├── ui/              # Shadcn/UI Components
│   │   ├── layout/          # Layout Components
│   │   ├── upload/          # Upload Components
│   │   ├── charts/          # Chart Components
│   │   └── results/         # Result Components
│   ├── lib/                 # Utility Libraries
│   │   ├── gemini.ts       # Gemini AI Integration
│   │   ├── file-processors/ # File Processing Logic
│   │   └── utils/          # Helper Functions
│   └── types/              # TypeScript Types
├── public/                 # Static Assets
├── vercel.json            # Vercel Configuration
├── package.json           # Dependencies
├── tailwind.config.js    # Tailwind Configuration
└── README.md             # This file
```

## 🛠️ Công Nghệ Sử Dụng

### Core Framework
- **Next.js 15**: React framework với App Router
- **React 19**: UI library
- **TypeScript 5**: Type-safe JavaScript

### UI & Styling
- **TailwindCSS 4**: Utility-first CSS framework
- **Shadcn/UI**: Modern component library
- **Radix UI**: Accessible UI primitives
- **Lucide React**: Beautiful icons

### File Processing
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX processing
- **xlsx**: Excel file handling
- **react-dropzone**: Drag & drop file uploads

### AI & Data
- **@google/generative-ai**: Google Gemini AI integration
- **recharts**: Data visualization

### Development Tools
- **ESLint**: Code linting
- **Turbopack**: Fast bundler (Next.js 15)
- **Vercel**: Deployment platform

## 🔧 Cấu Hình Nâng Cao

### Environment Variables

```env
# Required
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key

# Optional
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Vercel Deployment

1. Push code lên GitHub
2. Connect với Vercel
3. Set environment variables trong Vercel dashboard
4. Deploy automatically

### Custom Build

```bash
# Skip ESLint in production
npm run build:production

# With custom environment
NODE_ENV=production npm run build
```

## 🐛 Troubleshooting

### Lỗi Upload File
- Kiểm tra kích thước file (< 10MB)
- Đảm bảo định dạng được hỗ trợ
- Kiểm tra kết nối internet

### Lỗi AI Processing
- Verify Gemini API key
- Check API quota limits
- Ensure file has readable content

### Lỗi Build
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Update dependencies: `npm update`

### PDF Parsing Issues
- File có thể chứa hình ảnh thay vì text
- AI sẽ tạo fallback content thông minh
- Upload file PDF có text thuần để kết quả tốt nhất

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp!

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

### Development Guidelines

- Sử dụng TypeScript cho tất cả code mới
- Follow ESLint rules
- Viết tests cho features quan trọng
- Update documentation khi cần thiết

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên Hệ

- **Email**: thanhnhattnn@gmail.com
- **GitHub Issues**: [Report bugs](https://github.com/nhatdev99/AIDocs/issues)
- **Discussions**: [Q&A](https://github.com/nhatdev99/AIDocs/discussions)

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - AI processing
- [Vercel](https://vercel.com/) - Hosting platform
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
- [Next.js](https://nextjs.org/) - React framework

---

**AI Document Analyzer** - Phân tích tài liệu thông minh với sức mạnh của AI! 🚀🤖📄</content>