// ==========================================================================
// Central State Store (Mobile & Database Sync) - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { INITIAL_BOOKS, INITIAL_POEMS } from './initialData.js';
import { DatabaseService } from './dbService.js';

class Store {
  constructor() {
    this.listeners = [];

    // Load persisted state or defaults
    const savedBooks = localStorage.getItem('medad_books');
    const savedPoems = localStorage.getItem('medad_poems');
    const savedUser = localStorage.getItem('medad_user');
    const savedShelf = localStorage.getItem('medad_shelf');
    const savedBookmarks = localStorage.getItem('medad_bookmarks');
    const savedReviews = localStorage.getItem('medad_reviews');
    const savedComments = localStorage.getItem('medad_comments');
    const savedQuotes = localStorage.getItem('medad_quotes');
    const savedTheme = localStorage.getItem('medad_theme') || 'dark';
    const savedSafeShield = localStorage.getItem('medad_safe_shield');
    const savedLayoutMode = localStorage.getItem('medad_layout_mode') || 'mobile'; // mobile | web

    this.state = {
      theme: savedTheme,
      safeShield: savedSafeShield !== null ? JSON.parse(savedSafeShield) : true,
      layoutMode: savedLayoutMode, // mobile | web
      currentView: 'home', // home | book-detail | reader | diwan | add-book | add-poem | profile | quotes
      activeBookId: null,
      activePoemId: null,
      showAuthModal: false,
      readerConfig: {
        mode: 'flip-3d', // flip-3d | slide | scroll
        zoomScale: 1.0, // 0.5 to 2.0 (50% to 200%)
        fontFamily: 'Amiri',
        orientation: 'portrait', // portrait | landscape
        currentPage: 0,
        searchQuery: '',
        searchExecuted: false
      },
      searchQuery: '',
      selectedCategory: 'all',
      selectedGenre: 'all',
      selectedSafeFilter: 'all',
      selectedLanguage: 'all',
      user: savedUser ? JSON.parse(savedUser) : {
        username: "قارئ زَهْرِيّ",
        role: "user",
        provider: "email",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        stats: { booksRead: 14, pagesRead: 3420, streakDays: 7 }
      },
      shelf: savedShelf ? JSON.parse(savedShelf) : {
        currentlyReading: [{ bookId: "book-1", progress: 35 }],
        wishlist: ["book-2"],
        favorites: ["book-1", "book-3"],
        completed: ["book-3"]
      },
      bookmarks: savedBookmarks ? JSON.parse(savedBookmarks) : {},
      reviews: savedReviews ? JSON.parse(savedReviews) : {
        "book-1": [
          { username: "أحمد محمود", rating: 5, comment: "تحفة أدبية خالدة تأخذك لعوالم الأندلس الساحرة.", date: "2026-09-10" }
        ]
      },
      chapterComments: savedComments ? JSON.parse(savedComments) : {
        "book-1-chap-0": [
          { username: "سارة الأديبة", comment: "وصف الجبال والهواء في غرناطة يفوق الخيال!", date: "2026-09-12" }
        ]
      },
      quotes: savedQuotes ? JSON.parse(savedQuotes) : [
        {
          id: "q-1",
          quoteText: "الأشجار لا ترحل يا مريمة، تبقى جذورها متشبثة بالأرض مهما اشتدت العواصف.",
          bookTitle: "ثلاثية غرناطة",
          author: "رضوى عاشور",
          date: "2026-09-15"
        },
        {
          id: "q-2",
          quoteText: "إن الاجتماع الانساني ضروري، ويعبر الحكماء عن هذا بقولهم: الإنسان مدني بالطبع.",
          bookTitle: "مقدمة ابن خلدون",
          author: "ابن خلدون",
          date: "2026-09-14"
        }
      ],
      books: savedBooks ? JSON.parse(savedBooks) : INITIAL_BOOKS,
      poems: savedPoems ? JSON.parse(savedPoems) : INITIAL_POEMS
    };

    document.documentElement.setAttribute('data-theme', this.state.theme);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
    this.persist();
  }

