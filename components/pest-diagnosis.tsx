"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, Sparkles, ImageIcon, MapPin } from "lucide-react"
import { CameraCapture } from "./camera-capture"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface DiagnosisResult {
  plantType: string
  healthStatus: string
  confidence: number
  primaryIssues: string[]
  symptoms: string[]
  possibleCauses: string[]
  treatmentPlan: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  recommendations: {
    fertilizer: string
    pesticide: string
    watering: string
    monitoring: string
  }
  prevention: string[]
  severity: string
  prognosis: string
}

interface PestDiagnosisProps {
  language?: Language | null
  userLocation?: { lat: number; lon: number } | null
}

export function PestDiagnosis({ language, userLocation }: PestDiagnosisProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getLocalizedText = (key: string) => {
    const texts = {
      title: {
        hi: "AI पौधे रोग निदान",
        mr: "AI वनस्पती रोग निदान",
        gu: "AI છોડ રોગ નિદાન",
        pa: "AI ਪੌਧੇ ਰੋਗ ਨਿਦਾਨ",
        ta: "AI தாவர நோய் நிர்ணயம்",
        te: "AI మొక్క వ్యాధి నిర్ధారణ",
        kn: "AI ಸಸ್ಯ ರೋಗ ನಿರ್ಣಯ",
        bn: "AI উদ্ভিদ রোগ নির্ণয়",
        en: "AI Plant Disease Detection",
      },
      subtitle: {
        hi: "तुरंत निदान के लिए पौधों की छवियां अपलोड करें या कैप्चर करें",
        mr: "तत्काळ निदानासाठी वनस्पतींच्या प्रतिमा अपलोड करा किंवा कॅप्चर करा",
        gu: "તાત્કાલિક નિદાન માટે છોડની છબીઓ અપલોડ કરો અથવા કેપ્ચર કરો",
        pa: "ਤੁਰੰਤ ਨਿਦਾਨ ਲਈ ਪੌਧਿਆਂ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ ਜਾਂ ਕੈਪਚਰ ਕਰੋ",
        ta: "உடனடி நோயறிதலுக்காக தாவர படங்களை பதிவேற்றவும் அல்லது படம்பிடிக்கவும்",
        te: "తక్షణ నిర్ధారణ కోసం మొక్కల చిత్రాలను అప్‌లోడ్ చేయండి లేదా క్యాప్చర్ చేయండి",
        kn: "ತಕ್ಷಣದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ಸಸ್ಯ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಕ್ಯಾಪ್ಚರ್ ಮಾಡಿ",
        bn: "তাৎক্ষণিক নির্ণয়ের জন্য উদ্ভিদের ছবি আপলোড বা ক্যাপচার করুন",
        en: "Upload or capture plant images for instant diagnosis",
      },
      uploadImage: {
        hi: "छवि अपलोड करें",
        mr: "प्रतिमा अपलोड करा",
        gu: "છબી અપલોડ કરો",
        pa: "ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ",
        ta: "படத்தை பதிவேற்றவும்",
        te: "చిత్రాన్ని అప్‌లోడ్ చేయండి",
        kn: "ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        bn: "ছবি আপলোড করুন",
        en: "Upload Image",
      },
      useCamera: {
        hi: "कैमरा उपयोग करें",
        mr: "कॅमेरा वापरा",
        gu: "કેમેરા વાપરો",
        pa: "ਕੈਮਰਾ ਵਰਤੋ",
        ta: "கேமராவைப் பயன்படுத்துங்கள்",
        te: "కెమెరాను ఉపయోగించండి",
        kn: "ಕ್ಯಾಮೆರಾವನ್ನು ಬಳಸಿ",
        bn: "ক্যামেরা ব্যবহার করুন",
        en: "Use Camera",
      },
      analyzing: {
        hi: "AI के साथ विश्लेषण कर रहे हैं...",
        mr: "AI सह विश्लेषण करत आहे...",
        gu: "AI સાથે વિશ્લેષણ કરી રહ્યા છીએ...",
        pa: "AI ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ...",
        ta: "AI உடன் பகுப்பாய்வு செய்கிறோம்...",
        te: "AI తో విశ్లేషిస్తున్నాము...",
        kn: "AI ಯೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇವೆ...",
        bn: "AI দিয়ে বিশ্লেষণ করছি...",
        en: "Analyzing with AI...",
      },
    }

    const langCode = language?.code || "en"
    return (
      texts[key as keyof typeof texts]?.[langCode as keyof (typeof texts)[keyof typeof texts]] ||
      texts[key as keyof typeof texts]?.en ||
      ""
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (imageData: string) => {
    setImage(imageData)
    setResult(null)
    setShowCamera(false)
  }

  const analyzeImage = async () => {
    if (!image) return

    setIsAnalyzing(true)
    setResult(null)
    setAnalysisProgress(0)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          language: language?.code || "en",
          location: userLocation ? `${userLocation.lat},${userLocation.lon}` : null,
        }),
      })

      const data = await response.json()
      clearInterval(progressInterval)
      setAnalysisProgress(100)

      setTimeout(() => {
        setResult(data)
        setIsAnalyzing(false)
        setAnalysisProgress(0)
      }, 500)
    } catch (error) {
      console.error("Analysis failed:", error)
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <>
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <Camera className="h-8 w-8" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold">{getLocalizedText("title")}</span>
              <p className="text-green-100 text-sm">{getLocalizedText("subtitle")}</p>
              {userLocation && (
                <div className="flex items-center gap-1 text-green-200 text-xs mt-1">
                  <MapPin className="h-3 w-3" />
                  Location: {userLocation.lat.toFixed(2)}, {userLocation.lon.toFixed(2)}
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="h-16 border-2 border-dashed border-green-300 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
            >
              <Upload className="h-6 w-6 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-semibold text-green-800">{getLocalizedText("uploadImage")}</div>
                <div className="text-sm text-green-600">Choose from gallery</div>
              </div>
            </Button>

            <Button
              onClick={() => setShowCamera(true)}
              variant="outline"
              className="h-16 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <Camera className="h-6 w-6 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold text-blue-800">{getLocalizedText("useCamera")}</div>
                <div className="text-sm text-blue-600">Capture live photo</div>
              </div>
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

          {image && (
            <div className="space-y-6">
              <div className="relative group">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Plant to analyze"
                  className="w-full h-80 object-cover rounded-xl border-4 border-green-200 shadow-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-xl flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>

              <Button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-semibold rounded-xl shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    {getLocalizedText("analyzing")}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 mr-3" />
                    Analyze Plant Health
                  </>
                )}
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <span className="text-lg font-semibold text-green-800">AI Analysis in Progress...</span>
              </div>
              <Progress value={analysisProgress} className="w-full h-3" />
              <p className="text-center text-green-700">
                {analysisProgress < 30 && "Processing image..."}
                {analysisProgress >= 30 && analysisProgress < 60 && "Identifying plant features..."}
                {analysisProgress >= 60 && analysisProgress < 90 && "Detecting diseases and pests..."}
                {analysisProgress >= 90 && "Generating recommendations..."}
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border-2 border-green-200 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-green-800">AI Diagnosis Results</h3>
                <div className="flex items-center gap-3">
                  <Badge className={`flex items-center gap-2 px-4 py-2 ${getSeverityColor(result.severity)}`}>
                    {getSeverityIcon(result.severity)}
                    <span className="font-semibold">{result.severity.toUpperCase()}</span>
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 px-4 py-2">{result.confidence}% Confidence</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">Plant Information</h4>
                    <p>
                      <strong>Type:</strong> {result.plantType}
                    </p>
                    <p>
                      <strong>Health Status:</strong> {result.healthStatus}
                    </p>
                    <p>
                      <strong>Prognosis:</strong> {result.prognosis}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">Primary Issues</h4>
                    <ul className="space-y-1">
                      {result.primaryIssues.map((issue, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2">Symptoms Observed</h4>
                    <ul className="space-y-1">
                      {result.symptoms.map((symptom, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-2">Treatment Plan</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-blue-700">Immediate Actions:</h5>
                        <ul className="text-sm space-y-1">
                          {result.treatmentPlan.immediate.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-blue-700">Short Term (1-2 weeks):</h5>
                        <ul className="text-sm space-y-1">
                          {result.treatmentPlan.shortTerm.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2">Specific Recommendations</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Fertilizer:</strong> {result.recommendations.fertilizer}
                      </p>
                      <p>
                        <strong>Pesticide:</strong> {result.recommendations.pesticide}
                      </p>
                      <p>
                        <strong>Watering:</strong> {result.recommendations.watering}
                      </p>
                      <p>
                        <strong>Monitoring:</strong> {result.recommendations.monitoring}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">Prevention Tips</h4>
                <ul className="space-y-1">
                  {result.prevention.map((tip, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showCamera && <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}
    </>
  )
}
