// ==========================================================================
// Diwan Al-She'r View (ديوان الشعر) - مِدادُ زَهْر
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';

export function renderDiwanView() {
  const state = store.state;

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

      <!-- Diwan Search & Filters -->
      <section class="filter-section">
        <div class="search-box-large">
          <input 
            type="text" 
            class="search-input-large" 
            id="diwan-search-input" 
            placeholder="ابحث عن بيت شعر، اسم شاعر، أو عنوان قصيدة..." 
            value="${state.searchQuery}"
          />
        </div>

        <div class="filter-row">
          <div class="filter-group">
            <span class="filter-pill active">جميع العصور</span>
            <span class="filter-pill">${i18n.t('jahiliyyah')}</span>
            <span class="filter-pill">${i18n.t('abbasid')}</span>
            <span class="filter-pill">${i18n.t('andalusian')}</span>
            <span class="filter-pill">${i18n.t('modern')}</span>
          </div>
        </div>
      </section>

      <!-- Poems Grid -->
      <div class="poetry-grid">
        ${state.poems.map(poem => renderPoemCard(poem, state)).join('')}
      </div>
    </div>
  `;
}

function renderPoemCard(poem, state) {
  const eraLabel = i18n.t(poem.era) || poem.era;

  return `
    <div class="poem-card" data-id="${poem.id}">
      <span class="poem-era-badge">${eraLabel}</span>
      <h3 class="poem-title">${poem.title}</h3>
      <div class="poem-poet">الشاعر: ${poem.poet}</div>

      <div class="poem-preview-stanzas">
        ${poem.stanzas.slice(0, 3).map(stanza => {
          const parts = stanza.split('|');
          if (parts.length === 2) {
            return `
              <div class="poem-verse-line">
                <span>${parts[0].trim()}</span>
                <span style="color: var(--brand-amber);">❖</span>
                <span>${parts[1].trim()}</span>
              </div>
            `;
          }
          return `<div>${stanza}</div>`;
        }).join('')}
      </div>

      <div class="poem-card-footer">
        <button class="btn-secondary" data-action="like-poem" data-id="${poem.id}" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
          ❤️ ${poem.likes} إعجاب
        </button>
        <span style="font-size: 0.8rem; color: var(--safe-green);">🛡️ مفحوصة بالنظام الآمن</span>
      </div>
    </div>
  `;
}

export function bindDiwanEvents() {
  document.getElementById('diwan-add-poem-btn')?.addEventListener('click', () => {
    store.setView('add-poem');
  });

  document.getElementById('diwan-search-input')?.addEventListener('input', (e) => {
    store.setSearchQuery(e.target.value);
  });

  document.querySelectorAll('[data-action="like-poem"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const poemId = e.target.dataset.id;
      const poem = store.state.poems.find(p => p.id === poemId);
      if (poem) {
        poem.likes += 1;
        store.notify();
      }
    });
  });
}
