// ==========================================================================
// Main Application Controller (Mobile Phone Edition) - مِدادُ زَهْر
// ==========================================================================

import { store } from './services/store.js';
import { i18n } from './services/i18n.js';
import { FirebaseService } from './services/firebase.js';
import { renderMobileNav, bindMobileNavEvents } from './components/mobileNav.js';
import { renderAuthModal, bindAuthModalEvents } from './components/authModal.js';
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

    // Reader View Mode
    if (state.currentView === 'reader') {
      this.appElement.innerHTML = `
        <div class="mobile-device-frame">
          ${renderReaderView()}
          ${renderAuthModal()}
        </div>
      `;
      bindReaderEvents();
      bindAuthModalEvents();
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

    // Phone Frame Shell Container
    this.appElement.innerHTML = `
      <div class="mobile-device-frame">
        ${renderMobileNav()}
        <main class="mobile-app-content">
          ${viewHTML}
        </main>
        ${renderAuthModal()}
      </div>
    `;

    bindMobileNavEvents();
    bindAuthModalEvents();
    if (bindEventsFn) bindEventsFn();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.medadApp = new App();
});
