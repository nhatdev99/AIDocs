# Tích Hợp PDF Parsing Thực Tế ✅ HOÀN THÀNH

## Tình Trạng Hiện Tại

Ứng dụng đã tích hợp thành công PDF parsing thực tế bằng thư viện `pdf-parse` với dynamic import để tương thích với Next.js:

- ✅ **Parsing PDF thực tế**: Trích xuất văn bản từ file PDF
- ✅ **Metadata extraction**: Lấy thông tin title, author, creation date
- ✅ **Error handling**: Xử lý graceful với multiple fallback strategies
- ✅ **Next.js compatible**: Sử dụng dynamic import để tránh lỗi build
- ✅ **AI integration**: Văn bản được trích xuất sẽ được đưa vào prompt cho AI

## Giải Pháp Tích Hợp

### 1. Sử dụng PDF.co API (Khuyên dùng)

PDF.co cung cấp API đơn giản để chuyển đổi PDF sang text:

```typescript
// Trong src/app/api/pdf/parse/route.ts
const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.PDF_CO_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com/your-pdf-file.pdf', // hoặc upload file
    async: false
  })
});

const result = await response.json();
return {
  content: result.text,
  pageCount: result.pages.length
};
```

**Ưu điểm:**
- ✅ Dễ tích hợp
- ✅ Không cần cài đặt thư viện nặng
- ✅ Hỗ trợ nhiều định dạng
- ✅ API ổn định

### 2. Sử dụng pdf-parse với Webpack Config

Tạo file `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Chỉ import pdf-parse trên server
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse'
      });
    }

    return config;
  }
};

module.exports = nextConfig;
```

### 3. Sử dụng Microservice Python

Tạo một service riêng bằng Python:

```python
# pdf-service.py
from flask import Flask, request
import PyPDF2

app = Flask(__name__)

@app.route('/parse', methods=['POST'])
def parse_pdf():
    file = request.files['file']
    pdf_reader = PyPDF2.PdfReader(file)
    text = ''
    for page in pdf_reader.pages:
        text += page.extract_text()

    return {
        'content': text,
        'pageCount': len(pdf_reader.pages)
    }
```

### 4. Sử dụng pdfjs-dist (Client-side)

```typescript
// Trong client component
import * as pdfjsLib from 'pdfjs-dist';

// Cấu hình worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const loadPdf = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item: any) => item.str).join(' ');
  }

  return { content: text, pageCount: pdf.numPages };
};
```

## Cài Đặt và Chạy

### Với PDF.co API:

1. Đăng ký tài khoản tại [PDF.co](https://pdf.co/)
2. Lấy API key
3. Thêm vào `.env.local`:
   ```
   PDF_CO_API_KEY=your_api_key_here
   ```
4. Cập nhật code trong `src/app/api/pdf/parse/route.ts`

### Với Python Microservice:

1. Cài đặt Python dependencies:
   ```bash
   pip install flask PyPDF2
   ```
2. Chạy service:
   ```bash
   python pdf-service.py
   ```
3. Cập nhật URL trong API route

## Test Hệ Thống

Sau khi tích hợp PDF parsing thực tế:

1. Upload file PDF thực
2. Kiểm tra nội dung được trích xuất
3. Test với các loại PDF khác nhau (text-based, image-based, encrypted)
4. Verify kết quả phân tích AI

## Lưu Ý Quan Trọng

- **Bảo mật**: Không upload file nhạy cảm lên service bên thứ 3
- **Giới hạn**: Kiểm tra rate limits và costs của service
- **Fallback**: Luôn có fallback mechanism khi service fail
- **Performance**: PDF parsing có thể chậm với file lớn
- **Privacy**: Xem xét GDPR và quy định về data privacy

## Cách Hoạt Động Hiện Tại

### 1. Upload File PDF
- User upload file PDF qua giao diện
- File được gửi đến `/api/pdf/parse` endpoint

### 2. PDF Parsing (Server-side)
```typescript
// Dynamic import để tránh lỗi build
const { default: pdfParse } = await import('pdf-parse');

const data = await pdfParse(buffer, {
  max: 0, // Không giới hạn số trang
  version: 'v2.0.550' // Version mới nhất
});
```

### 3. Extract Thông Tin
- **Văn bản**: `data.text` - nội dung text của PDF
- **Metadata**: `data.info` - thông tin title, author, creation date
- **Số trang**: `data.numpages` - tổng số trang

### 4. AI Processing
Văn bản được trích xuất được đưa vào prompt cho Gemini AI:

```typescript
const prompt = `Hãy phân tích nội dung PDF sau đây và đưa ra những nhận xét sâu sắc, thông tin chính, và chủ đề chính:\n\n${extractedText}`;
```

### 5. Error Handling
- **pdf-parse thất bại**: Chuyển sang fallback với metadata
- **Không có nội dung**: Tạo mock content với thông tin file
- **API error**: Trả về lỗi với thông báo rõ ràng

### 6. Intelligent Fallback System
Khi PDF parsing thất bại, hệ thống sẽ:

1. **Phân tích tên file** để dự đoán chủ đề
2. **Tạo nội dung thông minh** dựa trên từ khóa trong tên
3. **Cung cấp gợi ý** cho người dùng về cách xử lý file
4. **Cho phép AI phân tích** dựa trên thông tin dự đoán

**Ví dụ với file "1000-tu-vung-tieng-anh-theo-chu-de.pdf":**
- Nhận diện: "tu vung", "1000" → Chủ đề: "Từ vựng tiếng Anh"
- Loại nội dung: "Danh sách từ vựng theo chủ đề"
- AI có thể đưa ra nhận xét về chất lượng danh sách từ vựng

## Testing

Để test tính năng PDF parsing:

1. **Upload file PDF**: Sử dụng file PDF có chứa văn bản
2. **Xem kết quả**: Kiểm tra nội dung được trích xuất trong tab "Results"
3. **AI Analysis**: Chạy "Analyze PDF" để xem AI phân tích nội dung thực
4. **Metadata**: Kiểm tra phần "Thông tin metadata" để xem thông tin file
5. **Fallback Testing**: Upload file PDF chứa hình ảnh để test fallback thông minh

## Performance Notes

- **File size**: Khuyến nghị < 10MB để parsing nhanh
- **Text-based PDFs**: Parsing tốt nhất với PDF chứa text
- **Image-based PDFs**: Có thể cần OCR bổ sung
- **Large files**: Parsing có thể mất vài giây

## Troubleshooting

### PDF không thể parse được:
- File có thể chứa hình ảnh thay vì text
- File có thể được mã hóa/bảo vệ
- File có thể bị hỏng
- **Intelligent fallback sẽ được kích hoạt** để phân tích tên file

### AI không phân tích đúng:
- Nội dung PDF quá ít hoặc không rõ ràng
- PDF chứa ngôn ngữ không hỗ trợ
- File quá lớn, AI chỉ xử lý phần đầu
- **Với fallback content**: AI đưa ra dự đoán dựa trên tên file, không phải phân tích thực tế

### Lỗi "Module not found":
- Đảm bảo đã cài đặt `pdf-parse`
- Kiểm tra Next.js version compatibility
- Restart development server
