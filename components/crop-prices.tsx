"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown, IndianRupee } from "lucide-react"

interface CropPrice {
  crop: string
  location: string
  price: number
  unit: string
  change: string
  trend: "up" | "down"
  source: string
}

export function CropPrices() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResult, setSearchResult] = useState<CropPrice | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const dummyPrices: CropPrice[] = [
    {
      crop: "Rice",
      location: "Delhi",
      price: 2100,
      unit: "per quintal",
      change: "+5%",
      trend: "up",
      source: "AGMARKNET",
    },
    {
      crop: "Wheat",
      location: "Punjab",
      price: 2050,
      unit: "per quintal",
      change: "+2%",
      trend: "up",
      source: "AGMARKNET",
    },
    {
      crop: "Cotton",
      location: "Gujarat",
      price: 5800,
      unit: "per quintal",
      change: "-3%",
      trend: "down",
      source: "AGMARKNET",
    },
    {
      crop: "Basmati",
      location: "Dehradun",
      price: 4200,
      unit: "per quintal",
      change: "+7%",
      trend: "up",
      source: "AGMARKNET",
    },
    {
      crop: "Sugarcane",
      location: "UP",
      price: 350,
      unit: "per quintal",
      change: "+1%",
      trend: "up",
      source: "AGMARKNET",
    },
    {
      crop: "Tomato",
      location: "Karnataka",
      price: 1800,
      unit: "per quintal",
      change: "-8%",
      trend: "down",
      source: "Local Mandi",
    },
  ]

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Find matching crop or create dummy result
    const found = dummyPrices.find((price) => price.crop.toLowerCase().includes(searchTerm.toLowerCase()))

    if (found) {
      setSearchResult(found)
    } else {
      // Generate dummy result for searched crop
      setSearchResult({
        crop: searchTerm,
        location: "Delhi",
        price: Math.floor(Math.random() * 3000) + 1000,
        unit: "per quintal",
        change: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 10) + 1}%`,
        trend: Math.random() > 0.5 ? "up" : "down",
        source: "AGMARKNET",
      })
    }

    setIsSearching(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-green-600" />
          Crop Price Finder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter crop name (e.g., Rice, Wheat, Cotton)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {searchResult && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold capitalize">{searchResult.crop}</h3>
              <Badge
                className={`flex items-center gap-1 ${
                  searchResult.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {searchResult.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {searchResult.change}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-sm text-gray-600">Price</div>
                <div className="text-2xl font-bold text-green-600">₹{searchResult.price}</div>
                <div className="text-sm text-gray-500">{searchResult.unit}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="font-semibold">{searchResult.location}</div>
                <div className="text-sm text-gray-500">Source: {searchResult.source}</div>
              </div>
            </div>

            <div className="text-xs text-gray-500 border-t pt-2">
              Last updated: {new Date().toLocaleDateString()} • Prices may vary by quality and market conditions
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-3">Popular Crop Prices</h4>
          <div className="space-y-2">
            {dummyPrices.slice(0, 4).map((price, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{price.crop}</div>
                  <div className="text-sm text-gray-600">{price.location}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{price.price}</div>
                  <Badge variant={price.trend === "up" ? "default" : "destructive"} className="text-xs">
                    {price.change}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
