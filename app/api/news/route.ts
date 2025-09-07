export async function GET() {
  // Dummy agriculture news data
  const dummyNews = [
    {
      id: 1,
      title: "New Drought-Resistant Wheat Variety Released by ICAR",
      description:
        "Scientists develop wheat variety that can withstand water stress and maintain yield in challenging conditions.",
      date: "2024-01-15",
      source: "Agricultural Research Institute",
      url: "#",
    },
    {
      id: 2,
      title: "Organic Farming Subsidies Increased by 25%",
      description:
        "Government announces enhanced financial support for farmers transitioning to organic cultivation methods.",
      date: "2024-01-14",
      source: "Ministry of Agriculture",
      url: "#",
    },
    {
      id: 3,
      title: "Digital Crop Insurance Platform Launched",
      description: "New mobile app allows farmers to register for crop insurance and track claims digitally.",
      date: "2024-01-13",
      source: "Insurance Regulatory Authority",
      url: "#",
    },
    {
      id: 4,
      title: "Mandi Prices Show Upward Trend for Pulses",
      description: "Lentil and chickpea prices increase by 15% across major agricultural markets in North India.",
      date: "2024-01-12",
      source: "AGMARKNET",
      url: "#",
    },
    {
      id: 5,
      title: "AI-Powered Pest Detection System Trials Begin",
      description:
        "Pilot program uses artificial intelligence to identify crop pests and diseases through smartphone cameras.",
      date: "2024-01-11",
      source: "Tech Agriculture Initiative",
      url: "#",
    },
  ]

  return Response.json(dummyNews)
}
