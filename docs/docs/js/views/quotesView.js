// ==========================================================================
// Favorite Quotes Hub (اقتباساتي المفضلة) - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';

export function renderQuotesView() {
  const state = store.state;
  const quotes = state.quotes || [];

  return `
    <div class="container" style="padding-top: 1.5rem; padding-bottom: 5rem; max-width: 860px;">
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            اقتباساتي المفضلة (${quotes.length})
          </h1>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.3rem;">
            سجل الجمل والعبارات الملهمة التي قمت بحفظها أثناء قراءتك للكتب والقصائد.
          </p>
        </div>

        <button class="btn-primary" id="add-quote-manual-btn">
          ✨ إضافة اقتباس جديد
        </button>
      </div>

      ${quotes.length === 0 ? `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted); background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">لا توجد اقتباسات محفوظة في حسابك بعد.</p>
          <p style="font-size: 0.85rem;">قم بتحديد أي جملة أثناء القراءة داخل الكتاب واضغط على "حفظ اقتباس".</p>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${quotes.map(q => `
            <div style="background: var(--surface-card); border-radius: var(--radius-md); border: 1px solid var(--border-light); padding: 1.5rem; box-shadow: var(--shadow-sm); border-right: 4px solid var(--brand-amber); position: relative;">
              <p style="font-family: var(--font-arabic-poetry); font-size: 1.2rem; line-height: 1.8; color: var(--text-primary); margin-bottom: 1rem;">
                "${q.quoteText}"
              </p>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
                <div style="color: var(--brand-amber); font-weight: 600;">
                  📖 ${q.bookTitle} — <span style="color: var(--text-secondary); font-weight: 400;">${q.author}</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <span style="color: var(--text-muted); font-size: 0.78rem;">${q.date}</span>
                  <button class="btn-icon" data-action="delete-quote" data-id="${q.id}" title="حذف الاقتباس" style="width: 32px; height: 32px; color: var(--danger-red);">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

export function bindQuotesEvents() {
  document.getElementById('add-quote-manual-btn')?.addEventListener('click', () => {
    const text = prompt('ادخل نص الاقتباس:');
    if (!text || !text.trim()) return;
    const bookTitle = prompt('اسم الكتاب أو المصدر:', 'مِدادُ زَهْر') || 'مِدادُ زَهْر';
    const author = prompt('اسم الكاتب:', 'مجهول') || 'مجهول';
    store.addQuote(text.trim(), bookTitle, author);
  });

  document.querySelectorAll('[data-action="delete-quote"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (confirm('هل ترغب في حذف هذا الاقتباس؟')) {
        store.deleteQuote(id);
      }
    });
  });
}
