// ==========================================================================
// Main Application Controller - مِدادُ زَهْر
// ==========================================================================

import { store } from './services/store.js';
import { i18n } from './services/i18n.js';
import { FirebaseService } from './services/firebase.js';
import { renderNavbar, bindNavbarEvents } from './components/navbar.js';
import { renderMobileNav, bindMobileNavEvents } from './components/mobileNav.js';
import { 
  renderAuthModal, 
  bindAuthModalEvents, 
  renderEditProfileModal, 
  bindEditProfileEvents, 
  renderFeedbackModal, 
  bindFeedbackModalEvents 
} from './components/authModal.js';
import { renderHomeView, bindHomeEvents } from './views/homeView.js';
import { renderBookDetailView, bindBookDetailEvents } from './views/bookDetailView.js';
import { renderReaderView, bindReaderEvents } from './views/readerView.js';
import { renderDiwanView, bindDiwanEvents } from './views/diwanView.js';
import { renderAddBookView, bindAddBookEvents } from './views/addBookView.js';
import { renderAddPoemView, bindAddPoemEvents } from './views/addPoemView.js';
import { renderProfileView, bindProfileEvents } from './views/profileView.js';
import { renderQuotesView, bindQuotesEvents } from './views/quotesView.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app');
    this.init();
  }

  async init() {
    const lang = i18n.getLanguage();
    i18n.setLanguage(lang);

    // Initialize Firebase
    await FirebaseService.initFirebase();

    store.subscribe(() => this.render());
    this.render();
  }

  render() {
    const state = store.state;
    const currentLang = i18n.getLanguage();
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // Modals HTML
    const modalsHTML = `
      ${renderAuthModal()}
      ${renderEditProfileModal()}
      ${renderFeedbackModal()}
    `;

    // Reader View Mode
    if (state.currentView === 'reader') {
      this.appElement.innerHTML = `
        <div class="${state.layoutMode === 'mobile' ? 'mobile-device-frame' : 'web-layout-container'}">
          ${renderReaderView()}
          ${modalsHTML}
        </div>
      `;
      bindReaderEvents();
      bindAuthModalEvents();
      bindEditProfileEvents();
      bindFeedbackModalEvents();
      return;
    }

    // View Router
    let viewHTML = '';
    let bindEventsFn = null;

    switch (state.currentView) {
      case 'home':
        viewHTML = renderHomeView();
        bindEventsFn = bindHomeEvents;
        break;
      case 'book-detail':
        viewHTML = renderBookDetailView();
        bindEventsFn = bindBookDetailEvents;
        break;
      case 'diwan':
        viewHTML = renderDiwanView();
        bindEventsFn = bindDiwanEvents;
        break;
      case 'add-book':
        viewHTML = renderAddBookView();
        bindEventsFn = bindAddBookEvents;
        break;
      case 'add-poem':
        viewHTML = renderAddPoemView();
        bindEventsFn = bindAddPoemEvents;
        break;
      case 'quotes':
        viewHTML = renderQuotesView();
        bindEventsFn = bindQuotesEvents;
        break;
      case 'profile':
        viewHTML = renderProfileView();
        bindEventsFn = bindProfileEvents;
        break;
      default:
        viewHTML = renderHomeView();
        bindEventsFn = bindHomeEvents;
    }

    if (state.layoutMode === 'mobile') {
      this.appElement.innerHTML = `
        <div class="mobile-device-frame">
          ${renderMobileNav()}
          <main class="mobile-app-content">
            ${viewHTML}
          </main>
          ${modalsHTML}
        </div>
      `;
      bindMobileNavEvents();
    } else {
      this.appElement.innerHTML = `
        <div class="web-layout-container">
          ${renderNavbar()}
          <main class="web-app-content">
            ${viewHTML}
          </main>
          ${modalsHTML}
        </div>
      `;
      bindNavbarEvents();
    }

    bindAuthModalEvents();
    bindEditProfileEvents();
    bindFeedbackModalEvents();
    if (bindEventsFn) bindEventsFn();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.medadApp = new App();
});
