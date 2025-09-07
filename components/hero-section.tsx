"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, MessageCircle, Camera, Cloud, TrendingUp, Sparkles, ArrowRight } from "lucide-react"

interface HeroSectionProps {
  onGetStarted: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Assistant",
      description: "Get instant answers to all your farming questions",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Camera,
      title: "Plant Disease Detection",
      description: "Identify crop diseases with AI-powered image analysis",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Cloud,
      title: "Weather Intelligence",
      description: "Real-time weather data with farming recommendations",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Market Prices",
      description: "Live commodity prices from government sources",
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <Leaf className="h-20 w-20 text-green-600 animate-pulse" />
              <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-500 animate-bounce" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AgriGPT
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-green-800 mb-6">Smart Farming Assistant</h2>

          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionize your farming with AI-powered crop health diagnosis, real-time weather insights, government
            commodity prices, and expert agricultural advice - all in your local language.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Get Started Free
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-full bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">Farmers Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">9+</div>
              <div className="text-gray-600">Languages</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
