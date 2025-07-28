const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Language detection function
const detectLanguage = (text) => {
  // First, check for character-based languages (most reliable)
  const hasChinese = /[\u4e00-\u9fff]/.test(text);
  const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
  const hasKorean = /[\uac00-\ud7af]/.test(text);
  const hasArabic = /[\u0600-\u06ff]/.test(text);
  const hasCyrillic = /[\u0400-\u04ff]/.test(text);

  // Check for Japanese-specific characters (hiragana and katakana)
  const hasHiragana = /[\u3040-\u309f]/.test(text);
  const hasKatakana = /[\u30a0-\u30ff]/.test(text);
  
  // If text has Japanese-specific characters, prioritize Japanese
  if (hasHiragana || hasKatakana) {
    return 'ja';
  }
  
  // If text has Chinese characters but no Japanese-specific characters
  if (hasChinese && !hasHiragana && !hasKatakana) {
    return 'zh';
  }
  
  if (hasKorean) return 'ko';
  if (hasArabic) return 'ar';
  if (hasCyrillic) return 'ru';

  // For Latin-based languages, use more comprehensive word lists
  const commonWords = {
    en: ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'this', 'that', 'these', 'those', 'what', 'when', 'where', 'why', 'how', 'who', 'which', 'whose', 'whom', 'hello', 'hi', 'hey', 'good', 'bad', 'yes', 'no', 'please', 'thank', 'sorry', 'okay', 'ok', 'fine', 'well', 'very', 'much', 'many', 'some', 'any', 'all', 'every', 'each', 'both', 'either', 'neither', 'none', 'nothing', 'something', 'anything', 'everything'],
    es: ['el', 'la', 'los', 'las', 'y', 'o', 'pero', 'en', 'con', 'por', 'para', 'de', 'del', 'un', 'una', 'unos', 'unas', 'es', 'son', 'era', 'eran', 'está', 'están', 'tiene', 'tienen', 'había', 'habían', 'será', 'serán', 'puede', 'pueden', 'debe', 'deben', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'qué', 'cuándo', 'dónde', 'por qué', 'cómo', 'quién', 'cuál', 'cuyo', 'quien', 'hola', 'buenos', 'días', 'buenas', 'tardes', 'noches', 'gracias', 'por favor', 'perdón', 'lo siento', 'vale', 'bien', 'mal', 'sí', 'no', 'muy', 'mucho', 'muchos', 'pocos', 'algunos', 'ningún', 'todo', 'todos', 'cada', 'ambos', 'ninguno', 'nada', 'algo', 'todo'],
    fr: ['le', 'la', 'les', 'et', 'ou', 'mais', 'dans', 'avec', 'pour', 'de', 'du', 'des', 'un', 'une', 'des', 'est', 'sont', 'était', 'étaient', 'a', 'ont', 'avait', 'avaient', 'sera', 'seront', 'peut', 'peuvent', 'doit', 'doivent', 'ce', 'cette', 'ces', 'que', 'qui', 'quoi', 'quand', 'où', 'pourquoi', 'comment', 'quel', 'quelle', 'quels', 'quelles', 'bonjour', 'salut', 'bonsoir', 'merci', 's\'il vous plaît', 'pardon', 'désolé', 'd\'accord', 'ok', 'bien', 'mal', 'oui', 'non', 'très', 'beaucoup', 'peu', 'quelques', 'aucun', 'tout', 'tous', 'chaque', 'les deux', 'aucun', 'rien', 'quelque chose', 'tout'],
    de: ['der', 'die', 'das', 'und', 'oder', 'aber', 'in', 'mit', 'für', 'von', 'zu', 'an', 'ein', 'eine', 'eines', 'einer', 'ist', 'sind', 'war', 'waren', 'hat', 'haben', 'hatte', 'hatten', 'wird', 'werden', 'kann', 'können', 'muss', 'müssen', 'soll', 'sollen', 'dieser', 'diese', 'dieses', 'was', 'wann', 'wo', 'warum', 'wie', 'wer', 'welcher', 'welche', 'welches', 'hallo', 'guten', 'tag', 'morgen', 'abend', 'danke', 'bitte', 'entschuldigung', 'tut mir leid', 'okay', 'gut', 'schlecht', 'ja', 'nein', 'sehr', 'viel', 'wenig', 'einige', 'kein', 'alle', 'jeder', 'beide', 'keiner', 'nichts', 'etwas', 'alles'],
    it: ['il', 'la', 'gli', 'le', 'e', 'o', 'ma', 'in', 'con', 'per', 'di', 'da', 'un', 'una', 'uno', 'è', 'sono', 'era', 'erano', 'ha', 'hanno', 'aveva', 'avevano', 'sarà', 'saranno', 'può', 'possono', 'deve', 'devono', 'dovrebbe', 'dovrebbero', 'questo', 'questa', 'questi', 'queste', 'che', 'cosa', 'quando', 'dove', 'perché', 'come', 'chi', 'quale', 'cui', 'ciao', 'buongiorno', 'buonasera', 'grazie', 'per favore', 'scusa', 'mi dispiace', 'va bene', 'ok', 'bene', 'male', 'sì', 'no', 'molto', 'poco', 'alcuni', 'nessun', 'tutto', 'ogni', 'entrambi', 'nessuno', 'niente', 'qualcosa', 'tutto'],
    pt: ['o', 'a', 'os', 'as', 'e', 'ou', 'mas', 'em', 'com', 'para', 'de', 'por', 'um', 'uma', 'uns', 'umas', 'é', 'são', 'era', 'eram', 'tem', 'têm', 'tinha', 'tinham', 'será', 'serão', 'pode', 'podem', 'deve', 'devem', 'deveria', 'deveriam', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas', 'que', 'quando', 'onde', 'por que', 'como', 'quem', 'qual', 'cujo', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'obrigado', 'por favor', 'desculpe', 'sinto muito', 'ok', 'bem', 'mal', 'sim', 'não', 'muito', 'pouco', 'alguns', 'nenhum', 'tudo', 'cada', 'ambos', 'ninguém', 'nada', 'algo', 'tudo'],
    ru: ['и', 'в', 'на', 'с', 'по', 'для', 'от', 'до', 'из', 'к', 'у', 'о', 'а', 'но', 'или', 'если', 'когда', 'где', 'почему', 'как', 'что', 'кто', 'какой', 'чей', 'который', 'этот', 'эта', 'эти', 'тот', 'та', 'те', 'есть', 'был', 'была', 'были', 'будет', 'будут', 'может', 'могут', 'должен', 'должны', 'привет', 'здравствуйте', 'добрый', 'день', 'вечер', 'спасибо', 'пожалуйста', 'извините', 'простите', 'хорошо', 'плохо', 'да', 'нет', 'очень', 'много', 'мало', 'несколько', 'никакой', 'все', 'каждый', 'оба', 'никто', 'ничего', 'что-то', 'все'],
    ja: ['は', 'が', 'を', 'に', 'へ', 'で', 'から', 'まで', 'より', 'の', 'と', 'や', 'も', 'や', 'か', 'が', 'を', 'に', 'へ', 'で', 'から', 'まで', 'より', 'の', 'と', 'や', 'も', 'や', 'か', 'が', 'を', 'に', 'へ', 'で', 'から', 'まで', 'より', 'の', 'と', 'や', 'も', 'や', 'か', 'こんにちは', 'おはよう', 'こんばんは', 'ありがとう', 'お願い', 'すみません', 'ごめんなさい', '大丈夫', 'いい', '悪い', 'はい', 'いいえ', 'とても', 'たくさん', '少し', 'いくつか', '何も', 'すべて', 'それぞれ', '両方', '誰も', '何も', '何か', 'すべて'],
    ko: ['은', '는', '을', '를', '에', '에서', '로', '으로', '的', '와', '과', '이', '가', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '도', '만', '안녕하세요', '안녕', '좋은', '아침', '저녁', '감사합니다', '부탁합니다', '미안합니다', '괜찮아요', '좋아요', '나빠요', '네', '아니요', '매우', '많이', '조금', '몇', '아무것도', '모든', '각각', '둘 다', '아무도', '아무것도', '뭔가', '모든'],
    zh: ['的', '了', '在', '是', '我', '你', '他', '她', '它', '们', '有', '不', '和', '或', '但', '如果', '当', '哪里', '为什么', '怎么', '什么', '谁', '哪个', '谁的', '这个', '那个', '这些', '那些', '有', '是', '会', '能', '应该', '可以', '必须', '你好', '早上好', '晚上好', '谢谢', '请', '对不起', '抱歉', '好的', '好', '坏', '是', '不', '很', '多', '少', '一些', '没有', '所有', '每个', '两个', '没有人', '没有', '什么', '所有'],
    ar: ['في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'التي', 'الذي', 'كان', 'ليس', 'و', 'أو', 'لكن', 'إذا', 'عندما', 'أين', 'لماذا', 'كيف', 'ماذا', 'من', 'أي', 'الذي', 'هذا', 'هذه', 'هؤلاء', 'أولئك', 'هو', 'هي', 'هم', 'هن', 'كان', 'كانت', 'كانوا', 'كن', 'سيكون', 'سيكونون', 'يمكن', 'يجب', 'مرحبا', 'صباح', 'الخير', 'مساء', 'شكرا', 'من فضلك', 'عذراً', 'آسف', 'حسنا', 'جيد', 'سيء', 'نعم', 'لا', 'جداً', 'كثير', 'قليل', 'بعض', 'لا شيء', 'كل', 'كل', 'كلا', 'لا أحد', 'لا شيء', 'شيء', 'كل شيء'],
    hi: ['का', 'की', 'के', 'और', 'या', 'लेकिन', 'में', 'पर', 'से', 'को', 'के', 'लिए', 'एक', 'एक', 'एक', 'एक', 'है', 'हैं', 'था', 'थे', 'है', 'हैं', 'था', 'थे', 'होगा', 'होंगे', 'सकता', 'सकते', 'चाहिए', 'चाहिए', 'यह', 'यह', 'ये', 'ये', 'वह', 'वह', 'वे', 'वे', 'क्या', 'कब', 'कहाँ', 'क्यों', 'कैसे', 'कौन', 'कौन सा', 'किसका', 'नमस्ते', 'सुप्रभात', 'शुभ संध्या', 'धन्यवाद', 'कृपया', 'माफ़', 'करें', 'क्षमा', 'ठीक', 'अच्छा', 'बुरा', 'हाँ', 'नहीं', 'बहुत', 'बहुत', 'थोड़ा', 'कुछ', 'कुछ नहीं', 'सब', 'हर', 'दोनों', 'कोई नहीं', 'कुछ नहीं', 'कुछ', 'सब कुछ'],
    tr: ['ve', 'ile', 'için', 'gibi', 'kadar', 'göre', 'karşı', 'doğru', 'gibi', 'kadar', 'için', 'ile', 'bir', 'bir', 'bir', 'bir', 'dir', 'dır', 'dı', 'dı', 'var', 'var', 'vardı', 'vardı', 'olacak', 'olacak', 'olabilir', 'olabilir', 'gerekir', 'gerekir', 'bu', 'bu', 'bunlar', 'bunlar', 'şu', 'şu', 'şunlar', 'şunlar', 'ne', 'ne zaman', 'nerede', 'neden', 'nasıl', 'kim', 'hangi', 'kimin', 'merhaba', 'günaydın', 'iyi akşamlar', 'teşekkürler', 'lütfen', 'özür', 'dilerim', 'tamam', 'iyi', 'kötü', 'evet', 'hayır', 'çok', 'çok', 'az', 'bazı', 'hiçbir', 'tüm', 'her', 'her ikisi', 'hiç kimse', 'hiçbir şey', 'bir şey', 'her şey'],
    nl: ['de', 'het', 'een', 'en', 'of', 'maar', 'in', 'met', 'voor', 'van', 'naar', 'op', 'is', 'zijn', 'was', 'waren', 'heeft', 'hebben', 'had', 'hadden', 'zal', 'zullen', 'kan', 'kunnen', 'moet', 'moeten', 'zou', 'zouden', 'dit', 'deze', 'die', 'dat', 'wat', 'wanneer', 'waar', 'waarom', 'hoe', 'wie', 'welke', 'wiens', 'hallo', 'goedemorgen', 'goedenavond', 'dank je', 'alsjeblieft', 'sorry', 'het spijt me', 'oké', 'goed', 'slecht', 'ja', 'nee', 'heel', 'veel', 'weinig', 'sommige', 'geen', 'alle', 'elk', 'beide', 'niemand', 'niets', 'iets', 'alles'],
    pl: ['i', 'oraz', 'ale', 'w', 'z', 'do', 'od', 'na', 'przez', 'dla', 'o', 'u', 'jest', 'są', 'był', 'byli', 'ma', 'mają', 'miał', 'mieli', 'będzie', 'będą', 'może', 'mogą', 'musi', 'muszą', 'powinien', 'powinni', 'ten', 'ta', 'te', 'to', 'co', 'kiedy', 'gdzie', 'dlaczego', 'jak', 'kto', 'który', 'czyj', 'cześć', 'dzień dobry', 'dobry wieczór', 'dziękuję', 'proszę', 'przepraszam', 'przykro mi', 'ok', 'dobry', 'zły', 'tak', 'nie', 'bardzo', 'dużo', 'mało', 'kilka', 'żaden', 'wszystko', 'każdy', 'oba', 'nikt', 'nic', 'coś', 'wszystko'],
    sv: ['och', 'eller', 'men', 'i', 'på', 'med', 'för', 'av', 'till', 'från', 'om', 'vid', 'är', 'var', 'var', 'har', 'ha', 'hade', 'hade', 'kommer', 'kommer', 'kan', 'kan', 'måste', 'måste', 'borde', 'borde', 'denna', 'denna', 'den', 'det', 'vad', 'när', 'var', 'varför', 'hur', 'vem', 'vilken', 'vars', 'hej', 'god morgon', 'god kväll', 'tack', 'snälla', 'förlåt', 'ledsen', 'okej', 'bra', 'dålig', 'ja', 'nej', 'mycket', 'litet', 'några', 'ingen', 'allt', 'varje', 'båda', 'ingen', 'ingenting', 'något', 'allt'],
    da: ['og', 'eller', 'men', 'i', 'på', 'med', 'for', 'af', 'til', 'fra', 'om', 'ved', 'er', 'var', 'var', 'har', 'har', 'havde', 'havde', 'vil', 'vil', 'kan', 'kan', 'skal', 'skal', 'bør', 'bør', 'denne', 'denne', 'den', 'det', 'hva', 'når', 'hvor', 'hvorfor', 'hvordan', 'hvem', 'hvilken', 'hvis', 'hei', 'god morgen', 'god aften', 'tak', 'venligst', 'undskyld', 'beklager', 'okay', 'god', 'dårlig', 'ja', 'nej', 'meget', 'lidt', 'nogle', 'ingen', 'alt', 'hver', 'begge', 'ingen', 'intet', 'noget', 'alt'],
    no: ['og', 'eller', 'men', 'i', 'på', 'med', 'for', 'av', 'til', 'fra', 'om', 'ved', 'er', 'var', 'var', 'har', 'har', 'hadde', 'hadde', 'vil', 'vil', 'kan', 'kan', 'skal', 'skal', 'bør', 'bør', 'denne', 'denne', 'den', 'det', 'hva', 'når', 'hvor', 'hvorfor', 'hvordan', 'hvem', 'hvilken', 'hvis', 'hei', 'god morgen', 'god kveld', 'takk', 'vær så snill', 'beklager', 'sorry', 'ok', 'bra', 'dårlig', 'ja', 'nei', 'veldig', 'mye', 'litt', 'noen', 'ingen', 'alt', 'hver', 'begge', 'ingen', 'ingenting', 'noe', 'alt'],
    fi: ['ja', 'tai', 'mutta', 'sisään', 'päällä', 'kanssa', 'varten', 'ilman', 'kohti', 'lähellä', 'yli', 'alla', 'on', 'ovat', 'oli', 'olivat', 'on', 'ovat', 'oli', 'olivat', 'on', 'on', 'voi', 'voivat', 'täytyy', 'täytyvät', 'pitäisi', 'pitäisivät', 'tämä', 'tämä', 'tämä', 'tämä', 'mitä', 'milloin', 'missä', 'miksi', 'miten', 'kuka', 'mikä', 'kenen', 'hei', 'hyvää', 'huomenta', 'iltaa', 'kiitos', 'ole hyvä', 'anteeksi', 'pahoittelen', 'ok', 'hyvä', 'huono', 'kyllä', 'ei', 'erittäin', 'paljon', 'vähän', 'muutama', 'ei mitään', 'kaikki', 'jokainen', 'molemmat', 'ei kukaan', 'ei mitään', 'jotain', 'kaikki']
  };

  const words = text.toLowerCase().split(/\s+/);
  const scores = {};

  // Count matches for each language
  for (const [lang, commonWordsList] of Object.entries(commonWords)) {
    scores[lang] = 0;
    for (const word of words) {
      if (commonWordsList.includes(word)) {
        scores[lang]++;
      }
    }
  }

  // Find the language with the highest score
  let bestLang = 'en'; // default to English
  let bestScore = 0;

  for (const [lang, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestLang = lang;
    }
  }

  // Only return detected language if we have a reasonable confidence
  if (bestScore > 0) {
    return bestLang;
  }

  // If no clear match, default to English
  return 'en';
};

// Proxy translation requests
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    let actualSourceLang = sourceLang;
    let detectedLanguage = null;
    
    // If auto-detect is selected, try to detect the language
    if (sourceLang === 'auto') {
      actualSourceLang = detectLanguage(text);
      detectedLanguage = actualSourceLang;
    }

    const langPair = `${actualSourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      res.json({
        translatedText: data.responseData.translatedText,
        detectedLanguage: detectedLanguage
      });
    } else {
      res.status(500).json({ error: 'Translation failed' });
    }
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation service unavailable' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Translation service is running' });
});

app.listen(PORT, () => {
  console.log(`Translation proxy server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/translate - Translate text');
  console.log('  GET  /api/health   - Health check');
}); 