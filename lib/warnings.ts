// Spoken interrupt warnings, keyed by ElevenLabs/ISO-ish language codes we expect back
// from classify's detected_language field. Falls back to Hindi-English code-mixed,
// which is the most common register for these scam calls in India.

export const WARNING_TEXT: Record<string, string> = {
  en: "Warning. This call matches the pattern of a digital arrest scam. No Indian police, CBI, ED, or RBI officer ever arrests you or demands money over a phone or video call. Hang up now and call 1930 to report it.",
  hi: "चेतावनी। यह कॉल डिजिटल अरेस्ट स्कैम जैसा लग रहा है। कोई भी भारतीय पुलिस, सीबीआई, ईडी या आरबीआई अधिकारी फ़ोन या वीडियो कॉल पर आपको गिरफ़्तार नहीं करता और न ही पैसे माँगता है। अभी कॉल काटें और 1930 पर रिपोर्ट करें।",
  "hi-en": "चेतावनी। यह कॉल डिजिटल अरेस्ट स्कैम जैसा लग रहा है। कोई भी भारतीय पुलिस, सीबीआई, ईडी या आरबीआई अधिकारी फ़ोन या वीडियो कॉल पर आपको गिरफ़्तार नहीं करता। अभी कॉल काटें और 1930 पर रिपोर्ट करें।",
  mr: "इशारा। हा कॉल डिजिटल अरेस्ट घोटाळ्यासारखा दिसतो. कोणताही भारतीय पोलीस, सीबीआय, ईडी किंवा आरबीआय अधिकारी फोन किंवा व्हिडिओ कॉलवर तुम्हाला अटक करत नाही किंवा पैसे मागत नाही. आत्ताच कॉल बंद करा आणि 1930 वर तक्रार करा.",
  ta: "எச்சரிக்கை. இந்த அழைப்பு டிஜிட்டல் அரெஸ்ட் மோசடி போல் தெரிகிறது. எந்த இந்திய போலீஸ், சிபிஐ, ஈடி அல்லது ஆர்பிஐ அதிகாரியும் தொலைபேசி அல்லது வீடியோ அழைப்பில் உங்களை கைது செய்ய மாட்டார்கள். இப்போதே அழைப்பை துண்டித்து 1930-ஐ அழையுங்கள்.",
  te: "హెచ్చరిక. ఈ కాల్ డిజిటల్ అరెస్ట్ మోసంలా కనిపిస్తోంది. ఏ భారతీయ పోలీసు, సిబిఐ, ఇడి లేదా ఆర్‌బిఐ అధికారి ఫోన్ లేదా వీడియో కాల్‌లో మిమ్మల్ని అరెస్ట్ చేయరు. వెంటనే కాల్ కట్ చేసి 1930కి ఫిర్యాదు చేయండి.",
  kn: "ಎಚ್ಚರಿಕೆ. ಈ ಕರೆ ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್ ವಂಚನೆಯಂತೆ ಕಾಣುತ್ತಿದೆ. ಯಾವುದೇ ಭಾರತೀಯ ಪೊಲೀಸ್, ಸಿಬಿಐ, ಇಡಿ ಅಥವಾ ಆರ್‌ಬಿಐ ಅಧಿಕಾರಿ ಫೋನ್ ಅಥವಾ ವಿಡಿಯೋ ಕರೆಯಲ್ಲಿ ನಿಮ್ಮನ್ನು ಬಂಧಿಸುವುದಿಲ್ಲ. ಈಗಲೇ ಕರೆ ಕಡಿತಗೊಳಿಸಿ 1930 ಗೆ ವರದಿ ಮಾಡಿ.",
  bn: "সতর্কতা। এই কলটি ডিজিটাল অ্যারেস্ট প্রতারণার মতো মনে হচ্ছে। কোনো ভারতীয় পুলিশ, সিবিআই, ইডি বা আরবিআই কর্মকর্তা ফোন বা ভিডিও কলে আপনাকে গ্রেপ্তার করে না বা টাকা চায় না। এখনই কল কেটে দিন এবং 1930 নম্বরে রিপোর্ট করুন।",
};

export function warningTextFor(language: string): string {
  const key = language.toLowerCase().trim();
  if (WARNING_TEXT[key]) return WARNING_TEXT[key];
  const short = key.split("-")[0];
  if (WARNING_TEXT[short]) return WARNING_TEXT[short];
  return WARNING_TEXT["hi-en"];
}
