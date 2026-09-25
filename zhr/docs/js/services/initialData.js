// ==========================================================================
// Initial Library & Diwan Dataset - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

export const INITIAL_BOOKS = [
  {
    id: "book-1",
    title: "ثلاثية غرناطة",
    titleEn: "Granada Trilogy",
    author: "رضوى عاشور",
    authorBio: "كاتبة وروائية ومترقدة مصرية استثنائية، عُرِفت بأعمالها الأدبية التاريخية والإنسانية العملاقة.",
    category: "novels",
    genre: "تاريخي وروايات أدبية",
    language: "ar",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    ratingCount: 342,
    pages: 512,
    safeStatus: "VERIFIED_CLEAN", // VERIFIED_CLEAN | REDACTED
    synopsis: "ملحمة أدبية تاريخية تُبحر بنا في تفاصيل سقوط غرناطة وحياة العائلات الأندلسية بعد أفول حكم المسلمين، محبوكة بأسلوب شعري دافئ يسلب الألباب.",
    chapters: [
      {
        title: "الفصل الأول: أبواب البيازين",
        content: "كان الشارع يسكن ببطء مع هبوط الليل على جبال البشرات. جلس أبو جعفر في دكانه يلملم أوراق الكتب العتيقة، ويتأمل الزخارف المكتوبة بماء الذهب. كانت الأندلس تشهد تحولاً تاريخياً مهيباً..."
      },
      {
        title: "الفصل الثاني: ظلال الرماد",
        content: "في الصباح التالي، اجتمعت العائلة حول الموقد الدافئ. قالت مريمة بصوت خفيض: الأشجار لا ترحل يا مريمة، تبقى جذورها متشبثة بالأرض مهما اشتدت العواصف."
      }
    ]
  },
  {
    id: "book-2",
    title: "The Prophet",
    titleEn: "The Prophet",
    author: "Kahlil Gibran",
    authorBio: "Lebanese-American writer, poet, and visual artist, best known for his philosophical masterpiece 'The Prophet'.",
    category: "poetry",
    genre: "Philosophy & Poetry",
    language: "en",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    rating: 4.95,
    ratingCount: 520,
    pages: 140,
    safeStatus: "VERIFIED_CLEAN",
    synopsis: "A timeless masterpiece composed of 26 poetic essays giving profound reflections on love, freedom, joy, sorrow, work, and the human spirit.",
    chapters: [
      {
        title: "Chapter I: The Coming of the Ship",
        content: "Almustafa, the chosen and the beloved, who was a dawn unto his own day, had waited twelve years in the city of Orphalese for his ship that was to return and bear him back to the isle of his birth..."
      },
      {
        title: "Chapter II: On Love",
        content: "Then said Almitra, Speak to us of Love. And he raised his head and looked upon the people, and there fell a stillness upon them. And with a great voice he said: When love beckons to you, follow him..."
      }
    ]
  },
  {
    id: "book-3",
    title: "مقدمة ابن خلدون",
    titleEn: "Muqaddimah of Ibn Khaldun",
    author: "عبد الرحمن بن خلدون",
    authorBio: "مؤسس علم الاجتماع وأحد أعظم مؤرخي وفلاسفة الحضارة الإسلامية والعالمية.",
    category: "philosophy",
    genre: "فلسفة وتاريخ واجتماع",
    language: "ar",
    cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
    rating: 4.88,
    ratingCount: 290,
    pages: 680,
    safeStatus: "VERIFIED_CLEAN",
    synopsis: "العمل التأسيسي الأهم في فلسفة التاريخ وعمران البشرية، يناقش نشوء الدول وسقوطها وأثر البيئة والعصبية في تطور المجتمعات.",
    chapters: [
      {
        title: "مقدمة الكتاب: في فضل علم التاريخ",
        content: "اعلم أن فن التاريخ فن عزيز المذهب، جم الفوائد، شريف الغاية؛ إذ هو يوقفنا على أحوال الماضين من الأمم في أخلاقهم، والأنبياء في سيرهم، والملوك في دولهم وسياستهم..."
      },
      {
        title: "الباب الأول: في العمران البشري على الجملة",
        content: "إن الاجتماع الانساني ضروري، ويعبر الحكماء عن هذا بقولهم: الإنسان مدني بالطبع، أي لا بد له من الاجتماع الذي هو المدنية في اصطلاحهم..."
      }
    ]
  },
  {
    id: "book-4",
    title: "ليالي ألف ليلة وليلة (نسخة مهدّبة آمنة)",
    titleEn: "One Thousand and One Nights (Clean Family Edition)",
    author: "تراث شرقي أصيل",
    authorBio: "مجموعة من حكايات الشعوب الشرقية الفارسية والعربية التي تناقلتها الرواة عبر القرون.",
    category: "novels",
    genre: "حكايات وفانتازيا تاريخية",
    language: "ar",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    rating: 4.75,
    ratingCount: 180,
    pages: 420,
    safeStatus: "REDACTED", // Contains auto-redacted passages!
    synopsis: "روائع الحكايات الشرقية العجيبة عن السندباد وعلاء الدين وحكمة شهرزاد، مفحوصة بدقة بنظام فلترة 18+ وحجب الألفاظ الحساسة تلقائياً.",
    chapters: [
      {
        title: "الليلة الأولى: حكاية التاجر مع العفريت",
        content: "بلغني أيها الملك السعيد، ذو الرأي الرشيد، أنه كان رجل تاجر من التجار، كثير المال، وكان له عيال وأطفال. وفي يوم من الأيام ركب دابته وسافر يقصد بعض البلاد... <span class=\"redacted-passage\" data-reason=\"18+ Content Censored\">وكانت الجارية تستلقي في قصر الإغراء وتتزين باللمسات الشفافة</span> وتناول التاجر التمرات وجلس تحت شجرة يابسة."
      }
    ]
  }
];

