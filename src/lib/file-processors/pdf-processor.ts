import { analyzePDF, summarizePDF } from '../gemini';

export interface PdfProcessingResult {
  content: string;
  pageCount: number;
  analysis?: string;
  summary?: string;
  error?: string;
  info?: {
    Title?: string;
    Author?: string;
    Subject?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
    Pages?: number;
    Encrypted?: boolean;
    ParsingStatus?: string;
  };
  success?: boolean;
}

export async function processPdfFile(file: File): Promise<PdfProcessingResult> {
  try {
    // Check if file has arrayBuffer method (File-like object)
    if (typeof file.arrayBuffer !== 'function') {
      throw new Error("Đối tượng file không hỗ trợ phương thức arrayBuffer. Vui lòng tải lên file hợp lệ.");
    }

    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append('file', file);

    // Gọi API để xử lý PDF
    const response = await fetch('/api/pdf/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi khi xử lý PDF');
    }

    const data = await response.json();

    return {
      content: data.content,
      pageCount: data.pageCount,
      info: data.info,
      success: data.success,
    };
  } catch (error) {
    console.error("Lỗi khi xử lý file PDF:", error);
    return {
      content: "",
      pageCount: 0,
      error: error instanceof Error ? error.message : "Không thể xử lý file PDF",
    };
  }
}

export async function analyzePdfContent(content: string): Promise<string> {
  try {
    return await analyzePDF(content);
  } catch (error) {
    console.error("Lỗi khi phân tích nội dung PDF:", error);
    throw new Error("Không thể phân tích nội dung PDF");
  }
}

export async function summarizePdfContent(content: string): Promise<string> {
  try {
    return await summarizePDF(content);
  } catch (error) {
    console.error("Lỗi khi tóm tắt nội dung PDF:", error);
    throw new Error("Không thể tóm tắt nội dung PDF");
  }
}

export async function processPdfWithAnalysis(file: File): Promise<PdfProcessingResult> {
  const result = await processPdfFile(file);

  if (result.error) {
    return result;
  }

  try {
    // Lấy phân tích
    const analysis = await analyzePdfContent(result.content);

    return {
      ...result,
      analysis,
    };
  } catch (error) {
    return {
      ...result,
      error: error instanceof Error ? error.message : "Không thể phân tích PDF",
    };
  }
}

export async function processPdfWithSummary(file: File): Promise<PdfProcessingResult> {
  const result = await processPdfFile(file);

  if (result.error) {
    return result;
  }

  try {
    // Lấy tóm tắt
    const summary = await summarizePdfContent(result.content);

    return {
      ...result,
      summary,
    };
  } catch (error) {
    return {
      ...result,
      error: error instanceof Error ? error.message : "Không thể tóm tắt PDF",
    };
  }
}
