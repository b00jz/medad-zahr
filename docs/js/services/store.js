// ==========================================================================
// Central State Store (Mobile & Database Sync) - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { INITIAL_BOOKS, INITIAL_POEMS } from './initialData.js';
import { DatabaseService } from './dbService.js';
import { FirebaseService } from './firebase.js';

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

    const defaultVIPUser = {
      id: 'usr-vip-xoencgz',
      name: "xoencgz 👑 (المؤسس الملكي)",
      username: "xoencgz",
      email: "xoencgz@gmail.com",
      bio: "👑 الحساب الملكي المخصص الحصري لمؤسس منصة مِدادُ زَهْر.",
      role: "vip_owner",
      isVIP: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      stats: { booksRead: 12, pagesRead: 450, quotesSaved: 30, booksAdded: 5, poemsAdded: 10, streakDays: 30 },
      shelf: { currentlyReading: [], wishlist: [], favorites: [], completed: [] },
      followers: ['usr-101', 'usr-102'],
      following: ['usr-101']
    };

    const savedUsers = localStorage.getItem('medad_all_users');
    const initialDirectory = [
      defaultVIPUser,
      {
        id: 'usr-101',
        name: "طاهر الأديب",
        username: "taher_reader",
        email: "taher@example.com",
        bio: "قارئ شغوف بالروايات الكلاسيكية والشعر الجاهلي.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        stats: { booksRead: 8, pagesRead: 200, quotesSaved: 12, booksAdded: 2, poemsAdded: 3, streakDays: 5 },
        followers: ['usr-vip-xoencgz'],
        following: ['usr-vip-xoencgz']
      },
      {
        id: 'usr-102',
        name: "سارة الشاعرة",
        username: "sara_poet",
        email: "sara@example.com",
        bio: "كاتبة قصائد وشعر حديث.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
        stats: { booksRead: 15, pagesRead: 600, quotesSaved: 25, booksAdded: 4, poemsAdded: 8, streakDays: 14 },
        followers: ['usr-vip-xoencgz'],
        following: []
      }
    ];

    const allUsersList = savedUsers ? JSON.parse(savedUsers) : initialDirectory;
    const savedFollowing = localStorage.getItem('medad_following');

    this.state = {
      theme: savedTheme,
      layoutMode: 'mobile', // Locked strictly to mobile device frame
      currentView: 'home',
      activeBookId: null,
      activePoemId: null,
      showAuthModal: false,
      showFeedbackModal: false,
      showEditProfileModal: false,
      userSearchQuery: '',
      readerConfig: {
        mode: 'flip-3d',
        zoomScale: 1.0,
        readerTheme: 'light',
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
      allUsers: allUsersList,
      following: savedFollowing ? JSON.parse(savedFollowing) : ['usr-vip-xoencgz'],
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
    localStorage.setItem('medad_all_users', JSON.stringify(this.state.allUsers));
    localStorage.setItem('medad_following', JSON.stringify(this.state.following));
    localStorage.setItem('medad_shelf', JSON.stringify(this.state.shelf));
    localStorage.setItem('medad_bookmarks', JSON.stringify(this.state.bookmarks));
    localStorage.setItem('medad_reviews', JSON.stringify(this.state.reviews));
    localStorage.setItem('medad_comments', JSON.stringify(this.state.chapterComments));
    localStorage.setItem('medad_quotes', JSON.stringify(this.state.quotes));
    localStorage.setItem('medad_theme', this.state.theme);
    localStorage.setItem('medad_layout_mode', this.state.layoutMode);
  }

  // --- Real-time Cloud Firestore Sync Handlers ---
  syncCloudBooks(cloudBooks) {
    if (!cloudBooks || !Array.isArray(cloudBooks)) return;
    const bookMap = new Map();
    INITIAL_BOOKS.forEach(b => bookMap.set(String(b.id), b));
    this.state.books.forEach(b => bookMap.set(String(b.id), b));
    cloudBooks.forEach(cb => {
      if (cb && cb.title) {
        bookMap.set(String(cb.id), { ...cb });
      }
    });
    this.state.books = Array.from(bookMap.values());
    this.notify();
  }

  syncCloudPoems(cloudPoems) {
    if (!cloudPoems || !Array.isArray(cloudPoems)) return;
    const poemMap = new Map();
    INITIAL_POEMS.forEach(p => poemMap.set(String(p.id), p));
    this.state.poems.forEach(p => poemMap.set(String(p.id), p));
    cloudPoems.forEach(cp => {
      if (cp && cp.title) {
        poemMap.set(String(cp.id), { ...cp });
      }
    });
    this.state.poems = Array.from(poemMap.values());
    this.notify();
  }

  syncCloudQuotes(cloudQuotes) {
    if (!cloudQuotes || !Array.isArray(cloudQuotes)) return;
    const quoteMap = new Map();
    this.state.quotes.forEach(q => quoteMap.set(String(q.id), q));
    cloudQuotes.forEach(cq => {
      if (cq && cq.quoteText) {
        quoteMap.set(String(cq.id), { ...cq });
      }
    });
    this.state.quotes = Array.from(quoteMap.values());
    this.notify();
  }

  syncCloudUsers(cloudUsers) {
    if (!cloudUsers || !Array.isArray(cloudUsers)) return;
    const userMap = new Map();
    this.state.allUsers.forEach(u => userMap.set(String(u.id || u.username), u));
    cloudUsers.forEach(cu => {
      if (cu && cu.username) {
        userMap.set(String(cu.id || cu.username), { ...cu });
      }
    });
    this.state.allUsers = Array.from(userMap.values());
    this.notify();
  }

  setUserSearchQuery(query) {
    this.state.userSearchQuery = query;
    this.notify();
  }

  toggleFollowUser(userId) {
    if (!this.state.following) this.state.following = [];
    const index = this.state.following.indexOf(userId);
    const targetUser = this.state.allUsers.find(u => u.id === userId);

    if (index > -1) {
      this.state.following.splice(index, 1);
      if (targetUser && targetUser.followers) {
        targetUser.followers = targetUser.followers.filter(id => id !== this.state.user.id);
      }
    } else {
      this.state.following.push(userId);
      if (targetUser) {
        if (!targetUser.followers) targetUser.followers = [];
        targetUser.followers.push(this.state.user.id);
      }
    }
    if (targetUser) FirebaseService.syncCloudUser(targetUser);
    if (this.state.user && !this.state.user.isGuest) FirebaseService.syncCloudUser(this.state.user);
    this.notify();
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
    FirebaseService.syncCloudUser(this.state.user);
    this.notify();
  }

  updateUserProfile(updates) {
    if (!this.state.user) return;
    this.state.user = { ...this.state.user, ...updates };
    this.state.showEditProfileModal = false;
    FirebaseService.syncCloudUser(this.state.user);
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
    FirebaseService.saveCloudBook(newBook);
    
    if (this.state.user && this.state.user.stats) {
      this.state.user.stats.booksAdded = (this.state.user.stats.booksAdded || 0) + 1;
    }

    this.setView('home');
    this.notify();
  }

  deleteBook(bookId) {
    this.state.books = this.state.books.filter(b => b.id !== bookId);
    DatabaseService.deleteBook(bookId);
    FirebaseService.deleteCloudBook(bookId);
    if (this.state.activeBookId === bookId) {
      this.state.activeBookId = null;
      this.setView('home');
    } else {
      this.notify();
    }
  }

  addPoem(newPoem) {
    this.state.poems.unshift(newPoem);
    DatabaseService.insertPoem(newPoem);
    FirebaseService.saveCloudPoem(newPoem);
    
    if (this.state.user && this.state.user.stats) {
      this.state.user.stats.poemsAdded = (this.state.user.stats.poemsAdded || 0) + 1;
    }

    this.setView('diwan');
    this.notify();
  }

  deletePoem(poemId) {
    this.state.poems = this.state.poems.filter(p => p.id !== poemId);
    DatabaseService.deletePoem(poemId);
    FirebaseService.deleteCloudPoem(poemId);
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
    FirebaseService.saveCloudQuote(quoteText, bookTitle, author);

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
