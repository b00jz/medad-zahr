// ==========================================================================
// Central State Store (Mobile & Database Sync) - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { INITIAL_BOOKS, INITIAL_POEMS } from './initialData.js';
import { DatabaseService } from './dbService.js';

class Store {
  constructor() {
    this.listeners = [];

    // Force clear old cached exemplary data from previous browser sessions
    if (localStorage.getItem('medad_v6_clean') !== 'true') {
      localStorage.removeItem('medad_books');
      localStorage.removeItem('medad_poems');
      localStorage.removeItem('medad_user');
      localStorage.removeItem('medad_shelf');
      localStorage.removeItem('medad_quotes');
      localStorage.removeItem('medad_reviews');
      localStorage.removeItem('medad_comments');
      localStorage.setItem('medad_v6_clean', 'true');
    }

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
    const savedLayoutMode = localStorage.getItem('medad_layout_mode') || 'mobile';

    const defaultGuestUser = {
      name: "زائر (Guest)",
      username: "guest",
      email: "",
      bio: "قم بتسجيل الدخول لإنشاء حسابك الشخصي وتخصيص مكتبتك واقتباساتك.",
      role: "guest",
      isGuest: true,
      provider: "guest",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      stats: { booksRead: 0, pagesRead: 0, quotesSaved: 0, booksAdded: 0, poemsAdded: 0, streakDays: 0 },
      shelf: { currentlyReading: [], wishlist: [], favorites: [], completed: [] }
    };

    let userObj = savedUser ? JSON.parse(savedUser) : defaultGuestUser;

    if (userObj && userObj.stats) {
      userObj.stats.booksAdded = userObj.stats.booksAdded || 0;
      userObj.stats.poemsAdded = userObj.stats.poemsAdded || 0;
      userObj.stats.quotesSaved = userObj.stats.quotesSaved || 0;
      userObj.stats.booksRead = userObj.stats.booksRead || 0;
      userObj.stats.pagesRead = userObj.stats.pagesRead || 0;
      userObj.stats.streakDays = userObj.stats.streakDays || 0;
    }

    this.state = {
      theme: savedTheme,
      layoutMode: savedLayoutMode, // mobile | web
      currentView: 'home', // home | book-detail | reader | diwan | add-book | add-poem | profile | quotes
      activeBookId: null,
      activePoemId: null,
      showAuthModal: false,
      showFeedbackModal: false,
      showEditProfileModal: false,
      readerConfig: {
        mode: 'flip-3d', // flip-3d | slide | scroll
        zoomScale: 1.0, // 0.01 to 1.50 (1% to 150%)
        readerTheme: 'light', // light (white) | dark (black)
        fontFamily: 'Amiri',
        orientation: 'portrait',
        currentPage: 0,
        searchQuery: '',
        searchExecuted: false
      },
      searchQuery: '',
      selectedCategory: 'all',
      selectedGenre: 'all',
      selectedLanguage: 'all',
      user: userObj,
      shelf: savedShelf ? JSON.parse(savedShelf) : (userObj.shelf || {
        currentlyReading: [],
        wishlist: [],
        favorites: [],
        completed: []
      }),
      bookmarks: savedBookmarks ? JSON.parse(savedBookmarks) : {},
      reviews: savedReviews ? JSON.parse(savedReviews) : {},
      chapterComments: savedComments ? JSON.parse(savedComments) : {},
      quotes: savedQuotes ? JSON.parse(savedQuotes) : [],
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
    localStorage.setItem('medad_layout_mode', this.state.layoutMode);
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.state.theme);
    this.notify();
  }

  toggleReaderTheme() {
    this.state.readerConfig.readerTheme = this.state.readerConfig.readerTheme === 'light' ? 'dark' : 'light';
    this.notify();
  }

  toggleLayoutMode() {
    this.state.layoutMode = this.state.layoutMode === 'mobile' ? 'web' : 'mobile';
    this.notify();
  }

  setUser(userObj) {
    this.state.user = { ...userObj, isGuest: false };
    this.state.showAuthModal = false;
    this.notify();
  }

