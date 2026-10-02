// ==========================================================================
// Authentication, Edit Profile, & Feedback Modals - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { AuthService } from '../services/authService.js';
import { i18n } from '../services/i18n.js';

/**
 * Render Authentication / Registration Modal
 */
export function renderAuthModal() {
  const state = store.state;
  if (!state.showAuthModal) return '';

  return `
    <div class="modal-backdrop" id="auth-modal-backdrop">
      <div class="modal-card" style="max-width: 480px; text-align: center;">
        <button class="btn-icon" id="auth-close-btn" style="position: absolute; top: 1.25rem; right: 1.25rem;">✕</button>

        <img src="assets/logo.png" alt="Logo" style="width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 1rem; border: 2px solid var(--brand-amber);" />
        <h2 style="font-family: var(--font-arabic-poetry); font-size: 1.75rem; color: var(--text-primary); margin-bottom: 0.3rem;">
          ${i18n.t('loginToAccount')}
        </h2>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">
          أنشئ حسابك الشخصي للبدء في حفظ مكتبتك وإضافة كتبك واقتباساتك.
        </p>

        <!-- Auth Method Selector Tabs -->
        <div style="display: flex; gap: 0.5rem; background: var(--bg-primary); padding: 0.35rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <button class="tab-btn active" id="auth-tab-email" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">✉️ البريد / التسجيل</button>
          <button class="tab-btn" id="auth-tab-google" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">🌐 Google</button>
        </div>

        <!-- Email Registration / Login Form Panel -->
        <div id="auth-panel-email" style="text-align: right;">
          <div class="form-group">
            <label class="form-label">${i18n.t('fullName')} *</label>
            <input type="text" id="reg-name-input" class="form-control" placeholder="مثال: عبدالله الهاشمي" required />
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('username')} *</label>
            <input type="text" id="reg-username-input" class="form-control" placeholder="مثال: abdullah99" required />
          </div>

          <div class="form-group">
            <label class="form-label">البريد الإلكتروني *</label>
            <input type="email" id="email-input" class="form-control" placeholder="example@domain.com" required />
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('bio')} (نبذة بسيطة)</label>
            <input type="text" id="reg-bio-input" class="form-control" placeholder="مثال: محب للقراءة والأدب والشعر..." />
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور</label>
            <input type="password" id="password-input" class="form-control" placeholder="••••••••" />
          </div>

          <button class="btn-primary" id="btn-email-submit" style="width: 100%; justify-content: center; padding: 0.85rem;">
            دخول / إنشاء حسابك الشخصي
          </button>
        </div>

        <!-- Google Login Box -->
        <div id="auth-panel-google" style="display: none; text-align: right;">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; text-align: center;">
            قم بإدخال بيانات حساب Google الخاص بك لتسجيل الدخول الفوري:
          </p>

          <div class="form-group">
            <label class="form-label">اسمك في حساب Google *</label>
            <input type="text" id="g-name-input" class="form-control" placeholder="ادخل اسمك الكامل" />
          </div>

          <div class="form-group">
            <label class="form-label">بريد Google (Gmail) *</label>
            <input type="email" id="g-email-input" class="form-control" placeholder="username@gmail.com" />
          </div>

          <button class="btn-secondary" id="btn-google-login" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem; background: var(--surface-card); border: 2px solid var(--border-light);">
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            تأكيد تسجيل الدخول عبر Google
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Edit Profile Modal
 */
export function renderEditProfileModal() {
  const state = store.state;
  if (!state.showEditProfileModal) return '';

  const user = state.user || {};

  return `
    <div class="modal-backdrop" id="edit-profile-backdrop">
      <div class="modal-card" style="max-width: 460px;">
        <button class="btn-icon" id="edit-profile-close-btn" style="position: absolute; top: 1.25rem; right: 1.25rem;">✕</button>
        <h2 style="font-family: var(--font-arabic-poetry); font-size: 1.5rem; margin-bottom: 1.25rem; color: var(--text-primary);">
          ✏️ ${i18n.t('editProfile')}
        </h2>

        <form id="edit-profile-form">
          <div class="form-group">
            <label class="form-label">${i18n.t('fullName')}</label>
            <input type="text" id="edit-name-input" class="form-control" value="${user.name || ''}" placeholder="ادخل اسمك الكامل" required />
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('username')}</label>
            <input type="text" id="edit-username-input" class="form-control" value="${user.username || ''}" placeholder="ادخل اسم المستخدم" required />
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('bio')}</label>
            <textarea id="edit-bio-input" class="form-control" placeholder="اكتب نبذة قصيرة عن نفسك واهتماماتك القرائية...">${user.bio || ''}</textarea>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem;">
            💾 ${i18n.t('saveChanges')}
          </button>
        </form>
      </div>
    </div>
  `;
}

/**
 * Render Help & Feedback Modal (Direct to xoencgz@gmail.com)
 */
export function renderFeedbackModal() {
  const state = store.state;
  if (!state.showFeedbackModal) return '';

  return `
    <div class="modal-backdrop" id="feedback-modal-backdrop">
      <div class="modal-card" style="max-width: 480px;">
        <button class="btn-icon" id="feedback-close-btn" style="position: absolute; top: 1.25rem; right: 1.25rem;">✕</button>

        <div style="text-align: center; margin-bottom: 1.25rem;">
          <span style="font-size: 2.5rem;">📩</span>
          <h2 style="font-family: var(--font-arabic-poetry); font-size: 1.6rem; color: var(--text-primary); margin-top: 0.3rem;">
            ${i18n.t('helpFeedback')}
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.3rem;">
            يسعدنا سماع آرائك أو أفكارك الجديدة أو تقارير المساعدة مباشرة!
          </p>
        </div>

        <div style="background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 1.25rem; font-size: 0.85rem; text-align: center;">
          <div style="font-weight: 700; color: var(--brand-amber); margin-bottom: 0.2rem;">${i18n.t('feedbackEmailInfo')}</div>
          <code style="background: var(--surface-card); padding: 0.25rem 0.6rem; border-radius: 4px; color: var(--brand-gold); font-size: 0.9rem; font-weight: 700;">xoencgz@gmail.com</code>
        </div>

        <form id="feedback-form">
          <div class="form-group">
            <label class="form-label">نوع الرسالة / الملحوظة</label>
            <select id="feedback-type-input" class="form-control">
              <option value="فكرة جديدة">💡 اقتراح فكرة جديدة</option>
              <option value="ملاحظة أو تقييم">⭐ رأي وتقييم للتطبيق</option>
              <option value="طلب مساعدة">❓ طلب مساعدة استفسار</option>
              <option value="إبلاغ عن مشكلة">🐛 إبلاغ عن مشكلة فنية</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">عنوان الرسالة</label>
            <input type="text" id="feedback-subject-input" class="form-control" placeholder="اكتب عنواناً قصيراً للرسالة..." required />
          </div>

          <div class="form-group">
            <label class="form-label">نص الرسالة أو الاقتراح التفصيلي</label>
            <textarea id="feedback-body-input" class="form-control" style="min-height: 110px;" placeholder="اكتب ملاحظاتك أو افكارك بالتفصيل..." required></textarea>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">
            ✉️ فتح تطبيق البريد لإرسال الملحوظة لـ (xoencgz@gmail.com)
          </button>
        </form>
      </div>
    </div>
  `;
}

export function bindAuthModalEvents() {
  document.getElementById('auth-close-btn')?.addEventListener('click', () => store.setAuthModal(false));

  const tabG = document.getElementById('auth-tab-google');
  const tabE = document.getElementById('auth-tab-email');
  const panelG = document.getElementById('auth-panel-google');
  const panelE = document.getElementById('auth-panel-email');

  tabG?.addEventListener('click', () => {
    tabG.className = 'tab-btn active'; tabE.className = 'tab-btn';
    panelG.style.display = 'block'; panelE.style.display = 'none';
  });

  tabE?.addEventListener('click', () => {
    tabE.className = 'tab-btn active'; tabG.className = 'tab-btn';
    panelE.style.display = 'block'; panelG.style.display = 'none';
  });

  // Google Login submit with user inputs
  document.getElementById('btn-google-login')?.addEventListener('click', async () => {
    const gName = document.getElementById('g-name-input')?.value.trim();
    const gEmail = document.getElementById('g-email-input')?.value.trim();

    if (!gName || !gEmail) {
      alert('يرجى ادخال الاسم وبريد Gmail لاستكمال الدخول عبر Google.');
      return;
    }

    const res = await AuthService.loginWithGoogle({
      name: gName,
      username: gEmail.split('@')[0],
      email: gEmail,
      bio: 'حساب مسجل عبر Google',
      provider: 'google'
    });

    if (res.success) {
      alert(`أهلاً بك يا ${res.user.name || res.user.username}! تم تسجيل الدخول بحساب Google بنجاح.`);
    }
  });

  // Email Register / Login submit
  document.getElementById('btn-email-submit')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name-input')?.value.trim();
    const username = document.getElementById('reg-username-input')?.value.trim();
    const email = document.getElementById('email-input')?.value.trim();
    const bio = document.getElementById('reg-bio-input')?.value.trim();
    const pass = document.getElementById('password-input')?.value.trim();

    if (email) {
      const res = await AuthService.loginWithEmail(email, pass, name, username, bio);
      if (res.success) {
        alert(`أهلاً بك يا ${res.user.name || res.user.username}! تم إنشاء حسابك وتسجيل الدخول بنجاح.`);
      }
    } else {
      alert('يرجى كتابة البريد الإلكتروني.');
    }
  });
}

export function bindEditProfileEvents() {
  document.getElementById('edit-profile-close-btn')?.addEventListener('click', () => store.setEditProfileModal(false));

  document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-name-input')?.value.trim();
    const username = document.getElementById('edit-username-input')?.value.trim();
    const bio = document.getElementById('edit-bio-input')?.value.trim();

    if (name && username) {
      store.updateUserProfile({ name, username, bio });
      alert('تم حفظ البيانات الشخصية بنجاح!');
    }
  });
}

export function bindFeedbackModalEvents() {
  document.getElementById('feedback-close-btn')?.addEventListener('click', () => store.setFeedbackModal(false));

  document.getElementById('feedback-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('feedback-type-input')?.value || 'اقتراح';
    const subject = document.getElementById('feedback-subject-input')?.value.trim() || 'ملحوظة تطبيق مِدادُ زَهْر';
    const body = document.getElementById('feedback-body-input')?.value.trim() || '';

    const fullSubject = encodeURIComponent(`[Medad Zahr App Feedback] ${type}: ${subject}`);
    const fullBody = encodeURIComponent(`نوع الملحوظة: ${type}\n\nنص الرسالة:\n${body}\n\nمرسلة من تطبيق مِدادُ زَهْر`);
    
    // Trigger direct mailto link to xoencgz@gmail.com
    window.location.href = `mailto:xoencgz@gmail.com?subject=${fullSubject}&body=${fullBody}`;
    store.setFeedbackModal(false);
  });
}
