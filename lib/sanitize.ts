// Comprehensive sanitization utilities
export class Sanitizer {
  // Remove HTML tags and dangerous content
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== "string") return ""

    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Remove iframe tags
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "") // Remove object tags
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "") // Remove embed tags
      .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, "") // Remove link tags
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove style tags
      .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, "") // Remove meta tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/vbscript:/gi, "") // Remove vbscript: protocol
      .replace(/data:/gi, "") // Remove data: protocol (except for images)
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .trim()
  }

  // Sanitize user input for chat and forms
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== "string") return ""

    return input
      .replace(/[<>'"&]/g, (match) => {
        const entities: { [key: string]: string } = {
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "&": "&amp;",
        }
        return entities[match] || match
      })
      .replace(/<[^>]*>/g, "") // Remove any HTML tags
      .substring(0, 2000) // Limit length
      .trim()
  }

  // Enhanced AI response sanitization with proper formatting
  static sanitizeAiResponse(response: string): string {
    if (!response || typeof response !== "string") return ""

    // First, remove development platform references
    let cleanedResponse = response
      .replace(/\b(built with v0|created with v0|made with v0|v0\.dev|vercel v0)\b/gi, "")
      .replace(/\b(this is a demo|prototype|sample application)\b/gi, "")
      .replace(/\b(development platform|ai assistant platform)\b/gi, "")
      .replace(/\*\*disclaimer\*\*.*?(?=\n\n|\n$|$)/gi, "")
      .replace(/\[.*?built.*?v0.*?\]/gi, "")
      .replace(/$$.*?v0\.dev.*?$$/gi, "")
      .replace(/powered by.*?v0/gi, "")
      .replace(/created using.*?v0/gi, "")

    // Remove dangerous HTML but preserve structure
    cleanedResponse = this.sanitizeHtml(cleanedResponse)

    // Convert markdown-style formatting to proper HTML tags
    cleanedResponse = cleanedResponse
      // Handle bold text - convert **text** to <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Handle italic text - convert *text* to <em>text</em>
      .replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>")
      // Handle numbered lists - convert 1. text to proper list items
      .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
      // Handle bullet points - convert - text or • text to proper list items
      .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
      // Handle headers - convert # text to proper headers
      .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
      .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
      .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")

    // Wrap consecutive list items in proper ul tags
    cleanedResponse = cleanedResponse.replace(/(<li>.*<\/li>)(\s*<li>.*<\/li>)*/g, (match) => {
      return `<ul>${match}</ul>`
    })

    // Convert line breaks to proper HTML breaks
    cleanedResponse = cleanedResponse
      .replace(/\n\s*\n/g, "</p><p>") // Double line breaks become paragraph breaks
      .replace(/\n/g, "<br>") // Single line breaks become <br>

    // Wrap content in paragraphs if not already structured
    if (!cleanedResponse.includes("<p>") && !cleanedResponse.includes("<ul>") && !cleanedResponse.includes("<h")) {
      cleanedResponse = `<p>${cleanedResponse}</p>`
    }

    // Clean up formatting issues
    cleanedResponse = cleanedResponse
      .replace(/<br>\s*<\/p>/g, "</p>") // Remove br before closing p
      .replace(/<p>\s*<br>/g, "<p>") // Remove br after opening p
      .replace(/<\/p>\s*<p>/g, "</p><p>") // Clean paragraph transitions
      .replace(/<br>\s*<br>/g, "<br>") // Remove double breaks
      .replace(/<p>\s*<\/p>/g, "") // Remove empty paragraphs
      .replace(/<ul>\s*<\/ul>/g, "") // Remove empty lists
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/>\s+</g, "><") // Remove whitespace between tags

    // Final cleanup and validation
    cleanedResponse = cleanedResponse.trim().substring(0, 5000) // Limit response length

    // Ensure we have meaningful content
    if (!cleanedResponse || cleanedResponse.replace(/<[^>]*>/g, "").trim().length < 10) {
      return "<p>I'm here to help with your agricultural questions. Please ask about farming, crops, or agricultural techniques.</p>"
    }

    return cleanedResponse
  }

  // Sanitize file names and paths
  static sanitizeFileName(fileName: string): string {
    if (!fileName || typeof fileName !== "string") return ""

    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace special chars with underscore
      .replace(/\.{2,}/g, ".") // Remove multiple dots
      .replace(/^\.+|\.+$/g, "") // Remove leading/trailing dots
      .substring(0, 255) // Limit length
  }

  // Sanitize URLs
  static sanitizeUrl(url: string): string {
    if (!url || typeof url !== "string") return ""

    // Only allow http and https protocols
    if (!url.match(/^https?:\/\//i)) {
      return ""
    }

    return url
      .replace(/[<>"']/g, "") // Remove dangerous characters
      .substring(0, 2048) // Limit URL length
  }

  // Sanitize location data
  static sanitizeLocation(location: string): string {
    if (!location || typeof location !== "string") return ""

    return location
      .replace(/[^a-zA-Z0-9\s,.-]/g, "") // Only allow alphanumeric, spaces, commas, dots, hyphens
      .trim()
      .substring(0, 100)
  }

  // Sanitize coordinates
  static sanitizeCoordinates(lat: number, lon: number): { lat: number; lon: number } | null {
    const latitude = Number.parseFloat(lat.toString())
    const longitude = Number.parseFloat(lon.toString())

    // Validate coordinate ranges
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return null
    }

    return {
      lat: Math.round(latitude * 1000000) / 1000000, // 6 decimal places
      lon: Math.round(longitude * 1000000) / 1000000,
    }
  }

  // Sanitize search queries
  static sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== "string") return ""

    return query
      .replace(/[^\w\s-]/g, "") // Only allow word characters, spaces, hyphens
      .replace(/\s+/g, " ") // Normalize spaces
      .trim()
      .substring(0, 100)
  }

  // Validate and sanitize image data
  static sanitizeImageData(imageData: string): string | null {
    if (!imageData || typeof imageData !== "string") return null

    // Check if it's a valid base64 image
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i
    if (!base64Pattern.test(imageData)) {
      return null
    }

    // Limit image size (base64 string length roughly corresponds to file size)
    if (imageData.length > 10 * 1024 * 1024) {
      // ~10MB limit
      return null
    }

    return imageData
  }

  // Sanitize language code
  static sanitizeLanguageCode(langCode: string): string {
    if (!langCode || typeof langCode !== "string") return "en"

    const validLanguages = ["en", "hi", "mr", "gu", "pa", "ta", "te", "kn", "bn"]
    const sanitized = langCode
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .substring(0, 2)

    return validLanguages.includes(sanitized) ? sanitized : "en"
  }

  // Sanitize JSON data
  static sanitizeJsonData(data: any): any {
    if (typeof data === "string") {
      return this.sanitizeInput(data)
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeJsonData(item))
    }

    if (data && typeof data === "object") {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        const sanitizedKey = this.sanitizeInput(key)
        sanitized[sanitizedKey] = this.sanitizeJsonData(value)
      }
      return sanitized
    }

    return data
  }

  // Rate limiting helper
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, number[]>()

    return (identifier: string): boolean => {
      const now = Date.now()
      const userRequests = requests.get(identifier) || []

      // Remove old requests outside the window
      const validRequests = userRequests.filter((time) => now - time < windowMs)

      if (validRequests.length >= maxRequests) {
        return false // Rate limit exceeded
      }

      validRequests.push(now)
      requests.set(identifier, validRequests)
      return true // Request allowed
    }
  }
}

// Content Security Policy helpers
export const CSP_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.openweathermap.org https://api.data.gov.in https://generativelanguage.googleapis.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
}

// Security headers
export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
  ...CSP_HEADERS,
}
