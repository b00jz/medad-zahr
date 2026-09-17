// ==========================================================================
// Mobile Bottom Navigation Bar & Header - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';

export function renderMobileNav() {
  const state = store.state;
  const lang = i18n.getLanguage();

  return `
    <!-- Top Mobile App Header -->
    <header class="mobile-top-bar">
      <div class="brand-logo" id="mobile-brand-btn">
        <img src="assets/logo.png" alt="Medad Zahr Logo" class="brand-logo-img" style="width: 38px; height: 38px;" />
        <span class="brand-title" style="font-size: 1.35rem;">${i18n.t('appName')}</span>
      </div>

      <div class="nav-actions">
        <!-- Layout Frame Switcher (Mobile App Frame vs Full Web) -->
        <button class="btn-icon" id="toggle-layout-mode" title="نمط العرض (تطبيق محمول / موقع)" style="font-size: 0.8rem; width: auto; padding: 0 0.6rem; border-radius: 16px;">
          ${state.layoutMode === 'mobile' ? '📱 إطار الجوال' : '💻 عرض كامل'}
        </button>

        <!-- 18+ Safe Shield Toggle -->
        <button class="safe-shield-pill ${state.safeShield ? 'active' : 'inactive'}" id="toggle-safe-shield-mobile" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
          ${state.safeShield ? '🛡️ +18' : '⚠️ عاري'}
        </button>

        <!-- Login / User Profile -->
        <button class="btn-icon" id="open-auth-btn" style="overflow: hidden; padding: 0;">
          <img src="${state.user.avatar}" alt="${state.user.username}" style="width: 100%; height: 100%; object-fit: cover;" />
        </button>
      </div>
    </header>

    <!-- Mobile Bottom Tab Navigation Bar -->
    <nav class="mobile-bottom-bar">
      <a class="mobile-nav-item ${state.currentView === 'home' ? 'active' : ''}" id="m-nav-home">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span>${i18n.t('home')}</span>
      </a>

      <a class="mobile-nav-item ${state.currentView === 'diwan' ? 'active' : ''}" id="m-nav-diwan">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        <span>الديوان</span>
      </a>

      <!-- Floating Action Button for Adding PDF / Book -->
      <a class="mobile-nav-fab" id="m-nav-add">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </a>

      <a class="mobile-nav-item ${state.currentView === 'quotes' ? 'active' : ''}" id="m-nav-quotes">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>اقتباساتي</span>
      </a>

      <a class="mobile-nav-item ${state.currentView === 'profile' ? 'active' : ''}" id="m-nav-profile">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>حسابي</span>
      </a>
    </nav>
  `;
}

export function bindMobileNavEvents() {
  document.getElementById('mobile-brand-btn')?.addEventListener('click', () => store.setView('home'));
  document.getElementById('m-nav-home')?.addEventListener('click', () => store.setView('home'));
  document.getElementById('m-nav-diwan')?.addEventListener('click', () => store.setView('diwan'));
  document.getElementById('m-nav-add')?.addEventListener('click', () => store.setView('add-book'));
  document.getElementById('m-nav-quotes')?.addEventListener('click', () => store.setView('quotes'));
  document.getElementById('m-nav-profile')?.addEventListener('click', () => store.setView('profile'));

  document.getElementById('toggle-safe-shield-mobile')?.addEventListener('click', () => store.toggleSafeShield());
  document.getElementById('toggle-layout-mode')?.addEventListener('click', () => store.toggleLayoutMode());
  document.getElementById('open-auth-btn')?.addEventListener('click', () => store.setAuthModal(true));
}
