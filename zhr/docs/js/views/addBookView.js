// ==========================================================================
// Add Book & PDF Upload Portal (Strict Moderation) - مِدادُ زَهْر
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';
import { ModerationService } from '../services/moderationService.js';
import { PDFService } from '../services/pdfService.js';

let pdfChaptersExtracted = null;

export function renderAddBookView() {
  const state = store.state;
  const isAdmin = state.user.role === 'admin';

  return `
    <div class="container" style="padding-top: 1.5rem; padding-bottom: 5rem; max-width: 800px;">
      <button class="btn-secondary" id="add-book-back-btn" style="margin-bottom: 1.25rem;">
        ← ${i18n.t('home')}
      </button>

      <div style="background: var(--surface-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-md);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;">
          <div>
            <h1 style="font-family: var(--font-arabic-poetry); font-size: 1.8rem; color: var(--text-primary);">${i18n.t('addBook')} / ملف PDF</h1>
            <p style="color: var(--text-secondary); font-size: 0.88rem;">رفع ملفات PDF أو إدخال النص يدوياً مع فحص آلي فائق ضد الألفاظ الإباحية +18 باللهجات العربية والإنجليزية.</p>
          </div>
        </div>

        <!-- PDF File Upload Box -->
        <div style="background: var(--bg-primary); border: 2px dashed var(--brand-amber); border-radius: var(--radius-md); padding: 1.75rem; text-align: center; margin-bottom: 2rem;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--brand-amber)" stroke-width="2" style="margin-bottom: 0.5rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.4rem;">رفع كتاب بصيغة PDF</h3>
          <p style="font-size: 0.83rem; color: var(--text-secondary); margin-bottom: 1rem;">اختر ملف PDF ليتم استخراج النص وفحصه بدرع الأمان 18+ تلقائياً.</p>
          
          <input type="file" id="pdf-file-input" accept="application/pdf" style="display: none;" />
          <button type="button" class="btn-primary" id="trigger-pdf-select">
            📄 اختر ملف PDF من جهازك
          </button>
          
          <div id="pdf-progress-box" style="display: none; margin-top: 1rem; font-size: 0.85rem; color: var(--brand-amber); font-weight: 700;">
            جاري معالجة واستخراج نص الـ PDF...
          </div>
        </div>

        <form id="add-book-form">
          <div class="form-group">
            <label class="form-label">${i18n.t('bookTitle')} *</label>
            <input type="text" id="book-title-input" class="form-control" required placeholder="مثال: ثلاثية غرناطة" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">${i18n.t('authorName')} *</label>
              <input type="text" id="book-author-input" class="form-control" required placeholder="مثال: رضوى عاشور" />
            </div>

            <div class="form-group">
              <label class="form-label">${i18n.t('category')} *</label>
              <select id="book-category-input" class="form-control">
                <option value="novels">روايات وأدب</option>
                <option value="poetry">شعر وفنون</option>
                <option value="philosophy">فلسفة وفكر</option>
                <option value="history">تاريخ وسير</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">${i18n.t('genre')}</label>
              <input type="text" id="book-genre-input" class="form-control" placeholder="مثال: أدب تاريخي / دراما" />
            </div>

            <div class="form-group">
              <label class="form-label">اللغة / Language</label>
              <select id="book-lang-input" class="form-control">
                <option value="ar">العربية (Arabic)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('coverUrl')}</label>
            <input type="url" id="book-cover-input" class="form-control" placeholder="https://images.unsplash.com/..." />
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('synopsis')} *</label>
            <textarea id="book-synopsis-input" class="form-control" required placeholder="ملخص سريع وكتابة نبذة عن أحداث ومضمون الكتاب..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('bookContent')} (نص الكتاب / الفصول) *</label>
            <textarea id="book-content-input" class="form-control" style="min-height: 180px;" required placeholder="اكتب أو الصق نص الكتاب هنا أو قم برفع ملف PDF ليملأ هذا الحقل تلقائياً..."></textarea>
          </div>

          <!-- Live 18+ Content Moderation Scan Dashboard -->
          <div id="moderation-scan-dashboard" style="background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary);">🔍 نتائج فحص الأمان 18+ (الفصحى والعاميات)</span>
              <span id="scan-status-badge" class="safe-shield-pill active">بانتظار الفحص</span>
            </div>

            <div style="height: 8px; background: var(--border-light); border-radius: 4px; overflow: hidden; margin-bottom: 0.85rem;">
              <div id="scan-score-bar" style="width: 0%; height: 100%; background: var(--safe-green); transition: width 0.4s ease;"></div>
            </div>

            <p id="scan-details-text" style="font-size: 0.85rem; color: var(--text-secondary);">
              قم برفع الـ PDF أو كتابة المحتوى لمعاينة فحص الأمان الشامل ضد الألفاظ الإباحية.
            </p>
          </div>

          <button type="submit" class="btn-primary" id="submit-book-btn" style="width: 100%; justify-content: center; padding: 0.85rem;">
            🛡️ ${i18n.t('submitBook')}
          </button>
        </form>
      </div>
    </div>
  `;
}

