"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, MessageCircle, Camera, Cloud, TrendingUp, Sparkles } from "lucide-react"

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = () => {
    setIsLoading(true)
    setTimeout(() => {
      onStart()
    }, 2500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-400/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-emerald-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-teal-400/20 rounded-full animate-ping"></div>
        </div>

        <div className="text-center z-10">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-300/30 border-t-green-400 mx-auto"></div>
            <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-green-400 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Initializing AgriGPT...</h3>
          <div className="flex items-center justify-center gap-2 text-green-300">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <p>Loading AI farming assistant</p>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-green-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-20 h-20 bg-teal-400/10 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-6xl w-full text-center z-10">
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <Leaf className="h-20 w-20 text-green-400 mr-4 animate-pulse" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
            </div>
            <div>
              <h1 className="text-6xl font-bold text-white mb-2">AgriGPT</h1>
              <div className="h-1 w-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-green-300 mb-6">Smart Farming Assistant</h2>
          <p className="text-xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered chatbot for crop health diagnosis, weather insights, market prices, and expert agricultural
            advice. Get instant solutions for all your farming needs with advanced image recognition and real-time data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-green-400/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-3 text-lg">AI Chat Assistant</h3>
              <p className="text-sm text-green-200">Ask anything about farming, get expert advice instantly</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-green-400/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <Camera className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-3 text-lg">Plant Disease Detection</h3>
              <p className="text-sm text-green-200">Upload or capture plant images for AI diagnosis</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-green-400/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <Cloud className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-3 text-lg">Weather Intelligence</h3>
              <p className="text-sm text-green-200">Real-time weather data with farming recommendations</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-green-400/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-3 text-lg">Market Prices</h3>
              <p className="text-sm text-green-200">Latest crop prices and market trends</p>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={handleStart}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <Sparkles className="mr-3 h-6 w-6" />
          Launch AgriGPT
          <Sparkles className="ml-3 h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
