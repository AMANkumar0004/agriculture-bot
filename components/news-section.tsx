"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, TrendingUp } from "lucide-react"

const sampleNews = [
  {
    id: 1,
    title: "Government Announces New Crop Insurance Scheme with Enhanced Coverage",
    description:
      "The Ministry of Agriculture launches an improved crop insurance program offering 90% coverage for farmers, including protection against extreme weather events and pest attacks.",
    date: "2024-01-20",
    source: "Ministry of Agriculture",
    category: "Policy",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "AI-Powered Pest Detection System Shows 95% Accuracy in Field Trials",
    description:
      "Revolutionary smartphone-based pest identification technology successfully tested across 500 farms in Punjab, Maharashtra, and Karnataka, promising early detection and treatment.",
    date: "2024-01-19",
    source: "Agricultural Research Institute",
    category: "Technology",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Organic Farming Subsidies Increased by 40% for Small Farmers",
    description:
      "Government increases financial support for organic farming transition, offering up to ₹50,000 per hectare for certification and organic input costs.",
    date: "2024-01-18",
    source: "Rural Development Ministry",
    category: "Subsidies",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Record Wheat Harvest Expected This Season Despite Weather Challenges",
    description:
      "Agricultural experts predict a bumper wheat crop of 112 million tonnes, driven by improved seed varieties and better irrigation management.",
    date: "2024-01-17",
    source: "ICAR",
    category: "Production",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Digital Mandi Platform Connects 10,000 Farmers Directly to Buyers",
    description:
      "New online marketplace eliminates middlemen, allowing farmers to get better prices for their produce while ensuring quality for consumers.",
    date: "2024-01-16",
    source: "Digital India Initiative",
    category: "Market",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Drought-Resistant Rice Variety Developed for Climate Resilience",
    description:
      "Scientists develop new rice variety that requires 30% less water and maintains yield even in drought conditions, suitable for rain-fed areas.",
    date: "2024-01-15",
    source: "IRRI India",
    category: "Research",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function NewsSection() {
  const getCategoryColor = (category: string) => {
    const colors = {
      Policy: "bg-blue-100 text-blue-800",
      Technology: "bg-purple-100 text-purple-800",
      Subsidies: "bg-green-100 text-green-800",
      Production: "bg-yellow-100 text-yellow-800",
      Market: "bg-orange-100 text-orange-800",
      Research: "bg-pink-100 text-pink-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <section id="news" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-800 mb-4">Agricultural News & Updates</h2>
          <p className="text-xl text-purple-600">Stay informed with the latest farming news and government updates</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Featured News */}
          <Card className="mb-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={sampleNews[0].image || "/placeholder.svg"}
                  alt="Featured news"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getCategoryColor(sampleNews[0].category)}>{sampleNews[0].category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(sampleNews[0].date)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{sampleNews[0].title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{sampleNews[0].description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Source: {sampleNews[0].source}</span>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    Read More <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleNews.slice(1).map((news) => (
              <Card
                key={news.id}
                className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="relative">
                  <img src={news.image || "/placeholder.svg"} alt={news.title} className="w-full h-48 object-cover" />
                  <Badge className={`absolute top-3 left-3 ${getCategoryColor(news.category)}`}>{news.category}</Badge>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    {formatDate(news.date)}
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">{news.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{news.source}</span>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trending Topics */}
          <Card className="mt-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-orange-600" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {[
                  "Crop Insurance",
                  "AI in Agriculture",
                  "Organic Farming",
                  "Climate Change",
                  "Digital Mandi",
                  "Pest Management",
                  "Water Conservation",
                  "Government Schemes",
                ].map((topic, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-4 py-2 hover:bg-orange-50 hover:border-orange-300 cursor-pointer transition-colors"
                  >
                    #{topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
