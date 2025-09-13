import { GoogleGenerativeAI } from "@google/generative-ai";

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '');

// Các mô hình Gemini có sẵn theo thứ tự ưu tiên
const GEMINI_MODELS = [
  "gemini-2.5-flash"
];

let currentModelIndex = 0;

export const getGeminiModel = () => {
  const modelName = GEMINI_MODELS[currentModelIndex];
  return genAI.getGenerativeModel({ model: modelName });
};

export const switchToNextModel = () => {
  currentModelIndex = (currentModelIndex + 1) % GEMINI_MODELS.length;
  console.log(`Chuyển sang mô hình: ${GEMINI_MODELS[currentModelIndex]}`);
};

const generateContentWithFallback = async (prompt: string): Promise<string> => {
  const maxRetries = GEMINI_MODELS.length;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const model = getGeminiModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`Mô hình ${GEMINI_MODELS[currentModelIndex]} thất bại:`, error);
      lastError = error as Error;

      // Thử mô hình tiếp theo nếu chưa phải lần cuối
      if (attempt < maxRetries - 1) {
        switchToNextModel();
      }
    }
  }

  throw new Error(`Tất cả mô hình Gemini đều thất bại. Lỗi cuối cùng: ${lastError?.message}`);
};

export const analyzeDocument = async (content: string): Promise<string> => {
  try {
    const prompt = `Hãy phân tích nội dung tài liệu sau đây và đưa ra những nhận xét sâu sắc, các điểm chính, và chủ đề chính:\n\n${content}`;
    return await generateContentWithFallback(prompt);
  } catch (error) {
    console.error("Lỗi khi phân tích tài liệu:", error);
    throw new Error("Không thể phân tích tài liệu");
  }
};

export const summarizeDocument = async (content: string): Promise<string> => {
  try {
    const prompt = `Hãy cung cấp một bản tóm tắt toàn diện về nội dung tài liệu sau đây, làm nổi bật các điểm chính và kết luận:\n\n${content}`;
    return await generateContentWithFallback(prompt);
  } catch (error) {
    console.error("Lỗi khi tóm tắt tài liệu:", error);
    throw new Error("Không thể tóm tắt tài liệu");
  }
};

export const rewriteDocument = async (content: string, style?: string): Promise<string> => {
  try {
    const styleInstruction = style ? ` theo phong cách ${style}` : "";
    const prompt = `Hãy viết lại nội dung tài liệu sau đây${styleInstruction}, cải thiện tính rõ ràng, cấu trúc và khả năng đọc hiểu đồng thời giữ nguyên ý nghĩa gốc:\n\n${content}`;
    return await generateContentWithFallback(prompt);
  } catch (error) {
    console.error("Lỗi khi viết lại tài liệu:", error);
    throw new Error("Không thể viết lại tài liệu");
  }
};

export const analyzePDF = async (content: string): Promise<string> => {
  try {
    // Kiểm tra xem content có phải là fallback không
    const isFallback = content.includes('📄 PHÂN TÍCH TÊN FILE PDF') || content.includes('⚠️  KHÔNG THỂ TRÍCH XUẤT');

    let prompt;
    if (isFallback) {
      prompt = `Đây là nội dung fallback được tạo từ việc phân tích tên file PDF vì không thể trích xuất văn bản trực tiếp.

Hãy phân tích thông tin có sẵn và đưa ra nhận xét, dự đoán về nội dung file PDF:

${content}

Hướng dẫn phân tích:
1. Dựa trên tên file và thông tin metadata để dự đoán chủ đề chính
2. Đánh giá mức độ phù hợp của dự đoán
3. Đưa ra gợi ý về loại nội dung có thể có trong file
4. Tư vấn về cách xử lý file hiệu quả hơn`;
    } else {
      prompt = `Hãy phân tích nội dung PDF sau đây và đưa ra những nhận xét sâu sắc, thông tin chính, và chủ đề chính:\n\n${content}`;
    }

    return await generateContentWithFallback(prompt);
  } catch (error) {
    console.error("Lỗi khi phân tích PDF:", error);
    throw new Error("Không thể phân tích PDF");
  }
};

export const summarizePDF = async (content: string): Promise<string> => {
  try {
    // Kiểm tra xem content có phải là fallback không
    const isFallback = content.includes('📄 PHÂN TÍCH TÊN FILE PDF') || content.includes('⚠️  KHÔNG THỂ TRÍCH XUẤT');

    let prompt;
    if (isFallback) {
      prompt = `Đây là thông tin phân tích từ tên file PDF (không thể trích xuất nội dung thực tế).

Hãy tóm tắt những gì chúng ta biết về file này và đưa ra dự đoán về nội dung có thể có:

${content}

Tóm tắt cần bao gồm:
1. Chủ đề chính của tài liệu
2. Mục đích sử dụng dự kiến
3. Đối tượng người dùng mục tiêu
4. Các giải pháp để truy cập nội dung thực tế`;
    } else {
      prompt = `Hãy cung cấp một bản tóm tắt ngắn gọn về nội dung PDF sau đây, nắm bắt thông tin thiết yếu và các điểm chính:\n\n${content}`;
    }

    return await generateContentWithFallback(prompt);
  } catch (error) {
    console.error("Lỗi khi tóm tắt PDF:", error);
    throw new Error("Không thể tóm tắt PDF");
  }
};
