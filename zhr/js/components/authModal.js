// ==========================================================================
// Authentication Modal Component - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { AuthService } from '../services/authService.js';
import { i18n } from '../services/i18n.js';

export function renderAuthModal() {
  const state = store.state;
  if (!state.showAuthModal) return '';

  return `
    <div class="modal-backdrop" id="auth-modal-backdrop">
      <div class="modal-card" style="max-width: 480px; text-align: center;">
        <button class="btn-icon" id="auth-close-btn" style="position: absolute; top: 1.25rem; right: 1.25rem;">✕</button>

        <img src="assets/logo.png" alt="Logo" style="width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 1rem; border: 2px solid var(--brand-amber);" />
        <h2 style="font-family: var(--font-arabic-poetry); font-size: 1.75rem; color: var(--text-primary); margin-bottom: 0.3rem;">تسجيل الدخول إلى (مِدادُ زَهْر)</h2>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 1.75rem;">انضم لعالم القراءة والأدب واستمتع بحفظ مكتبتك واقتباساتك في مكان واحد.</p>

        <!-- Auth Method Selector Tabs -->
        <div style="display: flex; gap: 0.5rem; background: var(--bg-primary); padding: 0.35rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <button class="tab-btn active" id="auth-tab-google" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">🌐 Google</button>
          <button class="tab-btn" id="auth-tab-email" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">✉️ البريد</button>
          <button class="tab-btn" id="auth-tab-phone" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">📱 الجوال</button>
        </div>

        <!-- Google Login Box -->
        <div id="auth-panel-google">
          <button class="btn-secondary" id="btn-google-login" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem; background: var(--surface-card); border: 2px solid var(--border-light);">
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            تسجيل الدخول بالحساب الموحد Google
          </button>
        </div>

        <!-- Email Form Panel -->
        <div id="auth-panel-email" style="display: none; text-align: right;">
          <div class="form-group">
            <label class="form-label">البريد الإلكتروني</label>
            <input type="email" id="email-input" class="form-control" placeholder="example@domain.com" />
          </div>
          <div class="form-group">
            <label class="form-label">كلمة المرور</label>
            <input type="password" id="password-input" class="form-control" placeholder="••••••••" />
          </div>
          <button class="btn-primary" id="btn-email-submit" style="width: 100%; justify-content: center;">دخول / إنشاء حساب</button>
        </div>

        <!-- Phone Form Panel -->
        <div id="auth-panel-phone" style="display: none; text-align: right;">
          <div class="form-group">
            <label class="form-label">رقم الجوال مع الرمز الدولي</label>
            <input type="tel" id="phone-input" class="form-control" placeholder="+964 770 000 0000" />
          </div>
          <div class="form-group" id="otp-group" style="display: none;">
            <label class="form-label">رمز التحقق (OTP)</label>
            <input type="text" id="otp-input" class="form-control" placeholder="123456" maxLength="6" />
          </div>
          <button class="btn-primary" id="btn-phone-submit" style="width: 100%; justify-content: center;">إرسال رمز التحقق</button>
        </div>
      </div>
    </div>
  `;
}

export function bindAuthModalEvents() {
  document.getElementById('auth-close-btn')?.addEventListener('click', () => store.setAuthModal(false));

  const tabG = document.getElementById('auth-tab-google');
  const tabE = document.getElementById('auth-tab-email');
  const tabP = document.getElementById('auth-tab-phone');

  const panelG = document.getElementById('auth-panel-google');
  const panelE = document.getElementById('auth-panel-email');
  const panelP = document.getElementById('auth-panel-phone');

  tabG?.addEventListener('click', () => {
    tabG.className = 'tab-btn active'; tabE.className = 'tab-btn'; tabP.className = 'tab-btn';
    panelG.style.display = 'block'; panelE.style.display = 'none'; panelP.style.display = 'none';
  });

  tabE?.addEventListener('click', () => {
    tabE.className = 'tab-btn active'; tabG.className = 'tab-btn'; tabP.className = 'tab-btn';
    panelE.style.display = 'block'; panelG.style.display = 'none'; panelP.style.display = 'none';
  });

  tabP?.addEventListener('click', () => {
    tabP.className = 'tab-btn active'; tabG.className = 'tab-btn'; tabE.className = 'tab-btn';
    panelP.style.display = 'block'; panelG.style.display = 'none'; panelE.style.display = 'none';
  });

  document.getElementById('btn-google-login')?.addEventListener('click', async () => {
    const res = await AuthService.loginWithGoogle();
    if (res.success) alert(`أهلاً بك يا ${res.user.username}! تم تسجيل الدخول بنجاح.`);
  });

  document.getElementById('btn-email-submit')?.addEventListener('click', async () => {
    const email = document.getElementById('email-input')?.value.trim();
    const pass = document.getElementById('password-input')?.value.trim();
    if (email && pass) {
      const res = await AuthService.loginWithEmail(email, pass);
      if (res.success) alert(`أهلاً بك يا ${res.user.username}! تم الدخول بالبريد.`);
    } else {
      alert('يرجى كتابة البريد وكلمة المرور.');
    }
  });

  let otpSent = false;
  document.getElementById('btn-phone-submit')?.addEventListener('click', async () => {
    const phone = document.getElementById('phone-input')?.value.trim();
    const otpGroup = document.getElementById('otp-group');
    const otpInput = document.getElementById('otp-input');
    const btn = document.getElementById('btn-phone-submit');

    if (!phone) return alert('يرجى ادخال رقم الجوال.');

    if (!otpSent) {
      await AuthService.sendPhoneOTP(phone);
      otpSent = true;
      otpGroup.style.display = 'block';
      btn.innerText = 'تأكيد الرمز والدخول';
      alert('تم إرسال رمز التحقق التجريبي (123456) إلى هاتفك.');
    } else {
      const code = otpInput?.value.trim();
      try {
        const res = await AuthService.verifyPhoneOTP(phone, code);
        alert(`تم تسجيل الدخول برقم الجوال بنجاح!`);
      } catch (err) {
        alert(err.message);
      }
    }
  });
}
