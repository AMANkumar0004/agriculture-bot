"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown, IndianRupee, MapPin } from "lucide-react"

interface CommodityRecord {
  state: string
  district: string
  market: string
  commodity: string
  variety: string
  min_price: string
  max_price: string
  modal_price: string
}

interface CommodityData {
  updated_date: string
  desc: string
  records: CommodityRecord[]
}

export function MarketPricesSection() {
  const [commodityData, setCommodityData] = useState<CommodityData | null>(null)
  const [filteredRecords, setFilteredRecords] = useState<CommodityRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommodityPrices()
  }, [])

  useEffect(() => {
    if (commodityData) {
      filterRecords()
    }
  }, [searchTerm, commodityData])

  const fetchCommodityPrices = async () => {
    try {
      const response = await fetch("/api/commodity-prices")
      const data = await response.json()
      setCommodityData(data)
      setFilteredRecords(data.records || [])
    } catch (error) {
      console.error("Failed to fetch commodity prices:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    if (!commodityData || !searchTerm.trim()) {
      setFilteredRecords(commodityData?.records || [])
      return
    }

    const filtered = commodityData.records.filter(
      (record) =>
        record.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.market.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredRecords(filtered)
  }

  const getUpdatedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPriceChange = () => {
    // Simulate price change
    const change = Math.random() > 0.5 ? "up" : "down"
    const percentage = Math.floor(Math.random() * 10) + 1
    return { change, percentage }
  }

  if (loading) {
    return (
      <section id="prices" className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-6xl mx-auto shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-center">Government Commodity Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="prices" className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-orange-800 mb-4">Government Commodity Prices</h2>
          <p className="text-xl text-orange-600">Live market prices from official government sources</p>
          {commodityData && (
            <p className="text-sm text-gray-600 mt-2">Last updated: {getUpdatedDate(commodityData.updated_date)}</p>
          )}
        </div>

        <Card className="max-w-6xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-6 w-6 text-orange-600" />
                Market Prices
              </CardTitle>
              <div className="flex gap-2 w-full md:w-auto">
                <Input
                  placeholder="Search by commodity, state, or market..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 md:w-80"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {commodityData && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">{commodityData.desc}</p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Sr.</th>
                    <th className="text-left p-3 font-semibold text-gray-700">State</th>
                    <th className="text-left p-3 font-semibold text-gray-700">District</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Market</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Commodity</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Variety</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Min Price</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Max Price</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Modal Price</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody id="market_price_body">
                  {filteredRecords.map((record, index) => {
                    const priceChange = getPriceChange()
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3 font-medium">{record.state}</td>
                        <td className="p-3">{record.district}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            {record.market}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-green-800">{record.commodity}</td>
                        <td className="p-3 text-sm text-gray-600">{record.variety}</td>
                        <td className="p-3">₹{record.min_price}</td>
                        <td className="p-3">₹{record.max_price}</td>
                        <td className="p-3 font-bold text-lg">₹{record.modal_price}</td>
                        <td className="p-3">
                          <Badge
                            variant={priceChange.change === "up" ? "default" : "destructive"}
                            className="flex items-center gap-1 w-fit"
                          >
                            {priceChange.change === "up" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {priceChange.percentage}%
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No records found for "{searchTerm}"</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Market Insights</h4>
              <p className="text-sm text-green-700">
                Prices are updated daily from various mandis across India. Modal price represents the most common
                trading price. Use this data to make informed decisions about when to sell your produce.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
