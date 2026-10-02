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
        <button class="btn-icon" id="auth-close-btn" type="button" style="position: absolute; top: 1.25rem; right: 1.25rem;">✕</button>

        <img src="assets/logo.png" alt="Logo" style="width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 1rem; border: 2px solid var(--brand-amber);" />
        <h2 style="font-family: var(--font-arabic-poetry); font-size: 1.75rem; color: var(--text-primary); margin-bottom: 0.3rem;">
          ${i18n.t('loginToAccount')}
        </h2>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">
          أنشئ حسابك الشخصي للبدء في حفظ مكتبتك وإضافة كتبك واقتباساتك.
        </p>

        <!-- Auth Method Selector Tabs -->
        <div style="display: flex; gap: 0.5rem; background: var(--bg-primary); padding: 0.35rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <button class="tab-btn active" id="auth-tab-email" type="button" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">✉️ البريد / التسجيل</button>
          <button class="tab-btn" id="auth-tab-google" type="button" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">🌐 Google الدخول السريع</button>
        </div>

        <!-- Email Registration / Login Form Panel -->
        <form id="auth-email-form" style="text-align: right;">
          <!-- Profile Avatar Gallery Upload -->
          <div class="form-group" style="text-align: center; margin-bottom: 1.25rem;">
            <div style="position: relative; display: inline-block;">
              <img id="avatar-preview-img" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="Avatar Preview" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--brand-amber); box-shadow: var(--shadow-md);" />
              <input type="file" id="auth-avatar-file" accept="image/*" style="display: none;" />
              <button type="button" class="btn-icon" id="btn-choose-avatar" style="position: absolute; bottom: 0; right: 0; width: 30px; height: 30px; background: var(--brand-amber); color: #FFF; border: none; font-size: 0.85rem;" title="اختيار صورة من المعرض">
                📷
              </button>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem;">اضغط الكاميرا لاختيار صورة من معرض الهاتف</div>
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('fullName')} *</label>
            <input type="text" id="reg-name-input" class="form-control" placeholder="مثال: عبدالله الهاشمي" required />
          </div>

          <div class="form-group">
            <label class="form-label">${i18n.t('username')} (@Username) *</label>
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

          <button class="btn-primary" id="btn-email-submit" type="submit" style="width: 100%; justify-content: center; padding: 0.85rem;">
            دخول / إنشاء حسابك الشخصي
          </button>
        </form>

        <!-- Google Direct 1-Click Login Box -->
        <form id="auth-google-form" style="display: none; text-align: center; padding: 1rem 0;">
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
            انقر الزر أدناه لتسجيل الدخول المباشر والتلقائي بحساب Google دون الحاجة لكتابة بريدك يدوياً:
          </p>

          <button class="btn-secondary" id="btn-google-login" type="submit" style="width: 100%; justify-content: center; padding: 1rem; font-size: 1rem; background: var(--surface-card); border: 2px solid var(--brand-amber); box-shadow: var(--shadow-md);">
            <svg width="22" height="22" viewBox="0 0 24 24" style="margin-left: 0.5rem;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            تسجيل الدخول الفوري عبر Google 🚀
          </button>
        </form>
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
        <button class="btn-icon" id="edit-profile-close-btn" type="button" style="position: absolute; top: 1.25rem; right: 1.25rem;">✕</button>
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
        <button class="btn-icon" id="feedback-close-btn" type="button" style="position: absolute; top: 1.25rem; right: 1.25rem;">✕</button>

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

  let selectedAvatarDataUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  document.getElementById('btn-choose-avatar')?.addEventListener('click', () => {
    document.getElementById('auth-avatar-file')?.click();
  });

  document.getElementById('auth-avatar-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        selectedAvatarDataUrl = evt.target.result;
        const preview = document.getElementById('avatar-preview-img');
        if (preview) preview.src = selectedAvatarDataUrl;
      };
      reader.readAsDataURL(file);
    }
  });

  // Google Login direct 1-click submit
  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    const res = await AuthService.loginWithGoogle();
    if (res.success) {
      alert(`أهلاً بك يا ${res.user.name || res.user.username}! تم تسجيل الدخول بحساب Google بنجاح.`);
      store.setView('profile');
    }
  };

  document.getElementById('auth-google-form')?.addEventListener('submit', handleGoogleSubmit);
  document.getElementById('btn-google-login')?.addEventListener('click', handleGoogleSubmit);

  // Email Register / Login submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name-input')?.value.trim();
    const username = document.getElementById('reg-username-input')?.value.trim();
    const email = document.getElementById('email-input')?.value.trim();
    const bio = document.getElementById('reg-bio-input')?.value.trim();
    const pass = document.getElementById('password-input')?.value.trim();

    if (email) {
      const res = await AuthService.loginWithEmail(email, pass, name, username, bio, selectedAvatarDataUrl);
      if (res.success) {
        alert(`أهلاً بك يا ${res.user.name || res.user.username}! تم إنشاء حسابك وتسجيل الدخول بنجاح.`);
        store.setView('profile');
      }
    } else {
      alert('يرجى كتابة البريد الإلكتروني.');
    }
  };

  document.getElementById('auth-email-form')?.addEventListener('submit', handleEmailSubmit);
  document.getElementById('btn-email-submit')?.addEventListener('click', handleEmailSubmit);
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
    
    window.location.href = `mailto:xoencgz@gmail.com?subject=${fullSubject}&body=${fullBody}`;
    store.setFeedbackModal(false);
  });
}
