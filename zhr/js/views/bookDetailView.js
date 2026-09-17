// ==========================================================================
// Book Details & Reviews View - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';

export function renderBookDetailView() {
  const state = store.state;
  const book = state.books.find(b => b.id === state.activeBookId) || state.books[0];

  if (!book) return `<div class="container"><p>لم يتم العثور على الكتاب.</p></div>`;

  const isFav = state.shelf.favorites.includes(book.id);
  const isWish = state.shelf.wishlist.includes(book.id);
  const bookReviews = state.reviews[book.id] || [];

  return `
    <div class="container" style="padding-top: 2rem;">
      <button class="btn-secondary" id="detail-back-btn" style="margin-bottom: 1.5rem;">
        ← ${i18n.t('home')}
      </button>

      <div style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 2.5rem; box-shadow: var(--shadow-md); margin-bottom: 2.5rem;">
        <div style="display: grid; grid-template-columns: 240px 1fr; gap: 2.5rem; align-items: start;">
          <div>
            <img src="${book.cover}" alt="${book.title}" style="width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-lg);" />
            
            <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
              <button class="btn-primary" id="detail-read-now-btn" data-id="${book.id}" style="width: 100%; justify-content: center;">
                📖 ${i18n.t('readNow')}
              </button>

              <div style="display: flex; gap: 0.5rem;">
                <button class="btn-secondary" id="detail-fav-btn" data-id="${book.id}" style="flex: 1; justify-content: center; color: ${isFav ? 'var(--brand-rose)' : 'inherit'};">
                  ♥ ${isFav ? i18n.t('isFavorite') : i18n.t('markFavorite')}
                </button>
                <button class="btn-secondary" id="detail-wish-btn" data-id="${book.id}" style="flex: 1; justify-content: center; color: ${isWish ? 'var(--brand-amber)' : 'inherit'};">
                  🔖 ${isWish ? i18n.t('addedToWishlist') : i18n.t('addToWishlist')}
                </button>
              </div>
            </div>
          </div>

          <div>
            <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap;">
              <span class="book-category-tag">${book.genre || book.category}</span>
              ${book.safeStatus === 'VERIFIED_CLEAN' 
                ? `<span class="safe-shield-pill active">🛡️ ${i18n.t('verifiedClean')}</span>`
                : `<span class="safe-shield-pill inactive">🔒 ${i18n.t('redactedContent')}</span>`
              }
              <span style="font-size: 0.85rem; color: var(--text-muted);">اللغة: ${book.language === 'ar' ? 'العربية' : 'English'}</span>
            </div>

            <h1 style="font-family: var(--font-arabic-poetry); font-size: 2.4rem; color: var(--text-primary); margin-bottom: 0.5rem;">${book.title}</h1>
            <div style="font-size: 1.1rem; color: var(--brand-amber); font-weight: 600; margin-bottom: 1rem;">الكاتب: ${book.author}</div>

            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
              <div style="color: var(--brand-gold); font-weight: 700; font-size: 1.1rem;">
                ★ ${book.rating} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 400;">(${book.ratingCount} تقييماً)</span>
              </div>
              <span style="color: var(--border-hover);">|</span>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">📄 ${book.pages} صفحة</div>
            </div>

            <!-- Bio & Synopsis -->
            <div style="margin-bottom: 2rem;">
              <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);">${i18n.t('synopsis')}</h3>
              <p style="color: var(--text-secondary); line-height: 1.8;">${book.synopsis}</p>
            </div>

            <div style="background: var(--bg-primary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 2rem;">
              <h4 style="font-size: 1rem; color: var(--brand-amber); margin-bottom: 0.4rem;">${i18n.t('authorBio')}</h4>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">${book.authorBio || 'كاتب ومفكر تميز بأسلوبه الأدبي الرائع وكتبه الخالدة.'}</p>
            </div>

            <!-- Chapters Selection -->
            <div>
              <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-primary);">${i18n.t('chapters')} (${book.chapters?.length || 0})</h3>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${(book.chapters || []).map((chap, idx) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.25rem; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                    <span style="font-weight: 600; font-size: 0.95rem;">${chap.title}</span>
                    <button class="btn-secondary" data-action="read-chap" data-index="${idx}" style="padding: 0.35rem 0.85rem; font-size: 0.82rem;">
                      قراءة الفصل ←
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews & Opinions Section -->
      <section style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 2.5rem; box-shadow: var(--shadow-sm); margin-bottom: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem;">
          <h3 style="font-family: var(--font-arabic-poetry); font-size: 1.6rem;">${i18n.t('reviews')}</h3>
          <button class="btn-primary" id="add-review-modal-btn">${i18n.t('addReview')}</button>
        </div>

        ${bookReviews.length === 0 ? `
          <p style="color: var(--text-muted); text-align: center; padding: 2rem 0;">لا توجد مراجعات لهذه الرواية بعد. كُن أول من يشارك رأيه!</p>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${bookReviews.map(rev => `
              <div style="background: var(--bg-primary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="font-weight: 700; color: var(--text-primary);">${rev.username}</span>
                  <span style="color: var(--brand-gold); font-weight: 700;">★ ${rev.rating}/5</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${rev.comment}</p>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem; text-align: left;">${rev.date}</div>
              </div>
            `).join('')}
          </div>
        `}
      </section>
    </div>
  `;
}

export function bindBookDetailEvents() {
  const state = store.state;
  const book = state.books.find(b => b.id === state.activeBookId) || state.books[0];

  document.getElementById('detail-back-btn')?.addEventListener('click', () => store.setView('home'));
  
  document.getElementById('detail-read-now-btn')?.addEventListener('click', (e) => {
    store.startReadingBook(e.target.dataset.id);
  });

  document.getElementById('detail-fav-btn')?.addEventListener('click', (e) => {
    store.toggleFavorite(e.target.dataset.id);
  });

  document.getElementById('detail-wish-btn')?.addEventListener('click', (e) => {
    store.toggleWishlist(e.target.dataset.id);
  });

  document.querySelectorAll('[data-action="read-chap"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      store.setView('reader', { bookId: book.id, page: idx });
    });
  });

  document.getElementById('add-review-modal-btn')?.addEventListener('click', () => {
    const ratingStr = prompt("أدخل تقييمك للرواية من 1 إلى 5 نجوم:", "5");
    if (!ratingStr) return;
    const rating = Math.min(5, Math.max(1, parseInt(ratingStr, 10) || 5));
    const comment = prompt("اكتب انطباعك ومراجعتك الشخصية للرواية:");
    if (comment) {
      store.addBookReview(book.id, rating, comment);
    }
  });
}
