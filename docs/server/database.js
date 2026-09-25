// ==========================================================================
// Database Engine (Schemas & Persistence) - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db_store.json');

const INITIAL_DB = {
  users: [
    {
      id: "usr-admin-1",
      username: "مسؤول مِدادُ زَهْر",
      email: "admin@medadzahr.com",
      role: "admin",
      provider: "email",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      stats: { booksRead: 25, pagesRead: 6400, streakDays: 14 }
    }
  ],
  books: [
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
      safeStatus: "VERIFIED_CLEAN",
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
    }
  ],
  poems: [
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
        "إنْ كانَ يَجْمَعُنا حُبٌّ لِبُغْيَتِهِ | فَلَيْتَ أنَّا بقَدْرِ الحُبِّ نَقْتَسِمُ"
      ]
    }
  ],
  quotes: [
    {
      id: "q-1",
      userId: "usr-admin-1",
      quoteText: "الأشجار لا ترحل يا مريمة، تبقى جذورها متشبثة بالأرض مهما اشتدت العواصف.",
      bookTitle: "ثلاثية غرناطة",
      author: "رضوى عاشور",
      date: "2026-09-15"
    }
  ],
  comments: {
    "book-1-chap-0": [
      { username: "أحمد القارئ", comment: "بداية مذهلة لثلاثية غرناطة، تصف أدق التفاصيل النفسية والإنسانية.", date: "2026-09-16" }
    ]
  },
  reviews: {
    "book-1": [
      { username: "سارة الأديبة", rating: 5, comment: "من أجمل ما قرأت في الأدب التاريخي العربي.", date: "2026-09-14" }
    ]
  }
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = INITIAL_DB;
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (e) {
        this.data = INITIAL_DB;
        this.save();
      }
    }
  }

  save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // Users Auth Methods
  findUserByEmail(email) {
    return this.data.users.find(u => u.email === email);
  }

  findUserByPhone(phone) {
    return this.data.users.find(u => u.phone === phone);
  }

  createUser(userData) {
    const newUser = {
      id: 'usr-' + Date.now(),
      stats: { booksRead: 0, pagesRead: 0, streakDays: 1 },
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Books
  getBooks() {
    return this.data.books;
  }

  addBook(book) {
    this.data.books.unshift(book);
    this.save();
    return book;
  }

  // Poems
  getPoems() {
    return this.data.poems;
  }

  addPoem(poem) {
    this.data.poems.unshift(poem);
    this.save();
    return poem;
  }

  // Quotes
  getQuotes(userId) {
    return this.data.quotes;
  }

  addQuote(quote) {
    this.data.quotes.unshift(quote);
    this.save();
    return quote;
  }

  deleteQuote(id) {
    this.data.quotes = this.data.quotes.filter(q => q.id !== id);
    this.save();
    return true;
  }

  // Comments
  getComments(key) {
    return this.data.comments[key] || [];
  }

  addComment(key, commentObj) {
    if (!this.data.comments[key]) this.data.comments[key] = [];
    this.data.comments[key].unshift(commentObj);
    this.save();
    return this.data.comments[key];
  }

  // Reviews
  getReviews(bookId) {
    return this.data.reviews[bookId] || [];
  }

  addReview(bookId, reviewObj) {
    if (!this.data.reviews[bookId]) this.data.reviews[bookId] = [];
    this.data.reviews[bookId].unshift(reviewObj);

    // Recalculate book rating
    const book = this.data.books.find(b => b.id === bookId);
    if (book) {
      const all = this.data.reviews[bookId];
      const sum = all.reduce((acc, c) => acc + c.rating, 0);
      book.rating = parseFloat((sum / all.length).toFixed(1));
      book.ratingCount = all.length;
    }

    this.save();
    return this.data.reviews[bookId];
  }
}

module.exports = new Database();
