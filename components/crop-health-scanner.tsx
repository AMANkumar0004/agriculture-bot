"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Camera, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface AnalysisResult {
  condition: string
  confidence: number
  severity: "low" | "medium" | "high"
  recommendations: string[]
  treatment: string
}

export function CropHealthScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!imagePreview) return

    setIsLoading(true)
    setAnalysisResult(null)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const possibleResults: AnalysisResult[] = [
      {
        condition: "Powdery Mildew",
        confidence: 87,
        severity: "medium",
        recommendations: [
          "Apply sulfur-based fungicide immediately",
          "Improve air circulation around plants",
          "Reduce humidity levels",
          "Remove affected leaves",
        ],
        treatment: "Spray with 0.2% sulfur solution every 7 days for 3 weeks",
      },
      {
        condition: "Healthy Crop",
        confidence: 94,
        severity: "low",
        recommendations: [
          "Continue regular monitoring",
          "Maintain current irrigation schedule",
          "Apply balanced fertilizer as planned",
        ],
        treatment: "No treatment needed. Continue preventive care.",
      },
      {
        condition: "Nitrogen Deficiency",
        confidence: 78,
        severity: "medium",
        recommendations: [
          "Apply nitrogen-rich fertilizer",
          "Use urea foliar spray",
          "Consider organic compost",
          "Monitor soil pH levels",
        ],
        treatment: "Apply 50kg urea per acre or foliar spray of 2% urea solution",
      },
      {
        condition: "Aphid Infestation",
        confidence: 91,
        severity: "high",
        recommendations: [
          "Apply neem oil spray immediately",
          "Introduce beneficial insects",
          "Use yellow sticky traps",
          "Monitor weekly for re-infestation",
        ],
        treatment: "Spray neem oil (5ml/liter) every 3 days for 2 weeks",
      },
    ]

    const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)]
    setAnalysisResult(randomResult)
    setIsLoading(false)
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
        return <Info className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Crop Health Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="crop-image">Upload Crop Image</Label>
          <Input id="crop-image" type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
        </div>

        {imagePreview && (
          <div className="relative w-full h-48 bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
            <img src={imagePreview || "/placeholder.svg"} alt="Crop preview" className="object-cover w-full h-full" />
          </div>
        )}

        <Button onClick={handleAnalyze} className="w-full" disabled={isLoading || !imagePreview} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Image...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Analyze Crop Health
            </>
          )}
        </Button>

        {isLoading && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Processing image...</div>
            <Progress value={33} className="w-full" />
          </div>
        )}

        {analysisResult && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{analysisResult.condition}</h3>
              <Badge className={`${getSeverityColor(analysisResult.severity)} flex items-center gap-1`}>
                {getSeverityIcon(analysisResult.severity)}
                {analysisResult.severity.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Confidence Level</span>
                <span className="font-medium">{analysisResult.confidence}%</span>
              </div>
              <Progress value={analysisResult.confidence} className="w-full" />
            </div>

            <div>
              <h4 className="font-medium mb-2">Treatment Plan:</h4>
              <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200 text-blue-800">
                {analysisResult.treatment}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
