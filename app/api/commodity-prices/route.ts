export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const commodity = searchParams.get("commodity")

  try {
    // Government commodity API endpoint
    const apiUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
    const apiKey = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b" // Sample key

    const url = `${apiUrl}?api-key=${apiKey}&format=json&limit=100${commodity ? `&filters[commodity]=${commodity}` : ""}`

    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      return Response.json(data)
    } else {
      throw new Error("Commodity API failed")
    }
  } catch (error) {
    console.error("Commodity API error:", error)

    // Fallback sample data
    const sampleData = {
      updated_date: new Date().toISOString(),
      desc: "Daily commodity prices from various markets across India",
      records: [
        {
          state: "Maharashtra",
          district: "Pune",
          market: "Pune Market",
          commodity: "Rice",
          variety: "Basmati",
          min_price: "2000",
          max_price: "2200",
          modal_price: "2100",
        },
        {
          state: "Punjab",
          district: "Ludhiana",
          market: "Ludhiana Mandi",
          commodity: "Wheat",
          variety: "HD-2967",
          min_price: "1950",
          max_price: "2100",
          modal_price: "2025",
        },
        {
          state: "Gujarat",
          district: "Ahmedabad",
          market: "Ahmedabad Market",
          commodity: "Cotton",
          variety: "Medium Staple",
          min_price: "5500",
          max_price: "6000",
          modal_price: "5750",
        },
        {
          state: "Uttar Pradesh",
          district: "Meerut",
          market: "Meerut Mandi",
          commodity: "Sugarcane",
          variety: "Common",
          min_price: "320",
          max_price: "380",
          modal_price: "350",
        },
        {
          state: "Karnataka",
          district: "Bangalore",
          market: "Bangalore Market",
          commodity: "Tomato",
          variety: "Hybrid",
          min_price: "1500",
          max_price: "2000",
          modal_price: "1750",
        },
      ],
    }

    return Response.json(sampleData)
  }
}
