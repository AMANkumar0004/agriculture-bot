"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Wind, Eye, Cloud, Sun, CloudRain, Search, MapPin, Gauge } from "lucide-react"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface WeatherData {
  location: string
  country: string
  temperature: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  pressure: number
  feelsLike: number
  visibility: number
  forecast: Array<{
    time: string
    temp: number
    description: string
    icon: string
  }>
}

interface WeatherSectionProps {
  location: { lat: number; lon: number } | null
  language?: Language | null
}

export function WeatherSection({ location, language }: WeatherSectionProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState("")

  useEffect(() => {
    fetchWeather()
  }, [location])

  const fetchWeather = async (city?: string) => {
    setLoading(true)
    try {
      let url = "/api/weather"

      if (city) {
        url = `/api/weather?city=${encodeURIComponent(city)}`
      } else if (location) {
        url = `/api/weather?lat=${location.lat}&lon=${location.lon}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setWeather(data)
    } catch (error) {
      console.error("Failed to fetch weather:", error)
      // Set fallback weather data
      setWeather({
        location: city || "Delhi",
        country: "IN",
        temperature: 28,
        humidity: 65,
        description: "partly cloudy",
        icon: "02d",
        windSpeed: 12,
        pressure: 1013,
        feelsLike: 30,
        visibility: 10,
        forecast: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim())
      setSearchCity("")
    }
  }

  const getLocalizedText = (key: string) => {
    const texts = {
      title: {
        hi: "मौसम जानकारी",
        mr: "हवामान माहिती",
        gu: "હવામાન માહિતી",
        pa: "ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ",
        ta: "வானிலை தகவல்",
        te: "వాతావరణ సమాచారం",
        kn: "ಹವಾಮಾನ ಮಾಹಿತಿ",
        bn: "আবহাওয়ার তথ্য",
        en: "Weather Intelligence",
      },
      subtitle: {
        hi: "कृषि सिफारिशों के साथ वास्तविक समय मौसम डेटा",
        mr: "शेती शिफारशींसह रिअल-टाइम हवामान डेटा",
        gu: "કૃષિ ભલામણો સાથે રીઅલ-ટાઇમ હવામાન ડેટા",
        pa: "ਖੇਤੀ ਸਿਫਾਰਸ਼ਾਂ ਦੇ ਨਾਲ ਰੀਅਲ-ਟਾਈਮ ਮੌਸਮ ਡੇਟਾ",
        ta: "விவசாய பரிந்துரைகளுடன் நிகழ்நேர வானிலை தரவு",
        te: "వ్యవసాయ సిఫార్సులతో రియల్-టైమ్ వాతావరణ డేటా",
        kn: "ಕೃಷಿ ಶಿಫಾರಸುಗಳೊಂದಿಗೆ ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ಡೇಟಾ",
        bn: "কৃষি সুপারিশ সহ রিয়েল-টাইম আবহাওয়া ডেটা",
        en: "Real-time weather data with farming recommendations",
      },
      searchPlaceholder: {
        hi: "शहर खोजें...",
        mr: "शहर शोधा...",
        gu: "શહેર શોધો...",
        pa: "ਸ਼ਹਿਰ ਖੋਜੋ...",
        ta: "நகரத்தைத் தேடுங்கள்...",
        te: "నగరాన్ని వెతకండి...",
        kn: "ನಗರವನ್ನು ಹುಡುಕಿ...",
        bn: "শহর খুঁজুন...",
        en: "Search city...",
      },
      humidity: {
        hi: "आर्द्रता",
        mr: "आर्द्रता",
        gu: "ભેજ",
        pa: "ਨਮੀ",
        ta: "ஈரப்பதம்",
        te: "తేమ",
        kn: "ಆರ್ದ್ರತೆ",
        bn: "আর্দ্রতা",
        en: "Humidity",
      },
      windSpeed: {
        hi: "हवा की गति",
        mr: "वाऱ्याचा वेग",
        gu: "પવનની ઝડપ",
        pa: "ਹਵਾ ਦੀ ਗਤੀ",
        ta: "காற்றின் வேகம்",
        te: "గాలి వేగం",
        kn: "ಗಾಳಿಯ ವೇಗ",
        bn: "বাতাসের গতি",
        en: "Wind Speed",
      },
      pressure: {
        hi: "दबाव",
        mr: "दाब",
        gu: "દબાણ",
        pa: "ਦਬਾਅ",
        ta: "அழுத்தம்",
        te: "ఒత్తిడి",
        kn: "ಒತ್ತಡ",
        bn: "চাপ",
        en: "Pressure",
      },
      visibility: {
        hi: "दृश्यता",
        mr: "दृश्यता",
        gu: "દૃશ્યતા",
        pa: "ਦਿੱਖ",
        ta: "பார்வை",
        te: "దృశ్యత",
        kn: "ಗೋಚರತೆ",
        bn: "দৃশ্যমানতা",
        en: "Visibility",
      },
      feelsLike: {
        hi: "महसूस होता है",
        mr: "जाणवते",
        gu: "લાગે છે",
        pa: "ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ",
        ta: "உணர்கிறது",
        te: "అనిపిస్తుంది",
        kn: "ಅನಿಸುತ್ತದೆ",
        bn: "মনে হচ্ছে",
        en: "Feels Like",
      },
      todaysForecast: {
        hi: "आज का पूर्वानुमान",
        mr: "आजचा अंदाज",
        gu: "આજનું આગાહી",
        pa: "ਅੱਜ ਦਾ ਪੂਰਵਾਨੁਮਾਨ",
        ta: "இன்றைய முன்னறிவிப்பு",
        te: "నేటి అంచనా",
        kn: "ಇಂದಿನ ಮುನ್ಸೂಚನೆ",
        bn: "আজকের পূর্বাভাস",
        en: "Today's Forecast",
      },
      farmingAdvice: {
        hi: "स्मार्ट कृषि सलाह",
        mr: "स्मार्ट शेती सल्ला",
        gu: "સ્માર્ટ કૃષિ સલાહ",
        pa: "ਸਮਾਰਟ ਖੇਤੀ ਸਲਾਹ",
        ta: "ஸ்மார்ட் விவசாய ஆலோசனை",
        te: "స్మార్ట్ వ్యవసాయ సలహా",
        kn: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಲಹೆ",
        bn: "স্মার্ট কৃষি পরামর্শ",
        en: "Smart Farming Advice",
      },
    }

    const langCode = language?.code || "en"
    return (
      texts[key as keyof typeof texts]?.[langCode as keyof (typeof texts)[keyof typeof texts]] ||
      texts[key as keyof typeof texts]?.en ||
      ""
    )
  }

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes("01")) return <Sun className="h-8 w-8 text-yellow-500" />
    if (iconCode.includes("02") || iconCode.includes("03") || iconCode.includes("04"))
      return <Cloud className="h-8 w-8 text-gray-500" />
    if (iconCode.includes("09") || iconCode.includes("10") || iconCode.includes("11"))
      return <CloudRain className="h-8 w-8 text-blue-500" />
    return <Cloud className="h-8 w-8 text-gray-500" />
  }

  const getFarmingAdvice = (weather: WeatherData) => {
    const adviceTexts = {
      highHumidity: {
        hi: "उच्च आर्द्रता का पता चला - फंगल रोगों के लिए फसलों की निगरानी करें। आज सिंचाई से बचें।",
        mr: "उच्च आर्द्रता आढळली - बुरशीजन्य रोगांसाठी पिकांचे निरीक्षण करा। आज पाणी देणे टाळा।",
        gu: "ઊંચી ભેજ મળી - ફૂગના રોગો માટે પાકોનું નિરીક્ષણ કરો. આજે સિંચાઈ ટાળો.",
        pa: "ਉੱਚੀ ਨਮੀ ਮਿਲੀ - ਫੰਗਲ ਬਿਮਾਰੀਆਂ ਲਈ ਫਸਲਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ। ਅੱਜ ਸਿੰਚਾਈ ਤੋਂ ਬਚੋ।",
        ta: "அதிக ஈரப்பதம் கண்டறியப்பட்டது - பூஞ்சை நோய்களுக்கு பயிர்களை கண்காணிக்கவும். இன்று நீர்ப்பாசனம் தவிர்க்கவும்.",
        te: "అధిక తేమ గుర్తించబడింది - ఫంగల్ వ్యాధుల కోసం పంటలను పర్యవేక్షించండి. ఈరోజు నీటిపారుదల తప్పించండి.",
        kn: "ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ ಪತ್ತೆಯಾಗಿದೆ - ಶಿಲೀಂಧ್ರ ರೋಗಗಳಿಗಾಗಿ ಬೆಳೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ. ಇಂದು ನೀರಾವರಿ ತಪ್ಪಿಸಿ.",
        bn: "উচ্চ আর্দ্রতা সনাক্ত - ছত্রাক রোগের জন্য ফসল পর্যবেক্ষণ করুন। আজ সেচ এড়িয়ে চলুন।",
        en: "High humidity detected - Monitor crops for fungal diseases. Avoid irrigation today.",
      },
      highTemperature: {
        hi: "उच्च तাপमान चेतावणी - संवেদनशील फसलों के लिए छाया प्रदान करें। सुबह जल्दी पानी दें।",
        mr: "उच्च तापमान चेतावणी - संवेदनशील पिकांसाठी सावली द्या। सकाळी लवकर पाणी द्या।",
        gu: "ઊંચા તાપમાનની ચેતવણી - સંવેદનશીલ પાકો માટે છાંયો પ્રદાન કરો. વહેલી સવારે પાણી આપો.",
        pa: "ਉੱਚ ਤਾਪਮਾਨ ਚੇਤਾਵਨੀ - ਸੰਵੇਦਨਸ਼ੀਲ ਫਸਲਾਂ ਲਈ ਛਾਂ ਪ੍ਰਦਾਨ ਕਰੋ। ਸਵੇਰੇ ਜਲਦੀ ਪਾਣੀ ਦਿਓ।",
        ta: "அதிக வெப்பநிலை எச்சரிக்கை - உணர்திறன் பயிர்களுக்கு நிழல் வழங்கவும். அதிகாலையில் தண்ணீர் கொடுங்கள்.",
        te: "అధిక ఉష్ణోగ్రత హెచ్చరిక - సున్నితమైన పంటలకు నీడ అందించండి. తెల్లవారుజామున నీరు ఇవ్వండి.",
        kn: "ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಎಚ್ಚರಿಕೆ - ಸೂಕ್ಷ್ಮ ಬೆಳೆಗಳಿಗೆ ನೆರಳು ಒದಗಿಸಿ. ಮುಂಜಾನೆ ನೀರು ಕೊಡಿ.",
        bn: "উচ্চ তাপমাত্রার সতর্কতা - সংবেদনশীল ফসলের জন্য ছায়া প্রদান করুন। ভোরে পানি দিন।",
        en: "High temperature alert - Provide shade for sensitive crops. Water early morning.",
      },
      rainExpected: {
        hi: "बारिश की उम्मीद - बारिश पर निर्भर फसलों के लिए अच्छा। कीटनाशक छिड़काव स्थगित करें।",
        mr: "पावसाची अपेक्षा - पावसावर अवलंबून असलेल्या पिकांसाठी चांगले। कीटकनाशक फवारणी पुढे ढकला।",
        gu: "વરસાદની અપેક્ષા - વરસાદ પર આધારિત પાકો માટે સારું. જંતુનાશક છંટકાવ મુલતવી રાખો.",
        pa: "ਬਾਰਿਸ਼ ਦੀ ਉਮੀਦ - ਬਾਰਿਸ਼ 'ਤੇ ਨਿਰਭਰ ਫਸਲਾਂ ਲਈ ਚੰਗਾ। ਕੀੜੇਮਾਰ ਛਿੜਕਾਅ ਮੁਲਤਵੀ ਕਰੋ।",
        ta: "மழை எதிர்பார்க்கப்படுகிறது - மழை சார்ந்த பயிர்களுக்கு நல்லது. பூச்சிக்கொல்லி தெளிப்பை ஒத்திவைக்கவும்.",
        te: "వర్షం ఆశించబడుతోంది - వర్షంపై ఆధారపడిన పంటలకు మంచిది. పురుగుమందు చల్లడం వాయిదా వేయండి.",
        kn: "ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ - ಮಳೆ ಆಧಾರಿತ ಬೆಳೆಗಳಿಗೆ ಒಳ್ಳೆಯದು. ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸುವಿಕೆಯನ್ನು ಮುಂದೂಡಿ.",
        bn: "বৃষ্টি প্রত্যাশিত - বৃষ্টি নির্ভর ফসলের জন্য ভাল। কীটনাশক স্প্রে স্থগিত করুন।",
        en: "Rain expected - Good for rain-fed crops. Postpone pesticide application.",
      },
      strongWinds: {
        hi: "तेज हवाएं - लंबी फसलों को सुरक्षित करें और छिड़काव कार्य से बचें।",
        mr: "जोरदार वारे - उंच पिकांना सुरक्षित करा आणि फवारणी कामे टाळा।",
        gu: "જોરદાર પવન - ઊંચા પાકોને સુરક્ષિત કરો અને છંટકાવ કામ ટાળો.",
        pa: "ਤੇਜ਼ ਹਵਾਵਾਂ - ਲੰਬੀਆਂ ਫਸਲਾਂ ਨੂੰ ਸੁਰੱਖਿਤ ਕਰੋ ਅਤੇ ਛਿੜਕਾਅ ਕੰਮ ਤੋਂ ਬਚੋ।",
        ta: "வலுவான காற்று - உயரமான பயிர்களை பாதுகாக்கவும் மற்றும் தெளிக்கும் வேலைகளை தவிர்க்கவும்.",
        te: "బలమైన గాలులు - పొడవైన పంటలను భద్రపరచండి మరియు స్ప్రే పనులను తప్పించండి.",
        kn: "ಬಲವಾದ ಗಾಳಿ - ಎತ್ತರದ ಬೆಳೆಗಳನ್ನು ಭದ್ರಪಡಿಸಿ ಮತ್ತು ಸಿಂಪಡಿಸುವ ಕೆಲಸಗಳನ್ನು ತಪ್ಪಿಸಿ.",
        bn: "শক্তিশালী বাতাস - লম্বা ফসল সুরক্ষিত করুন এবং স্প্রে কাজ এড়িয়ে চলুন।",
        en: "Strong winds - Secure tall crops and avoid spraying operations.",
      },
      goodConditions: {
        hi: "अधिकांश कृषि गतिविधियों के लिए अच्छी मौसम स्थितियां।",
        mr: "बहुतेक शेती क्रियाकलापांसाठी चांगली हवामान परिस्थिती।",
        gu: "મોટાભાગની કૃષિ પ્રવૃત્તિઓ માટે સારી હવામાન પરિસ્થિતિઓ.",
        pa: "ਜ਼ਿਆਦਾਤਰ ਖੇਤੀ ਗਤੀਵਿਧੀਆਂ ਲਈ ਚੰਗੀ ਮੌਸਮ ਸਥਿਤੀ।",
        ta: "பெரும்பாலான விவசாய நடவடிக்கைகளுக்கு நல்ல வானிலை நிலைமைகள்.",
        te: "చాలా వ్యవసాయ కార్యకలాపాలకు మంచి వాతావరణ పరిస్థితులు.",
        kn: "ಹೆಚ್ಚಿನ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳಿಗೆ ಉತ್ತಮ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು.",
        bn: "বেশিরভাগ কৃষি কার্যক্রমের জন্য ভাল আবহাওয়া পরিস্থিতি।",
        en: "Good weather conditions for most farming activities.",
      },
    }

    const langCode = language?.code || "en"

    if (weather.humidity > 80) {
      return adviceTexts.highHumidity[langCode as keyof typeof adviceTexts.highHumidity] || adviceTexts.highHumidity.en
    }
    if (weather.temperature > 35) {
      return (
        adviceTexts.highTemperature[langCode as keyof typeof adviceTexts.highTemperature] ||
        adviceTexts.highTemperature.en
      )
    }
    if (weather.description.includes("rain")) {
      return adviceTexts.rainExpected[langCode as keyof typeof adviceTexts.rainExpected] || adviceTexts.rainExpected.en
    }
    if (weather.windSpeed > 25) {
      return adviceTexts.strongWinds[langCode as keyof typeof adviceTexts.strongWinds] || adviceTexts.strongWinds.en
    }
    return (
      adviceTexts.goodConditions[langCode as keyof typeof adviceTexts.goodConditions] || adviceTexts.goodConditions.en
    )
  }

  if (loading) {
    return (
      <section id="weather" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-center">{getLocalizedText("title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (!weather) return null

  return (
    <section id="weather" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">{getLocalizedText("title")}</h2>
          <p className="text-xl text-blue-600">{getLocalizedText("subtitle")}</p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Search Bar */}
            <div className="flex gap-2 mb-8">
              <Input
                placeholder={getLocalizedText("searchPlaceholder")}
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Weather */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                {getWeatherIcon(weather.icon)}
                <div>
                  <h3 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    {weather.location}, {weather.country}
                  </h3>
                  <p className="text-blue-600 capitalize">{weather.description}</p>
                </div>
              </div>

              <div className="text-6xl font-bold text-blue-600 mb-2">{weather.temperature}°C</div>
              <div className="text-lg text-gray-600">
                {getLocalizedText("feelsLike")} {weather.feelsLike}°C
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">{weather.humidity}%</div>
                <div className="text-sm text-blue-600">{getLocalizedText("humidity")}</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <Wind className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{weather.windSpeed} km/h</div>
                <div className="text-sm text-green-600">{getLocalizedText("windSpeed")}</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <Gauge className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">{weather.pressure} hPa</div>
                <div className="text-sm text-purple-600">{getLocalizedText("pressure")}</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                <Eye className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-800">{weather.visibility} km</div>
                <div className="text-sm text-yellow-600">{getLocalizedText("visibility")}</div>
              </div>
            </div>

            {/* Forecast */}
            {weather.forecast && weather.forecast.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-blue-800 mb-4">{getLocalizedText("todaysForecast")}</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {weather.forecast.map((item, index) => (
                    <div key={index} className="text-center p-3 bg-white rounded-lg shadow-md">
                      <div className="text-sm text-gray-600 mb-1">{item.time}</div>
                      <div className="flex justify-center mb-2">{getWeatherIcon(item.icon)}</div>
                      <div className="font-bold text-blue-800">{item.temp}°C</div>
                      <div className="text-xs text-gray-600 capitalize">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Farming Advice */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                {getLocalizedText("farmingAdvice")}
              </h4>
              <p className="text-green-700 leading-relaxed">{getFarmingAdvice(weather)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
