// ==========================================================================
// Book-Style Interactive Reader View (3D Page Flip, Drag Swipe, & Zoom)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';
import { SecurityService } from '../services/securityService.js';

export function renderReaderView() {
  const state = store.state;
  const book = state.books.find(b => b.id === state.activeBookId) || state.books[0];
  const cfg = state.readerConfig;

  if (!book || !book.chapters || book.chapters.length === 0) {
    return `
      <div class="reader-overlay" style="display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
        <div>
          <h3 style="font-family: var(--font-arabic-poetry); font-size: 1.5rem; margin-bottom: 1rem;">لا توجد فصول متوفرة في هذا الكتاب</h3>
          <button class="btn-primary" id="reader-close-btn">العودة للمكتبة</button>
        </div>
      </div>
    `;
  }

  const totalPages = book.chapters.length;
  const currentPageIndex = Math.min(totalPages - 1, Math.max(0, cfg.currentPage));
  const currentChapter = book.chapters[currentPageIndex] || { title: '', content: '' };
  
  let displayContent = SecurityService.sanitizeHTML(currentChapter.content);

  let matchCount = 0;
  if (cfg.searchExecuted && cfg.searchQuery && cfg.searchQuery.trim()) {
    const q = cfg.searchQuery.trim();
    const regex = new RegExp(`(${SecurityService.escapeRegExp(q)})`, 'gi');
    const matches = displayContent.match(regex);
    matchCount = matches ? matches.length : 0;
    displayContent = displayContent.replace(regex, `<mark class="search-highlight">$1</mark>`);
  }

  const isBookmarked = state.bookmarks[book.id]?.pageIndex === currentPageIndex;
  const chapterCommentsKey = `${book.id}-chap-${currentPageIndex}`;
  const comments = state.chapterComments[chapterCommentsKey] || [];
  
  // Continuous Zoom Range calculation: 1% to 150%
  const zoomScaleFactor = cfg.zoomScale !== undefined ? cfg.zoomScale : 1.0;
  const zoomPercent = Math.round(zoomScaleFactor * 100);

  const safeTitle = SecurityService.escapeHTML(book.title);
  const safeChapTitle = SecurityService.escapeHTML(currentChapter.title);
  const isArabicBook = book.language !== 'en' && i18n.getLanguage() !== 'en';
  const readerTheme = cfg.readerTheme || 'light';

  return `
    <div class="reader-overlay reader-theme-${readerTheme}">
      <!-- Reader Header Toolbar -->
      <header class="reader-header">
        <div class="reader-title-info" style="display: flex; align-items: center; gap: 0.75rem;">
          <button class="btn-icon" id="reader-close-btn" title="إغلاق القارئ">✕</button>
          <div>
            <h2 style="font-size: 1.05rem; font-weight: 700;">${safeTitle}</h2>
            <div style="font-size: 0.78rem; opacity: 0.75;">${safeChapTitle}</div>
          </div>
        </div>

        <div class="reader-toolbar">
          <!-- Continuous Zoom Slider (1% to 150%) -->
          <div class="zoom-slider-box">
            <span class="zoom-label" id="zoom-percent-display">🔍 ${zoomPercent}%</span>
            <input 
              type="range" 
              id="reader-zoom-slider" 
              min="1" 
              max="150" 
              step="1" 
              value="${zoomPercent}"
              title="${i18n.t('zoomRange')} (1% - 150%)"
            />
          </div>

          <!-- Bright / Dark Color Theme Toggle -->
          <button class="btn-icon" id="reader-theme-toggle-btn" title="تغيير لون الصفحة (أبيض / أسود)">
            ${readerTheme === 'light' ? '🌙 أسود' : '☀️ أبيض'}
          </button>

          <!-- Save Quote -->
          <button class="btn-secondary" id="reader-save-quote-btn" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;">
            💬 اقتباس
          </button>

          <!-- Bookmark -->
          <button class="btn-icon" id="reader-bookmark-btn" title="${i18n.t('bookmark')}" style="color: ${isBookmarked ? 'var(--brand-amber)' : 'inherit'}; width: 34px; height: 34px;">
            ${isBookmarked ? '🔖' : '🏷️'}
          </button>
        </div>
      </header>

      <!-- Main Book Stage Container (Book Page Sheet Effect with Drag Swipe) -->
      <main class="reader-body" id="reader-body-container">
        <div class="book-stage-container" id="book-stage-element" dir="${isArabicBook ? 'rtl' : 'ltr'}">
          <div class="book-3d-frame">
            <div class="book-spine-binding"></div>
            <div class="book-page-sheet" id="active-page-sheet" style="font-size: ${zoomScaleFactor * 1.15}rem;">
              
              <div class="book-page-header">
                <span class="book-header-title">${safeTitle}</span>
                <span class="book-header-chapter">${safeChapTitle}</span>
              </div>

              ${cfg.searchExecuted && cfg.searchQuery ? `
                <div style="background: var(--warning-amber-bg); color: var(--warning-amber); padding: 0.4rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 700; margin-bottom: 1rem; text-align: center;">
                  تم العثور على (${matchCount}) مطابقة للعبارة في هذا الفصل
                </div>
              ` : ''}

              <h3 class="book-chapter-heading">${safeChapTitle}</h3>

              <!-- Actual Page Text Content -->
              <div class="reader-page-content" id="reader-text-container">
                ${displayContent}
              </div>

              <!-- Physical Book Page Footer & Page Number -->
              <div class="book-page-footer">
                <span>${isArabicBook ? 'سحب اللمس أو النقر لتقليب الصفحة ◄' : '◄ Drag or Click to Flip Page'}</span>
                <span class="book-page-number">صفحة ${currentPageIndex + 1} من ${totalPages}</span>
              </div>

            </div>
          </div>
        </div>

        <!-- Reader Chapter Discussions & Comments Section -->
        <div class="chapter-comments-box">
          <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 1rem;">
            💬 ${i18n.t('chapterComments')} (${comments.length})
          </h4>

          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
            <input type="text" id="chap-comment-input" placeholder="${i18n.t('writeComment')}" class="form-control" style="flex: 1;" />
            <button class="btn-primary" id="chap-comment-submit">${i18n.t('postComment')}</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${comments.map(c => `
              <div style="background: var(--surface-card); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.88rem;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--brand-amber); margin-bottom: 0.2rem;">
                  <span>${SecurityService.escapeHTML(c.username)}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">${SecurityService.escapeHTML(c.date)}</span>
                </div>
                <p style="color: var(--text-secondary);">${SecurityService.escapeHTML(c.comment)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </main>

      <!-- Reader Navigation Footer (Page Flip Triggers) -->
      <footer class="reader-footer">
        <button class="btn-secondary" id="reader-prev-page" ${currentPageIndex <= 0 ? 'disabled style="opacity:0.4;"' : ''}>
          ${isArabicBook ? 'الفصل التالي ◄' : '◄ Previous Page'}
        </button>

        <div class="page-indicator">
          📖 ${currentPageIndex + 1} / ${totalPages}
        </div>

        <button class="btn-secondary" id="reader-next-page" ${currentPageIndex >= totalPages - 1 ? 'disabled style="opacity:0.4;"' : ''}>
          ${isArabicBook ? '► الفصل السابق' : 'Next Page ►'}
        </button>
      </footer>
    </div>
  `;
}

export function bindReaderEvents() {
  const state = store.state;
  const book = state.books.find(b => b.id === state.activeBookId) || state.books[0];
  const cfg = state.readerConfig;

  if (!book || !book.chapters) return;

  const totalPages = book.chapters.length;
  const isArabicBook = book.language !== 'en' && i18n.getLanguage() !== 'en';

  const triggerPageTurn = (direction) => {
    // direction: 'next' or 'prev'
    const pageSheet = document.getElementById('active-page-sheet');
    if (pageSheet) {
      pageSheet.classList.add(direction === 'next' ? 'flip-next-anim' : 'flip-prev-anim');
    }

    setTimeout(() => {
      let targetPage = cfg.currentPage;
      if (direction === 'next' && cfg.currentPage < totalPages - 1) {
        targetPage = cfg.currentPage + 1;
      } else if (direction === 'prev' && cfg.currentPage > 0) {
        targetPage = cfg.currentPage - 1;
      }

      // Track read pages in user stats
      if (state.user && state.user.stats) {
        state.user.stats.pagesRead = (state.user.stats.pagesRead || 0) + 1;
        if (targetPage >= totalPages - 1) {
          state.user.stats.booksRead = (state.user.stats.booksRead || 0) + 1;
        }
      }

      store.updateReaderConfig({ currentPage: targetPage });
    }, 280);
  };

  document.getElementById('reader-close-btn')?.addEventListener('click', () => {
    store.setView('book-detail', { bookId: book.id });
  });

  document.getElementById('reader-prev-page')?.addEventListener('click', () => {
    triggerPageTurn('prev');
  });

  document.getElementById('reader-next-page')?.addEventListener('click', () => {
    triggerPageTurn('next');
  });

  // Continuous Zoom Range Slider Handler (1% to 150%)
  const zoomSlider = document.getElementById('reader-zoom-slider');
  const zoomDisplay = document.getElementById('zoom-percent-display');

  zoomSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const scale = parseFloat((val / 100).toFixed(2));
    if (zoomDisplay) zoomDisplay.innerText = `🔍 ${val}%`;
    
    // Live continuous font scaling
    const activeSheet = document.getElementById('active-page-sheet');
    if (activeSheet) {
      activeSheet.style.fontSize = `${scale * 1.15}rem`;
    }
    store.updateReaderConfig({ zoomScale: scale });
  });

  // Bright / Dark Theme Toggle
  document.getElementById('reader-theme-toggle-btn')?.addEventListener('click', () => {
    store.toggleReaderTheme();
  });

  // Save Bookmark
  document.getElementById('reader-bookmark-btn')?.addEventListener('click', () => {
    store.saveBookmark(book.id, cfg.currentPage);
    alert(i18n.t('bookmarked'));
  });

  // Save Quote
  document.getElementById('reader-save-quote-btn')?.addEventListener('click', () => {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      const cleanSelection = SecurityService.cleanUserInput(selection, 500);
      store.addQuote(cleanSelection, book.title, book.author);
      alert('تم حفظ الاقتباس بنجاح في قسم "اقتباساتي المفضلة"!');
    } else {
      const quoteInput = prompt('ادخل الاقتباس الذي ترغب في حفظه:');
      if (quoteInput && quoteInput.trim()) {
        const cleanQuote = SecurityService.cleanUserInput(quoteInput, 500);
        store.addQuote(cleanQuote, book.title, book.author);
        alert('تم حفظ الاقتباس بنجاح!');
      }
    }
  });

  // Chapter Comment Submit
  document.getElementById('chap-comment-submit')?.addEventListener('click', () => {
    const input = document.getElementById('chap-comment-input');
    if (input && input.value.trim()) {
      const cleanComment = SecurityService.cleanUserInput(input.value, 500);
      const key = `${book.id}-chap-${cfg.currentPage}`;
      store.addChapterComment(key, cleanComment);
      input.value = '';
    }
  });

  // Touch Swipe & Drag Handler for Realistic Page Flipping across finger drag
  const pageStage = document.getElementById('book-stage-element');
  if (pageStage) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const onStart = (clientX, clientY) => {
      startX = clientX;
      startY = clientY;
      isDragging = true;
    };

    const onEnd = (clientX, clientY) => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = clientX - startX;
      const diffY = clientY - startY;

      // Ensure horizontal swipe
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (isArabicBook) {
          // In RTL Arabic: swipe left-to-right => Next page, swipe right-to-left => Prev page
          if (diffX > 0) {
            triggerPageTurn('next');
          } else {
            triggerPageTurn('prev');
          }
        } else {
          // In LTR English: swipe right-to-left => Next page, swipe left-to-right => Prev page
          if (diffX < 0) {
            triggerPageTurn('next');
          } else {
            triggerPageTurn('prev');
          }
        }
      }
    };

    pageStage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    pageStage.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    });

    pageStage.addEventListener('mousedown', (e) => {
      onStart(e.clientX, e.clientY);
    });

    pageStage.addEventListener('mouseup', (e) => {
      onEnd(e.clientX, e.clientY);
    });
  }
}
