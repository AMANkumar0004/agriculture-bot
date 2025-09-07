import { Sanitizer, SECURITY_HEADERS } from "@/lib/sanitize"

// Rate limiter for weather requests
const weatherRateLimiter = Sanitizer.createRateLimiter(30, 60000) // 30 requests per minute

export async function GET(request: Request) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Apply rate limiting
    if (!weatherRateLimiter(clientIP)) {
      return Response.json(
        { error: "Too many weather requests. Please wait before making another request." },
        { status: 429, headers: SECURITY_HEADERS },
      )
    }

    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const city = searchParams.get("city")

    // Sanitize and validate inputs
    let sanitizedCoords = null
    if (lat && lon) {
      sanitizedCoords = Sanitizer.sanitizeCoordinates(Number.parseFloat(lat), Number.parseFloat(lon))
      if (!sanitizedCoords) {
        return Response.json({ error: "Invalid coordinates provided." }, { status: 400, headers: SECURITY_HEADERS })
      }
    }

    const sanitizedCity = city ? Sanitizer.sanitizeLocation(city) : null
    if (city && !sanitizedCity) {
      return Response.json({ error: "Invalid city name provided." }, { status: 400, headers: SECURITY_HEADERS })
    }

    const apiKey = process.env.OPENWEATHER_API_KEY || "8e18fc375c2683d21b3233f785b6e6fc"
    let url = ""

    if (sanitizedCoords) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${sanitizedCoords.lat}&lon=${sanitizedCoords.lon}&appid=${apiKey}&units=metric`
    } else if (sanitizedCity) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(sanitizedCity)}&appid=${apiKey}&units=metric`
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${apiKey}&units=metric`
    }

    console.log("Fetching weather from:", url.replace(apiKey, "[API_KEY]"))
    const response = await fetch(url)

    if (!response.ok) {
      console.error("Weather API error:", response.status, response.statusText)
      throw new Error(`Weather API failed with status ${response.status}`)
    }

    const data = await response.json()

    // Sanitize API response data
    const sanitizedData = Sanitizer.sanitizeJsonData(data)

    // Also get 5-day forecast
    let forecastData = null
    try {
      const forecastUrl = sanitizedCoords
        ? `https://api.openweathermap.org/data/2.5/forecast?lat=${sanitizedCoords.lat}&lon=${sanitizedCoords.lon}&appid=${apiKey}&units=metric`
        : `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(sanitizedCity || sanitizedData.name)}&appid=${apiKey}&units=metric`

      const forecastResponse = await fetch(forecastUrl)
      if (forecastResponse.ok) {
        const rawForecastData = await forecastResponse.json()
        forecastData = Sanitizer.sanitizeJsonData(rawForecastData)
      }
    } catch (forecastError) {
      console.error("Forecast API error:", forecastError)
    }

    const weatherResponse = {
      location: Sanitizer.sanitizeLocation(sanitizedData.name || "Unknown"),
      country: Sanitizer.sanitizeInput(sanitizedData.sys?.country || ""),
      temperature: Math.round(Math.max(-50, Math.min(60, sanitizedData.main?.temp || 0))), // Reasonable temperature range
      humidity: Math.max(0, Math.min(100, sanitizedData.main?.humidity || 0)), // 0-100% range
      description: Sanitizer.sanitizeInput(sanitizedData.weather?.[0]?.description || "unknown"),
      icon: Sanitizer.sanitizeInput(sanitizedData.weather?.[0]?.icon || "01d").substring(0, 10),
      windSpeed: Math.max(0, Math.min(200, Math.round((sanitizedData.wind?.speed || 0) * 3.6))), // Convert m/s to km/h, max 200 km/h
      pressure: Math.max(800, Math.min(1200, sanitizedData.main?.pressure || 1013)), // Reasonable pressure range
      feelsLike: Math.round(Math.max(-50, Math.min(60, sanitizedData.main?.feels_like || 0))),
      visibility: Math.max(0, Math.min(50, Math.round((sanitizedData.visibility || 10000) / 1000))), // Convert m to km, max 50km
      forecast: forecastData?.list
        ? forecastData.list.slice(0, 5).map((item: any) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            temp: Math.round(Math.max(-50, Math.min(60, item.main?.temp || 0))),
            description: Sanitizer.sanitizeInput(item.weather?.[0]?.description || "unknown"),
            icon: Sanitizer.sanitizeInput(item.weather?.[0]?.icon || "01d").substring(0, 10),
          }))
        : [],
    }

    console.log("Processed weather response:", weatherResponse)
    return Response.json(weatherResponse, { headers: SECURITY_HEADERS })
  } catch (error) {
    console.error("Weather API error:", error)

    // Return sanitized fallback data
    const fallbackWeather = {
      location: "Delhi",
      country: "IN",
      temperature: 28,
      humidity: 65,
      description: "partly cloudy",
      icon: "02d",
      windSpeed: 12,
      pressure: 1013,
      feelsLike: 30,
      visibility: 10,
      forecast: [
        { time: "12:00 PM", temp: 30, description: "sunny", icon: "01d" },
        { time: "3:00 PM", temp: 32, description: "partly cloudy", icon: "02d" },
        { time: "6:00 PM", temp: 29, description: "cloudy", icon: "03d" },
        { time: "9:00 PM", temp: 26, description: "clear", icon: "01n" },
        { time: "12:00 AM", temp: 24, description: "clear", icon: "01n" },
      ],
    }

    return Response.json(fallbackWeather, {
      status: 500,
      headers: SECURITY_HEADERS,
    })
  }
}
