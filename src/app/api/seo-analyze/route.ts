import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Parser for SEO Analysis Response
interface ParsedSEOSection {
  title: string
  analysis: string
  reason: string
  suggestions: string
}

interface ParsedSEOAnalysis {
  overview: string
  sections: ParsedSEOSection[]
  conclusion: string
}

function parseSEOAnalysis(rawText: string): ParsedSEOAnalysis {
  // Clean HTML tags
  const cleanText = rawText.replace(/<[^>]*>/g, '').trim()

  const result: ParsedSEOAnalysis = {
    overview: '',
    sections: [],
    conclusion: ''
  }

  // Split by main sections
  const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0)

	let currentSection: Partial<ParsedSEOSection> | null = null
	let isInConclusion = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Detect overview section
    if (line.includes('Tổng quan') || line.includes('Tổng quan:')) {
      let overviewText = ''
      i++ // Skip the "Tổng quan" line
      while (i < lines.length && !isMainSection(lines[i])) {
        overviewText += lines[i] + ' '
        i++
      }
      result.overview = overviewText.trim()
      i-- // Back up one line
      continue
    }

    // Detect main sections
    if (isMainSection(line)) {
      // Save previous section
      if (currentSection && currentSection.title) {
        result.sections.push(currentSection as ParsedSEOSection)
      }

      // Start new section
      currentSection = {
        title: line.replace(/^[-•*]\s*/, '').replace(/:$/, ''),
        analysis: '',
        reason: '',
        suggestions: ''
      }
      continue
    }

    // Detect conclusion
    if (line.includes('Kết luận') || line.includes('Chiến lược') || line.includes('Kết luận & Chiến lược')) {
      isInConclusion = true
      if (currentSection && currentSection.title) {
        result.sections.push(currentSection as ParsedSEOSection)
      }
      currentSection = null
      continue
    }

    // Process content
    if (currentSection) {
      if (line.includes('Phân tích:') || line.includes('Phân tích')) {
        currentSection.analysis = extractContent(lines, i, ['Nguyên nhân', 'Đề xuất', 'Kết luận'])
        continue
      }
      if (line.includes('Nguyên nhân:') || line.includes('Nguyên nhân')) {
        currentSection.reason = extractContent(lines, i, ['Đề xuất', 'Kết luận'])
        continue
      }
      if (line.includes('Đề xuất:') || line.includes('Đề xuất')) {
        currentSection.suggestions = extractContent(lines, i, ['Kết luận', 'Chiến lược'])
        continue
      }
    }

    // Collect conclusion content
    if (isInConclusion) {
      result.conclusion += line + ' '
    }
  }

  // Save last section
  if (currentSection && currentSection.title) {
    result.sections.push(currentSection as ParsedSEOSection)
  }

  return result
}

function isMainSection(line: string): boolean {
  const mainSections = [
    'Meta Title', 'Meta Description', 'Cấu trúc Heading', 'Mật độ từ khóa',
    'Liên kết', 'Cấu trúc nội dung', 'Tính thân thiện với thiết bị di động',
    'Tối ưu hóa hình ảnh', 'Cấu trúc URL', 'SEO kỹ thuật',
    'Từ khóa chính', 'Từ khóa phụ', 'Từ khóa dài', 'Phân tích mật độ từ khóa',
    'Từ khóa ngữ nghĩa', 'Phân tích khoảng trống', 'Đề xuất từ khóa từ đối thủ',
    'Cải thiện cấu trúc nội dung', 'Chiến lược tích hợp từ khóa', 'Tối ưu tương tác người dùng',
    'Đề xuất liên kết nội bộ', 'Khuyến nghị về Schema Markup', 'Tối ưu cho mạng xã hội'
  ]

  return mainSections.some(section => line.includes(section))
}

function extractContent(lines: string[], startIndex: number, stopWords: string[]): string {
  let content = ''
  let i = startIndex + 1

  while (i < lines.length) {
    const line = lines[i]

    // Stop if we hit another section marker or stop word
    if (stopWords.some(word => line.includes(word)) || isMainSection(line)) {
      break
    }

    // Skip empty lines or section markers
    if (line.trim() && !line.match(/^[•\-*]\s*$/) && !line.includes(':')) {
      content += line + ' '
    }

    i++
  }

  return content.trim()
}

// Initialize Gemini API with server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