  persist() {
    localStorage.setItem('medad_books', JSON.stringify(this.state.books));
    localStorage.setItem('medad_poems', JSON.stringify(this.state.poems));
    localStorage.setItem('medad_user', JSON.stringify(this.state.user));
    localStorage.setItem('medad_shelf', JSON.stringify(this.state.shelf));
    localStorage.setItem('medad_bookmarks', JSON.stringify(this.state.bookmarks));
    localStorage.setItem('medad_reviews', JSON.stringify(this.state.reviews));
    localStorage.setItem('medad_comments', JSON.stringify(this.state.chapterComments));
    localStorage.setItem('medad_quotes', JSON.stringify(this.state.quotes));
    localStorage.setItem('medad_theme', this.state.theme);
    localStorage.setItem('medad_safe_shield', JSON.stringify(this.state.safeShield));
    localStorage.setItem('medad_layout_mode', this.state.layoutMode);
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.state.theme);
    this.notify();
  }

  toggleSafeShield() {
    this.state.safeShield = !this.state.safeShield;
    this.notify();
  }

  toggleLayoutMode() {
    this.state.layoutMode = this.state.layoutMode === 'mobile' ? 'web' : 'mobile';
    this.notify();
  }

  setUser(userObj) {
    this.state.user = { ...this.state.user, ...userObj };
    this.state.showAuthModal = false;
    this.notify();
  }

  setAuthModal(open) {
    this.state.showAuthModal = open;
    this.notify();
  }

  setView(view, params = {}) {
    this.state.currentView = view;
    if (params.bookId) this.state.activeBookId = params.bookId;
    if (params.poemId) this.state.activePoemId = params.poemId;
    if (params.page !== undefined) this.state.readerConfig.currentPage = params.page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.notify();
  }

  setFilters(filters) {
    if (filters.category !== undefined) this.state.selectedCategory = filters.category;
    if (filters.genre !== undefined) this.state.selectedGenre = filters.genre;
    if (filters.safeFilter !== undefined) this.state.selectedSafeFilter = filters.safeFilter;
    if (filters.language !== undefined) this.state.selectedLanguage = filters.language;
    this.notify();
  }

  toggleFavorite(bookId) {
    const favs = this.state.shelf.favorites;
    if (favs.includes(bookId)) {
      this.state.shelf.favorites = favs.filter(id => id !== bookId);
    } else {
      this.state.shelf.favorites.push(bookId);
    }
    this.notify();
  }

  toggleWishlist(bookId) {
    const list = this.state.shelf.wishlist;
    if (list.includes(bookId)) {
      this.state.shelf.wishlist = list.filter(id => id !== bookId);
    } else {
      this.state.shelf.wishlist.push(bookId);
    }
    this.notify();
  }

  startReadingBook(bookId) {
    const curr = this.state.shelf.currentlyReading;
    if (!curr.some(item => item.bookId === bookId)) {
      curr.push({ bookId, progress: 0 });
    }
    this.setView('reader', { bookId, page: 0 });
  }

  updateReaderConfig(updates) {
    this.state.readerConfig = { ...this.state.readerConfig, ...updates };
    this.notify();
  }

  saveBookmark(bookId, pageIndex) {
    this.state.bookmarks[bookId] = { pageIndex, timestamp: new Date().toISOString() };
    this.notify();
  }

  addBook(newBook) {
    this.state.books.unshift(newBook);
    DatabaseService.insertBook(newBook);
    this.setView('home');
    this.notify();
  }

  addPoem(newPoem) {
    this.state.poems.unshift(newPoem);
    this.setView('diwan');
    this.notify();
  }

  addQuote(quoteText, bookTitle = 'مِدادُ زَهْر', author = 'مجهول') {
    const newQuote = {
      id: 'q-' + Date.now(),
      quoteText,
      bookTitle,
      author,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.quotes.unshift(newQuote);
    DatabaseService.insertQuote(newQuote);
    this.notify();
  }

  deleteQuote(id) {
    this.state.quotes = this.state.quotes.filter(q => q.id !== id);
    DatabaseService.deleteQuote(id);
    this.notify();
  }

  addBookReview(bookId, rating, comment) {
    if (!this.state.reviews[bookId]) this.state.reviews[bookId] = [];
    const rev = {
      username: this.state.user.username,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.reviews[bookId].unshift(rev);
    
    // Recalculate book rating average
    const book = this.state.books.find(b => b.id === bookId);
    if (book) {
      const allRev = this.state.reviews[bookId];
      const sum = allRev.reduce((acc, curr) => acc + curr.rating, 0);
      book.rating = parseFloat((sum / allRev.length).toFixed(1));
      book.ratingCount = allRev.length;
    }
    this.notify();
  }

  addChapterComment(key, comment) {
    if (!this.state.chapterComments[key]) this.state.chapterComments[key] = [];
    const comm = {
      username: this.state.user.username,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.chapterComments[key].unshift(comm);
    DatabaseService.insertComment(key, comm);
    this.notify();
  }
}

export const store = new Store();
