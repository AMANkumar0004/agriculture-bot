"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, X, RotateCcw, Download } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const startCamera = useCallback(async () => {
    try {
      setIsInitializing(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment", // Use back camera on mobile
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)

        videoRef.current.onloadedmetadata = () => {
          setIsInitializing(false)
        }
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setIsInitializing(false)
      alert("Camera access is required to capture plant images. Please allow camera permission and try again.")
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageData)
      }
    }
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
  }, [])

  const usePhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage)
      stopCamera()
      onClose()
    }
  }, [capturedImage, onCapture, onClose])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  // Start camera when component mounts
  useState(() => {
    startCamera()
    return () => stopCamera()
  })

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Capture Plant Image</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                stopCamera()
                onClose()
              }}
              className="text-white hover:bg-gray-800"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                  <p>Initializing camera...</p>
                </div>
              </div>
            )}

            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-80 object-cover"
                style={{ display: isInitializing ? "none" : "block" }}
              />
            ) : (
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured plant"
                className="w-full h-80 object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />

            {/* Camera overlay */}
            {!capturedImage && !isInitializing && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-green-400 rounded-lg opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 border-2 border-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {!capturedImage ? (
              <Button
                onClick={capturePhoto}
                disabled={isInitializing}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
              >
                <Camera className="h-5 w-5 mr-2" />
                Capture Photo
              </Button>
            ) : (
              <>
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Retake
                </Button>
                <Button onClick={usePhoto} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Use Photo
                </Button>
              </>
            )}
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Position your plant in the frame and capture a clear image for AI analysis
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
