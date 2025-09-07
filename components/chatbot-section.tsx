"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, MapPin, Mic, Sparkles, AlertCircle, Shield, RefreshCw } from "lucide-react"
import { LoadingSpinner } from "./loading-spinner"
import { Sanitizer } from "@/lib/sanitize"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface ChatbotSectionProps {
  language?: Language | null
  location?: string
}

export function ChatbotSection({ language, location }: ChatbotSectionProps) {
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string; timestamp: number }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [rateLimitWarning, setRateLimitWarning] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const getLocalizedText = (key: string) => {
    const texts = {
      title: {
        hi: "AgriGPT सहायक",
        mr: "AgriGPT सहाय्यक",
        gu: "AgriGPT સહાયક",
        pa: "AgriGPT ਸਹਾਇਕ",
        ta: "AgriGPT உதவியாளர்",
        te: "AgriGPT సహాయకుడు",
        kn: "AgriGPT ಸಹಾಯಕ",
        bn: "AgriGPT সহায়ক",
        en: "AgriGPT Assistant",
      },
      subtitle: {
        hi: "जेमिनी AI द्वारा संचालित • सुरक्षित",
        mr: "जेमिनी AI द्वारे चालित • सुरक्षित",
        gu: "જેમિની AI દ્વારા સંચાલિત • સુરક્ષિત",
        pa: "ਜੈਮਿਨੀ AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ • ਸੁਰੱਖਿਅਤ",
        ta: "ஜெமினி AI ஆல் இயக்கப்படுகிறது • பாதுகாப்பான",
        te: "జెమిని AI చే శక్తివంతం • సురక్షితం",
        kn: "ಜೆಮಿನಿ AI ನಿಂದ ಚಾಲಿತ • ಸುರಕ್ಷಿತ",
        bn: "জেমিনি AI দ্বারা চালিত • নিরাপদ",
        en: "Powered by Gemini AI • Secure",
      },
      welcome: {
        hi: "AgriGPT में आपका स्वागत है!",
        mr: "AgriGPT मध्ये आपले स्वागत आहे!",
        gu: "AgriGPT માં આપનું સ્વાગત છે!",
        pa: "AgriGPT ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ!",
        ta: "AgriGPT இல் உங்களை வரவேற்கிறோம்!",
        te: "AgriGPT కి మిమ్మల్ని స్వాగతం!",
        kn: "AgriGPT ಗೆ ನಿಮಗೆ ಸ್ವಾಗತ!",
        bn: "AgriGPT তে আপনাকে স্বাগতম!",
        en: "Welcome to AgriGPT!",
      },
      description: {
        hi: "आपका AI-संचालित कृषि सहायक। फसलों, रोगों, मौसम या बाजार की कीमतों के बারe में कुछ भी पूछें। आपकी सुरक्षा हमारी प्राथमिकता है।",
        mr: "तुमचा AI-चालित शेती सहाय्यक। पिके, रोग, हवामान किंवा बाजार भावांबद्दल काहीही विचारा। तुमची सुरक्षा आमची प्राथमिकता आहे.",
        gu: "તમારો AI-સંચાલિત કૃષિ સહાયક. પાક, રોગ, હવામાન અથવા બજાર ભાવ વિશે કંઈપણ પૂછો. તમારી સુરક્ષા અમારી પ્રાથમિકતા છે.",
        pa: "ਤੁਹਾਡਾ AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਸਹਾਇਕ। ਫਸਲਾਂ, ਬਿਮਾਰੀਆਂ, ਮੌਸਮ ਜਾਂ ਮਾਰਕੀਟ ਦੀਆਂ ਕੀਮਤਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ। ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਸਾਡੀ ਪ੍ਰਾਥਮਿਕਤਾ ਹੈ।",
        ta: "உங்கள் AI-இயங்கும் விவசாய உதவியாளர். பயிர்கள், நோய்கள், வானிலை அல்லது சந்தை விலைகள் பற்றி எதையும் கேளுங்கள். உங்கள் பாதுகாப்பு எங்கள் முன்னுரிமை.",
        te: "మీ AI-శక్తివంతమైన వ్యవసాయ సహాయకుడు. పంటలు, వ్యాధులు, వాతావరణం లేదా మార్కెట్ ధరల గురించి ఏదైనా అడగండి. మీ భద్రత మా ప్రాధాన్యత.",
        kn: "ನಿಮ್ಮ AI-ಚಾಲಿತ ಕೃಷಿ ಸಹಾಯಕ. ಬೆಳೆಗಳು, ರೋಗಗಳು, ಹವಾಮಾನ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ. ನಿಮ್ಮ ಸುರಕ್ಷತೆ ನಮ್ಮ ಆದ್ಯತೆ.",
        bn: "আপনার AI-চালিত কৃষি সহায়ক। ফসল, রোগ, আবহাওয়া বা বাজার দাম সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন। আপনার নিরাপত্তা আমাদের অগ্রাধিকার।",
        en: "Your AI-powered farming assistant. Ask anything about crops, diseases, weather, or market prices. Your security is our priority.",
      },
      placeholder: {
        hi: "फसलों, मौसम, कीमतों या कृषि सलाह के बारe में पूछें... (500 अक्षर तक)",
        mr: "पिके, हवामान, किंमती किंवा शेती सल्ल्याबद्दल विचारा... (500 अक्षरांपर्यंत)",
        gu: "પાક, હવામાન, ભાવ અથવા કૃષિ સલાહ વિશે પૂછો... (500 અક્ષરો સુધી)",
        pa: "ਫਸਲਾਂ, ਮੌਸਮ, ਕੀਮਤਾਂ ਜਾਂ ਖੇਤੀ ਸਲਾਹ ਬਾਰੇ ਪੁੱਛੋ... (500 ਅੱਖਰਾਂ ਤੱਕ)",
        ta: "பயிர்கள், வானிலை, விலைகள் அல்லது விவசாய ஆலோசனை பற்றி கேளுங்கள்... (500 எழுத்துகள் வரை)",
        te: "పంటలు, వాతావరణం, ధరలు లేదా వ్యవసాయ సలహా గురించి అడగండి... (500 అక్షరాల వరకు)",
        kn: "ಬೆಳೆಗಳು, ಹವಾಮಾನ, ಬೆಲೆಗಳು ಅಥವಾ ಕೃಷಿ ಸಲಹೆಯ ಬಗ್ಗೆ ಕೇಳಿ... (500 ಅಕ್ಷರಗಳವರೆಗೆ)",
        bn: "ফসল, আবহাওয়া, দাম বা কৃষি পরামর্শ সম্পর্কে জিজ্ঞাসা করুন... (500 অক্ষর পর্যন্ত)",
        en: "Ask about crops, weather, prices, or farming advice... (up to 500 characters)",
      },
      rateLimitWarning: {
        hi: "कृपया धীरে-धীरे संदेश भेजें। दर सीमा सक्रिय है।",
        mr: "कृपया हळूहळू संदेश पाठवा. दर मर्यादा सक्रिय आहे.",
        gu: "કૃપા કરીને ધીમે ધીમે સંદેશા મોકલો. દર મર્યાદા સક્રિય છે.",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ-ਹੌਲੀ ਸੁਨੇਹੇ ਭੇਜੋ। ਦਰ ਸੀਮਾ ਸਰਗਰਮ ਹੈ।",
        ta: "தயவுசெய்து மெதுவாக செய்திகளை அனுப்பவும். வீத வரம்பு செயலில் உள்ளது.",
        te: "దయచేసి నెమ్మదిగా సందేశాలు పంపండి. రేట్ పరిమితి చురుకుగా ఉంది.",
        kn: "ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಸಂದೇಶಗಳನ್ನು ಕಳುಹಿಸಿ. ದರ ಮಿತಿ ಸಕ್ರಿಯವಾಗಿದೆ.",
        bn: "অনুগ্রহ করে ধীরে ধীরে বার্তা পাঠান। হার সীমা সক্রিয়।",
        en: "Please send messages slowly. Rate limit is active.",
      },
      retryMessage: {
        hi: "पुनः प্রयास करें",
        mr: "पुन्हा प्रयत्न करा",
        gu: "ફરી પ્રયાસ કરો",
        pa: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
        ta: "மீண்டும் முயற்சிக்கவும்",
        te: "మళ్లీ ప్రయత్నించండి",
        kn: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
        bn: "আবার চেষ্টা করুন",
        en: "Try Again",
      },
    }

    const langCode = language?.code || "en"
    return (
      texts[key as keyof typeof texts]?.[langCode as keyof (typeof texts)[keyof typeof texts]] ||
      texts[key as keyof typeof texts]?.en ||
      ""
    )
  }

  const getQuickQuestions = () => {
    const questions = {
      hi: [
        "इस मौसम में क्या उगाना चाहिए?",
        "टमाटर में पीले पत्तों का इलाज",
        "गेहूं के लिए सबसे अच्छा उर्वरक",
        "प्राकृतिक रूप से कीटों को कैसे नियंत्रित करें?",
        "धान कब लगाना चाहिए?",
        "जैविक खेती की तकनीक",
      ],
      mr: [
        "या हंगामात काय पिकवावे?",
        "टोमॅटोमधील पिवळी पाने बरी करणे",
        "गहूंसाठी सर्वोत्तम खत",
        "नैसर्गिकरित्या कीड नियंत्रण कसे करावे?",
        "तांदूळ कधी लावावा?",
        "सेंद्रिय शेतीच्या तंत्रा",
      ],
      gu: [
        "આ મોસમમાં શું ઉગાડવું?",
        "ટામેટામાં પીળા પાંદડાંની સારવાર",
        "ઘઉં માટે શ્રેષ્ઠ ખાતર",
        "કુદરતી રીતે જંતુઓને કેવી રીતે નિયંત્રિત કરવા?",
        "ચોખા ક્યારે રોપવા?",
        "કાર્બનિક ખેતીની તકનીકો",
      ],
      pa: [
        "ਇਸ ਮੌਸਮ ਵਿੱਚ ਕੀ ਉਗਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
        "ਟਮਾਟਰ ਵਿੱਚ ਪੀਲੇ ਪੱਤਿਆਂ ਦਾ ਇਲਾਜ",
        "ਕਣਕ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਖਾਦ",
        "ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਕੀੜਿਆਂ ਨੂੰ ਕਿਵੇਂ ਕੰਟਰੋਲ ਕਰਨਾ?",
        "ਚਾਵਲ ਕਦੋਂ ਲਗਾਉਣੇ ਚਾਹੀਦੇ ਹਨ?",
        "ਜੈਵਿਕ ਖੇਤੀ ਦੀਆਂ ਤਕਨੀਕਾਂ",
      ],
      ta: [
        "இந்த பருவத்தில் என்ன வளர்க்க வேண்டும்?",
        "தக்காளியில் மஞ்சள் இலைகளுக்கு தீர்வு",
        "கோதுமைக்கு சிறந்த உரம்",
        "இயற்கையாக பூச்சிகளை எப்படி கட்டுப்படுத்துவது?",
        "அரிசி எப்போது நடவு செய்ய வேண்டும்?",
        "இயற்கை விவசாய நுட்பங்கள்",
      ],
      te: [
        "ఈ సీజన్‌లో ఏమి పండించాలి?",
        "టమాటోలో పసుపు ఆకులకు చికిత్స",
        "గోధుమలకు ఉత్తమ ఎరువు",
        "సహజంగా కీటకాలను ఎలా నియంత్రించాలి?",
        "వరిని ఎప్పుడు నాటాలి?",
        "సేంద్రీయ వ్యవసాయ పద్ధతులు",
      ],
      kn: [
        "ಈ ಋತುವಿನಲ್ಲಿ ಏನು ಬೆಳೆಯಬೇಕು?",
        "ಟೊಮೇಟೊದಲ್ಲಿ ಹಳದಿ ಎಲೆಗಳಿಗೆ ಚಿಕಿತ್ಸೆ",
        "ಗೋಧಿಗೆ ಅತ್ಯುತ್ತಮ ಗೊಬ್ಬರ",
        "ನೈಸರ್ಗಿಕವಾಗಿ ಕೀಟಗಳನ್ನು ಹೇಗೆ ನಿಯಂತ್ರಿಸುವುದು?",
        "ಅಕ್ಕಿಯನ್ನು ಯಾವಾಗ ನೆಡಬೇಕು?",
        "ಸಾವಯವ ಕೃಷಿ ತಂತ್ರಗಳು",
      ],
      bn: [
        "এই মৌসুমে কী চাষ করা উচিত?",
        "টমেটোতে হলুদ পাতার চিকিৎসা",
        "গমের জন্য সেরা সার",
        "প্রাকৃতিকভাবে পোকামাকড় নিয়ন্ত্রণ কীভাবে?",
        "ধান কখন রোপণ করতে হবে?",
        "জৈব চাষাবাদের কৌশল",
      ],
      en: [
        "What to grow this season?",
        "Remedy for yellowing leaves in tomato",
        "Best fertilizer for wheat",
        "How to control pests naturally?",
        "When to plant rice?",
        "Organic farming tips",
      ],
    }

    const langCode = language?.code || "en"
    return questions[langCode as keyof typeof questions] || questions.en
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Client-side input sanitization
    const sanitizedInput = Sanitizer.sanitizeInput(input.trim())
    if (!sanitizedInput || sanitizedInput.length < 2) {
      setError("Please provide a valid message.")
      return
    }

    if (sanitizedInput.length > 500) {
      setError("Message too long. Please keep it under 500 characters.")
      return
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: sanitizedInput,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = sanitizedInput
    setInput("")
    setIsLoading(true)
    setError("")
    setRateLimitWarning(false)
    setRetryCount(0)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          location: Sanitizer.sanitizeLocation(location || ""),
          language: Sanitizer.sanitizeLanguageCode(language?.code || "en"),
        }),
      })

      if (!response.ok) {
        // Attempt to parse the error response from the server
        const errorData = await response.json().catch(() => ({ message: "Unknown server error" }))
        const assistantMessageContent = errorData.message || `Server error: ${response.status}`

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: Sanitizer.sanitizeAiResponse(assistantMessageContent),
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setError(assistantMessageContent) // Set the error state to show the warning banner
        setIsLoading(false)
        return // Exit early as we've handled the message
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      // Additional client-side sanitization and filtering
      let cleanedMessage = Sanitizer.sanitizeAiResponse(data.message)

      // Remove any remaining development platform references
      cleanedMessage = cleanedMessage
        .replace(/\b(built with v0|created with v0|made with v0|v0\.dev|vercel v0)\b/gi, "")
        .replace(/\b(this is a demo|prototype|sample application)\b/gi, "")
        .replace(/\b(development platform|ai assistant platform)\b/gi, "")
        .replace(/\*\*disclaimer\*\*.*?(?=<br><br>|<br>$|$)/gi, "")
        .replace(/\[.*?built.*?v0.*?\]/gi, "")
        .replace(/$$.*?v0\.dev.*?$$/gi, "")
        .replace(/powered by.*?v0/gi, "")
        .replace(/created using.*?v0/gi, "")
        .trim()

      // Ensure we have meaningful content
      if (!cleanedMessage || cleanedMessage.length < 5) {
        cleanedMessage =
          "<p>I'm here to help with your agricultural questions. Please ask about farming, crops, or agricultural techniques.</p>"
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: cleanedMessage,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      setError("Network connection lost. Please check your internet.") // More specific network error

      const fallbackMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: Sanitizer.sanitizeAiResponse(
          "<p><strong>Offline Mode:</strong> I'm working in offline mode. Please try asking about specific farming topics like pest control, fertilizers, or irrigation.</p>",
        ),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = async () => {
    if (messages.length === 0 || isLoading || isRetrying) return

    const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    if (!lastUserMessage) return

    setIsRetrying(true)
    setError("")
    setRetryCount((prev) => prev + 1)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: lastUserMessage.content,
          location: Sanitizer.sanitizeLocation(location || ""),
          language: Sanitizer.sanitizeLanguageCode(language?.code || "en"),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.message) {
          const cleanedMessage = Sanitizer.sanitizeAiResponse(data.message)
          const assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: cleanedMessage,
            timestamp: Date.now(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        }
      }
    } catch (error) {
      console.error("Retry failed:", error)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    const sanitizedQuestion = Sanitizer.sanitizeInput(question)
    setInput(sanitizedQuestion)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 500) {
      setInput(value)
      setError("")
    }
  }

  const quickQuestions = getQuickQuestions()

  return (
    <Card className="h-[700px] flex flex-col shadow-2xl border-0 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="border-b bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-8 w-8" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold">{getLocalizedText("title")}</span>
              <p className="text-green-100 text-sm flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {getLocalizedText("subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {location && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-white/20 text-white border-white/30">
                <MapPin className="h-3 w-3" />
                {Sanitizer.sanitizeLocation(location)}
              </Badge>
            )}
            <Badge
              className={`${error || rateLimitWarning ? "bg-yellow-400 text-yellow-900" : "bg-green-400 text-green-900"} animate-pulse`}
            >
              <div
                className={`w-2 h-2 ${error || rateLimitWarning ? "bg-yellow-600" : "bg-green-600"} rounded-full mr-1`}
              ></div>
              {error || rateLimitWarning ? "Limited" : "Secure"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          {(error || rateLimitWarning) && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">{error || getLocalizedText("rateLimitWarning")}</span>
              </div>
              {error && !rateLimitWarning && (
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  size="sm"
                  variant="outline"
                  className="text-xs bg-transparent"
                >
                  {isRetrying ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {getLocalizedText("retryMessage")}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative mb-6">
                <Bot className="h-20 w-20 text-green-500 animate-bounce" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-pulse" />
                <Shield className="absolute -bottom-2 -left-2 h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-800">{getLocalizedText("welcome")}</h3>
              <p className="text-gray-600 mb-8 max-w-md">{getLocalizedText("description")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left h-auto p-4 whitespace-normal border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-green-500" />
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 mb-8 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-200">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="h-6 w-6 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-br-md"
                    : "bg-white border border-gray-200 rounded-bl-md"
                }`}
              >
                <div
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
                <div className="text-xs opacity-70 mt-2">{new Date(message.timestamp).toLocaleTimeString()}</div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-blue-200">
                  <AvatarFallback className="bg-transparent">
                    <User className="h-6 w-6 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-4 mb-8">
              <Avatar className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-200">
                <AvatarFallback className="bg-transparent">
                  <Bot className="h-6 w-6 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-lg p-4">
                <LoadingSpinner text="AgriGPT is thinking..." />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-green-50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder={getLocalizedText("placeholder")}
              value={input}
              onChange={handleInputChange}
              className="h-12 border-green-200 focus:border-green-400 rounded-xl pr-16"
              disabled={isLoading || rateLimitWarning}
              maxLength={500}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              {input.length}/500
            </div>
          </div>
          <Button type="button" variant="outline" size="icon" className="h-12 w-12 rounded-xl bg-transparent" disabled>
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !input.trim() || rateLimitWarning || input.length > 500}
            className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
          <Shield className="h-3 w-3 mr-1" />
          All messages are sanitized and secured
        </div>
      </div>
    </Card>
  )
}
