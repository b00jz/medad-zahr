// ==========================================================================
// Database Engine (Schemas & Persistence) - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db_store.json');

const INITIAL_DB = {
  users: [],
  books: [],
  poems: [],
  quotes: [],
  comments: {},
  reviews: {}
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
