// ==========================================================================
// Interactive Reader View (Zoom Slider & Sentence Search) - مِدادُ زَهْر
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';
import { ModerationService } from '../services/moderationService.js';

export function renderReaderView() {
  const state = store.state;
  const book = state.books.find(b => b.id === state.activeBookId) || state.books[0];
  const cfg = state.readerConfig;

  if (!book || !book.chapters) {
    return `<div class="reader-overlay"><p>لا توجد فصول متوفرة في هذا الكتاب.</p></div>`;
  }

  const totalPages = book.chapters.length;
  const currentPageIndex = Math.min(totalPages - 1, Math.max(0, cfg.currentPage));
  const currentChapter = book.chapters[currentPageIndex] || { title: '', content: '' };
  
  let displayContent = currentChapter.content;
  
  if (state.safeShield) {
    displayContent = ModerationService.applyRedaction(displayContent);
  }

  let matchCount = 0;
  if (cfg.searchExecuted && cfg.searchQuery.trim()) {
    const q = cfg.searchQuery.trim();
    const regex = new RegExp(`(${ModerationService.escapeRegExp(q)})`, 'gi');
    const matches = displayContent.match(regex);
    matchCount = matches ? matches.length : 0;
    displayContent = displayContent.replace(regex, `<mark class="search-highlight">$1</mark>`);
  }

  const isBookmarked = state.bookmarks[book.id]?.pageIndex === currentPageIndex;
  const chapterCommentsKey = `${book.id}-chap-${currentPageIndex}`;
  const comments = state.chapterComments[chapterCommentsKey] || [];
  const zoomPercent = Math.round((cfg.zoomScale || 1.0) * 100);

  return `
    <div class="reader-overlay">
      <!-- Reader Header Toolbar -->
      <header class="reader-header">
        <div class="reader-title-info">
          <button class="btn-icon" id="reader-close-btn" title="إغلاق القارئ">✕</button>
          <div>
            <h2>${book.title}</h2>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${currentChapter.title}</div>
          </div>
        </div>

        <div class="reader-toolbar" style="flex-wrap: wrap; gap: 0.5rem;">
          <!-- Sentence Search Input with Explicit Search Button -->
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <input 
              type="text" 
              id="reader-search-input" 
              placeholder="ابحث عن جملة كاملة..."
              value="${cfg.searchQuery}"
              style="padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.82rem; background: var(--bg-primary); color: var(--text-primary); width: 150px;"
            />
            <button class="btn-primary" id="reader-search-btn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
              🔍 بحث
            </button>
          </div>

          <!-- Zoom Slider 50% to 200% -->
          <div style="display: flex; align-items: center; gap: 0.4rem; background: var(--bg-primary); padding: 0.25rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--brand-amber);">🔍 ${zoomPercent}%</span>
            <input 
              type="range" 
              id="reader-zoom-slider" 
              min="0.5" 
              max="2.0" 
              step="0.05" 
              value="${cfg.zoomScale || 1.0}"
              style="width: 90px; cursor: pointer;"
            />
          </div>

          <!-- Page Flip Mode Switch -->
          <select id="reader-mode-select" class="filter-select" style="padding: 0.35rem; font-size: 0.8rem;">
            <option value="flip-3d" ${cfg.mode === 'flip-3d' ? 'selected' : ''}>📖 3D Flip</option>
            <option value="slide" ${cfg.mode === 'slide' ? 'selected' : ''}>↔️ Slide</option>
            <option value="scroll" ${cfg.mode === 'scroll' ? 'selected' : ''}>↕️ Scroll</option>
          </select>

          <!-- Quote Collector Action -->
          <button class="btn-secondary" id="reader-save-quote-btn" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;">
            💬 حفظ اقتباس
          </button>

          <!-- Bookmark Button -->
          <button class="btn-icon" id="reader-bookmark-btn" title="${i18n.t('bookmark')}" style="color: ${isBookmarked ? 'var(--brand-amber)' : 'inherit'}; width: 36px; height: 36px;">
            ${isBookmarked ? '🔖' : '🏷️'}
          </button>
        </div>
      </header>

      <!-- Reader Content Canvas -->
      <main class="reader-body">
        <div class="reader-canvas ${cfg.orientation === 'landscape-mode' ? 'landscape-mode' : ''} mode-${cfg.mode}" style="transform: scale(${cfg.zoomScale || 1.0}); transform-origin: top center;">
          
          ${cfg.searchExecuted && cfg.searchQuery ? `
            <div style="background: var(--warning-amber-bg); color: var(--warning-amber); padding: 0.5rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; margin-bottom: 1rem; text-align: center;">
              تم العثور على (${matchCount}) مطابقة للعبارة في هذا الفصل
            </div>
          ` : ''}

          <h3 style="font-family: var(--font-arabic-poetry); color: var(--brand-amber); margin-bottom: 1.5rem; text-align: center; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
            ${currentChapter.title}
          </h3>

          <div class="reader-page-content" id="reader-text-container">
            ${displayContent}
          </div>

          <!-- Public Global Comments Section -->
          <div style="margin-top: 4rem; padding-top: 2rem; border-top: 2px dashed var(--border-light);">
            <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 1rem;">
              💬 ${i18n.t('chapterComments')} (عاما للجميع - ${comments.length})
            </h4>

            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
              <input type="text" id="chap-comment-input" placeholder="${i18n.t('writeComment')}" class="form-control" style="flex: 1;" />
              <button class="btn-primary" id="chap-comment-submit">${i18n.t('postComment')}</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${comments.map(c => `
                <div style="background: var(--bg-primary); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.88rem;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--brand-amber); margin-bottom: 0.2rem;">
                    <span>${c.username}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">${c.date}</span>
                  </div>
                  <p style="color: var(--text-secondary);">${c.comment}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </main>

      <!-- Reader Footer Page Nav -->
      <footer class="reader-footer">
        <button class="btn-secondary" id="reader-prev-page" ${currentPageIndex <= 0 ? 'disabled style="opacity:0.5;"' : ''}>
          ← الفصل السابق
        </button>

        <div class="page-indicator">
          فصل ${currentPageIndex + 1} من ${totalPages}
        </div>

        <button class="btn-secondary" id="reader-next-page" ${currentPageIndex >= totalPages - 1 ? 'disabled style="opacity:0.5;"' : ''}>
          الفصل التالي →
        </button>
      </footer>
    </div>
  `;
}

export function bindReaderEvents() {
  const state = store.state;
  const book = state.books.find(b => b.id === state.activeBookId) || state.books[0];
  const cfg = state.readerConfig;

  document.getElementById('reader-close-btn')?.addEventListener('click', () => {
    store.setView('book-detail', { bookId: book.id });
  });

  document.getElementById('reader-prev-page')?.addEventListener('click', () => {
    if (cfg.currentPage > 0) {
      store.updateReaderConfig({ currentPage: cfg.currentPage - 1 });
    }
  });

  document.getElementById('reader-next-page')?.addEventListener('click', () => {
    if (book && book.chapters && cfg.currentPage < book.chapters.length - 1) {
      store.updateReaderConfig({ currentPage: cfg.currentPage + 1 });
    }
  });

  // Smooth Zoom Range Slider 50% to 200%
  document.getElementById('reader-zoom-slider')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    store.updateReaderConfig({ zoomScale: val });
  });

  document.getElementById('reader-mode-select')?.addEventListener('change', (e) => {
    store.updateReaderConfig({ mode: e.target.value });
  });

  document.getElementById('reader-bookmark-btn')?.addEventListener('click', () => {
    store.saveBookmark(book.id, cfg.currentPage);
    alert(i18n.t('bookmarked'));
  });

  // Explicit Sentence Search Button
  const runSearch = () => {
    const q = document.getElementById('reader-search-input')?.value || '';
    store.updateReaderConfig({ searchQuery: q, searchExecuted: true });
  };

  document.getElementById('reader-search-btn')?.addEventListener('click', runSearch);
  document.getElementById('reader-search-input')?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') runSearch();
  });

  // Save Selected Text as Favorite Quote
  document.getElementById('reader-save-quote-btn')?.addEventListener('click', () => {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      store.addQuote(selection, book.title, book.author);
      alert('تم حفظ الاقتباس بنجاح في قسم "اقتباساتي المفضلة" בחسابك!');
    } else {
      const quoteInput = prompt('ادخل الاقتباس الذي ترغب في حفظه:');
      if (quoteInput && quoteInput.trim()) {
        store.addQuote(quoteInput.trim(), book.title, book.author);
        alert('تم حفظ الاقتباس بنجاح!');
      }
    }
  });

  // Handle Redacted Passage Clicks
  document.querySelectorAll('.redacted-passage').forEach(span => {
    span.addEventListener('click', () => {
      if (!span.classList.contains('unlocked')) {
        const confirmUnlock = confirm(i18n.t('redactedWarning') + '\n\nهل ترغب في فتح هذا المقطع المحجوب مؤقتاً؟');
        if (confirmUnlock) span.classList.add('unlocked');
      } else {
        span.classList.remove('unlocked');
      }
    });
  });

  // Post public chapter comment
  document.getElementById('chap-comment-submit')?.addEventListener('click', () => {
    const input = document.getElementById('chap-comment-input');
    if (input && input.value.trim()) {
      const key = `${book.id}-chap-${cfg.currentPage}`;
      store.addChapterComment(key, input.value.trim());
      input.value = '';
    }
  });
}
