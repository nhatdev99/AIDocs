"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/rich-text-editor'
import { toast } from '@/hooks/use-toast'
import { Loader2, FileText, AlertTriangle, TrendingUp, Search, CheckCircle, XCircle } from 'lucide-react'
// import { Textarea } from './ui/textarea'

// API endpoint for SEO analysis
const SEO_ANALYZE_API = '/api/seo-analyze'

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

interface SEOError {
	title: string
	description: string
	severity: 'high' | 'medium' | 'low'
	suggestion: string
}

interface SEOSuggestion {
	category: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	action: string
}

interface KeywordAnalysisJSON {
	overview: string
	primaryKeywords: string[]
	secondaryKeywords: string[]
	longTailKeywords: string[]
	keywordDensity: string
	lsiKeywords: string[]
	contentGaps: string[]
	competitorKeywords: string[]
	strategy: string
}

interface ErrorAnalysisJSON {
	overview: string
	errors: SEOError[]
	conclusion: string
}

interface ContentOptimizationJSON {
	overview: string
	suggestions: SEOSuggestion[]
	strategy: string
}

interface SEOAnalysisResult {
	score: number
	keywords: {
		primary: string[]
		secondary: string[]
	}
	errors: string[]
	suggestions: string[]
	titleSuggestions: string[]
	metaDescriptionSuggestions: string[]
	readabilityScore: number
	rawAnalysis: {
		errorAnalysis: string
		keywordAnalysis: string
		contentOptimization: string
	}
	jsonData?: {
		errorAnalysis: ErrorAnalysisJSON
		keywordAnalysis: KeywordAnalysisJSON
		contentOptimization: ContentOptimizationJSON
	}
	parsedAnalysis?: {
		errorAnalysis: ParsedSEOAnalysis
		keywordAnalysis: ParsedSEOAnalysis
		contentOptimization: ParsedSEOAnalysis
	}
}



