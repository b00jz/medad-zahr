// ==========================================================================
// Personal Account & Reading Tracker - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';
import { AuthService } from '../services/authService.js';

export function renderProfileView() {
  const state = store.state;
  const user = state.user;
  const shelf = state.shelf;

  const currentBooks = state.books.filter(b => shelf.currentlyReading.some(item => item.bookId === b.id));
  const favBooks = state.books.filter(b => shelf.favorites.includes(b.id));
  const wishBooks = state.books.filter(b => shelf.wishlist.includes(b.id));
  const doneBooks = state.books.filter(b => shelf.completed.includes(b.id));

  return `
    <div class="container" style="padding-top: 1.5rem; padding-bottom: 5rem;">
      <!-- Profile Header -->
      <section class="profile-header">
        <img src="${user.avatar}" alt="${user.username}" class="profile-avatar" />

        <div class="profile-info" style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.2rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h2>${user.username}</h2>
              <span class="safe-shield-pill active">${user.provider ? `تسجيل: ${user.provider}` : 'مسجل'}</span>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <button class="btn-secondary" id="profile-switch-acc-btn" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
                🔑 تبديل الحساب / Google / Phone
              </button>
              <button class="btn-secondary" id="profile-logout-btn" style="font-size: 0.85rem; padding: 0.4rem 0.85rem; color: var(--danger-red);">
                خروج
              </button>
            </div>
          </div>

          <p style="color: var(--text-secondary); font-size: 0.92rem;">عضو أدبي مميز، يقرأ ويستمتع ببيئة نقية محمية بفلتر +18 الفائق.</p>

          <div style="display: flex; gap: 2rem; margin-top: 1.25rem;">
            <div class="stat-item">
              <span class="stat-number">${user.stats.booksRead}</span>
              <span class="stat-label">${i18n.t('booksReadCount')}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${user.stats.pagesRead}</span>
              <span class="stat-label">${i18n.t('pagesRead')}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${user.stats.streakDays}🔥</span>
              <span class="stat-label">${i18n.t('activeStreak')}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${state.quotes.length}</span>
              <span class="stat-label">اقتباس محفوظ</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Library Shelf Tabs -->
      <nav class="profile-tabs" id="shelf-tabs">
        <button class="tab-btn active" data-tab="curr">📖 ${i18n.t('currentlyReading')} (${currentBooks.length})</button>
        <button class="tab-btn" data-tab="fav">♥ ${i18n.t('favorites')} (${favBooks.length})</button>
        <button class="tab-btn" data-tab="wish">🔖 ${i18n.t('wishlist')} (${wishBooks.length})</button>
        <button class="tab-btn" data-tab="done">✅ ${i18n.t('completed')} (${doneBooks.length})</button>
        <button class="tab-btn" data-tab="quotes">💬 اقتباساتي (${state.quotes.length})</button>
      </nav>

      <!-- Shelf Content Grid -->
      <section id="shelf-content-grid" class="books-grid">
        ${renderBooksGrid(currentBooks, state)}
      </section>
    </div>
  `;
}

function renderBooksGrid(booksList, state) {
  if (booksList.length === 0) {
    return `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">لا توجد كتب في هذا الرف حالياً.</div>`;
  }

  return booksList.map(book => `
    <div class="book-card" data-id="${book.id}">
      <div class="book-cover-wrap">
        <img src="${book.cover}" alt="${book.title}" class="book-cover-img" />
      </div>
      <div class="book-card-body">
        <h3 class="book-card-title">${book.title}</h3>
        <div class="book-card-author">${book.author}</div>
        <button class="btn-primary" data-action="resume-read" data-id="${book.id}" style="width: 100%; justify-content: center; margin-top: 1rem;">
          متابعة القراءة ←
        </button>
      </div>
    </div>
  `).join('');
}

export function bindProfileEvents() {
  const state = store.state;
  const shelf = state.shelf;

  document.getElementById('profile-switch-acc-btn')?.addEventListener('click', () => {
    store.setAuthModal(true);
  });

  document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
    AuthService.logout();
    alert('تم تسجيل الخروج.');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      if (tab === 'quotes') {
        store.setView('quotes');
        return;
      }

      let targetList = [];
      if (tab === 'curr') targetList = state.books.filter(b => shelf.currentlyReading.some(item => item.bookId === b.id));
      if (tab === 'fav') targetList = state.books.filter(b => shelf.favorites.includes(b.id));
      if (tab === 'wish') targetList = state.books.filter(b => shelf.wishlist.includes(b.id));
      if (tab === 'done') targetList = state.books.filter(b => shelf.completed.includes(b.id));

      const grid = document.getElementById('shelf-content-grid');
      if (grid) grid.innerHTML = renderBooksGrid(targetList, state);
    });
  });

  document.getElementById('shelf-content-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="resume-read"]');
    if (btn) {
      store.startReadingBook(btn.dataset.id);
    }
  });
}
