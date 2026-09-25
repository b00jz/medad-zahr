// ==========================================================================
// Add Poem Portal - ديوان الشعر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';
import { ModerationService } from '../services/moderationService.js';

export function renderAddPoemView() {
  return `
    <div class="container" style="padding-top: 2rem; max-width: 760px;">
      <button class="btn-secondary" id="add-poem-back-btn" style="margin-bottom: 1.5rem;">
        ← ${i18n.t('diwan')}
      </button>

      <div style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 2.5rem; box-shadow: var(--shadow-md);">
        <h1 style="font-family: var(--font-arabic-poetry); font-size: 2rem; color: var(--text-primary); margin-bottom: 0.5rem;">
          ✨ ${i18n.t('addPoem')}
        </h1>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem;">
          شارِك قصائدك وأبياتك الشعرية مع قرّاء (مِدادُ زَهْر)، وادخل ديوان العرب الفصيح.
        </p>

        <form id="add-poem-form">
          <div class="form-group">
            <label class="form-label">${i18n.t('poemTitle')} *</label>
            <input type="text" id="poem-title-input" class="form-control" required placeholder="مثال: واحَرَّ قَلْباهُ" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">${i18n.t('poetName')} *</label>
              <input type="text" id="poem-poet-input" class="form-control" required placeholder="مثال: أبو الطيب المتنبي" />
            </div>

            <div class="form-group">
              <label class="form-label">${i18n.t('poetryEra')} *</label>
              <select id="poem-era-input" class="form-control">
                <option value="modern">${i18n.t('modern')}</option>
                <option value="abbasid">${i18n.t('abbasid')}</option>
                <option value="jahiliyyah">${i18n.t('jahiliyyah')}</option>
                <option value="andalusian">${i18n.t('andalusian')}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('poemVerses')} *</label>
            <textarea id="poem-verses-input" class="form-control" style="min-height: 220px; font-family: var(--font-arabic-poetry); font-size: 1.1rem;" required placeholder="مثال:&#11;واحَرَّ قَلْباهُ مِمَّنْ قَلْبُهُ شَبِمُ | ومَنْ بجِسْمي وحالي عِنْدَهُ سَقَمُ&#11;مالي أُكَتِّمُ حُبّاً قَدْ نَهَكْتُ بهِ | وتَدَّعي حُبَّ سَيْفِ الدَّوْلَةِ الأُمَمُ"></textarea>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem;">
            🖋️ ${i18n.t('submitPoem')}
          </button>
        </form>
      </div>
    </div>
  `;
}

export function bindAddPoemEvents() {
  document.getElementById('add-poem-back-btn')?.addEventListener('click', () => store.setView('diwan'));

  document.getElementById('add-poem-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('poem-title-input').value.trim();
    const poet = document.getElementById('poem-poet-input').value.trim();
    const era = document.getElementById('poem-era-input').value;
    const rawVerses = document.getElementById('poem-verses-input').value.trim();

    const scan = ModerationService.scanContent(rawVerses);
    if (scan.decision === 'BLOCKED') {
      alert('تم رفض نشر هذه القصيدة لاحتوائها على عبارات إباحية وفاحشة +18.');
      return;
    }

    const stanzas = rawVerses.split('\n').filter(line => line.trim().length > 0);

    const newPoem = {
      id: 'poem-' + Date.now(),
      title,
      poet,
      era,
      category: 'قصيدة جديدة',
      likes: 1,
      safeStatus: 'VERIFIED_CLEAN',
      stanzas
    };

    store.addPoem(newPoem);
    alert('تم نشر القصيدة بنجاح في ديوان الشعر!');
  });
}
