// ==========================================================================
// Database Client Service - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

export class DatabaseService {
  static async getBooks() {
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        return data.books || [];
      }
    } catch (e) {
      console.warn('API Offline, using LocalStorage fallback for Books.');
    }
    const raw = localStorage.getItem('medad_books');
    return raw ? JSON.parse(raw) : [];
  }

  static async insertBook(bookData) {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (res.ok) {
        const data = await res.json();
        return data.book;
      }
    } catch (e) {
      console.warn('API Offline, saving Book to LocalStorage fallback.');
    }
    const books = await this.getBooks();
    books.unshift(bookData);
    localStorage.setItem('medad_books', JSON.stringify(books));
    return bookData;
  }

  static async getQuotes() {
    try {
      const res = await fetch('/api/quotes');
      if (res.ok) {
        const data = await res.json();
        return data.quotes || [];
      }
    } catch (e) {
      console.warn('API Offline, using LocalStorage fallback for Quotes.');
    }
    const raw = localStorage.getItem('medad_quotes');
    return raw ? JSON.parse(raw) : [];
  }

  static async insertQuote(quoteObj) {
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteObj)
      });
      if (res.ok) {
        const data = await res.json();
        return data.quote;
      }
    } catch (e) {
      console.warn('API Offline, saving Quote to LocalStorage.');
    }
    const quotes = await this.getQuotes();
    quotes.unshift(quoteObj);
    localStorage.setItem('medad_quotes', JSON.stringify(quotes));
    return quoteObj;
  }

  static async deleteQuote(quoteId) {
    try {
      await fetch(`/api/quotes/${quoteId}`, { method: 'DELETE' });
    } catch (e) {}
    let quotes = await this.getQuotes();
    quotes = quotes.filter(q => q.id !== quoteId);
    localStorage.setItem('medad_quotes', JSON.stringify(quotes));
    return quotes;
  }

  static async getComments(key) {
    try {
      const res = await fetch(`/api/comments/${encodeURIComponent(key)}`);
      if (res.ok) {
        const data = await res.json();
        return data.comments || [];
      }
    } catch (e) {}
    const raw = localStorage.getItem('medad_comments');
    const all = raw ? JSON.parse(raw) : {};
    return all[key] || [];
  }

  static async insertComment(key, commentObj) {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, commentObj })
      });
      if (res.ok) {
        const data = await res.json();
        return data.comments;
      }
    } catch (e) {}
    const raw = localStorage.getItem('medad_comments');
    const all = raw ? JSON.parse(raw) : {};
    if (!all[key]) all[key] = [];
    all[key].unshift(commentObj);
    localStorage.setItem('medad_comments', JSON.stringify(all));
    return all[key];
  }
}
