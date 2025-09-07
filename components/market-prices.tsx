"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react"

interface MarketPrice {
  crop: string
  price: number
  unit: string
  change: string
  trend: "up" | "down"
}

export function MarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const response = await fetch("/api/market-prices")
      const data = await response.json()
      setPrices(data)
    } catch (error) {
      console.error("Failed to fetch prices:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Market Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prices.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div>
                <h4 className="font-medium">{item.crop}</h4>
                <p className="text-sm text-gray-600">
                  ₹{item.price} {item.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.trend === "up" ? "default" : "destructive"} className="flex items-center gap-1">
                  {item.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Market Insight:</strong> Rice and wheat prices are trending upward. Good time to sell stored grain.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