export function SEOAnalyzer() {
	console.log('🔄 SEOAnalyzer component rendered')

	const [content, setContent] = useState('')
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [analysisResult, setAnalysisResult] = useState<SEOAnalysisResult | null>(null)
	const [activeTab, setActiveTab] = useState('content')

	console.log('📊 Component state:', {
		contentLength: content.length,
		isAnalyzing,
		hasAnalysisResult: !!analysisResult,
		activeTab,
		analysisResultKeys: analysisResult ? Object.keys(analysisResult) : []
	})

	// Collapsible state for raw analysis sections
	const [collapsedSections, setCollapsedSections] = useState({
		errorAnalysis: false,
		keywordAnalysis: false,
		contentOptimization: false
	})

	// Collapsible state for analysis tab sections
	const [analysisCollapsed, setAnalysisCollapsed] = useState({
		keywords: false
	})

	// Debug helper function
	const debugLog = (message: string, data?: unknown) => {
		if (process.env.NODE_ENV === 'development') {
			console.log(`🐛 [SEO Debug] ${message}`, data || '')
		}
	}

	// Use debugLog for important debugging points
	debugLog('SEO Analyzer initialized')

	// Progress state
	const [analysisProgress, setAnalysisProgress] = useState({
		isVisible: false,
		currentStep: 1,
		progress: 0,
		estimatedTime: 25,
		statusMessage: 'Chuẩn bị phân tích...'
	})

	const toggleSection = (section: keyof typeof collapsedSections) => {
		setCollapsedSections(prev => ({
			...prev,
			[section]: !prev[section]
		}))
	}

	const toggleAnalysisSection = (section: keyof typeof analysisCollapsed) => {
		setAnalysisCollapsed(prev => ({
			...prev,
			[section]: !prev[section]
		}))
	}

	// Collapsible Card Component
	const CollapsibleCard = ({
		title,
		description,
		icon: Icon,
		isCollapsed,
		onToggle,
		children,
		colorScheme = 'default'
	}: {
		title: string
		description: string
		icon: React.ComponentType<{ className?: string }>
		isCollapsed: boolean
		onToggle: () => void
		children: React.ReactNode
		colorScheme?: 'red' | 'blue' | 'green' | 'default'
	}) => {
		const colorClasses = {
			red: {
				header: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-700',
				icon: 'text-red-500',
				title: 'text-red-700 dark:text-red-300',
				dot: 'bg-red-500'
			},
			blue: {
				header: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-700',
				icon: 'text-blue-500',
				title: 'text-blue-700 dark:text-blue-300',
				dot: 'bg-blue-500'
			},
			green: {
				header: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-700',
				icon: 'text-green-500',
				title: 'text-green-700 dark:text-green-300',
				dot: 'bg-green-500'
			},
			default: {
				header: 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700',
				icon: 'text-slate-500',
				title: 'text-slate-700 dark:text-slate-300',
				dot: 'bg-slate-500'
			}
		}

		const colors = colorClasses[colorScheme]

		return (
			<Card className="overflow-hidden">
				<CardHeader
					className={`${colors.header} cursor-pointer transition-colors hover:bg-opacity-80`}
					onClick={onToggle}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className={`w-3 h-3 ${colors.dot} rounded-full flex-shrink-0`}></div>
							<div className="flex items-center gap-2">
								<Icon className={`w-5 h-5 ${colors.icon}`} />
								<CardTitle className={`text-lg ${colors.title}`}>
									{title}
								</CardTitle>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="p-1 h-8 w-8"
							onClick={(e) => {
								e.stopPropagation()
								onToggle()
							}}
						>
							{isCollapsed ? (
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							) : (
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
								</svg>
							)}
						</Button>
					</div>
					<CardDescription className="text-sm mt-1">
						{description}
					</CardDescription>
				</CardHeader>
				{!isCollapsed && (
					<CardContent className="pt-0">
						{children}
					</CardContent>
				)}
			</Card>
		)
	}

	// SEO Score Visualization Component
	const SEOScoreCard = ({
		score,
		readabilityScore,
		keywords,
		title,
		description
	}: {
		score: number
		readabilityScore: number
		keywords: { primary: string[], secondary: string[] }
		title: string
		description: string
	}) => {
		const keywordCount = keywords.primary.length + keywords.secondary.length
		const getScoreColor = (score: number) => {
			if (score >= 80) return 'text-green-600'
			if (score >= 60) return 'text-yellow-600'
			return 'text-red-600'
		}

		const getScoreBg = (score: number) => {
			if (score >= 80) return 'bg-green-500'
			if (score >= 60) return 'bg-yellow-500'
			return 'bg-red-500'
		}

		const getScoreText = (score: number) => {
			if (score >= 80) return 'Xuất sắc'
			if (score >= 60) return 'Khá tốt'
			if (score >= 40) return 'Cần cải thiện'
			return 'Kém'
		}

		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="w-5 h-5" />
						{title}
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* SEO Score */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Điểm SEO</span>
								<span className={`text-lg font-bold ${getScoreColor(score)}`}>
									{score}/100
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
								<div
									className={`h-3 rounded-full transition-all duration-500 ${getScoreBg(score)}`}
									style={{ width: `${score}%` }}
								></div>
							</div>
							<div className="text-center">
								<Badge
									className={`${
										score >= 80 ? 'bg-green-100 text-green-800' :
										score >= 60 ? 'bg-yellow-100 text-yellow-800' :
										'bg-red-100 text-red-800'
									}`}
								>
									{getScoreText(score)}
								</Badge>
							</div>
						</div>

						{/* Readability Score */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Độ dễ đọc</span>
								<span className={`text-lg font-bold ${getScoreColor(readabilityScore)}`}>
									{readabilityScore}/100
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
								<div
									className={`h-3 rounded-full transition-all duration-500 ${getScoreBg(readabilityScore)}`}
									style={{ width: `${readabilityScore}%` }}
								></div>
							</div>
							<div className="text-center">
								<Badge
									className={`${
										readabilityScore >= 80 ? 'bg-green-100 text-green-800' :
										readabilityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
										'bg-red-100 text-red-800'
									}`}
								>
									{getScoreText(readabilityScore)}
								</Badge>
							</div>
						</div>

						{/* Keywords Count */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Từ khóa</span>
								<span className="text-lg font-bold text-blue-600">
									{keywordCount}
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
								<div
									className="h-3 bg-blue-500 rounded-full transition-all duration-500"
									style={{ width: `${Math.min(keywordCount * 10, 100)}%` }}
								></div>
							</div>
							<div className="text-center">
								<Badge className="bg-blue-100 text-blue-800">
									{keywordCount >= 10 ? 'Đầy đủ' : 'Cần thêm'}
								</Badge>
							</div>
						</div>
					</div>

					{/* Overall Status */}
					<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-3">
							<div className={`w-4 h-4 rounded-full ${
								score >= 70 && readabilityScore >= 70 && keywordCount >= 5
									? 'bg-green-500'
									: score >= 50 && readabilityScore >= 50
									? 'bg-yellow-500'
									: 'bg-red-500'
							}`}></div>
							<div>
								<h4 className="font-medium text-sm">
									{score >= 70 && readabilityScore >= 70 && keywordCount >= 5
										? 'Trang web của bạn đã được tối ưu SEO tốt!'
										: score >= 50 && readabilityScore >= 50
										? 'Trang web có tiềm năng tốt, cần cải thiện thêm'
										: 'Cần tối ưu hóa SEO ngay lập tức'
									}
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
									Đánh giá dựa trên điểm SEO, độ dễ đọc và số lượng từ khóa
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}

	// Collapsible Keywords Section Component
	const KeywordsSection = ({
		keywords,
		isCollapsed,
		onToggle
	}: {
		keywords: { primary: string[], secondary: string[] }
		isCollapsed: boolean
		onToggle: () => void
	}) => {
		const primaryKeywords = keywords.primary
		const secondaryKeywords = keywords.secondary
		const totalKeywords = primaryKeywords.length + secondaryKeywords.length

		return (
			<Card>
				<CardHeader
					className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
					onClick={onToggle}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Search className="w-5 h-5" />
							<CardTitle className="text-lg">Từ khóa đề xuất</CardTitle>
						</div>
						<Button variant="ghost" size="sm" className="p-1 h-8 w-8">
							{isCollapsed ? (
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							) : (
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
								</svg>
							)}
						</Button>
					</div>
					<CardDescription>
						Các từ khóa được Gemini AI phân tích và đề xuất theo cấp độ ({totalKeywords} từ khóa)
					</CardDescription>
				</CardHeader>

				{!isCollapsed && (
					<CardContent>
						<div className="space-y-6">
							{/* Primary Keywords */}
							<div>
								<h4 className="font-medium text-sm text-red-600 mb-3 flex items-center gap-2">
									<span className="w-2 h-2 bg-red-500 rounded-full"></span>
									Từ khóa chính (Primary) - {primaryKeywords.length}
								</h4>
								{primaryKeywords.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{primaryKeywords.map((keyword, index) => {
											const cleanKeyword = keyword.replace(/<[^>]*>/g, '').trim()
											return (
												<Badge 
													key={index} 
													className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1.5 border border-red-300 rounded-full shadow-sm"
												>
													<span className="text-sm font-medium max-w-xs truncate" title={cleanKeyword}>
														{cleanKeyword}
													</span>
												</Badge>
											)
										})}
									</div>
								) : (
									<div className="text-sm text-gray-500 italic p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
										Không tìm thấy từ khóa chính trong phân tích
									</div>
								)}
							</div>

							{/* Secondary Keywords */}
							<div>
								<h4 className="font-medium text-sm text-blue-600 mb-3 flex items-center gap-2">
									<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
									Từ khóa phụ (Secondary) - {secondaryKeywords.length}
								</h4>
								{secondaryKeywords.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{secondaryKeywords.map((keyword, index) => {
											const cleanKeyword = keyword.replace(/<[^>]*>/g, '').trim()
											return (
												<Badge 
													key={index} 
													variant="secondary" 
													className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1.5 border border-blue-300 rounded-full shadow-sm"
												>
													<span className="text-sm font-medium max-w-xs truncate" title={cleanKeyword}>
														{cleanKeyword}
													</span>
												</Badge>
											)
										})}
									</div>
								) : (
									<div className="text-sm text-gray-500 italic p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
										Không tìm thấy từ khóa phụ trong phân tích
									</div>
								)}
							</div>

						</div>
					</CardContent>
				)}
			</Card>
		)
	}

	// JSON Analysis Card Component
	const JSONAnalysisCard = ({
		jsonData,
		rawData,
		title,
		description,
		icon: Icon,
		colorScheme = 'default'
	}: {
		jsonData: ErrorAnalysisJSON | KeywordAnalysisJSON | ContentOptimizationJSON | null
		rawData: string
		title: string
		description: string
		icon: React.ComponentType<{ className?: string }>
		colorScheme?: 'red' | 'blue' | 'green' | 'default'
	}) => {
		const colorClasses = {
			red: {
				header: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-700',
				icon: 'text-red-500',
				title: 'text-red-700 dark:text-red-300',
				dot: 'bg-red-500'
			},
			blue: {
				header: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-700',
				icon: 'text-blue-500',
				title: 'text-blue-700 dark:text-blue-300',
				dot: 'bg-blue-500'
			},
			green: {
				header: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-700',
				icon: 'text-green-500',
				title: 'text-green-700 dark:text-green-300',
				dot: 'bg-green-500'
			},
			default: {
				header: 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700',
				icon: 'text-slate-500',
				title: 'text-slate-700 dark:text-slate-300',
				dot: 'bg-slate-500'
			}
		}

		const colors = colorClasses[colorScheme]

		return (
			<Card className="overflow-hidden">
				<CardHeader className={`${colors.header}`}>
					<div className="flex items-center gap-3">
						<div className={`w-3 h-3 ${colors.dot} rounded-full flex-shrink-0`}></div>
						<div className="flex items-center gap-2">
							<Icon className={`w-5 h-5 ${colors.icon}`} />
							<CardTitle className={`text-lg ${colors.title}`}>
								{title}
							</CardTitle>
						</div>
					</div>
					<CardDescription className="text-sm mt-1">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					{jsonData ? (
						<div className="space-y-6">
							{/* Overview */}
							{jsonData.overview && (
								<div className="mb-6">
									<h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
										Tổng quan
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
										{jsonData.overview}
									</p>
								</div>
							)}

							{/* Keywords Analysis */}
							{'primaryKeywords' in jsonData && jsonData.primaryKeywords && (
								<div className="space-y-4">
									<h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
										Phân tích từ khóa
									</h4>
									
									{jsonData.primaryKeywords.length > 0 && (
										<div>
											<h5 className="font-medium text-sm text-red-600 mb-2">Từ khóa chính</h5>
											<div className="flex flex-wrap gap-2">
												{jsonData.primaryKeywords.map((keyword: string, index: number) => (
													<Badge key={index} className="bg-red-100 text-red-800 px-2 py-1">
														{keyword}
													</Badge>
												))}
											</div>
										</div>
									)}

									{jsonData.secondaryKeywords && jsonData.secondaryKeywords.length > 0 && (
										<div>
											<h5 className="font-medium text-sm text-blue-600 mb-2">Từ khóa phụ</h5>
											<div className="flex flex-wrap gap-2">
												{jsonData.secondaryKeywords.map((keyword: string, index: number) => (
													<Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 px-2 py-1">
														{keyword}
													</Badge>
												))}
											</div>
										</div>
									)}

									{jsonData.longTailKeywords && jsonData.longTailKeywords.length > 0 && (
										<div>
											<h5 className="font-medium text-sm text-green-600 mb-2">Từ khóa dài</h5>
											<div className="flex flex-wrap gap-2">
												{jsonData.longTailKeywords.map((keyword: string, index: number) => (
													<Badge key={index} variant="outline" className="bg-green-50 text-green-700 px-2 py-1">
														{keyword}
													</Badge>
												))}
											</div>
										</div>
									)}
								</div>
							)}

							{/* Errors Analysis */}
							{'errors' in jsonData && jsonData.errors && jsonData.errors.length > 0 && (
								<div className="space-y-4">
									<h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
										Phân tích lỗi
									</h4>
									<div className="space-y-3">
										{jsonData.errors.map((error: SEOError, index: number) => (
											<div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
												<div className="flex items-start gap-3">
													<div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
														error.severity === 'high' ? 'bg-red-500' :
														error.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
													}`}>
														{index + 1}
													</div>
													<div className="flex-1">
														<h5 className="font-medium text-sm mb-1">{error.title}</h5>
														<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{error.description}</p>
														{error.suggestion && (
															<div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
																<strong>Đề xuất:</strong> {error.suggestion}
															</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Suggestions Analysis */}
							{'suggestions' in jsonData && jsonData.suggestions && jsonData.suggestions.length > 0 && (
								<div className="space-y-4">
									<h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
										Đề xuất cải thiện
									</h4>
									<div className="space-y-3">
										{jsonData.suggestions.map((suggestion: SEOSuggestion, index: number) => (
											<div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
												<div className="flex items-start gap-3">
													<div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
														suggestion.priority === 'high' ? 'bg-red-500' :
														suggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
													}`}>
														{index + 1}
													</div>
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<h5 className="font-medium text-sm">{suggestion.title}</h5>
															<Badge variant="outline" className="text-xs">
																{suggestion.category}
															</Badge>
														</div>
														<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{suggestion.description}</p>
														{suggestion.action && (
															<div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
																<strong>Hành động:</strong> {suggestion.action}
															</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Strategy/Conclusion */}
							{((jsonData && 'strategy' in jsonData && jsonData.strategy) || (jsonData && 'conclusion' in jsonData && jsonData.conclusion)) && (
								<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
									<h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
										{jsonData && 'strategy' in jsonData && jsonData.strategy ? 'Chiến lược' : 'Kết luận'}
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
										{jsonData && 'strategy' in jsonData && jsonData.strategy ? jsonData.strategy : 
										 jsonData && 'conclusion' in jsonData && jsonData.conclusion ? jsonData.conclusion : ''}
									</p>
								</div>
							)}
						</div>
					) : (
						<div className="text-center text-gray-500 py-8">
							<p>Không có dữ liệu JSON để hiển thị</p>
						</div>
					)}

					{/* Raw Data Toggle */}
					<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
						<details className="group">
							<summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2">
								<svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
								Xem dữ liệu thô từ Gemini AI
							</summary>
							<div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
								<pre className="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap overflow-x-auto">
									{rawData}
								</pre>
							</div>
						</details>
					</div>
				</CardContent>
			</Card>
		)
	}

	// Structured Analysis Card Component
	const StructuredAnalysisCard = ({
		parsedData,
		rawData,
		title,
		description,
		icon: Icon,
		colorScheme = 'default'
	}: {
		parsedData: ParsedSEOAnalysis
		rawData: string
		title: string
		description: string
		icon: React.ComponentType<{ className?: string }>
		colorScheme?: 'red' | 'blue' | 'green' | 'default'
	}) => {
		const colorClasses = {
			red: {
				header: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-700',
				icon: 'text-red-500',
				title: 'text-red-700 dark:text-red-300',
				dot: 'bg-red-500'
			},
			blue: {
				header: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-700',
				icon: 'text-blue-500',
				title: 'text-blue-700 dark:text-blue-300',
				dot: 'bg-blue-500'
			},
			green: {
				header: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-700',
				icon: 'text-green-500',
				title: 'text-green-700 dark:text-green-300',
				dot: 'bg-green-500'
			},
			default: {
				header: 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700',
				icon: 'text-slate-500',
				title: 'text-slate-700 dark:text-slate-300',
				dot: 'bg-slate-500'
			}
		}

		const colors = colorClasses[colorScheme]

		return (
			<Card className="overflow-hidden">
				<CardHeader className={`${colors.header}`}>
					<div className="flex items-center gap-3">
						<div className={`w-3 h-3 ${colors.dot} rounded-full flex-shrink-0`}></div>
						<div className="flex items-center gap-2">
							<Icon className={`w-5 h-5 ${colors.icon}`} />
							<CardTitle className={`text-lg ${colors.title}`}>
								{title}
							</CardTitle>
						</div>
					</div>
					<CardDescription className="text-sm mt-1">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					{/* Overview */}
					{parsedData.overview && (
						<div className="mb-6">
							<h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
								Tổng quan
							</h4>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								{parsedData.overview}
							</p>
						</div>
					)}

					{/* Sections */}
					{parsedData.sections.length > 0 && (
						<div className="space-y-4">
							<h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
								Phân tích chi tiết
							</h4>
							{parsedData.sections.map((section, index) => (
								<div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
									<h5 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">
										{section.title}
									</h5>

									{section.analysis && (
										<div className="mb-3">
											<div className="flex items-center gap-2 mb-1">
												<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
												<span className="text-xs font-medium text-blue-700 dark:text-blue-300">Phân tích</span>
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-4">
												{section.analysis}
											</p>
										</div>
									)}

									{section.reason && (
										<div className="mb-3">
											<div className="flex items-center gap-2 mb-1">
												<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
												<span className="text-xs font-medium text-orange-700 dark:text-orange-300">Nguyên nhân</span>
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-4">
												{section.reason}
											</p>
										</div>
									)}

									{section.suggestions && (
										<div className="mb-3">
											<div className="flex items-center gap-2 mb-1">
												<div className="w-2 h-2 bg-green-500 rounded-full"></div>
												<span className="text-xs font-medium text-green-700 dark:text-green-300">Đề xuất</span>
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-4">
												{section.suggestions}
											</p>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Conclusion */}
					{parsedData.conclusion && (
						<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
							<h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
								Kết luận & Chiến lược
							</h4>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								{parsedData.conclusion}
							</p>
						</div>
					)}

					{/* Raw Data Toggle */}
					<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
						<details className="group">
							<summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2">
								<svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
								Xem dữ liệu thô từ Gemini AI
							</summary>
							<div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
								<div className="prose prose-sm max-w-none text-gray-900 dark:text-gray-100"
									dangerouslySetInnerHTML={{ __html: rawData }}
								/>
							</div>
						</details>
					</div>
				</CardContent>
			</Card>
		)
	}

	// Enhanced Errors and Suggestions Component
	const EnhancedIssuesCard = ({
		errors,
		suggestions,
		title,
		description
	}: {
		errors: string[]
		suggestions: string[]
		title: string
		description: string
	}) => {
		const getSeverityColor = (index: number) => {
			if (index === 0) return 'bg-red-500' // Critical
			if (index < 3) return 'bg-orange-500' // High
			return 'bg-yellow-500' // Medium
		}

		const getSeverityText = (index: number) => {
			if (index === 0) return 'Nghiêm trọng'
			if (index < 3) return 'Cao'
			return 'Trung bình'
		}

		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5" />
						{title}
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Errors Section */}
					<div>
						<h4 className="font-medium text-sm mb-4 flex items-center gap-2">
							<XCircle className="w-4 h-4 text-red-500" />
							Vấn đề cần khắc phục ({errors.length})
						</h4>

						{errors.length > 0 ? (
							<div className="space-y-3">
								{errors.map((error, index) => (
									<div key={index} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
										<div className="flex-shrink-0">
											<div className={`w-6 h-6 ${getSeverityColor(index)} rounded-full flex items-center justify-center`}>
												<span className="text-white text-xs font-bold">!</span>
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-2">
												<span className="text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded">
													{getSeverityText(index)}
												</span>
											</div>
											<div className="text-sm text-red-800 dark:text-red-200 prose prose-sm max-w-none"
												dangerouslySetInnerHTML={{ __html: error }}
											/>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
								<CheckCircle className="w-5 h-5 text-green-500" />
								<span className="text-green-700 dark:text-green-300 font-medium">
									Không phát hiện lỗi SEO nghiêm trọng
								</span>
							</div>
						)}
					</div>

					{/* Suggestions Section */}
					<div>
						<h4 className="font-medium text-sm mb-4 flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-blue-500" />
							Đề xuất cải thiện ({suggestions.length})
						</h4>

						{suggestions.length > 0 ? (
							<div className="space-y-3">
								{suggestions.map((suggestion, index) => (
									<div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
										<div className="flex-shrink-0 mt-0.5">
											<div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
												<span className="text-white text-xs font-bold">{index + 1}</span>
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-sm text-blue-800 dark:text-blue-200 prose prose-sm max-w-none"
												dangerouslySetInnerHTML={{ __html: suggestion }}
											/>
											<div className="mt-2 flex items-center gap-2">
												<span className="text-xs text-blue-600 dark:text-blue-400">
													Ưu tiên: {index < 3 ? 'Cao' : index < 6 ? 'Trung bình' : 'Thấp'}
												</span>
												<div className={`w-2 h-2 rounded-full ${
													index < 3 ? 'bg-red-500' :
													index < 6 ? 'bg-yellow-500' :
													'bg-gray-500'
												}`}></div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center text-muted-foreground py-4">
								Không có đề xuất cải thiện nào
							</div>
						)}
					</div>

					{/* Summary Stats */}
					{(errors.length > 0 || suggestions.length > 0) && (
						<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
								<div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
									<div className="text-lg font-bold text-red-600">{errors.length}</div>
									<div className="text-xs text-red-600">Lỗi</div>
								</div>
								<div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
									<div className="text-lg font-bold text-blue-600">{suggestions.length}</div>
									<div className="text-xs text-blue-600">Đề xuất</div>
								</div>
								<div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
									<div className="text-lg font-bold text-yellow-600">
										{errors.filter((_, i) => i < 3).length}
									</div>
									<div className="text-xs text-yellow-600">Ưu tiên cao</div>
								</div>
								<div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
									<div className="text-lg font-bold text-green-600">
										{Math.max(0, 10 - errors.length - Math.floor(suggestions.length / 2))}
									</div>
									<div className="text-xs text-green-600">Điểm hoàn thiện</div>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		)
	}

	// Analysis Progress Component
	const AnalysisProgress = ({
		isVisible,
		currentStep,
		progress,
		estimatedTime,
		statusMessage
	}: {
		isVisible: boolean
		currentStep: number
		progress: number
		estimatedTime: number
		statusMessage: string
	}) => {
		const steps = [
			{ id: 1, title: 'Chuẩn bị nội dung', description: 'Xử lý và làm sạch dữ liệu đầu vào' },
			{ id: 2, title: 'Phân tích cấu trúc', description: 'Đánh giá cấu trúc HTML và SEO elements' },
			{ id: 3, title: 'Kết nối Gemini AI', description: 'Gửi yêu cầu đến AI và nhận phản hồi' },
			{ id: 4, title: 'Xử lý kết quả', description: 'Parse và format dữ liệu trả về' },
			{ id: 5, title: 'Hoàn thành phân tích', description: 'Chuẩn bị báo cáo cuối cùng' }
		]

		if (!isVisible) return null

		return (
			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
				<Card className="w-full max-w-md mx-auto">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
							{progress < 100 ? (
								<svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
							) : (
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							)}
						</div>
						<CardTitle className="text-xl">Đang phân tích SEO</CardTitle>
						<CardDescription>{statusMessage}</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Progress Bar */}
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Tiến trình</span>
								<span className="font-medium">{Math.round(progress)}%</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
								<div
									className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
									style={{ width: `${progress}%` }}
								></div>
							</div>
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>Thời gian ước tính: {estimatedTime}s</span>
								<span>Bước {currentStep}/5</span>
							</div>
						</div>

						{/* Steps */}
						<div className="space-y-3">
							{steps.map((step, index) => (
								<div key={step.id} className="flex items-start gap-3">
									<div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
										index + 1 < currentStep
											? 'bg-green-500 text-white'
											: index + 1 === currentStep
											? 'bg-blue-500 text-white animate-pulse'
											: 'bg-gray-200 dark:bg-gray-700 text-gray-500'
									}`}>
										{index + 1 < currentStep ? (
											<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
											</svg>
										) : index + 1 === currentStep ? (
											<svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										) : (
											step.id
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className={`text-sm font-medium ${
											index + 1 <= currentStep ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'
										}`}>
											{step.title}
										</div>
										<div className={`text-xs ${
											index + 1 <= currentStep ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'
										}`}>
											{step.description}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Tips */}
						<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
							<div className="flex items-start gap-2">
								<svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div className="text-sm text-blue-800 dark:text-blue-200">
									<div className="font-medium mb-1">Mẹo:</div>
									<div className="text-xs">
										{currentStep === 1 && "Đang chuẩn bị nội dung để phân tích..."}
										{currentStep === 2 && "AI đang phân tích cấu trúc và elements SEO..."}
										{currentStep === 3 && "Đang kết nối với Gemini AI để xử lý thông minh..."}
										{currentStep === 4 && "Đang xử lý và format kết quả phân tích..."}
										{currentStep === 5 && "Gần hoàn thành! Đang chuẩn bị báo cáo cuối cùng..."}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	const analyzeWithGemini = async (analysisType: string, text: string) => {
		console.log(`🤖 Calling Gemini API for ${analysisType}...`)

		try {
			const response = await fetch(SEO_ANALYZE_API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					content: text,
					analysisType: analysisType
				}),
			})

			console.log(`📡 API response status for ${analysisType}:`, response.status)

			const data = await response.json()
			console.log(`📄 API response data for ${analysisType}:`, {
				hasAnalysis: !!data.analysis,
				hasRawAnalysis: !!data.rawAnalysis,
				hasJsonData: !!data.jsonData,
				hasParsedAnalysis: !!data.parsedAnalysis,
				dataKeys: Object.keys(data)
			})

			if (!response.ok) {
				console.error(`❌ API error for ${analysisType}:`, data.error)
				throw new Error(data.error || 'Có lỗi xảy ra khi phân tích')
			}

			// Check if rawAnalysis exists and is a string
			if (!data.rawAnalysis || typeof data.rawAnalysis !== 'string') {
				console.error(`❌ Invalid API response for ${analysisType}: rawAnalysis is missing or not a string`, data)
				throw new Error(`Phản hồi API không hợp lệ cho ${analysisType}`)
			}

			console.log(`✅ API call successful for ${analysisType}`)
			return {
				rawAnalysis: data.rawAnalysis,
				jsonData: data.jsonData
			}
		} catch (error) {
			console.error(`❌ SEO Analysis Error for ${analysisType}:`, error)
			if (error instanceof Error) {
				throw error
			}
			throw new Error('Không thể phân tích với Gemini API')
		}
	}

	const analyzeSEO = async () => {
		console.log('🔍 Starting SEO analysis...')
		console.log('📝 Content length:', content.length)

		if (!content.trim()) {
			console.warn('❌ No content provided')
			toast({
				title: 'Lỗi',
				description: 'Vui lòng nhập nội dung để phân tích',
				variant: 'destructive'
			})
			return
		}

		setIsAnalyzing(true)

		// Initialize progress
		setAnalysisProgress({
			isVisible: true,
			currentStep: 1,
			progress: 0,
			estimatedTime: 25,
			statusMessage: 'Chuẩn bị nội dung để phân tích...'
		})

		try {
			// Step 1: Content preparation
			console.log('📋 Step 1: Preparing content...')
			await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate processing
			setAnalysisProgress(prev => ({
				...prev,
				currentStep: 1,
				progress: 20,
				statusMessage: 'Đang chuẩn bị nội dung...'
			}))
			console.log('✅ Content preparation complete')

			// Step 2: Analyze structure
			console.log('🔍 Step 2: Analyzing structure...')
			setAnalysisProgress(prev => ({
				...prev,
				currentStep: 2,
				progress: 40,
				statusMessage: 'Phân tích cấu trúc nội dung...'
			}))

			// Analyze for SEO errors
			console.log('🚨 Step 3: Analyzing SEO errors...')
			const errorResult = await analyzeWithGemini('errorAnalysis', content)
			console.log('✅ Error analysis complete, response length:', errorResult?.rawAnalysis?.length || 0)

			// Step 3: Connect to AI
			setAnalysisProgress(prev => ({
				...prev,
				currentStep: 3,
				progress: 60,
				statusMessage: 'Kết nối với Gemini AI...'
			}))

			// Analyze for keywords
			console.log('🔑 Step 4: Analyzing keywords...')
			const keywordResult = await analyzeWithGemini('keywordAnalysis', content)
			console.log('✅ Keyword analysis complete, response length:', keywordResult?.rawAnalysis?.length || 0)

			// Analyze for content optimization
			console.log('📈 Step 5: Analyzing content optimization...')
			const contentResult = await analyzeWithGemini('contentOptimization', content)
			console.log('✅ Content optimization complete, response length:', contentResult?.rawAnalysis?.length || 0)

			// Step 4: Process results
			setAnalysisProgress(prev => ({
				...prev,
				currentStep: 4,
				progress: 80,
				statusMessage: 'Xử lý kết quả phân tích...'
			}))

			// Step 5: Finalize
			setAnalysisProgress(prev => ({
				...prev,
				currentStep: 5,
				progress: 95,
				statusMessage: 'Chuẩn bị báo cáo cuối cùng...'
			}))

			// Parse and structure the results
			console.log('🔧 Step 6: Processing results...')

			// Ensure analysis results are valid strings
			const safeErrorAnalysis = typeof errorResult?.rawAnalysis === 'string' ? errorResult.rawAnalysis : ''
			const safeKeywordAnalysis = typeof keywordResult?.rawAnalysis === 'string' ? keywordResult.rawAnalysis : ''
			const safeContentOptimization = typeof contentResult?.rawAnalysis === 'string' ? contentResult.rawAnalysis : ''

			// Extract data from JSON if available, otherwise use fallback parsing
			let keywords = { primary: [] as string[], secondary: [] as string[] }
			let errors: string[] = []
			let suggestions: string[] = []

			if (keywordResult?.jsonData) {
				// Use JSON data for keywords
				keywords = {
					primary: keywordResult.jsonData.primaryKeywords || [],
					secondary: keywordResult.jsonData.secondaryKeywords || []
				}
			} else {
				// Fallback to text parsing
				keywords = extractKeywords(safeKeywordAnalysis)
			}

			if (errorResult?.jsonData) {
				// Use JSON data for errors
				errors = errorResult.jsonData.errors?.map((error: SEOError) => error.description) || []
			} else {
				// Fallback to text parsing
				errors = extractErrors(safeErrorAnalysis)
			}

			if (contentResult?.jsonData) {
				// Use JSON data for suggestions
				suggestions = contentResult.jsonData.suggestions?.map((suggestion: SEOSuggestion) => suggestion.description) || []
			} else {
				// Fallback to text parsing
				suggestions = extractSuggestions(safeContentOptimization)
			}

			const result: SEOAnalysisResult = {
				score: calculateSEOScore(content),
				keywords,
				errors,
				suggestions,
				titleSuggestions: generateTitleSuggestions(content),
				metaDescriptionSuggestions: generateMetaDescriptionSuggestions(content),
				readabilityScore: calculateReadabilityScore(content),
				rawAnalysis: {
					errorAnalysis: safeErrorAnalysis,
					keywordAnalysis: safeKeywordAnalysis,
					contentOptimization: safeContentOptimization
				},
				jsonData: {
					errorAnalysis: errorResult?.jsonData,
					keywordAnalysis: keywordResult?.jsonData,
					contentOptimization: contentResult?.jsonData
				}
			}

			console.log('📊 Analysis results:', {
				score: result.score,
				primaryKeywordsCount: result.keywords.primary.length,
				secondaryKeywordsCount: result.keywords.secondary.length,
				errorsCount: result.errors.length,
				suggestionsCount: result.suggestions.length,
				readabilityScore: result.readabilityScore
			})

			// Complete
			setAnalysisProgress(prev => ({
				...prev,
				progress: 100,
				statusMessage: 'Hoàn thành phân tích!'
			}))

			// Hide progress after a short delay
			setTimeout(() => {
				setAnalysisProgress(prev => ({
					...prev,
					isVisible: false
				}))
			}, 1500)

			setAnalysisResult(result)
			setActiveTab('analysis')
			console.log('💾 Analysis result saved:', {
				score: result.score,
				primaryKeywordsCount: result.keywords.primary.length,
				secondaryKeywordsCount: result.keywords.secondary.length,
				errorsCount: result.errors.length,
				suggestionsCount: result.suggestions.length
			})

			console.log('🎉 SEO analysis completed successfully!')
			toast({
				title: 'Phân tích hoàn thành',
				description: 'Đã phân tích SEO thành công',
				variant: 'default'
			})
		} catch (error) {
			console.error('❌ SEO analysis failed:', error)

			// Hide progress on error
			setAnalysisProgress(prev => ({
				...prev,
				isVisible: false
			}))

			toast({
				title: 'Lỗi phân tích',
				description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi phân tích',
				variant: 'destructive'
			})
		} finally {
			console.log('🏁 Analysis process finished')
			setIsAnalyzing(false)
		}
	}

	const calculateSEOScore = (content: string): number => {
		let score = 100

		// Length penalties
		if (content.length < 300) score -= 20
		if (content.length > 2000) score -= 10

		// Heading structure
		const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []
		if (headings.length === 0) score -= 15
		if (!content.includes('<h1')) score -= 10

		// Keyword usage
		const words = content.toLowerCase().split(/\s+/)
		const wordCount = words.length
		const uniqueWords = new Set(words).size
		if (uniqueWords / wordCount < 0.3) score -= 10

		// Links
		const links = content.match(/<a[^>]*>.*?<\/a>/gi) || []
		if (links.length === 0) score -= 5

		// Images
		const images = content.match(/<img[^>]*>/gi) || []
		if (images.length === 0 && content.length > 500) score -= 5

		return Math.max(0, Math.min(100, score))
	}

	const extractKeywords = (keywordAnalysis: string): { primary: string[], secondary: string[] } => {
		console.log('🔍 Extracting keywords from analysis...')
		const primaryKeywords: string[] = []
		const secondaryKeywords: string[] = []

		// Improved parsing for Gemini response
		const lines = keywordAnalysis.split('\n')
		console.log('📝 Raw keyword analysis lines:', lines.length)

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim()

			// Look for primary keyword sections with colon
			if (line.toLowerCase().includes('từ khóa chính:') ||
				line.toLowerCase().includes('primary keywords:')) {

				// Extract keywords after the colon
				const afterColon = line.split(':')[1]?.trim()
				if (afterColon) {
					const keywords = afterColon.split(/[,;]/)
						.map(k => k.trim().replace(/["']/g, ''))
						.filter(k => k.length > 2 && k.length < 50)
					primaryKeywords.push(...keywords)
				}

				// Also check next few lines for additional keywords
				for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
					const nextLine = lines[j].trim()
					if (!nextLine || nextLine.includes(':') || nextLine.length < 2) continue

					const keywordMatch = nextLine.match(/^[\s]*[•\-\*\d]+\.?\s*(.+)$/)
					if (keywordMatch) {
						const keyword = keywordMatch[1].trim().replace(/["']/g, '')
						if (keyword.length > 2 && keyword.length < 50) {
							primaryKeywords.push(keyword)
						}
					} else if (nextLine.length > 2 && nextLine.length < 50 && !nextLine.includes(':')) {
						const keyword = nextLine.replace(/["']/g, '').trim()
						if (keyword.length > 2) {
							primaryKeywords.push(keyword)
						}
					}
				}
			}

			// Look for secondary keyword sections with colon
			if (line.toLowerCase().includes('từ khóa phụ:') ||
				line.toLowerCase().includes('secondary keywords:')) {

				// Extract keywords after the colon
				const afterColon = line.split(':')[1]?.trim()
				if (afterColon) {
					const keywords = afterColon.split(/[,;]/)
						.map(k => k.trim().replace(/["']/g, ''))
						.filter(k => k.length > 2 && k.length < 50)
					secondaryKeywords.push(...keywords)
				}

				// Also check next few lines for additional keywords
				for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
					const nextLine = lines[j].trim()
					if (!nextLine || nextLine.includes(':') || nextLine.length < 2) continue

					const keywordMatch = nextLine.match(/^[\s]*[•\-\*\d]+\.?\s*(.+)$/)
					if (keywordMatch) {
						const keyword = keywordMatch[1].trim().replace(/["']/g, '')
						if (keyword.length > 2 && keyword.length < 50) {
							secondaryKeywords.push(keyword)
						}
					} else if (nextLine.length > 2 && nextLine.length < 50 && !nextLine.includes(':')) {
						const keyword = nextLine.replace(/["']/g, '').trim()
						if (keyword.length > 2) {
							secondaryKeywords.push(keyword)
						}
					}
				}
			}

			// Look for keywords in analysis text like "Từ khóa chính 'Roncodes Toolkit' và các từ khóa phụ liên quan"
			const analysisMatch = line.match(/từ khóa chính\s*["']([^"']+)["']/i)
			if (analysisMatch) {
				primaryKeywords.push(analysisMatch[1].trim())
			}

			// Look for secondary keywords in analysis text with better pattern matching
			const secondaryMatch = line.match(/từ khóa phụ[^:]*:?\s*([^.]*)/i)
			if (secondaryMatch && secondaryMatch[1]) {
				const keywords = secondaryMatch[1]
					.split(/[,;]/)
					.map(k => k.trim().replace(/["']/g, ''))
					.filter(k => k.length > 2 && k.length < 50)
				secondaryKeywords.push(...keywords)
			}

			// Look for keywords in parentheses or quotes (but exclude section titles)
			const quotedKeywords = line.match(/["']([^"']+)["']/g)
			if (quotedKeywords) {
				quotedKeywords.forEach(quoted => {
					const keyword = quoted.replace(/["']/g, '').trim()
					// Filter out section titles and common analysis terms
					const excludeTerms = [
						'từ khóa chính', 'từ khóa phụ', 'từ khóa dài', 'từ khóa ngữ nghĩa',
						'primary keywords', 'secondary keywords', 'long-tail keywords',
						'phân tích', 'analysis', 'đề xuất', 'suggestions'
					]
					
					if (keyword.length > 2 && keyword.length < 50 && 
						!excludeTerms.some(term => keyword.toLowerCase().includes(term.toLowerCase()))) {
						// Determine if it's primary or secondary based on context
						if (line.toLowerCase().includes('chính') || line.toLowerCase().includes('primary')) {
							primaryKeywords.push(keyword)
						} else if (line.toLowerCase().includes('phụ') || line.toLowerCase().includes('secondary')) {
							secondaryKeywords.push(keyword)
						}
					}
				})
			}
		}

		// Clean up keywords - remove any that contain section titles
		const cleanKeywords = (keywords: string[]) => {
			return keywords.filter(keyword => {
				const lowerKeyword = keyword.toLowerCase()
				const excludeTerms = [
					'từ khóa chính', 'từ khóa phụ', 'từ khóa dài', 'từ khóa ngữ nghĩa',
					'primary keywords', 'secondary keywords', 'long-tail keywords',
					'phân tích', 'analysis', 'đề xuất', 'suggestions', 'lsi'
				]
				return !excludeTerms.some(term => lowerKeyword.includes(term))
			})
		}

		// Remove duplicates and limit keywords
		const finalPrimary = [...new Set(cleanKeywords(primaryKeywords))].slice(0, 5)
		const finalSecondary = [...new Set(cleanKeywords(secondaryKeywords))].slice(0, 10)
		
		console.log('✅ Extracted primary keywords:', finalPrimary.length, finalPrimary)
		console.log('✅ Extracted secondary keywords:', finalSecondary.length, finalSecondary)
		
		return {
			primary: finalPrimary,
			secondary: finalSecondary
		}
	}

	const extractErrors = (errorAnalysis: string): string[] => {
		console.log('🔍 Extracting errors from analysis...')
		const errors: string[] = []
		const lines = errorAnalysis.split('\n')
		console.log('📝 Raw error analysis lines:', lines.length)

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim()

			// Look for specific error patterns
			const errorPatterns = [
				// Meta tags errors
				/meta title.*?(thiếu|cần|chưa|không có)/i,
				/meta description.*?(thiếu|cần|chưa|không có)/i,
				// Heading structure errors
				/cấu trúc heading.*?(thiếu|cần|chưa|không có|sai)/i,
				/heading.*?(thiếu|cần|chưa|không có|sai)/i,
				// Content errors
				/mật độ từ khóa.*?(thấp|cao|không phù hợp)/i,
				/nội dung.*?(thiếu|cần|chưa|không có|ngắn)/i,
				// Technical SEO errors
				/liên kết.*?(thiếu|cần|chưa|không có)/i,
				/hình ảnh.*?(thiếu|cần|chưa|không có|alt)/i,
				/url.*?(thiếu|cần|chưa|không có|sai)/i,
				// General error indicators
				/lỗi.*?:/i,
				/vấn đề.*?:/i,
				/thiếu.*?:/i,
				/cần cải thiện.*?:/i
			]

			let foundError = false
			for (const pattern of errorPatterns) {
				if (pattern.test(line)) {
					foundError = true
					break
				}
			}

			if (foundError) {
				// Extract the full error description
				let errorDescription = line

				// Look for additional context in the next few lines
				for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
					const nextLine = lines[j].trim()
					if (nextLine && !nextLine.includes(':') && nextLine.length > 5) {
						// Stop if we hit another error or section
						if (nextLine.toLowerCase().includes('lỗi') || 
							nextLine.toLowerCase().includes('vấn đề') ||
							nextLine.toLowerCase().includes('đề xuất')) {
							break
						}
						errorDescription += ' ' + nextLine
					}
				}

				// Clean up the error description
				errorDescription = errorDescription
					.replace(/^\d+\.\s*/, '') // Remove numbering
					.replace(/^[•\-\*]\s*/, '') // Remove bullet points
					.trim()

				if (errorDescription.length > 15) {
					errors.push(errorDescription)
				}
			}
		}

		// Remove duplicates and limit to 8 errors
		const finalErrors = [...new Set(errors)].slice(0, 8)
		console.log('✅ Extracted errors:', finalErrors.length, finalErrors)
		return finalErrors
	}

	const extractSuggestions = (contentOptimization: string): string[] => {
		console.log('🔍 Extracting suggestions from analysis...')
		const suggestions: string[] = []
		const lines = contentOptimization.split('\n')
		console.log('📝 Raw suggestions analysis lines:', lines.length)

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim()

			// Look for specific suggestion patterns
			const suggestionPatterns = [
				// Action-oriented suggestions
				/nên.*?(thêm|cải thiện|tối ưu|sử dụng)/i,
				/có thể.*?(thêm|cải thiện|tối ưu|sử dụng)/i,
				/đề xuất.*?(thêm|cải thiện|tối ưu|sử dụng)/i,
				/khuyến nghị.*?(thêm|cải thiện|tối ưu|sử dụng)/i,
				// Specific improvement areas
				/cải thiện.*?(cấu trúc|nội dung|heading|meta)/i,
				/tối ưu.*?(từ khóa|nội dung|hình ảnh|liên kết)/i,
				/thêm.*?(heading|meta|liên kết|hình ảnh)/i,
				/sử dụng.*?(heading|meta|từ khóa|schema)/i,
				// General improvement indicators
				/để.*?(cải thiện|tối ưu|tăng)/i,
				/giúp.*?(cải thiện|tối ưu|tăng)/i
			]

			let foundSuggestion = false
			for (const pattern of suggestionPatterns) {
				if (pattern.test(line)) {
					foundSuggestion = true
					break
				}
			}

			if (foundSuggestion) {
				// Extract the full suggestion
				let suggestion = line

				// Look for additional context in the next few lines
				for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
					const nextLine = lines[j].trim()
					if (nextLine && !nextLine.includes(':') && nextLine.length > 5) {
						// Stop if we hit another suggestion or section
						if (nextLine.toLowerCase().includes('nên') || 
							nextLine.toLowerCase().includes('có thể') ||
							nextLine.toLowerCase().includes('đề xuất') ||
							nextLine.toLowerCase().includes('kết luận')) {
							break
						}
						suggestion += ' ' + nextLine
					}
				}

				// Clean up the suggestion
				suggestion = suggestion
					.replace(/^\d+\.\s*/, '') // Remove numbering
					.replace(/^[•\-\*]\s*/, '') // Remove bullet points
					.trim()

				if (suggestion.length > 20) {
					suggestions.push(suggestion)
				}
			}
		}

		// Remove duplicates and limit to 10 suggestions
		const finalSuggestions = [...new Set(suggestions)].slice(0, 10)
		console.log('✅ Extracted suggestions:', finalSuggestions.length, finalSuggestions)
		return finalSuggestions
	}

	const generateTitleSuggestions = (content: string): string[] => {
		const words = content.split(/\s+/)
		const commonWords = ['và', 'hoặc', 'là', 'của', 'từ', 'với', 'theo', 'trong', 'về', 'để', 'có', 'không', 'này', 'đó']

		const keywords = words
			.filter(word => word.length > 3 && !commonWords.includes(word.toLowerCase()))
			.slice(0, 3)

		const suggestions = [
			`${keywords[0] || 'Chủ đề'} - Hướng dẫn chi tiết`,
			`Tìm hiểu về ${keywords.slice(0, 2).join(' và ') || 'chủ đề'}`,
			`${keywords[0] || 'Cách'} ${keywords[1] || 'làm'} hiệu quả nhất`
		]

		console.log('✅ Extracted suggestions (fallback):', suggestions.length, suggestions)
		return suggestions
	}

	const generateMetaDescriptionSuggestions = (content: string): string[] => {
		const firstSentence = content.split('.')[0] || ''
		const truncated = firstSentence.length > 120 ? firstSentence.substring(0, 120) + '...' : firstSentence

		return [
			truncated,
			`Khám phá chi tiết về ${content.substring(0, 50)}...`,
			`Hướng dẫn đầy đủ và chi tiết về chủ đề quan trọng này.`
		]
	}

	const calculateReadabilityScore = (content: string): number => {
		const sentences = content.split(/[.!?]+/).length
		const words = content.split(/\s+/).length
		const avgWordsPerSentence = words / sentences

		// Simple readability score (lower is better readability)
		let score = 100

		if (avgWordsPerSentence > 25) score -= 20
		if (avgWordsPerSentence > 35) score -= 30

		if (sentences < 3) score -= 15
		if (words < 150) score -= 10

		return Math.max(0, Math.min(100, score))
	}


	return (
		<div className="space-y-8">
			<div className="text-start space-y-2">
				<h1 className="text-3xl font-bold">Công cụ Phân tích SEO</h1>
				<p className="text-muted-foreground">
					Phân tích từ khóa, cấu trúc, lỗi SEO và tối ưu hóa nội dung với Gemini AI
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="content" className="flex items-center gap-2">
						<FileText className="w-4 h-4" />
						Nội dung
					</TabsTrigger>
					<TabsTrigger value="analysis" className="flex items-center gap-2" disabled={!analysisResult}>
						<TrendingUp className="w-4 h-4" />
						Phân tích
					</TabsTrigger>
					<TabsTrigger value="raw" className="flex items-center gap-2" disabled={!analysisResult}>
						<Search className="w-4 h-4" />
						Chi tiết
					</TabsTrigger>
				</TabsList>

				<TabsContent value="content" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="w-5 h-5" />
								Nhập nội dung cần phân tích
							</CardTitle>
							<CardDescription>
								Dán hoặc nhập nội dung HTML/text để phân tích SEO
								<div className="flex justify-end">
									<Button
										onClick={analyzeSEO}
										disabled={isAnalyzing || !content.trim()}
										size="lg"
										className="min-w-[200px]"
									>
										{isAnalyzing ? (
											<>
												<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												Đang phân tích...
											</>
										) : (
											<>
												<Search className="w-4 h-4 mr-2" />
												Phân tích SEO
											</>
										)}
									</Button>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<RichTextEditor
								content={content}
								onChange={setContent}
								placeholder="Nhập nội dung cần phân tích SEO..."
								minHeight="400px"
							/>



							<div className="flex justify-end">
								<Button
									onClick={analyzeSEO}
									disabled={isAnalyzing || !content.trim()}
									variant="default"
									size="lg"
									className="min-w-[200px]"
								>
									{isAnalyzing ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Đang phân tích...
										</>
									) : (
										<>
											<Search className="w-4 h-4 mr-2" />
											Phân tích SEO
										</>
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="analysis" className="space-y-4">
					{analysisResult && (
						<>
							{/* SEO Score Overview */}
							<SEOScoreCard
								score={analysisResult.score}
								readabilityScore={analysisResult.readabilityScore}
								keywords={analysisResult.keywords}
								title="Tổng quan điểm SEO"
								description="Đánh giá tổng thể về hiệu suất SEO, độ dễ đọc và từ khóa"
							/>

							{/* Keywords */}
							<KeywordsSection
								keywords={analysisResult.keywords}
								isCollapsed={analysisCollapsed.keywords}
								onToggle={() => toggleAnalysisSection('keywords')}
							/>

							{/* Enhanced Issues Display */}
							<EnhancedIssuesCard
								errors={analysisResult.errors}
								suggestions={analysisResult.suggestions}
								title="Vấn đề & Đề xuất SEO"
								description="Phân tích chi tiết các vấn đề SEO và gợi ý cải thiện từ Gemini AI"
							/>

							
						</>
					)}
				</TabsContent>

				<TabsContent value="raw" className="space-y-4">
					{analysisResult && (
						<>
							{/* JSON Error Analysis */}
							{analysisResult.jsonData?.errorAnalysis ? (
								<JSONAnalysisCard
									jsonData={analysisResult.jsonData.errorAnalysis}
									rawData={analysisResult.rawAnalysis.errorAnalysis}
									title="Phân tích lỗi SEO"
									description="Phân tích chi tiết các lỗi SEO và đề xuất cải thiện từ JSON response"
									icon={XCircle}
									colorScheme="red"
								/>
							) : analysisResult.parsedAnalysis?.errorAnalysis ? (
								<StructuredAnalysisCard
									parsedData={analysisResult.parsedAnalysis.errorAnalysis}
									rawData={analysisResult.rawAnalysis.errorAnalysis}
									title="Phân tích lỗi SEO"
									description="Phân tích chi tiết các lỗi SEO và đề xuất cải thiện"
									icon={XCircle}
								/>
							) : (
								<CollapsibleCard
									title="Phân tích lỗi SEO - Gemini Raw Response"
									description="Response thô từ Gemini AI - Phân tích chi tiết các lỗi SEO và đề xuất cải thiện"
									icon={XCircle}
									isCollapsed={collapsedSections.errorAnalysis}
									onToggle={() => toggleSection('errorAnalysis')}
									colorScheme="red"
								>
									<div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-lg border border-red-200 dark:border-red-700">
										<div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
											<div className="w-3 h-3 bg-red-500 rounded-full"></div>
											<span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
												Gemini AI Analysis Result
											</span>
										</div>
										<div className="prose prose-lg text-gray-900 dark:text-gray-100 font-sans"
											dangerouslySetInnerHTML={{ __html: analysisResult.rawAnalysis.errorAnalysis }}
										/>
									</div>
								</CollapsibleCard>
							)}

							{/* JSON Keyword Analysis */}
							{analysisResult.jsonData?.keywordAnalysis ? (
								<JSONAnalysisCard
									jsonData={analysisResult.jsonData.keywordAnalysis}
									rawData={analysisResult.rawAnalysis.keywordAnalysis}
									title="Phân tích từ khóa"
									description="Phân tích từ khóa theo cấp độ và chiến lược SEO từ JSON response"
									icon={Search}
									colorScheme="blue"
								/>
							) : analysisResult.parsedAnalysis?.keywordAnalysis ? (
								<StructuredAnalysisCard
									parsedData={analysisResult.parsedAnalysis.keywordAnalysis}
									rawData={analysisResult.rawAnalysis.keywordAnalysis}
									title="Phân tích từ khóa"
									description="Phân tích từ khóa theo cấp độ và chiến lược SEO"
									icon={Search}
									colorScheme="blue"
								/>
							) : (
								<CollapsibleCard
									title="Phân tích từ khóa - Gemini Raw Response"
									description="Response thô từ Gemini AI - Phân tích từ khóa theo cấp độ và chiến lược SEO"
									icon={Search}
									isCollapsed={collapsedSections.keywordAnalysis}
									onToggle={() => toggleSection('keywordAnalysis')}
									colorScheme="blue"
								>
									<div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
										<div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
											<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
											<span className="text-sm font-medium text-slate-700 dark:text-slate-300">
												Gemini AI Keyword Analysis
											</span>
										</div>
										<div className="prose text-gray-900 dark:text-gray-100 font-sans"
											dangerouslySetInnerHTML={{ __html: analysisResult.rawAnalysis.keywordAnalysis }}
										/>
									</div>
								</CollapsibleCard>
							)}

							{/* JSON Content Optimization */}
							{analysisResult.jsonData?.contentOptimization ? (
								<JSONAnalysisCard
									jsonData={analysisResult.jsonData.contentOptimization}
									rawData={analysisResult.rawAnalysis.contentOptimization}
									title="Tối ưu hóa nội dung"
									description="Chiến lược tối ưu hóa nội dung và cải thiện SEO từ JSON response"
									icon={CheckCircle}
									colorScheme="green"
								/>
							) : analysisResult.parsedAnalysis?.contentOptimization ? (
								<StructuredAnalysisCard
									parsedData={analysisResult.parsedAnalysis.contentOptimization}
									rawData={analysisResult.rawAnalysis.contentOptimization}
									title="Tối ưu hóa nội dung"
									description="Chiến lược tối ưu hóa nội dung và cải thiện SEO"
									icon={CheckCircle}
									colorScheme="green"
								/>
							) : (
								<CollapsibleCard
									title="Tối ưu hóa nội dung - Gemini Raw Response"
									description="Response thô từ Gemini AI - Chiến lược tối ưu hóa nội dung và cải thiện SEO"
									icon={CheckCircle}
									isCollapsed={collapsedSections.contentOptimization}
									onToggle={() => toggleSection('contentOptimization')}
									colorScheme="green"
								>
									<div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
										<div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
											<div className="w-3 h-3 bg-green-500 rounded-full"></div>
											<span className="text-sm font-medium text-slate-700 dark:text-slate-300">
												Gemini AI Content Optimization
											</span>
										</div>
										<div className="prose text-gray-900 dark:text-gray-100 font-sans"
											dangerouslySetInnerHTML={{ __html: analysisResult.rawAnalysis.contentOptimization }}
											style={{ lineHeight: '2rem' }}
										/>
									</div>
								</CollapsibleCard>
							)}
						</>
					)}
				</TabsContent>
			</Tabs>

			{/* Analysis Progress Modal */}
			<AnalysisProgress
				isVisible={analysisProgress.isVisible}
				currentStep={analysisProgress.currentStep}
				progress={analysisProgress.progress}
				estimatedTime={analysisProgress.estimatedTime}
				statusMessage={analysisProgress.statusMessage}
			/>

			{/* Debug Panel - Only in development */}
		
		</div>
	)
}