export function bindAddBookEvents() {
  document.getElementById('add-book-back-btn')?.addEventListener('click', () => store.setView('home'));

  const triggerPdf = document.getElementById('trigger-pdf-select');
  const pdfInput = document.getElementById('pdf-file-input');
  const pdfBox = document.getElementById('pdf-progress-box');
  const titleInput = document.getElementById('book-title-input');
  const contentInput = document.getElementById('book-content-input');
  const synopsisInput = document.getElementById('book-synopsis-input');

  triggerPdf?.addEventListener('click', () => pdfInput.click());

  pdfInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    pdfBox.style.display = 'block';
    pdfBox.innerText = 'جاري استخراج وقراءة صفحات ملف الـ PDF...';

    try {
      const result = await PDFService.extractTextFromPDF(file, (percent, statusText) => {
        pdfBox.innerText = `${statusText} (${percent}%)`;
      });

      titleInput.value = result.title;
      synopsisInput.value = `كتاب بصيغة PDF تم رفعه يحتوي على ${result.pageCount} صفحة.`;
      contentInput.value = result.fullText.slice(0, 5000); // Sample preview in textarea
      pdfChaptersExtracted = result.chapters;

      pdfBox.innerText = `✅ تم استخراج ${result.pageCount} صفحة بنجاح! جاري تشغيل فحص الأمان 18+...`;
      runScan();
    } catch (err) {
      alert('حدث خطأ أثناء قراءة ملف الـ PDF: ' + err.message);
      pdfBox.style.display = 'none';
    }
  });

  const runScan = () => {
    const combinedText = (synopsisInput?.value || '') + ' ' + (contentInput?.value || '');
    const report = ModerationService.scanContent(combinedText);

    const badge = document.getElementById('scan-status-badge');
    const bar = document.getElementById('scan-score-bar');
    const text = document.getElementById('scan-details-text');
    const submitBtn = document.getElementById('submit-book-btn');

    if (!badge || !bar || !text) return;

    if (report.decision === 'APPROVED') {
      badge.className = 'safe-shield-pill active';
      badge.innerHTML = '🛡️ نظيف ومقبول 100%';
      bar.style.width = '100%';
      bar.style.background = 'var(--safe-green)';
      text.innerHTML = 'الكتاب نقي تماماً وخالٍ من الألفاظ الإباحية أو العامية الخادشة.';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    } else if (report.decision === 'REDACTED') {
      badge.className = 'safe-shield-pill inactive';
      badge.innerHTML = '🔒 يحتوي عبارات غير مناسبة (تم حجبها تلقائياً)';
      bar.style.width = '60%';
      bar.style.background = 'var(--warning-amber)';
      text.innerHTML = `تم رصد <strong>${report.explicitCount}</strong> عبارات حساسة. سيقوم نظام (مِدادُ زَهْر) بتغطيتها بقناع حماية +18 تلقائياً.`;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    } else if (report.decision === 'BLOCKED') {
      badge.className = 'safe-shield-pill';
      badge.style.background = 'var(--danger-red-bg)';
      badge.style.color = 'var(--danger-red)';
      badge.innerHTML = '🚫 محظور من النشر (+18 فاحش)';
      bar.style.width = '20%';
      bar.style.background = 'var(--danger-red)';
      text.innerHTML = `<span style="color: var(--danger-red); font-weight:700;">تم حظر نشر هذا الكتاب نهائياً</span> لتجاوزه معايير النقاء ووجود عبارات خادشة بالعامية أو الفصحى.`;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
    }
  };

  contentInput?.addEventListener('input', runScan);
  synopsisInput?.addEventListener('input', runScan);

  document.getElementById('add-book-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const author = document.getElementById('book-author-input').value.trim();
    const category = document.getElementById('book-category-input').value;
    const genre = document.getElementById('book-genre-input').value.trim() || category;
    const language = document.getElementById('book-lang-input').value;
    const cover = document.getElementById('book-cover-input').value.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
    const synopsis = synopsisInput.value.trim();
    const content = contentInput.value.trim();

    const scan = ModerationService.scanContent(synopsis + ' ' + content);

    if (scan.decision === 'BLOCKED') {
      alert('لا يمكن إضافة هذا الكتاب لأنه يخالف سياسة الاستخدام ويحتوي محتوى فاحشاً +18.');
      return;
    }

    const chapters = pdfChaptersExtracted || [
      {
        title: 'الفصل الأول: البداية',
        content: content
      }
    ];

    const newBook = {
      id: 'book-' + Date.now(),
      title,
      author,
      authorBio: 'مؤلف ساهم بإضافة هذا الكتاب للمكتبة.',
      category,
      genre,
      language,
      cover,
      rating: 5.0,
      ratingCount: 1,
      pages: chapters.length * 15,
      safeStatus: scan.decision === 'APPROVED' ? 'VERIFIED_CLEAN' : 'REDACTED',
      synopsis,
      chapters
    };

    store.addBook(newBook);
    alert('تم فحص ونشر الكتاب بنجاح في تطبيق مِدادُ زَهْر!');
  });
}
