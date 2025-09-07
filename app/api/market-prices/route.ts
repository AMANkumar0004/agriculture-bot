export async function GET() {
  // Simulate market price API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  const marketPrices = [
    { crop: "Rice", price: 2100, unit: "per quintal", change: "+5%", trend: "up" },
    { crop: "Wheat", price: 2050, unit: "per quintal", change: "+2%", trend: "up" },
    { crop: "Cotton", price: 5800, unit: "per quintal", change: "-3%", trend: "down" },
    { crop: "Sugarcane", price: 350, unit: "per quintal", change: "+1%", trend: "up" },
    { crop: "Maize", price: 1800, unit: "per quintal", change: "+4%", trend: "up" },
    { crop: "Soybean", price: 4200, unit: "per quintal", change: "-2%", trend: "down" },
  ]

  return Response.json(marketPrices)
}