export const INITIAL_POEMS = [
  {
    id: "poem-1",
    title: "واحَرَّ قَلْباهُ مِمَّنْ قَلْبُهُ شَبِمُ",
    poet: "أبو الطيب المتنبي",
    era: "abbasid",
    category: "فخر وعتاب",
    likes: 1240,
    safeStatus: "VERIFIED_CLEAN",
    stanzas: [
      "واحَرَّ قَلْباهُ مِمَّنْ قَلْبُهُ شَبِمُ | ومَنْ بجِسْمي وحالي عِنْدَهُ سَقَمُ",
      "مالي أُكَتِّمُ حُبّاً قَدْ نَهَكْتُ بهِ | وتَدَّعي حُبَّ سَيْفِ الدَّوْلَةِ الأُمَمُ",
      "إنْ كانَ يَجْمَعُنا حُبٌّ لِبُغْيَتِهِ | فَلَيْتَ أنَّا بقَدْرِ الحُبِّ نَقْتَسِمُ",
      "قد زُرْتُهُ وحُسُومُ الخَيْلِ تُحْزِنُهُ | وقَدْ نَظَرْتُ إلَيْهِ والنَّواظِرُ عُمُ"
    ]
  },
  {
    id: "poem-2",
    title: "ريمٌ عَلى القاعِ بَينَ البانِ وَالعَلَمِ",
    poet: "أحمد شوقي (أمير الشعراء)",
    era: "modern",
    category: "غزل ومديح نبوي",
    likes: 980,
    safeStatus: "VERIFIED_CLEAN",
    stanzas: [
      "رِيمٌ عَلى القاعِ بَيْنَ البانِ وَالعَلَمِ | أَحَلَّ سَفْك دَمي في الأَشْهُرِ الحُرُمِ",
      "رَمى القَضاءُ بِعَيْنَيْ جُؤْذَرٍ أَسَدًا | يا ساكِنَ القاعِ أَدْرِكْ ساكِنَ الأَكَمِ",
      "يا لائمي في هَواهُ وَالهَوى قَدَرٌ | لَوْ ذُقْتَ شَوْقِيَ لَمْ تَعْلُبْ عَلَيَّ دَمِي"
    ]
  },
  {
    id: "poem-3",
    title: "قِفا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ",
    poet: "امرؤ القيس",
    era: "jahiliyyah",
    category: "معلقة جاهلية",
    likes: 1560,
    safeStatus: "VERIFIED_CLEAN",
    stanzas: [
      "قِفا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ ومَنْزِلِ | بسِقْطِ اللِّوَى بَيْنَ الدَّخُولِ فَحَوْمَلِ",
      "فَتُوضِحَ فَالْمِقْراةِ لَمْ يَعْفُ رَسْمُها | لِما نَسَجَتْها مِنْ جَنُوبٍ وشَمْأَلِ",
      "تَرَى بَعَر الأَرآمِ فِي عَرَصاتِها | وقِيعانِها كَأَنَّهُ حَبُّ فُلْفُلِ"
    ]
  }
];
