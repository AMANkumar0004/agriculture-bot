"use client"

import { useState, useEffect } from "react"
import { LanguageSelector } from "@/components/language-selector"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ChatbotSection } from "@/components/chatbot-section"
import { PestDiagnosis } from "@/components/pest-diagnosis"
import { WeatherSection } from "@/components/weather-section"
import { MarketPricesSection } from "@/components/market-prices-section"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export default function AgriGPT() {
  const [showLanguageSelector, setShowLanguageSelector] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [locationPermission, setLocationPermission] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationName, setLocationName] = useState("")
  const [currentSection, setCurrentSection] = useState("home")

  useEffect(() => {
    // Check if user has already set preferences
    const savedLanguage = localStorage.getItem("agrigpt-language")
    const savedLocation = localStorage.getItem("agrigpt-location")
    const savedCoords = localStorage.getItem("agrigpt-coords")

    if (savedLanguage && savedLocation) {
      setSelectedLanguage(JSON.parse(savedLanguage))
      setLocationName(savedLocation)
      if (savedCoords) {
        setUserLocation(JSON.parse(savedCoords))
      }
      setShowLanguageSelector(false)
    }
  }, [])

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    localStorage.setItem("agrigpt-language", JSON.stringify(language))
    setShowLanguageSelector(false)
  }

  const handleLocationPermission = async (granted: boolean) => {
    setLocationPermission(granted)

    if (granted) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })

        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
        setUserLocation(coords)
        localStorage.setItem("agrigpt-coords", JSON.stringify(coords))

        // Get location name
        const response = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`)
        const data = await response.json()
        setLocationName(data.location)
        localStorage.setItem("agrigpt-location", data.location)
      } catch (error) {
        console.error("Error getting location:", error)
        setLocationName("India")
        localStorage.setItem("agrigpt-location", "India")
      }
    } else {
      setLocationName("India")
      localStorage.setItem("agrigpt-location", "India")
    }
  }

  const scrollToSection = (sectionId: string) => {
    setCurrentSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (showLanguageSelector) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} onLocationPermission={handleLocationPermission} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Navigation
        language={selectedLanguage?.nativeName || "English"}
        location={locationName}
        onNavigate={scrollToSection}
        currentSection={currentSection}
      />

      {/* Hero Section */}
      <section id="home">
        <HeroSection onGetStarted={() => scrollToSection("chat")} language={selectedLanguage} />
      </section>

      {/* Chat Section */}
      <section id="chat" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              {selectedLanguage?.code === "hi"
                ? "एआई चैट सहायक"
                : selectedLanguage?.code === "mr"
                  ? "एआय चॅट सहाय्यक"
                  : selectedLanguage?.code === "gu"
                    ? "AI ચેટ સહાયક"
                    : selectedLanguage?.code === "pa"
                      ? "AI ਚੈਟ ਸਹਾਇਕ"
                      : selectedLanguage?.code === "ta"
                        ? "AI அரட்டை உதவியாளர்"
                        : selectedLanguage?.code === "te"
                          ? "AI చాట్ సహాయకుడు"
                          : selectedLanguage?.code === "kn"
                            ? "AI ಚಾಟ್ ಸಹಾಯಕ"
                            : selectedLanguage?.code === "bn"
                              ? "AI চ্যাট সহায়ক"
                              : "AI Chat Assistant"}
            </h2>
            <p className="text-xl text-green-600">
              {selectedLanguage?.code === "hi"
                ? "अपने सभी कृषि प्रश्नों के लिए तुरंत विशेषज्ञ सलाह प्राप्त करें"
                : selectedLanguage?.code === "mr"
                  ? "आपल्या सर्व शेती प्रश्नांसाठी तत्काळ तज्ञ सल्ला मिळवा"
                  : selectedLanguage?.code === "gu"
                    ? "તમારા તમામ ખેતી પ્રશ્નો માટે તાત્કાલિક નિષ્ણાત સલાહ મેળવો"
                    : selectedLanguage?.code === "pa"
                      ? "ਆਪਣੇ ਸਾਰੇ ਖੇਤੀ ਸਵਾਲਾਂ ਲਈ ਤੁਰੰਤ ਮਾਹਰ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ"
                      : selectedLanguage?.code === "ta"
                        ? "உங்கள் அனைத்து விவசாய கேள்விகளுக்கும் உடனடி நிபுணர் ஆலோசனை பெறுங்கள்"
                        : selectedLanguage?.code === "te"
                          ? "మీ అన్ని వ్యవసాయ ప్రశ్నలకు తక్షణ నిపుణుల సలహా పొందండి"
                          : selectedLanguage?.code === "kn"
                            ? "ನಿಮ್ಮ ಎಲ್ಲಾ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ತಕ್ಷಣದ ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ"
                            : selectedLanguage?.code === "bn"
                              ? "আপনার সমস্ত কৃষি প্রশ্নের জন্য তাৎক্ষণিক বিশেষজ্ঞ পরামর্শ পান"
                              : "Get instant expert advice for all your farming questions"}
            </p>
          </div>
          <ChatbotSection language={selectedLanguage} location={locationName} />
        </div>
      </section>

      {/* Scanner Section */}
      <section id="scanner" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              {selectedLanguage?.code === "hi"
                ? "पौधे रोग स्कैनर"
                : selectedLanguage?.code === "mr"
                  ? "वनस्पती रोग स्कॅनर"
                  : selectedLanguage?.code === "gu"
                    ? "છોડ રોગ સ્કેનર"
                    : selectedLanguage?.code === "pa"
                      ? "ਪੌਧੇ ਦੀ ਬਿਮਾਰੀ ਸਕੈਨਰ"
                      : selectedLanguage?.code === "ta"
                        ? "தாவர நோய் ஸ்கேனர்"
                        : selectedLanguage?.code === "te"
                          ? "మొక్క వ్యాధి స్కానర్"
                          : selectedLanguage?.code === "kn"
                            ? "ಸಸ್ಯ ರೋಗ ಸ್ಕ್ಯಾನರ್"
                            : selectedLanguage?.code === "bn"
                              ? "উদ্ভিদ রোগ স্ক্যানার"
                              : "Plant Disease Scanner"}
            </h2>
            <p className="text-xl text-green-600">
              {selectedLanguage?.code === "hi"
                ? "AI-संचालित निदान के लिए पौधों की छवियां अपलोड करें या कैप्चर करें"
                : selectedLanguage?.code === "mr"
                  ? "AI-चालित निदानासाठी वनस्पतींच्या प्रतिमा अपलोड करा किंवा कॅप्चर करा"
                  : selectedLanguage?.code === "gu"
                    ? "AI-સંચાલિત નિદાન માટે છોડની છબીઓ અપલોડ કરો અથવા કેપ્ચર કરો"
                    : selectedLanguage?.code === "pa"
                      ? "AI-ਸੰਚਾਲਿਤ ਨਿਦਾਨ ਲਈ ਪੌਧਿਆਂ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ ਜਾਂ ਕੈਪਚਰ ਕਰੋ"
                      : selectedLanguage?.code === "ta"
                        ? "AI-இயங்கும் நோயறிதலுக்காக தாவர படங்களை பதிவேற்றவும் அல்லது படம்பிடிக்கவும்"
                        : selectedLanguage?.code === "te"
                          ? "AI-నడిచే నిర్ధారణ కోసం మొక్కల చిత్రాలను అప్‌లోడ్ చేయండి లేదా క్యాప్చర్ చేయండి"
                          : selectedLanguage?.code === "kn"
                            ? "AI-ಚಾಲಿತ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ಸಸ್ಯ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಕ್ಯಾಪ್ಚರ್ ಮಾಡಿ"
                            : selectedLanguage?.code === "bn"
                              ? "AI-চালিত নির্ণয়ের জন্য উদ্ভিদের ছবি আপলোড বা ক্যাপচার করুন"
                              : "Upload or capture plant images for AI-powered diagnosis"}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <PestDiagnosis language={selectedLanguage} userLocation={userLocation} />
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <section id="weather">
        <WeatherSection location={userLocation} language={selectedLanguage} />
      </section>

      {/* Market Prices Section */}
      <section id="prices">
        <MarketPricesSection language={selectedLanguage} />
      </section>

      {/* News Section */}
      <section id="news">
        <NewsSection language={selectedLanguage} />
      </section>

      <Footer language={selectedLanguage} />
    </div>
  )
}
