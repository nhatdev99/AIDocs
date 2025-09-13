// Debug utilities for SEO analysis
export const debugSEO = {
	log: (message: string, data?: unknown) => {
		if (process.env.NODE_ENV === 'development') {
			console.log(`🐛 [SEO Debug] ${message}`, data || '')
		}
	},

	error: (message: string, error?: unknown) => {
		if (process.env.NODE_ENV === 'development') {
			console.error(`❌ [SEO Error] ${message}`, error || '')
		}
	},

	warn: (message: string, data?: unknown) => {
		if (process.env.NODE_ENV === 'development') {
			console.warn(`⚠️ [SEO Warning] ${message}`, data || '')
		}
	},

	info: (message: string, data?: unknown) => {
		if (process.env.NODE_ENV === 'development') {
			console.info(`ℹ️ [SEO Info] ${message}`, data || '')
		}
	},

	performance: (label: string, startTime?: number) => {
		if (process.env.NODE_ENV === 'development') {
			if (startTime) {
				const duration = Date.now() - startTime
				console.log(`⏱️ [SEO Performance] ${label}: ${duration}ms`)
				return duration
			} else {
				console.time(`⏱️ [SEO Performance] ${label}`)
				return Date.now()
			}
		}
		return 0
	}
}

// Performance monitoring
export const monitorPerformance = (label: string) => {
	return <T>(fn: () => T): T => {
		const startTime = Date.now()
		try {
			const result = fn()
			debugSEO.performance(label, startTime)
			return result
		} catch (error) {
			debugSEO.error(`${label} failed`, error)
			throw error
		}
	}
}

// API call monitoring
export const monitorAPI = async (url: string, options?: RequestInit) => {
	const startTime = Date.now()
	debugSEO.log(`API Call: ${url}`)

	try {
		const response = await fetch(url, options)
		const duration = Date.now() - startTime

		debugSEO.log(`API Response: ${url}`, {
			status: response.status,
			duration: `${duration}ms`,
			ok: response.ok
		})

		return response
	} catch (error) {
		debugSEO.error(`API Error: ${url}`, error)
		throw error
	}
}
