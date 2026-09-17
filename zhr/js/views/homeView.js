// ==========================================================================
// Home & Books Explore View - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';

export function renderHomeView() {
  const state = store.state;
  const featuredBook = state.books[0] || {};

  // Filter books based on search query, category, genre, safe shield, language
  let filteredBooks = state.books.filter(book => {
    // Search query filter
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const titleMatch = (book.title && book.title.toLowerCase().includes(q)) || 
                         (book.titleEn && book.titleEn.toLowerCase().includes(q));
      const authorMatch = book.author && book.author.toLowerCase().includes(q);
      const synopsisMatch = book.synopsis && book.synopsis.toLowerCase().includes(q);
      if (!titleMatch && !authorMatch && !synopsisMatch) return false;
    }

    // Category filter
    if (state.selectedCategory !== 'all' && book.category !== state.selectedCategory) {
      return false;
    }

    // Language filter
    if (state.selectedLanguage !== 'all' && book.language !== state.selectedLanguage) {
      return false;
    }

    // Strict Safe Shield filter
    if (state.safeShield && book.safeStatus === 'BLOCKED') {
      return false;
    }

    // Manual safe filter dropdown
    if (state.selectedSafeFilter === 'clean' && book.safeStatus !== 'VERIFIED_CLEAN') {
      return false;
    }

    return true;
  });

  return `
    <!-- Hero Banner -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <h1>${i18n.t('tagline')}</h1>
          <p>استمتع بتجربة قراءة فاخرة ومحمية بالكامل، تصفح أحدث الكتب والروايات والدواوين الشعرية الخالدة مع بيئة قراءة نقية تضمن حجب المحتوى الحساس.</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">${state.books.length}+</span>
              <span class="stat-label">كتاباً ورواية</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${state.poems.length}+</span>
              <span class="stat-label">قصيدة في الديوان</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">100%</span>
              <span class="stat-label">فلترة آمنة 18+</span>
            </div>
          </div>
        </div>

        ${featuredBook.id ? `
          <div class="hero-featured-card">
            <img src="${featuredBook.cover}" alt="${featuredBook.title}" class="featured-cover" />
            <div class="featured-info">
              <span class="book-category-tag">${i18n.t('recommended')}</span>
              <h3>${featuredBook.title}</h3>
              <div class="featured-author">${featuredBook.author}</div>
              <p class="featured-desc">${featuredBook.synopsis}</p>
              <button class="btn-primary" id="featured-read-btn" data-id="${featuredBook.id}">
                ${i18n.t('readNow')}
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    </section>

    <div class="container">
      <!-- Search & Filter Controls -->
      <section class="filter-section">
        <div class="search-box-large">
          <input 
            type="text" 
            class="search-input-large" 
            id="home-search-input" 
            placeholder="${i18n.t('searchPlaceholder')}" 
            value="${state.searchQuery}"
          />
          <button class="search-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>

        <div class="filter-row">
          <div class="filter-group">
            <select class="filter-select" id="filter-category-select">
              <option value="all">${i18n.t('allCategories')}</option>
              <option value="novels" ${state.selectedCategory === 'novels' ? 'selected' : ''}>${i18n.t('novels')}</option>
              <option value="poetry" ${state.selectedCategory === 'poetry' ? 'selected' : ''}>${i18n.t('poetry')}</option>
              <option value="philosophy" ${state.selectedCategory === 'philosophy' ? 'selected' : ''}>${i18n.t('philosophy')}</option>
              <option value="history" ${state.selectedCategory === 'history' ? 'selected' : ''}>${i18n.t('history')}</option>
            </select>

            <select class="filter-select" id="filter-language-select">
              <option value="all">جميع اللغات / All Languages</option>
              <option value="ar" ${state.selectedLanguage === 'ar' ? 'selected' : ''}>${i18n.t('arabicBooks')}</option>
              <option value="en" ${state.selectedLanguage === 'en' ? 'selected' : ''}>${i18n.t('englishBooks')}</option>
            </select>

            <select class="filter-select" id="filter-safe-select">
              <option value="all">${i18n.t('allContent')}</option>
              <option value="clean" ${state.selectedSafeFilter === 'clean' ? 'selected' : ''}>${i18n.t('cleanOnly')}</option>
            </select>
          </div>

          <div class="filter-group">
            <span class="filter-pill ${state.selectedCategory === 'all' ? 'active' : ''}" data-cat="all">الكل</span>
            <span class="filter-pill ${state.selectedCategory === 'novels' ? 'active' : ''}" data-cat="novels">روايات</span>
            <span class="filter-pill ${state.selectedCategory === 'poetry' ? 'active' : ''}" data-cat="poetry">شعر</span>
            <span class="filter-pill ${state.selectedCategory === 'philosophy' ? 'active' : ''}" data-cat="philosophy">فلسفة</span>
          </div>
        </div>
      </section>

      <!-- Books Grid -->
      <section>
        <div class="section-header">
          <h2 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            ${i18n.t('explore')} (${filteredBooks.length})
          </h2>
        </div>

        ${filteredBooks.length === 0 ? `
          <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p style="margin-top: 1rem; font-size: 1.1rem;">لم يتم العثور على كتب تطابق خيارات البحث الحالية.</p>
          </div>
        ` : `
          <div class="books-grid">
            ${filteredBooks.map(book => renderBookCard(book, state)).join('')}
          </div>
        `}
      </section>
    </div>
  `;
}

function renderBookCard(book, state) {
  const isFav = state.shelf.favorites.includes(book.id);
  const isWish = state.shelf.wishlist.includes(book.id);

  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-cover-wrap">
        <img src="${book.cover}" alt="${book.title}" class="book-cover-img" />
        
        ${book.safeStatus === 'VERIFIED_CLEAN' 
          ? `<div class="book-badge-safe">🛡️ ${i18n.t('verifiedClean')}</div>`
          : `<div class="book-badge-redacted">🔒 ${i18n.t('redactedContent')}</div>`
        }
      </div>

      <div class="book-card-body">
        <span class="book-category-tag">${book.genre || book.category}</span>
        <h3 class="book-card-title" data-action="detail" data-id="${book.id}">${book.title}</h3>
        <div class="book-card-author">${book.author}</div>
        
        <div class="book-card-rating">
          <span>★</span>
          <span class="rating-score">${book.rating}</span>
          <span class="rating-count">(${book.ratingCount})</span>
        </div>

        <p class="book-card-bio">${book.synopsis}</p>

        <div class="book-card-actions">
          <button class="btn-read" data-action="read" data-id="${book.id}">
            ${i18n.t('readNow')}
          </button>
          
          <button class="btn-icon" data-action="favorite" data-id="${book.id}" title="${i18n.t('markFavorite')}" style="color: ${isFav ? 'var(--brand-rose)' : 'inherit'};">
            ♥
          </button>

          <button class="btn-icon" data-action="wishlist" data-id="${book.id}" title="${i18n.t('addToWishlist')}" style="color: ${isWish ? 'var(--brand-amber)' : 'inherit'};">
            🔖
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindHomeEvents() {
  document.getElementById('home-search-input')?.addEventListener('input', (e) => {
    store.setSearchQuery(e.target.value);
  });

  document.getElementById('filter-category-select')?.addEventListener('change', (e) => {
    store.setFilters({ category: e.target.value });
  });

  document.getElementById('filter-language-select')?.addEventListener('change', (e) => {
    store.setFilters({ language: e.target.value });
  });

  document.getElementById('filter-safe-select')?.addEventListener('change', (e) => {
    store.setFilters({ safeFilter: e.target.value });
  });

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      store.setFilters({ category: pill.dataset.cat });
    });
  });

  document.getElementById('featured-read-btn')?.addEventListener('click', (e) => {
    store.startReadingBook(e.target.dataset.id);
  });

  // Delegate actions on book cards
  document.querySelector('.books-grid')?.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const bookId = target.dataset.id;

    if (action === 'read') {
      store.startReadingBook(bookId);
    } else if (action === 'detail') {
      store.setView('book-detail', { bookId });
    } else if (action === 'favorite') {
      store.toggleFavorite(bookId);
    } else if (action === 'wishlist') {
      store.toggleWishlist(bookId);
    }
  });
}
