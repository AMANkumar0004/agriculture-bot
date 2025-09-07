"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, Mic } from "lucide-react"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void
  onLocationPermission: (granted: boolean) => void
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
]

export function LanguageSelector({ onLanguageSelect, onLocationPermission }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [locationGranted, setLocationGranted] = useState(false)
  const [step, setStep] = useState<"language" | "location" | "complete">("language")

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    setStep("location")
  }

  const requestLocationPermission = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        })
      })

      setLocationGranted(true)
      onLocationPermission(true)
      setStep("complete")

      // Complete setup after a short delay
      setTimeout(() => {
        if (selectedLanguage) {
          onLanguageSelect(selectedLanguage)
        }
      }, 1500)
    } catch (error) {
      console.error("Location permission denied:", error)
      setLocationGranted(false)
      onLocationPermission(false)
      setStep("complete")

      setTimeout(() => {
        if (selectedLanguage) {
          onLanguageSelect(selectedLanguage)
        }
      }, 1500)
    }
  }

  const skipLocation = () => {
    setLocationGranted(false)
    onLocationPermission(false)
    setStep("complete")

    setTimeout(() => {
      if (selectedLanguage) {
        onLanguageSelect(selectedLanguage)
      }
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-green-800 mb-2">Welcome to AgriGPT</CardTitle>
          <p className="text-green-600">Let's personalize your farming assistant</p>
        </CardHeader>

        <CardContent className="p-8">
          {step === "language" && (
            <div className="space-y-6">
              <div className="text-center">
                <Globe className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Choose Your Language</h3>
                <p className="text-gray-600">Select your preferred language for the best experience</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((language) => (
                  <Button
                    key={language.code}
                    variant="outline"
                    onClick={() => handleLanguageSelect(language)}
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                  >
                    <span className="text-2xl">{language.flag}</span>
                    <div className="text-center">
                      <div className="font-semibold text-sm">{language.name}</div>
                      <div className="text-xs text-gray-600">{language.nativeName}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === "location" && (
            <div className="space-y-6 text-center">
              <div>
                <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Location Access</h3>
                <p className="text-gray-600 mb-4">
                  Allow location access to get personalized weather updates and local farming advice
                </p>
                {selectedLanguage && (
                  <Badge variant="outline" className="mb-4">
                    Selected: {selectedLanguage.flag} {selectedLanguage.nativeName}
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={requestLocationPermission}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Allow Location Access
                </Button>
                <Button onClick={skipLocation} variant="outline" className="w-full bg-transparent">
                  Skip for Now
                </Button>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <strong>Why we need location:</strong> To provide accurate weather forecasts, local market prices, and
                region-specific farming advice.
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-6 text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                <Mic className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Setting Up Your Experience</h3>
              <div className="space-y-2">
                {selectedLanguage && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Language: {selectedLanguage.nativeName}</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Location: {locationGranted ? "Enabled" : "Disabled"}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>AI Assistant: Ready</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
