// ==========================================================================
// Strict 18+ Content Moderation Engine (Standard Arabic & Dialects) - مِدادُ زَهْر
// ==========================================================================

// Explicit & adult content dictionaries (Standard Arabic, English, and Dialects)
const EXPLICIT_LEVEL_HIGH = [
  // --- Standard Arabic Hardcore Explicit ---
  "جنس صريح", "عري كامل", "جماع", "إباحية", "ممارسة الجنس", "شهوة عارمة", 
  "نشوة جنسية", "استمناء", "عارية تماما", "عاريا تماما", "أعضاء تناسلية", "مضاجعة",
  "قبلة حارة شهوانية", "فاحشة", "إغراء فاحش", "عورة", "سحاق", "لوطية", "دعارة",
  
  // --- English Hardcore Explicit ---
  "erotic", "orgasm", "ejaculation", "masturbation", "pornography", "explicit sex",
  "nakedness", "nudity", "sensual intercourse", "intercourse", "penetration", "fetish",
  "striptease", "lustful act", "climax", "nude photo", "genitals", "vulva", "phallus",

  // --- Iraqi & Gulf Dialect Explicit Terms ---
  "مال نوم بالليل", "نيج", "ناج", "سكسي", "مفاصيخ", "ملط", "فاصخ الملابس", 
  "سالفة عري", "فركشه", "شهواني مو طبيعي", "نوم بالفراش عاريا", "زب", "كس",

  // --- Egyptian Dialect Explicit Terms ---
  "شرموطة", "تناك", "نيك", "شرمطة", "قلع ملط", "عريان ملط", "بتاعته عريانة", 
  "مشي عريان", "بوس من الشفايف بقوة", "قليلة الادب", "في الفراش ملط",

  // --- Levantine & Maghrebi Dialect Explicit Terms ---
  "مشلح", "مشلحة", "عريانة ع الآخر", "تبويس ومص", "نيكة", "قحاب", "قحبة",
  "تعري كامل", "شلحوا بعض"
];

const EXPLICIT_LEVEL_MODERATE = [
  // --- Standard Arabic Moderate Adult / Suggestive ---
  "عاري", "عارية", "صدر عار", "إغراء", "جرّدها من ملابسها", "قبلة شهوانية", 
  "فراش الهوى", "ليلة حميمية", "لمسات شهوانية", "مفاتن", "جسد عار", "ملابس شفافة",
  "مستلقية على الفراش", "نهدين", "فخذين", "خصر عار", "قبلة حارة",

  // --- English Moderate Adult / Suggestive ---
  "naked", "bare chest", "seduction", "undressed", "passionately kissed", "moaned with desire",
  "caressed her thigh", "unbuttoned shirt", "intimate night", "bed of desire", "bedroom heat",
  "sensual touch", "lewd", "scantily clad", "cleavage", "provocative",

  // --- Dialect Suggestive Terms (Iraqi, Egyptian, Levantine, Gulf) ---
  "ملابس ضيقة هواية", "صدرها طالع", "بوسات حارة", "نامت بصفه", "حضن حار", 
  "قعدت بالفراش", "لابسة قميص نوم شفاف", "قميص نوم مشخلع", "مبينة مفاتنها", 
  "شاف جسمها", "متحزمة بالشال", "تتعرى بالتدريج", "بوسه قوية", "بوسة ع الشفة"
];

export class ModerationService {
  /**
   * Scans text for 18+ adult, sexual, dialect slang, and explicit content.
   * @param {string} text - The input manuscript / PDF text / synopsis.
   * @returns {Object} Analysis report with decision, score, redacted HTML, and detected terms.
   */
  static scanContent(text) {
    if (!text || typeof text !== 'string') {
      return {
        decision: 'APPROVED',
        score: 0,
        explicitCount: 0,
        censoredText: text || '',
        details: 'No text provided.'
      };
    }

    const lowerText = text.toLowerCase();
    let highCount = 0;
    let moderateCount = 0;
    const detectedTerms = [];

    // Check Level High (Hardcore & Dialects)
    EXPLICIT_LEVEL_HIGH.forEach(term => {
      const regex = new RegExp(this.escapeRegExp(term), 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        highCount += matches.length * 3;
        detectedTerms.push(term);
      }
    });

    // Check Level Moderate (Suggestive & Dialects)
    EXPLICIT_LEVEL_MODERATE.forEach(term => {
      const regex = new RegExp(this.escapeRegExp(term), 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        moderateCount += matches.length;
        detectedTerms.push(term);
      }
    });

    const wordCount = text.trim().split(/\s+/).length || 1;
    const totalExplicitWeight = (highCount * 2) + moderateCount;
    const explicitDensityScore = Math.min(100, Math.round((totalExplicitWeight / wordCount) * 100 * 5));

    // Decision Logic
    let decision = 'APPROVED'; // APPROVED | REDACTED | BLOCKED
    let censoredText = text;

    if (highCount >= 2 || explicitDensityScore > 18) {
      decision = 'BLOCKED';
    } else if (highCount > 0 || moderateCount > 0) {
      decision = 'REDACTED';
      censoredText = this.applyRedaction(text);
    }

    return {
      decision,
      score: explicitDensityScore,
      explicitCount: highCount + moderateCount,
      detectedTerms,
      censoredText,
      isClean: decision === 'APPROVED'
    };
  }

  /**
   * Wraps sensitive passages/sentences in blur redaction spans.
   * @param {string} text 
   * @returns {string} Text containing redaction tags.
   */
  static applyRedaction(text) {
    if (!text) return '';
    let result = text;
    const allTerms = [...EXPLICIT_LEVEL_HIGH, ...EXPLICIT_LEVEL_MODERATE];

    // Split text into sentences to blur full sensitive context
    const sentences = text.split(/(?<=[.!?\n])\s+/);
    const processedSentences = sentences.map(sentence => {
      const containsExplicit = allTerms.some(term => 
        sentence.toLowerCase().includes(term.toLowerCase())
      );

      if (containsExplicit) {
        return `<span class="redacted-passage" data-reason="18+ Content Censored">${sentence}</span>`;
      }
      return sentence;
    });

    return processedSentences.join(' ');
  }

  static escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