  updateUserProfile(updates) {
    if (!this.state.user) return;
    this.state.user = { ...this.state.user, ...updates };
    this.state.showEditProfileModal = false;
    this.notify();
  }

  logoutUser() {
    this.state.user = {
      name: "زائر (Guest)",
      username: "guest",
      email: "",
      bio: "قم بتسجيل الدخول لإنشاء حسابك الشخصي وتخصيص مكتبتك واقتباساتك.",
      role: "guest",
      isGuest: true,
      provider: "guest",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      stats: { booksRead: 0, pagesRead: 0, quotesSaved: 0, booksAdded: 0, poemsAdded: 0, streakDays: 0 },
      shelf: { currentlyReading: [], wishlist: [], favorites: [], completed: [] }
    };
    this.state.shelf = { currentlyReading: [], wishlist: [], favorites: [], completed: [] };
    localStorage.removeItem('medad_user');
    this.notify();
  }

  setAuthModal(open) {
    this.state.showAuthModal = open;
    this.notify();
  }

  setFeedbackModal(open) {
    this.state.showFeedbackModal = open;
    this.notify();
  }

  setEditProfileModal(open) {
    this.state.showEditProfileModal = open;
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
    if (filters.language !== undefined) this.state.selectedLanguage = filters.language;
    this.notify();
  }

  toggleFavorite(bookId) {
    if (!this.state.shelf.favorites) this.state.shelf.favorites = [];
    const favs = this.state.shelf.favorites;
    if (favs.includes(bookId)) {
      this.state.shelf.favorites = favs.filter(id => id !== bookId);
    } else {
      this.state.shelf.favorites.push(bookId);
    }
    this.notify();
  }

  toggleWishlist(bookId) {
    if (!this.state.shelf.wishlist) this.state.shelf.wishlist = [];
    const list = this.state.shelf.wishlist;
    if (list.includes(bookId)) {
      this.state.shelf.wishlist = list.filter(id => id !== bookId);
    } else {
      this.state.shelf.wishlist.push(bookId);
    }
    this.notify();
  }

  startReadingBook(bookId) {
    if (!this.state.shelf.currentlyReading) this.state.shelf.currentlyReading = [];
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
    
    if (this.state.user && this.state.user.stats) {
      this.state.user.stats.booksAdded = (this.state.user.stats.booksAdded || 0) + 1;
    }

    this.setView('home');
    this.notify();
  }

  deleteBook(bookId) {
    this.state.books = this.state.books.filter(b => b.id !== bookId);
    DatabaseService.deleteBook(bookId);
    if (this.state.activeBookId === bookId) {
      this.state.activeBookId = null;
      this.setView('home');
    } else {
      this.notify();
    }
  }

  addPoem(newPoem) {
    this.state.poems.unshift(newPoem);
    
    if (this.state.user && this.state.user.stats) {
      this.state.user.stats.poemsAdded = (this.state.user.stats.poemsAdded || 0) + 1;
    }

    this.setView('diwan');
    this.notify();
  }

  deletePoem(poemId) {
    this.state.poems = this.state.poems.filter(p => p.id !== poemId);
    DatabaseService.deletePoem(poemId);
    if (this.state.activePoemId === poemId) {
      this.state.activePoemId = null;
      this.setView('diwan');
    } else {
      this.notify();
    }
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

    if (this.state.user && this.state.user.stats) {
      this.state.user.stats.quotesSaved = (this.state.user.stats.quotesSaved || 0) + 1;
    }

    this.notify();
  }

  deleteQuote(id) {
    this.state.quotes = this.state.quotes.filter(q => q.id !== id);
    DatabaseService.deleteQuote(id);
    this.notify();
  }

  addBookReview(bookId, rating, comment) {
    if (!this.state.reviews[bookId]) this.state.reviews[bookId] = [];
    const username = this.state.user ? (this.state.user.name || this.state.user.username) : 'قارئ';
    const rev = {
      username: username,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.reviews[bookId].unshift(rev);
    
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
    const username = this.state.user ? (this.state.user.name || this.state.user.username) : 'قارئ';
    const comm = {
      username: username,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.chapterComments[key].unshift(comm);
    DatabaseService.insertComment(key, comm);
    this.notify();
  }
}

export const store = new Store();
