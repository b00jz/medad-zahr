// ==========================================================================
// Navbar Component - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

import { store } from '../services/store.js';
import { i18n } from '../services/i18n.js';

export function renderNavbar() {
  const state = store.state;
  const lang = i18n.getLanguage();
  const user = state.user;

  return `
    <header class="navbar">
      <div class="container nav-container">
        <!-- Brand Logo -->
        <a class="brand-logo" id="nav-brand-btn">
          <img src="assets/logo.png" alt="Medad Zahr Logo" class="brand-logo-img" />
          <span class="brand-title">${i18n.t('appName')}</span>
        </a>

        <!-- Navigation Menu -->
        <ul class="nav-menu">
          <li>
            <a class="nav-link ${state.currentView === 'home' ? 'active' : ''}" id="nav-home-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              ${i18n.t('home')}
            </a>
          </li>
          <li>
            <a class="nav-link ${state.currentView === 'diwan' ? 'active' : ''}" id="nav-diwan-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              ${i18n.t('diwan')}
            </a>
          </li>
          <li>
            <a class="nav-link ${state.currentView === 'profile' ? 'active' : ''}" id="nav-library-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              ${i18n.t('myLibrary')}
            </a>
          </li>
        </ul>

        <!-- Action Controls -->
        <div class="nav-actions">
          <!-- Help & Feedback Button -->
          <button class="btn-secondary" id="nav-feedback-btn" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;" title="${i18n.t('helpFeedback')}">
            ✉️ ${i18n.t('helpFeedback')}
          </button>

          <!-- Language Switcher -->
          <button class="btn-icon" id="toggle-language-btn" title="تغيير اللغة / Change Language">
            <span style="font-weight: 700; font-size: 0.85rem;">${lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <!-- Dark / Light Theme Toggle -->
          <button class="btn-icon" id="toggle-theme-btn" title="تغيير المظهر / Toggle Theme">
            ${state.theme === 'dark' 
              ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
              : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
            }
          </button>

          <!-- Profile / Login Button -->
          <button class="btn-secondary" id="nav-user-profile-btn" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
            ${user && !user.isGuest 
              ? `👤 ${user.name || user.username}`
              : `🔑 ${i18n.t('loginToAccount')}`
            }
          </button>

          <!-- Add Content CTA -->
          <button class="btn-primary" id="nav-add-book-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>${i18n.t('addBook')}</span>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function bindNavbarEvents() {
  document.getElementById('nav-brand-btn')?.addEventListener('click', () => store.setView('home'));
  document.getElementById('nav-home-btn')?.addEventListener('click', () => store.setView('home'));
  document.getElementById('nav-diwan-btn')?.addEventListener('click', () => store.setView('diwan'));
  document.getElementById('nav-library-btn')?.addEventListener('click', () => store.setView('profile'));
  document.getElementById('nav-add-book-btn')?.addEventListener('click', () => store.setView('add-book'));

  document.getElementById('nav-feedback-btn')?.addEventListener('click', () => store.setFeedbackModal(true));
  document.getElementById('toggle-theme-btn')?.addEventListener('click', () => store.toggleTheme());
  
  document.getElementById('nav-user-profile-btn')?.addEventListener('click', () => {
    if (store.state.user && !store.state.user.isGuest) {
      store.setView('profile');
    } else {
      store.setAuthModal(true);
    }
  });

  document.getElementById('toggle-language-btn')?.addEventListener('click', () => {
    const nextLang = i18n.getLanguage() === 'ar' ? 'en' : 'ar';
    i18n.setLanguage(nextLang);
    store.notify();
  });
}
