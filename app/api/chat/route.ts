import { GoogleGenerativeAI } from "@google/generative-ai"
import { Sanitizer, SECURITY_HEADERS } from "@/lib/sanitize"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyArIBPBpRHDPlRnmw8bQ3rhDyWVDLGKQJU")

// Rate limiter for chat requests
const chatRateLimiter = Sanitizer.createRateLimiter(20, 60000) // 20 requests per minute

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Sleep function for retry delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Fallback responses for different scenarios
const getFallbackResponse = (language: string, scenario: "overloaded" | "error" | "timeout") => {
  const responses = {
    overloaded: {
      hi: "<p><strong>सेवा व्यस्त है:</strong> AI सिस्टम अभी व्यस्त है। कृपया कुछ मिनट बाद पुनः प्रयास करें।</p><p><strong>सामान्य कृषि सलाह:</strong></p><ul><li>नियमित रूप से मिट्टी की जांच कराएं</li><li>मौसम के अनुसार फसल का चयन करें</li><li>जैविक खाद का उपयोग करें</li><li>पान��� की बचत करें</li></ul>",
      mr: "<p><strong>सेवा व्यस्त आहे:</strong> AI सिस्टम सध्या व्यस्त आहे. कृपया काही मिनिटांनंतर पुन्हा प्रयत्न करा.</p><p><strong>सामान्य शेती सल्ला:</strong></p><ul><li>नियमितपणे मातीची तपासणी करा</li><li>हवामानानुसार पिकाची निवड करा</li><li>सेंद्रिय खताचा वापर करा</li><li>पाण्याची बचत करा</li></ul>",
      gu: "<p><strong>સેવા વ્યસ્ત છે:</strong> AI સિસ્ટમ અત્યારે વ્યસ્ત છે. કૃપા કરીને થોડી મિનિટો પછી ફરી પ્રયાસ કરો.</p><p><strong>સામાન્ય કૃષિ સલાહ:</strong></p><ul><li>નિયમિત માટીની તપાસ કરાવો</li><li>હવામાન અનુસાર પાકની પસંદગી કરો</li><li>જૈવિક ખાતરનો ઉપયોગ કરો</li><li>પાણીની બચત કરો</li></ul>",
      pa: "<p><strong>ਸੇਵਾ ਵਿਅਸਤ ਹੈ:</strong> AI ਸਿਸਟਮ ਹੁਣ ਵਿਅਸਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਮਿੰਟਾਂ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।</p><p><strong>ਆਮ ਖੇਤੀ ਸਲਾਹ:</strong></p><ul><li>ਨਿਯਮਿਤ ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਕਰਾਓ</li><li>ਮੌਸਮ ਅਨੁਸਾਰ ਫਸਲ ਦੀ ਚੋਣ ਕਰੋ</li><li>ਜੈਵਿਕ ਖਾਦ ਦਾ ਵਰਤੋਂ ਕਰੋ</li><li>ਪਾਣੀ ਦੀ ਬਚਤ ਕਰੋ</li></ul>",
      ta: "<p><strong>சேவை பிஸியாக உள்ளது:</strong> AI அமைப்பு இப்போது பிஸியாக உள்ளது. தயவுசெய்து சில நிமிடங்கள் கழித்து மீண்டும் முயற்சிக்கவும்.</p><p><strong>பொதுவான விவசாய ஆலோசனை:</strong></p><ul><li>மண் பரிசோதனையை தொடர்ந்து செய்யுங்கள்</li><li>காலநிலைக்கு ஏற்ப பயிர் தேர்வு செய்யுங்கள்</li><li>இயற்கை உரம் பயன்படுத்துங்கள்</li><li>நீர் சேமிப்பு செய்யுங்கள்</li></ul>",
      te: "<p><strong>సేవ బిజీగా ఉంది:</strong> AI సిస్టమ్ ఇప్పుడు బిజీగా ఉంది. దయచేసి కొన్ని నిమిషాల తర్వాత మళ్లీ ప్రయత్నించండి.</p><p><strong>సాధారణ వ్యవసాయ సలహా:</strong></p><ul><li>క్రమం తప్పకుండా మట్టి పరీక్ష చేయించండి</li><li>వాతావరణం ప్రకారం పంట ఎంపిక చేయండి</li><li>సేంద్రీయ ఎరువులు వాడండి</li><li>నీటిని ఆదా చేయండి</li></ul>",
      kn: "<p><strong>ಸೇವೆ ಬ್ಯುಸಿಯಾಗಿದೆ:</strong> AI ಸಿಸ್ಟಂ ಈಗ ಬ್ಯುಸಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಕೆಲವು ನಿಮಿಷಗಳ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.</p><p><strong>ಸಾಮಾನ್ಯ ಕೃಷಿ ಸಲಹೆ:</strong></p><ul><li>ನಿಯಮಿತವಾಗಿ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ</li><li>ಹವಾಮಾನ ಪ್ರಕಾರ ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ</li><li>ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸಿ</li><li>ನೀರಿನ ಉಳಿತಾಯ ಮಾಡಿ</li></ul>",
      bn: "<p><strong>সেবা ব্যস্ত:</strong> AI সিস্টেম এখন ব্যস্ত। অনুগ্রহ করে কয়েক মিনিট পর আবার চেষ্টা করুন।</p><p><strong>সাধারণ কৃষি পরামর্শ:</strong></p><ul><li>নিয়মিত মাটি পরীক্ষা করান</li><li>আবহাওয়া অনুযায়ী ফসল নির্বাচন করুন</li><li>জৈব সার ব্যবহার করুন</li><li>পানি সাশ্রয় করুন</li></ul>",
      en: "<p><strong>Service Busy:</strong> The AI system is currently overloaded. Please try again in a few minutes.</p><p><strong>General Farming Advice:</strong></p><ul><li>Conduct regular soil testing</li><li>Choose crops according to weather conditions</li><li>Use organic fertilizers</li><li>Practice water conservation</li></ul>",
    },
    error: {
      hi: "<p><strong>तकनीकी समस्या:</strong> कुछ तकनीकी समस्या है। बुनियादी कृषि सलाह के लिए स्थानीय कृषि विशेषज्ञ से संपर्क करें।</p>",
      mr: "<p><strong>तांत्रिक समस्या:</strong> काही तांत्रिक समस्या आहे. मूलभूत शेती सल्ल्यासाठी स्थानिक कृषी तज्ञांशी संपर्क साधा.</p>",
      gu: "<p><strong>તકનીકી સમસ્યા:</strong> કોઈ તકનીકી સમસ્યા છે. મૂળભૂત કૃષિ સલાહ માટે સ્થાનિક કૃષિ નિષ્ણાતનો સંપર્ક કરો.</p>",
      pa: "<p><strong>ਤਕਨੀਕੀ ਸਮੱਸਿਆ:</strong> ਕੋਈ ਤਕਨੀਕੀ ਸਮੱਸਿਆ ਹੈ। ਬੁਨਿਆਦੀ ਖੇਤੀ ਸਲਾਹ ਲਈ ਸਥਾਨਕ ਖੇਤੀ ਮਾਹਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।</p>",
      ta: "<p><strong>தொழில்நுட்ப சிக்கல்:</strong> சில தொழில்நுட்ப சிக்கல் உள்ளது. அடிப்படை விவசாய ஆலோசனைக்கு உள்ளூர் விவசாய நிபுணரை தொடர்பு கொள்ளுங்கள்.</p>",
      te: "<p><strong>సాంకేతిక సమస్య:</strong> కొంత సాంకేతిక సమస్య ఉంది. ప్రాథమిక వ్యవసాయ సలహా కోసం స్థానిక వ్యవసాయ నిపుణుడిని సంప్రదించండి.</p>",
      kn: "<p><strong>ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆ:</strong> ಕೆಲವು ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆ ಇದೆ. ಮೂಲಭೂತ ಕೃಷಿ ಸಲಹೆಗಾಗಿ ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.</p>",
      bn: "<p><strong>প্রযুক্তিগত সমস্যা:</strong> কিছু প্রযুক্তিগত সমস্যা আছে। মৌলিক কৃষি পরামর্শের জন্য স্থানীয় কৃষি বিশেষজ্ঞের সাথে যোগাযোগ করুন।</p>",
      en: "<p><strong>Technical Issue:</strong> There's a technical problem. Please contact local agricultural experts for basic farming advice.</p>",
    },
    timeout: {
      hi: "<p><strong>समय समाप्त:</strong> प्रतिक्रिया में देरी हो रही है। कृपया छोटे प्रश्न पूछें या बाद में पुनः प्रयास करें।</p>",
      mr: "<p><strong>वेळ संपली:</strong> प्रतिसादात विलंब होत आहे. कृपया लहान प्रश्न विचारा किंवा नंतर पुन्हा प्रयत्न करा.</p>",
      gu: "<p><strong>સમય સમાપ્ત:</strong> પ્રતિસાદમાં વિલંબ થઈ રહ્યો છે. કૃપા કરીને નાના પ્રશ્નો પૂછો અથવા પછીથી ફરી પ્રયાસ કરો.</p>",
      pa: "<p><strong>ਸਮਾਂ ਸਮਾਪਤ:</strong> ਜਵਾਬ ਵਿੱਚ ਦੇਰੀ ਹੋ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਛੋਟੇ ਸਵਾਲ ਪੁੱਛੋ ਜਾਂ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।</p>",
      ta: "<p><strong>நேரம் முடிந்தது:</strong> பதிலில் தாமதம் ஏற்பட்டுள்ளது. தயவுசெய்து சிறிய கேள்விகள் கேளுங்கள் அல்லது பின்னர் முயற்சிக்கவும்.</p>",
      te: "<p><strong>సమయం ముగిసింది:</strong> ప్రతిస్పందనలో ఆలస్యం అవుతోంది. దయచేసి చిన్న ప్రశ్నలు అడగండి లేదా తర్వాత మళ్లీ ప్రయత్నించండి.</p>",
      kn: "<p><strong>ಸಮಯ ಮುಗಿದಿದೆ:</strong> ಪ್ರತಿಕ್ರಿಯೆಯಲ್ಲಿ ವಿಳಂಬವಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಸಣ್ಣ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಅಥವಾ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.</p>",
      bn: "<p><strong>সময় শেষ:</strong> প্রতিক্রিয়ায় বিলম্ব হচ্ছে। অনুগ্রহ করে ছোট প্রশ্ন করুন বা পরে আবার চেষ্টা করুন।</p>",
      en: "<p><strong>Timeout:</strong> Response is taking too long. Please ask shorter questions or try again later.</p>",
    },
  }

  return responses[scenario][language as keyof (typeof responses)[typeof scenario]] || responses[scenario].en
}

