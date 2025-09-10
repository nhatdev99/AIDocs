import * as mammoth from 'mammoth';
import { analyzeDocument, summarizeDocument, rewriteDocument } from '../gemini';

export interface DocxProcessingResult {
  content: string;
  analysis?: string;
  summary?: string;
  rewritten?: string;
  error?: string;
}

export async function processDocxFile(file: File): Promise<DocxProcessingResult> {
  try {
    // Check if file has arrayBuffer method (File-like object)
    if (typeof file.arrayBuffer !== 'function') {
      throw new Error("File object does not support arrayBuffer method. Please upload a valid file.");
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Extract text from DOCX using ArrayBuffer directly
    const result = await mammoth.extractRawText({ arrayBuffer });
    const content = result.value;

    if (!content || content.trim().length === 0) {
      throw new Error("No readable content found in the DOCX file");
    }

    return {
      content: content.trim(),
    };
  } catch (error) {
    console.error("Error processing DOCX file:", error);
    return {
      content: "",
      error: error instanceof Error ? error.message : "Failed to process DOCX file",
    };
  }
}

export async function analyzeDocxContent(content: string): Promise<string> {
  try {
    return await analyzeDocument(content);
  } catch (error) {
    console.error("Error analyzing DOCX content:", error);
    throw new Error("Failed to analyze document content");
  }
}

export async function summarizeDocxContent(content: string): Promise<string> {
  try {
    return await summarizeDocument(content);
  } catch (error) {
    console.error("Error summarizing DOCX content:", error);
    throw new Error("Failed to summarize document content");
  }
}

export async function rewriteDocxContent(content: string, style?: string): Promise<string> {
  try {
    return await rewriteDocument(content, style);
  } catch (error) {
    console.error("Error rewriting DOCX content:", error);
    throw new Error("Failed to rewrite document content");
  }
}

export async function processDocxWithAnalysis(file: File): Promise<DocxProcessingResult> {
  const result = await processDocxFile(file);

  if (result.error) {
    return result;
  }

  try {
    // Get analysis
    const analysis = await analyzeDocxContent(result.content);

    return {
      ...result,
      analysis,
    };
  } catch (error) {
    return {
      ...result,
      error: error instanceof Error ? error.message : "Failed to analyze document",
    };
  }
}

export async function processDocxWithSummary(file: File): Promise<DocxProcessingResult> {
  const result = await processDocxFile(file);

  if (result.error) {
    return result;
  }

  try {
    // Get summary
    const summary = await summarizeDocxContent(result.content);

    return {
      ...result,
      summary,
    };
  } catch (error) {
    return {
      ...result,
      error: error instanceof Error ? error.message : "Failed to summarize document",
    };
  }
}

export async function processDocxWithRewrite(file: File, style?: string): Promise<DocxProcessingResult> {
  const result = await processDocxFile(file);

  if (result.error) {
    return result;
  }

  try {
    // Get rewritten content
    const rewritten = await rewriteDocxContent(result.content, style);

    return {
      ...result,
      rewritten,
    };
  } catch (error) {
    return {
      ...result,
      error: error instanceof Error ? error.message : "Failed to rewrite document",
    };
  }
}
