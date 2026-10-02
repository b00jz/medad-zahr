// ==========================================================================
// Personal Account & Reading Tracker - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';
import { AuthService } from '../services/authService.js';
import { SecurityService } from '../services/securityService.js';

export function renderProfileView() {
  const state = store.state;
  const user = state.user || {};
  const shelf = state.shelf || { currentlyReading: [], favorites: [], wishlist: [], completed: [] };

  const isGuest = user.isGuest || user.role === 'guest';

  const currentBooks = state.books.filter(b => (shelf.currentlyReading || []).some(item => item.bookId === b.id));
  const favBooks = state.books.filter(b => (shelf.favorites || []).includes(b.id));
  const wishBooks = state.books.filter(b => (shelf.wishlist || []).includes(b.id));
  const doneBooks = state.books.filter(b => (shelf.completed || []).includes(b.id));

  const stats = user.stats || {
    booksRead: 0,
    pagesRead: 0,
    quotesSaved: state.quotes.length,
    booksAdded: 0,
    poemsAdded: 0,
    streakDays: 0
  };

  return `
    <div class="container" style="padding-top: 1.5rem; padding-bottom: 5rem;">
      
      ${isGuest ? `
        <div style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 2rem; text-align: center; margin-bottom: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">👤</div>
          <h2 style="font-family: var(--font-arabic-poetry); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 0.5rem;">
            أهلاً بك في منصة مِدادُ زَهْر
          </h2>
          <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto 1.5rem; font-size: 0.9rem;">
            قم بإنشاء حسابك الشخصي مجاناً أو تسجيل الدخول لحفظ مؤلفاتك، وتتبع كتبك واقتباساتك وإحصائيات قراءتك.
          </p>
          <button class="btn-primary" id="profile-login-cta-btn" style="padding: 0.75rem 1.75rem; font-size: 0.95rem;">
            🔑 ${i18n.t('loginToAccount')}
          </button>
        </div>
      ` : `
        <!-- Profile Header -->
        <section class="profile-header">
          <img src="${user.avatar || 'assets/logo.png'}" alt="${user.name || user.username}" class="profile-avatar" />

          <div class="profile-info" style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.2rem;">
              <div>
                <h2 style="font-size: 1.45rem; color: var(--text-primary); margin-bottom: 0.1rem;">
                  ${SecurityService.escapeHTML(user.name || user.username)}
                </h2>
                <div style="font-size: 0.82rem; color: var(--brand-amber); font-weight: 600;">
                  @${SecurityService.escapeHTML(user.username || 'user')} ${user.provider ? `(${user.provider})` : ''}
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <button class="btn-secondary" id="profile-edit-btn" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
                  ✏️ ${i18n.t('editProfile')}
                </button>
                <button class="btn-secondary" id="profile-logout-btn" style="font-size: 0.85rem; padding: 0.4rem 0.85rem; color: var(--danger-red);">
                  ${i18n.t('logout')}
                </button>
              </div>
            </div>

            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 0.4rem;">
              ${SecurityService.escapeHTML(user.bio || 'عضو في منصة مِدادُ زَهْر للقراءة والأدب.')}
            </p>

            <!-- Detailed Metrics Dashboard -->
            <div class="profile-stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 1.25rem; background: var(--bg-primary); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
              <div class="stat-item">
                <span class="stat-number">${stats.booksRead}</span>
                <span class="stat-label">${i18n.t('booksReadCount')}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${stats.pagesRead}</span>
                <span class="stat-label">${i18n.t('pagesRead')}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${state.quotes.length}</span>
                <span class="stat-label">${i18n.t('quotesSavedCount')}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${stats.booksAdded}</span>
                <span class="stat-label">${i18n.t('booksAddedCount')}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${stats.poemsAdded}</span>
                <span class="stat-label">${i18n.t('poemsAddedCount')}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${stats.streakDays}🔥</span>
                <span class="stat-label">${i18n.t('activeStreak')}</span>
              </div>
            </div>
          </div>
        </section>
      `}

      <!-- Library Shelf Tabs -->
      <nav class="profile-tabs" id="shelf-tabs" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1.25rem;">
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
    return `
      <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem 1rem; color: var(--text-muted); background: var(--surface-card); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
        لا توجد كتب في هذا الرف حالياً.
      </div>
    `;
  }

  return booksList.map(book => `
    <div class="book-card" data-id="${book.id}">
      <div class="book-cover-wrap">
        <img src="${SecurityService.safeImageURL(book.cover)}" alt="${SecurityService.escapeHTML(book.title)}" class="book-cover-img" />
      </div>
      <div class="book-card-body">
        <h3 class="book-card-title">${SecurityService.escapeHTML(book.title)}</h3>
        <div class="book-card-author">${SecurityService.escapeHTML(book.author)}</div>
        <button class="btn-primary" data-action="resume-read" data-id="${book.id}" style="width: 100%; justify-content: center; margin-top: 0.75rem; padding: 0.4rem;">
          متابعة القراءة ←
        </button>
      </div>
    </div>
  `).join('');
}

export function bindProfileEvents() {
  const state = store.state;
  const shelf = state.shelf || {};

  document.getElementById('profile-login-cta-btn')?.addEventListener('click', () => {
    store.setAuthModal(true);
  });

  document.getElementById('profile-edit-btn')?.addEventListener('click', () => {
    store.setEditProfileModal(true);
  });

  document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
    AuthService.logout();
    alert('تم تسجيل الخروج بنجاح.');
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
      if (tab === 'curr') targetList = state.books.filter(b => (shelf.currentlyReading || []).some(item => item.bookId === b.id));
      if (tab === 'fav') targetList = state.books.filter(b => (shelf.favorites || []).includes(b.id));
      if (tab === 'wish') targetList = state.books.filter(b => (shelf.wishlist || []).includes(b.id));
      if (tab === 'done') targetList = state.books.filter(b => (shelf.completed || []).includes(b.id));

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