const SEOPrompts = {
  errorAnalysis: `Hãy phân tích đoạn văn bản sau để tìm các lỗi SEO và trả về kết quả dưới dạng JSON. Phân tích theo các mục: Meta Title, Meta Description, Cấu trúc Heading, Mật độ từ khóa, Liên kết nội bộ/ngoại bộ, Cấu trúc nội dung & mức độ dễ đọc, Tính thân thiện với thiết bị di động, Tối ưu hóa hình ảnh, Cấu trúc URL, SEO kỹ thuật.

Trả về JSON với cấu trúc:
{
  "overview": "Tổng quan về tình trạng SEO",
  "errors": [
    {
      "title": "Tên lỗi",
      "description": "Mô tả chi tiết lỗi",
      "severity": "high|medium|low",
      "suggestion": "Đề xuất khắc phục"
    }
  ],
  "conclusion": "Kết luận và chiến lược SEO tổng thể"
}

Đoạn văn bản cần phân tích:
`,

  keywordAnalysis: `Hãy phân tích đoạn văn bản sau và đề xuất bộ từ khóa SEO tối ưu, trả về kết quả dưới dạng JSON. Phân tích theo các mục: Từ khóa chính, Từ khóa phụ, Từ khóa dài, Phân tích mật độ từ khóa, Từ khóa ngữ nghĩa LSI, Phân tích khoảng trống nội dung, Đề xuất từ khóa từ đối thủ.

Trả về JSON với cấu trúc:
{
  "overview": "Tổng quan về từ khóa",
  "primaryKeywords": ["từ khóa chính 1", "từ khóa chính 2"],
  "secondaryKeywords": ["từ khóa phụ 1", "từ khóa phụ 2", "từ khóa phụ 3"],
  "longTailKeywords": ["từ khóa dài 1", "từ khóa dài 2"],
  "keywordDensity": "Phân tích mật độ từ khóa",
  "lsiKeywords": ["từ khóa LSI 1", "từ khóa LSI 2"],
  "contentGaps": ["khoảng trống 1", "khoảng trống 2"],
  "competitorKeywords": ["từ khóa đối thủ 1", "từ khóa đối thủ 2"],
  "strategy": "Chiến lược SEO từ khóa tổng thể"
}

Đoạn văn bản cần phân tích:
`,

  contentOptimization: `Hãy phân tích đoạn văn bản sau và đưa ra các đề xuất tối ưu nội dung cho SEO, trả về kết quả dưới dạng JSON. Phân tích theo các mục: Cải thiện cấu trúc nội dung, Chiến lược tích hợp từ khóa, Tối ưu tương tác người dùng, Đề xuất liên kết nội bộ, Khuyến nghị về Schema Markup, Tối ưu cho mạng xã hội.

Trả về JSON với cấu trúc:
{
  "overview": "Tổng quan về tối ưu nội dung",
  "suggestions": [
    {
      "category": "Tên danh mục",
      "title": "Tiêu đề đề xuất",
      "description": "Mô tả chi tiết",
      "priority": "high|medium|low",
      "action": "Hành động cụ thể"
    }
  ],
  "strategy": "Chiến lược tối ưu nội dung tổng thể"
}

Đoạn văn bản cần phân tích:
`
}

export async function POST(request: NextRequest) {
  try {
    const { content, analysisType } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Nội dung không được để trống' },
        { status: 400 }
      )
    }

    if (!analysisType || !['errorAnalysis', 'keywordAnalysis', 'contentOptimization'].includes(analysisType)) {
      return NextResponse.json(
        { error: 'Loại phân tích không hợp lệ' },
        { status: 400 }
      )
    }

    const prompt = SEOPrompts[analysisType as keyof typeof SEOPrompts]
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(`${prompt}${content}`)
    const response = await result.response
    const rawAnalysis = response.text()

    // Try to parse JSON response
    let jsonData = null
    try {
      // Extract JSON from response (remove any markdown formatting)
      const jsonMatch = rawAnalysis.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('JSON parsing error:', error)
      // Fallback to old parsing method
      const parsedAnalysis = parseSEOAnalysis(rawAnalysis)
      return NextResponse.json({
        success: true,
        rawAnalysis,
        parsedAnalysis,
        analysisType
      })
    }

    return NextResponse.json({
      success: true,
      rawAnalysis,
      jsonData,
      analysisType
    })

  } catch (error) {
    console.error('SEO Analysis API Error:', error)

    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'Lỗi cấu hình API Key. Vui lòng kiểm tra lại.' },
          { status: 500 }
        )
      }
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Đã đạt giới hạn sử dụng API. Vui lòng thử lại sau.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi phân tích. Vui lòng thử lại.' },
      { status: 500 }
    )
  }
}