// Enhanced retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  baseDelay: number = RETRY_DELAY,
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry on certain error types
      if (error.message?.includes("API key") || error.message?.includes("authentication")) {
        throw error
      }

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error
      }

      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
      await sleep(delay)
    }
  }

  throw lastError!
}

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"

    // Apply rate limiting
    if (!chatRateLimiter(clientIP)) {
      return Response.json(
        { error: "Too many requests. Please wait before sending another message." },
        { status: 429, headers: SECURITY_HEADERS },
      )
    }

    const body = await req.json()
    const { message, location, language } = body

    // Comprehensive input sanitization
    const sanitizedMessage = Sanitizer.sanitizeInput(message)
    const sanitizedLocation = Sanitizer.sanitizeLocation(location || "")
    const sanitizedLanguage = Sanitizer.sanitizeLanguageCode(language || "en")

    // Validate inputs
    if (!sanitizedMessage || sanitizedMessage.length < 2) {
      return Response.json({ error: "Please provide a valid message." }, { status: 400, headers: SECURITY_HEADERS })
    }

    if (sanitizedMessage.length > 500) {
      return Response.json(
        { error: "Message too long. Please keep it under 500 characters." },
        { status: 400, headers: SECURITY_HEADERS },
      )
    }

    // Language-specific prompts with security considerations
    const languageInstructions = {
      hi: "कृपया हिंदी में उत्तर दें। आप एक भारतीय कृषि विशेषज्ञ हैं। केवल कृषि संबंधी प्रश्नों का उत्तर दें।",
      mr: "कृपया मराठीत उत्तर द्या। तुम्ही एक भारतीय कृषी तज्ञ आहात। फक्त शेतीशी संबंधित प्रश्नांची उत्तरे द्या।",
      gu: "કૃપા કરીને ગુજરાતીમાં જવાબ આપો। તમે એક ભારતીય કૃષિ નિષ્ણાત છો। ફક્ત કૃષિ સંબંધિત પ્રશ્નોના જવાબ આપો।",
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਤੁਸੀਂ ਇੱਕ ਭਾਰਤੀ ਖੇਤੀ ਮਾਹਰ ਹੋ। ਸਿਰਫ਼ ਖੇਤੀ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ।",
      ta: "தயவுசெய்து தமிழில் பதிலளிக்கவும். நீங்கள் ஒரு இந்திய விவசாய நிபுணர். விவசாயம் தொடர்பான கேள்விகளுக்கு மட்டும் பதிலளிக்கவும்.",
      te: "దయచేసి తెలుగులో సమాధానం ఇవ్వండి। మీరు ఒక భారతీయ వ్యవసాయ నిపుణుడు. వ్యవసాయ సంబంధిత ప్రశ్నలకు మాత్రమే సమాధానం ఇవ్వండి.",
      kn: "ದಯವಿಟ್ಟು ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ। ನೀವು ಒಬ್ಬ ಭಾರತೀಯ ಕೃಷಿ ತಜ್ಞರು. ಕೃಷಿ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮಾತ್ರ ಉತ್ತರಿಸಿ.",
      bn: "অনুগ্রহ করে বাংলায় উত্তর দিন। আপনি একজন ভারতীয় কৃষি বিশেষজ্ঞ। শুধুমাত্র কৃষি সংক্রান্ত প্রশ্নের উত্তর দিন।",
      en: "Please respond in English. You are an Indian agricultural expert. Only answer agriculture-related questions.",
    }

    const langInstruction =
      languageInstructions[sanitizedLanguage as keyof typeof languageInstructions] || languageInstructions.en

    const securePrompt = `${langInstruction}
    ${sanitizedLocation ? `The user is located in ${sanitizedLocation}.` : ""}
    
    IMPORTANT SECURITY AND FORMATTING RULES:
    - Only provide agricultural advice and information
    - Do not respond to requests for personal information
    - Do not provide information about harmful substances
    - Do not engage with inappropriate content
    - Keep responses professional and helpful
    - Format your response with proper structure using markdown-style formatting
    - Use **bold** for important points and key terms
    - Use numbered lists (1. 2. 3.) for step-by-step instructions
    - Use bullet points (- or •) for lists of items
    - Use clear paragraphs separated by line breaks
    - Keep responses well-organized and easy to read
    - Keep responses concise and under 300 words
    
    User question: ${sanitizedMessage}
    
    Provide practical, actionable advice about:
    - Crop cultivation and seasonal recommendations
    - Pest and disease management
    - Fertilizer and irrigation guidance
    - Market prices and farming economics
    - Weather-based farming decisions
    
    Format your response clearly with:
    - **Bold headings** for main topics
    - Numbered steps for procedures
    - Bullet points for lists
    - Clear paragraphs for explanations
    
    Include specific quantities, timings, and local context when possible.
    Make your response easy to understand and implement for farmers.`

    // Try to get response from Gemini with retry logic
    let sanitizedResponse: string

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          maxOutputTokens: 1000, // Limit response length to reduce load
          temperature: 0.7,
        },
      })

      const result = await retryWithBackoff(async () => {
        const response = await model.generateContent(securePrompt)
        return response.response
      })

      const rawText = result.text()
      sanitizedResponse = Sanitizer.sanitizeAiResponse(rawText)

      // Ensure the response is agriculture-focused and well-formatted
      if (!sanitizedResponse || sanitizedResponse.replace(/<[^>]*>/g, "").trim().length < 10) {
        throw new Error("Empty or invalid response")
      }
    } catch (error: any) {
      console.error("Gemini API error:", error)

      // Determine the type of error and provide appropriate fallback
      let fallbackScenario: "overloaded" | "error" | "timeout" = "error"

      if (error.message?.includes("overloaded") || error.message?.includes("503")) {
        fallbackScenario = "overloaded"
      } else if (error.message?.includes("timeout") || error.message?.includes("TIMEOUT")) {
        fallbackScenario = "timeout"
      }

      sanitizedResponse = getFallbackResponse(sanitizedLanguage, fallbackScenario)
    }

    return Response.json({ message: sanitizedResponse }, { headers: SECURITY_HEADERS })
  } catch (error) {
    console.error("Chat API error:", error)

    const body = await req.json().catch(() => ({}))
    const language = Sanitizer.sanitizeLanguageCode(body.language || "en")
    const fallbackMessage = getFallbackResponse(language, "error")

    return Response.json({ message: fallbackMessage }, { status: 500, headers: SECURITY_HEADERS })
  }
}
