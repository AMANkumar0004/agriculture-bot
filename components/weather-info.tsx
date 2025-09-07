"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Wind, Eye, Search, MapPin } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  description: string
  windSpeed: number
  pressure: number
}

export function WeatherInfo() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState("")

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async (city?: string) => {
    setLoading(true)
    try {
      const url = city ? `/api/weather?city=${city}` : "/api/weather"
      const response = await fetch(url)
      const data = await response.json()
      setWeather(data)
    } catch (error) {
      console.error("Failed to fetch weather:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim())
      setSearchCity("")
    }
  }

  const getWeatherIcon = (description: string) => {
    if (description.includes("rain")) return "🌧️"
    if (description.includes("cloud")) return "☁️"
    if (description.includes("clear") || description.includes("sun")) return "☀️"
    return "🌤️"
  }

  const getFarmingAdvice = (weather: WeatherData) => {
    if (weather.humidity > 80) {
      return "High humidity - Monitor for fungal diseases. Avoid irrigation today."
    }
    if (weather.temperature > 35) {
      return "High temperature - Provide shade for sensitive crops. Water early morning."
    }
    if (weather.description.includes("rain")) {
      return "Rain expected - Good for rain-fed crops. Postpone pesticide application."
    }
    return "Good weather conditions for most farming activities."
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-blue-500" />
          Weather Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} size="icon" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {weather && (
          <>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <h3 className="text-lg font-semibold">{weather.location}</h3>
              </div>
              <div className="text-4xl mb-2">{getWeatherIcon(weather.description)}</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{weather.temperature}°C</div>
              <div className="text-sm text-gray-600 capitalize">{weather.description}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="font-semibold">{weather.humidity}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Wind className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm text-gray-600">Wind Speed</div>
                  <div className="font-semibold">{weather.windSpeed} km/h</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-600">Pressure</div>
                  <div className="font-semibold">{weather.pressure} hPa</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <Thermometer className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm text-gray-600">Feels Like</div>
                  <div className="font-semibold">{weather.temperature + 2}°C</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-1">Farming Advice</h4>
              <p className="text-sm text-green-700">{getFarmingAdvice(weather)}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
