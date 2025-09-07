"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, Menu, X, Globe, MapPin } from "lucide-react"

interface NavigationProps {
  language: string
  location: string
  onNavigate: (section: string) => void
  currentSection: string
}

export function Navigation({ language, location, onNavigate, currentSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    {
      id: "home",
      name: "Home",
      nameHi: "होम",
      nameMr: "मुख्यपृष्ठ",
      nameGu: "હોમ",
      namePa: "ਘਰ",
      nameTa: "முகப்பு",
      nameTe: "హోమ్",
      nameKn: "ಮುಖಪುಟ",
      nameBn: "হোম",
    },
    {
      id: "chat",
      name: "AI Chat",
      nameHi: "एआई चैट",
      nameMr: "एआय चॅट",
      nameGu: "AI ચેટ",
      namePa: "AI ਚੈਟ",
      nameTa: "AI அரட்டை",
      nameTe: "AI చాట్",
      nameKn: "AI ಚಾಟ್",
      nameBn: "AI চ্যাট",
    },
    {
      id: "scanner",
      name: "Plant Scanner",
      nameHi: "पौधा स्कैनर",
      nameMr: "वनस्पती स्कॅनर",
      nameGu: "છોડ સ્કેનર",
      namePa: "ਪੌਧਾ ਸਕੈਨਰ",
      nameTa: "தாவர ஸ்கேனர்",
      nameTe: "మొక్క స్కానర్",
      nameKn: "ಸಸ್ಯ ಸ್ಕ್ಯಾನರ್",
      nameBn: "উদ্ভিদ স্ক্যানার",
    },
    {
      id: "weather",
      name: "Weather",
      nameHi: "मौसम",
      nameMr: "हवामान",
      nameGu: "હવામાન",
      namePa: "ਮੌਸਮ",
      nameTa: "வானிலை",
      nameTe: "వాతావరణం",
      nameKn: "ಹವಾಮಾನ",
      nameBn: "আবহাওয়া",
    },
    {
      id: "prices",
      name: "Market",
      nameHi: "बाजार",
      nameMr: "बाजार",
      nameGu: "બજાર",
      namePa: "ਮਾਰਕੀਟ",
      nameTa: "சந்தை",
      nameTe: "మార్కెట్",
      nameKn: "ಮಾರುಕಟ್ಟೆ",
      nameBn: "বাজার",
    },
    {
      id: "news",
      name: "News",
      nameHi: "समाचार",
      nameMr: "बातम्या",
      nameGu: "સમાચાર",
      namePa: "ਖਬਰਾਂ",
      nameTa: "செய்திகள்",
      nameTe: "వార్తలు",
      nameKn: "ಸುದ್ದಿ",
      nameBn: "সংবাদ",
    },
  ]

  const getLocalizedName = (item: any) => {
    if (language.includes("हिं")) return item.nameHi
    if (language.includes("मरा")) return item.nameMr
    if (language.includes("ગુજ")) return item.nameGu
    if (language.includes("ਪੰਜ")) return item.namePa
    if (language.includes("தமிழ்")) return item.nameTa
    if (language.includes("తెలుగు")) return item.nameTe
    if (language.includes("ಕನ್ನಡ")) return item.nameKn
    if (language.includes("বাংলা")) return item.nameBn
    return item.name
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-green-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
            <div className="relative">
              <Leaf className="h-8 w-8 text-green-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AgriGPT
              </h1>
              <p className="text-xs text-green-600">Smart Farming Assistant</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-medium transition-colors duration-200 ${
                  currentSection === item.id
                    ? "text-green-600 border-b-2 border-green-600 pb-1"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {getLocalizedName(item)}
              </button>
            ))}
          </div>

          {/* Status Badges */}
          <div className="hidden md:flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {language}
            </Badge>
            {location && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location}
              </Badge>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-200">
            <div className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentSection === item.id
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  {getLocalizedName(item)}
                </button>
              ))}
              <div className="flex items-center gap-2 px-4 pt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {language}
                </Badge>
                {location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
