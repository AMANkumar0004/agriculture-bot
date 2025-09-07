"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  forecast: Array<{
    day: string
    temp: number
    condition: string
    rain: number
  }>
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      const response = await fetch("/api/weather?location=Delhi")
      const data = await response.json()
      setWeather(data)
    } catch (error) {
      console.error("Failed to fetch weather:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "rainy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Weather Conditions - {weather.location}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm">{weather.temperature}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{weather.rainfall}mm</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{weather.windSpeed} km/h</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">3-Day Forecast</h4>
          <div className="space-y-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(day.condition)}
                  <span className="text-sm font-medium">{day.day}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{day.temp}°C</span>
                  <Badge variant="outline" className="text-xs">
                    {day.rain}% rain
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Farming Tip:</strong> Current conditions are good for irrigation. Consider watering crops in the
            evening to reduce evaporation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
