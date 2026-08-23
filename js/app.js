// Main Application Coordinator & View Router for The Journey V2
import { store } from './state.js';
import { firebaseService } from './firebase-config.js';
import { openAuthModal, showToast } from './views/auth-modal.js';

// Views
import { renderHomeView } from './views/home-view.js';
import { renderSquadView } from './views/squad-view.js';
import { renderTacticsView } from './views/tactics-view.js';
import { renderSchedulesView } from './views/schedules-view.js';
import { renderAnalyticsView } from './views/analytics-view.js';
import { renderContractsView } from './views/contracts-view.js';
import { renderInjuriesView } from './views/injuries-view.js';
import { renderTransfersView } from './views/transfers-view.js';
import { renderTablesView } from './views/tables-view.js';
import { renderShortlistsView } from './views/shortlists-view.js';

class App {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.init();
  }

  init() {
    this.renderShell();
    this.bindEvents();

    // Subscribe to state changes
    store.subscribe(() => {
      this.updateHeaderUI();
      this.renderCurrentView();
    });

    // Subscribe to Firebase Auth
    firebaseService.onAuthChanged((user) => {
      if (user) {
        store.managerName = user.displayName || user.email?.split('@')[0] || 'John Connor';
      }
      this.updateHeaderUI();
    });

    // Initial render
    this.renderCurrentView();
  }

  renderShell() {
    this.appContainer.innerHTML = `
      <!-- TOP HEADER (Exact Reference Image Replica) -->
      <header class="main-header">
        <button class="btn-signout" id="btn-signout">
          Sign Out
        </button>

        <div class="brand-wrapper" id="brand-home-link">
          <div class="brand-line"></div>
          <div class="brand-title">THE JOURNEY</div>
          <div class="brand-line"></div>
        </div>

        <div class="header-right">
          <!-- Season Dropdown -->
          <div class="season-selector-wrapper">
            <button class="season-select-btn" id="btn-season-toggle">
              <span id="season-display-text">${store.currentSeason}</span>
              <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="season-dropdown-menu" id="season-dropdown-menu">
              ${store.seasons.map(s => `
                <div class="season-dropdown-item ${s === store.currentSeason ? 'active' : ''}" data-season="${s}">
                  <span>${s}</span>
                  ${s === store.currentSeason ? '<i class="fa-solid fa-check"></i>' : ''}
                </div>
              `).join('')}
              <div class="season-dropdown-item add-season" id="btn-add-new-season">
                <i class="fa-solid fa-plus" style="margin-right: 6px;"></i> Add Season
              </div>
            </div>
          </div>

          <!-- User Profile & Avatar -->
          <div class="user-profile-header" id="btn-profile-auth" title="Switch User / Firebase Cloud Sync">
            <span class="user-greeting-text">Welcome, <strong id="header-user-name">${store.managerName}!</strong></span>
            <div class="user-avatar-badge">
              <i class="fa-solid fa-user"></i>
            </div>
          </div>
        </div>
      </header>

      <!-- SUB-NAVIGATION BAR (10 Tabs matching reference) -->
      <nav class="sub-nav-bar" id="sub-nav-bar">
        <button class="nav-item-btn active" data-page="home">
          <i class="fa-solid fa-house"></i> Home
        </button>
        <button class="nav-item-btn" data-page="squad">
          <i class="fa-solid fa-user"></i> Squad
        </button>
        <button class="nav-item-btn" data-page="tactics">
          <i class="fa-solid fa-clipboard-list"></i> Tactics
        </button>
        <button class="nav-item-btn" data-page="schedules">
          <i class="fa-solid fa-calendar-days"></i> Schedules
        </button>
        <button class="nav-item-btn" data-page="analytics">
          <i class="fa-solid fa-chart-column"></i> Data Analytics
        </button>
        <button class="nav-item-btn" data-page="contracts">
          <i class="fa-solid fa-file-signature"></i> Contracts
        </button>
        <button class="nav-item-btn" data-page="injuries">
          <i class="fa-solid fa-circle-plus"></i> Injuries
        </button>
        <button class="nav-item-btn" data-page="transfers">
          <i class="fa-solid fa-arrow-right-arrow-left"></i> Transfers
        </button>
        <button class="nav-item-btn" data-page="tables">
          <i class="fa-solid fa-trophy"></i> Tables
        </button>
        <button class="nav-item-btn" data-page="shortlists">
          <i class="fa-solid fa-pencil"></i> Shortlists
        </button>
      </nav>

      <!-- MAIN VIEWPORT WITH ULTRA-REALISTIC TABLET MOCKUP -->
      <div class="main-viewport">
        <div class="tablet-hardware-wrapper">
          <!-- Physical Hardware Buttons -->
          <div class="tablet-btn-power" title="Power / Lock"></div>
          <div class="tablet-btn-vol-up" title="Volume Up"></div>
          <div class="tablet-btn-vol-down" title="Volume Down"></div>

          <!-- Main Tablet Body -->
          <div class="tablet-container">
            <!-- Top Bezel: Acoustic Speaker Slit + TrueDepth Camera Assembly -->
            <div class="tablet-top-bezel-bar">
              <div class="tablet-speaker-slit"></div>
              <div class="tablet-camera-assembly">
                <div class="tablet-sensor-dot"></div>
                <div class="tablet-camera-notch" title="Front Camera"></div>
                <div class="tablet-mic-hole"></div>
              </div>
            </div>

            <!-- Tablet Screen Container -->
            <div class="tablet-screen">
              <!-- Glass Glare Specular Reflection -->
              <div class="tablet-screen-glare"></div>

              <!-- Faux Browser Modern Top Bar -->
              <div class="browser-top-bar">
                <div class="browser-action-left">
                  <button class="browser-nav-btn" id="btn-browser-back" title="Back">
                    <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <button class="browser-nav-btn" id="btn-browser-fwd" title="Forward">
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button class="browser-reload-btn" id="btn-browser-refresh" title="Reload View">
                    <i class="fa-solid fa-rotate-right"></i>
                  </button>
                </div>

                <div class="browser-url-pill" id="browser-url-text" title="Encrypted Football Manager Vault Cloud URL">
                  <i class="fa-solid fa-lock browser-url-lock"></i>
                  <span class="browser-url-domain">thejourney.fm</span><span class="browser-url-path">/vault/career/${store.currentSeason.replace('/', '-')}/overview</span>
                </div>

                <div class="browser-controls-right">
                  <div class="control-dot dot-green" title="Expand View">+</div>
                  <div class="control-dot dot-yellow" title="Minimize View">-</div>
                  <div class="control-dot dot-red" title="Close View">x</div>
                </div>
              </div>

              <!-- Main Inner Screen Dynamic Canvas -->
              <div class="screen-canvas" id="screen-canvas"></div>
            </div>

            <!-- Bottom Bezel: Home Gesture Indicator -->
            <div class="tablet-bottom-bezel-bar">
              <div class="tablet-home-indicator" title="Home Indicator"></div>
            </div>
          </div>
        </div>

        <!-- Watermark Footer -->
        <div class="tablet-footer-credit">
          <i class="fa-solid fa-code" style="font-size: 0.75rem; color: #38bdf8;"></i> Designed & Developed by <span>Ruffy Prasetya</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Navigation back/forward buttons
    const btnBack = document.getElementById('btn-browser-back');
    const btnFwd = document.getElementById('btn-browser-fwd');
    if (btnBack) btnBack.onclick = () => showToast('Browser navigation: Home', 'info');
    if (btnFwd) btnFwd.onclick = () => showToast('Browser navigation: Forward', 'info');
    // Brand click returns to Home
    document.getElementById('brand-home-link').onclick = () => store.setPage('home');

    // Sign Out Button
    document.getElementById('btn-signout').onclick = () => {
      if (confirm(`Do you want to sign out of ${store.managerName}'s vault?`)) {
        firebaseService.logOut();
        showToast('Signed out of vault.');
      } else {
        openAuthModal('login');
      }
    };

    // User profile click opens auth/vault switcher
    document.getElementById('btn-profile-auth').onclick = () => openAuthModal('login');

    // Season Dropdown Toggle
    const seasonBtn = document.getElementById('btn-season-toggle');
    const seasonMenu = document.getElementById('season-dropdown-menu');

    seasonBtn.onclick = (e) => {
      e.stopPropagation();
      seasonMenu.classList.toggle('active');
    };

    document.addEventListener('click', (e) => {
      if (!seasonBtn.contains(e.target) && !seasonMenu.contains(e.target)) {
        seasonMenu.classList.remove('active');
      }
    });

    seasonMenu.querySelectorAll('.season-dropdown-item[data-season]').forEach(item => {
      item.onclick = () => {
        const selected = item.getAttribute('data-season');
        store.setSeason(selected);
        seasonMenu.classList.remove('active');
        showToast(`Switched to ${selected} season.`);
      };
    });

    document.getElementById('btn-add-new-season').onclick = () => {
      seasonMenu.classList.remove('active');
      const newSeason = prompt('Enter new season label (e.g. 2028/29):');
      if (newSeason) {
        store.addSeason(newSeason);
        showToast(`Season ${newSeason} added!`);
      }
    };

    // Sub Navigation Bar Clicks
    const navButtons = document.querySelectorAll('.nav-item-btn');
    navButtons.forEach(btn => {
      btn.onclick = () => {
        const page = btn.getAttribute('data-page');
        store.setPage(page);
      };
    });

    // Browser reload button
    document.getElementById('btn-browser-refresh').onclick = () => {
      this.renderCurrentView();
      showToast('Page refreshed.');
    };
  }

  updateHeaderUI() {
    // Update season text
    const seasonText = document.getElementById('season-display-text');
    if (seasonText) seasonText.textContent = store.currentSeason;

    // Update user name
    const userName = document.getElementById('header-user-name');
    if (userName) userName.textContent = `${store.managerName}!`;

    // Update active nav button
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      const page = btn.getAttribute('data-page');
      if (page === store.currentPage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  renderCurrentView() {
    const canvas = document.getElementById('screen-canvas');
    if (!canvas) return;

    // Scroll to top
    canvas.scrollTop = 0;

    switch (store.currentPage) {
      case 'home':
        renderHomeView(canvas);
        break;
      case 'squad':
        renderSquadView(canvas);
        break;
      case 'tactics':
        renderTacticsView(canvas);
        break;
      case 'schedules':
        renderSchedulesView(canvas);
        break;
      case 'analytics':
        renderAnalyticsView(canvas);
        break;
      case 'contracts':
        renderContractsView(canvas);
        break;
      case 'injuries':
        renderInjuriesView(canvas);
        break;
      case 'transfers':
        renderTransfersView(canvas);
        break;
      case 'tables':
        renderTablesView(canvas);
        break;
      case 'shortlists':
        renderShortlistsView(canvas);
        break;
      default:
        renderHomeView(canvas);
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
