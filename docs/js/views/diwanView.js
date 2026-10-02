// ==========================================================================
// Diwan Al-She'r View (ديوان الشعر) - مِدادُ زَهْر
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';
import { SecurityService } from '../services/securityService.js';

export function renderDiwanView() {
  const state = store.state;

  let filteredPoems = state.poems.filter(poem => {
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const titleMatch = poem.title && poem.title.toLowerCase().includes(q);
      const poetMatch = poem.poet && poem.poet.toLowerCase().includes(q);
      const stanzaMatch = poem.stanzas && poem.stanzas.some(s => s.toLowerCase().includes(q));
      if (!titleMatch && !poetMatch && !stanzaMatch) return false;
    }
    return true;
  });

  return `
    <div class="container" style="padding-top: 2rem;">
      <div class="section-header">
        <div>
          <h1 class="section-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            ${i18n.t('diwan')}
          </h1>
          <p style="color: var(--text-secondary); margin-top: 0.4rem;">ملاذ عشاق الشعر العربي الفصيح، تصفح أعذب الأبيات واستمتع بجمال القصيد عبر العصور.</p>
        </div>

        <button class="btn-primary" id="diwan-add-poem-btn">
          ✨ ${i18n.t('addPoem')}
        </button>
      </div>

      <!-- Diwan Search -->
      <section class="filter-section">
        <div class="search-box-large">
          <input 
            type="text" 
            class="search-input-large" 
            id="diwan-search-input" 
            placeholder="اكتب اسم الشاعر أو عنوان القصيدة واضغط Enter أو 🔍 للبحث..." 
            value="${SecurityService.escapeHTML(state.searchQuery)}"
          />
          <button class="search-icon-btn" id="diwan-search-btn" title="بحث">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </section>

      <!-- Poems Grid -->
      ${filteredPoems.length === 0 ? `
        <div style="text-align: center; padding: 4rem 1.5rem; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); margin-top: 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📜</div>
          <h3 style="font-family: var(--font-arabic-poetry); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">
            ${i18n.t('emptyPoemsTitle')}
          </h3>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.9rem;">
            ${i18n.t('emptyPoemsDesc')}
          </p>
          <button class="btn-primary" id="diwan-add-first-poem-btn" style="padding: 0.75rem 1.5rem; font-size: 0.95rem;">
            🖋️ ${i18n.t('addPoem')}
          </button>
        </div>
      ` : `
        <div class="poetry-grid">
          ${filteredPoems.map(poem => renderPoemCard(poem, state)).join('')}
        </div>
      `}
    </div>
  `;
}

function renderPoemCard(poem, state) {
  const eraLabel = i18n.t(poem.era) || poem.era;
  const safeTitle = SecurityService.escapeHTML(poem.title);
  const safePoet = SecurityService.escapeHTML(poem.poet);

  return `
    <div class="poem-card" data-id="${poem.id}">
      <span class="poem-era-badge">${eraLabel}</span>
      <h3 class="poem-title">${safeTitle}</h3>
      <div class="poem-poet">الشاعر: ${safePoet}</div>

      <div class="poem-preview-stanzas">
        ${(poem.stanzas || []).slice(0, 4).map(stanza => {
          const parts = stanza.split('|');
          if (parts.length === 2) {
            return `
              <div class="poem-verse-line">
                <span>${SecurityService.escapeHTML(parts[0].trim())}</span>
                <span style="color: var(--brand-amber);">❖</span>
                <span>${SecurityService.escapeHTML(parts[1].trim())}</span>
              </div>
            `;
          }
          return `<div>${SecurityService.escapeHTML(stanza)}</div>`;
        }).join('')}
      </div>

      <div class="poem-card-footer">
        <button class="btn-secondary" data-action="like-poem" data-id="${poem.id}" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
          ❤️ ${poem.likes || 1} إعجاب
        </button>

        <button class="btn-secondary" data-action="delete-poem" data-id="${poem.id}" style="padding: 0.35rem 0.75rem; font-size: 0.82rem; color: #EF4444; border-color: rgba(239, 68, 68, 0.3);">
          🗑️ ${i18n.t('deletePoem')}
        </button>
      </div>
    </div>
  `;
}

export function bindDiwanEvents() {
  document.getElementById('diwan-add-poem-btn')?.addEventListener('click', () => {
    store.setView('add-poem');
  });

  document.getElementById('diwan-add-first-poem-btn')?.addEventListener('click', () => {
    store.setView('add-poem');
  });

  const diwanInput = document.getElementById('diwan-search-input');
  const diwanBtn = document.getElementById('diwan-search-btn');

  const executeDiwanSearch = () => {
    if (diwanInput) {
      store.setSearchQuery(diwanInput.value);
    }
  };

  diwanInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeDiwanSearch();
    }
  });

  diwanBtn?.addEventListener('click', () => {
    executeDiwanSearch();
  });

  document.querySelectorAll('[data-action="like-poem"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const poemId = e.target.dataset.id;
      const poem = store.state.poems.find(p => p.id === poemId);
      if (poem) {
        poem.likes = (poem.likes || 0) + 1;
        store.notify();
      }
    });
  });

  document.querySelectorAll('[data-action="delete-poem"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const poemId = e.target.dataset.id;
      if (confirm(i18n.t('confirmDeletePoem'))) {
        store.deletePoem(poemId);
      }
    });
  });
}
