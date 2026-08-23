// Auth Modal, Firebase Config, & Data Editor Modals
import { firebaseService } from '../firebase-config.js';
import { store } from '../state.js';

export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : type === 'info' ? 'fa-circle-info' : 'fa-circle-check'}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function openAuthModal(defaultTab = 'login') {
  const existing = document.getElementById('auth-modal-root');
  if (existing) existing.remove();

  const modalRoot = document.createElement('div');
  modalRoot.id = 'auth-modal-root';
  modalRoot.className = 'modal-backdrop';

  modalRoot.innerHTML = `
    <div class="modal-window">
      <div class="modal-header">
        <div class="modal-title">
          <i class="fa-solid fa-shield-halved" style="color: var(--brand-yellow);"></i>
          The Journey • Personal Vault
        </div>
        <button class="modal-close-btn" id="btn-close-modal">&times;</button>
      </div>

      <div class="modal-body">
        <div class="auth-tabs-toggle">
          <button class="auth-tab-btn ${defaultTab === 'login' ? 'active' : ''}" data-tab="login">Sign In</button>
          <button class="auth-tab-btn ${defaultTab === 'register' ? 'active' : ''}" data-tab="register">Register</button>
          <button class="auth-tab-btn ${defaultTab === 'config' ? 'active' : ''}" data-tab="config">Firebase Config</button>
        </div>

        <!-- LOGIN FORM -->
        <form id="form-login" style="display: ${defaultTab === 'login' ? 'flex' : 'none'}; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="login-email" class="form-input" placeholder="e.g. manager@thejourney.com" required value="${firebaseService.currentUser?.email || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="login-password" class="form-input" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn-action-primary" style="padding: 10px; font-size: 0.9rem; justify-content: center; margin-top: 4px;">
            Access Career Vault
          </button>
          <p class="auth-switch-note">No account yet? <a href="#" id="link-goto-register">Create a new vault</a></p>
        </form>

        <!-- REGISTER FORM -->
        <form id="form-register" style="display: ${defaultTab === 'register' ? 'flex' : 'none'}; flex-direction: column; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Manager Name</label>
            <input type="text" id="reg-name" class="form-input" placeholder="e.g. John Connor" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="reg-email" class="form-input" placeholder="manager@thejourney.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="reg-password" class="form-input" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn-action-primary" style="padding: 10px; font-size: 0.9rem; justify-content: center; margin-top: 4px;">
            Create Personal Vault
          </button>
        </form>

        <!-- FIREBASE CONFIG FORM -->
        <form id="form-config" style="display: ${defaultTab === 'config' ? 'flex' : 'none'}; flex-direction: column; gap: 12px;">
          <p style="font-size: 0.8rem; color: #94a3b8;">
            Connect your free Firebase Firestore & Auth project to automatically sync your Football Manager vault across devices.
          </p>
          <div class="form-group">
            <label class="form-label">Firebase Config (JSON format)</label>
            <textarea id="firebase-config-json" class="form-textarea" rows="6" placeholder='{ "apiKey": "...", "authDomain": "...", "projectId": "..." }'></textarea>
          </div>
          <button type="submit" class="btn-action-primary" style="padding: 10px; font-size: 0.9rem; justify-content: center;">
            Save Firebase Keys
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modalRoot);

  // Tab switching
  const tabs = modalRoot.querySelectorAll('.auth-tab-btn');
  const forms = {
    login: modalRoot.querySelector('#form-login'),
    register: modalRoot.querySelector('#form-register'),
    config: modalRoot.querySelector('#form-config')
  };

  tabs.forEach(btn => {
    btn.onclick = () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const tabName = btn.getAttribute('data-tab');
      Object.keys(forms).forEach(k => {
        forms[k].style.display = k === tabName ? 'flex' : 'none';
      });
    };
  });

  // Close modal
  const closeModal = () => modalRoot.remove();
  modalRoot.querySelector('#btn-close-modal').onclick = closeModal;
  modalRoot.onclick = (e) => { if (e.target === modalRoot) closeModal(); };

  // Login Submit
  forms.login.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    try {
      const user = await firebaseService.signIn(email, pass);
      store.managerName = user.displayName || email.split('@')[0];
      store.notify();
      showToast(`Welcome back, ${store.managerName}!`);
      closeModal();
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  // Register Submit
  forms.register.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value;
    try {
      const user = await firebaseService.signUp(email, pass, name);
      store.managerName = name;
      store.notify();
      showToast(`Personal vault created for ${name}!`);
      closeModal();
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  // Config Submit
  forms.config.onsubmit = (e) => {
    e.preventDefault();
    const jsonStr = document.getElementById('firebase-config-json').value.trim();
    try {
      const parsed = JSON.parse(jsonStr);
      firebaseService.saveConfig(parsed);
      showToast('Firebase configuration saved and activated!');
      closeModal();
    } catch (err) {
      showToast('Invalid JSON configuration format', 'error');
    }
  };
}

export function openEditStatsModal() {
  const existing = document.getElementById('stats-modal-root');
  if (existing) existing.remove();

  const modalRoot = document.createElement('div');
  modalRoot.id = 'stats-modal-root';
  modalRoot.className = 'modal-backdrop';

  modalRoot.innerHTML = `
    <div class="modal-window">
      <div class="modal-header">
        <div class="modal-title"><i class="fa-solid fa-pen-to-square"></i> Edit Record & Performance</div>
        <button class="modal-close-btn" id="btn-close-stats-modal">&times;</button>
      </div>
      <form id="form-edit-stats" class="modal-body">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Wins</label>
            <input type="number" id="input-wins" class="form-input" value="${store.record.wins}" min="0" required />
          </div>
          <div class="form-group">
            <label class="form-label">Draws</label>
            <input type="number" id="input-draws" class="form-input" value="${store.record.draws}" min="0" required />
          </div>
          <div class="form-group">
            <label class="form-label">Losses</label>
            <input type="number" id="input-losses" class="form-input" value="${store.record.losses}" min="0" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Performance Rating</label>
          <select id="select-perf" class="form-select">
            <option value="Excellent" ${store.performance === 'Excellent' ? 'selected' : ''}>Excellent</option>
            <option value="Superb" ${store.performance === 'Superb' ? 'selected' : ''}>Superb</option>
            <option value="Good" ${store.performance === 'Good' ? 'selected' : ''}>Good</option>
            <option value="Average" ${store.performance === 'Average' ? 'selected' : ''}>Average</option>
          </select>
        </div>

        <button type="submit" class="btn-action-primary" style="padding: 10px; font-size: 0.9rem; justify-content: center; margin-top: 6px;">
          Save Changes
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modalRoot);
  const closeModal = () => modalRoot.remove();
  modalRoot.querySelector('#btn-close-stats-modal').onclick = closeModal;
  modalRoot.onclick = (e) => { if (e.target === modalRoot) closeModal(); };

  modalRoot.querySelector('#form-edit-stats').onsubmit = (e) => {
    e.preventDefault();
    const w = document.getElementById('input-wins').value;
    const d = document.getElementById('input-draws').value;
    const l = document.getElementById('input-losses').value;
    store.performance = document.getElementById('select-perf').value;
    store.updateRecord(w, d, l);
    showToast('Record statistics updated!');
    closeModal();
  };
}

export function openAddMatchModal() {
  const existing = document.getElementById('match-modal-root');
  if (existing) existing.remove();

  const modalRoot = document.createElement('div');
  modalRoot.id = 'match-modal-root';
  modalRoot.className = 'modal-backdrop';

  modalRoot.innerHTML = `
    <div class="modal-window">
      <div class="modal-header">
        <div class="modal-title"><i class="fa-solid fa-futbol"></i> Record Match Result</div>
        <button class="modal-close-btn" id="btn-close-match-modal">&times;</button>
      </div>
      <form id="form-add-match" class="modal-body">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Gameweek</label>
            <input type="number" id="match-gw" class="form-input" value="20" required />
          </div>
          <div class="form-group">
            <label class="form-label">Match Date</label>
            <input type="text" id="match-date" class="form-input" value="27/07/2026" required />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 60px 60px 1fr; gap: 8px; align-items: flex-end;">
          <div class="form-group">
            <label class="form-label">Home</label>
            <input type="text" id="match-home" class="form-input" value="Man Utd" required />
          </div>
          <div class="form-group">
            <label class="form-label">Score</label>
            <input type="number" id="match-hscore" class="form-input" value="3" min="0" required />
          </div>
          <div class="form-group">
            <label class="form-label">Score</label>
            <input type="number" id="match-ascore" class="form-input" value="0" min="0" required />
          </div>
          <div class="form-group">
            <label class="form-label">Away</label>
            <input type="text" id="match-away" class="form-input" value="Tottenham" required />
          </div>
        </div>

        <button type="submit" class="btn-action-primary" style="padding: 10px; font-size: 0.9rem; justify-content: center; margin-top: 6px;">
          Save Result
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modalRoot);
  const closeModal = () => modalRoot.remove();
  modalRoot.querySelector('#btn-close-match-modal').onclick = closeModal;
  modalRoot.onclick = (e) => { if (e.target === modalRoot) closeModal(); };

  modalRoot.querySelector('#form-add-match').onsubmit = (e) => {
    e.preventDefault();
    store.addMatchResult({
      gameweek: Number(document.getElementById('match-gw').value),
      date: document.getElementById('match-date').value,
      home: document.getElementById('match-home').value,
      homeScore: Number(document.getElementById('match-hscore').value),
      awayScore: Number(document.getElementById('match-ascore').value),
      away: document.getElementById('match-away').value,
      competition: store.leagueName
    });
    showToast('Match logged & table recalculated!');
    closeModal();
  };
}

export function openAddPlayerModal(defaultPos = 'MC') {
  const existing = document.getElementById('player-modal-root');
  if (existing) existing.remove();

  const posOptions = [
    { value: 'GK', label: 'GK (Goalkeeper)' },
    { value: 'DC', label: 'DC (Centre-Back)' },
    { value: 'DL', label: 'DL (Left-Back)' },
    { value: 'DR', label: 'DR (Right-Back)' },
    { value: 'DM', label: 'DM (Defensive Mid)' },
    { value: 'MC', label: 'MC (Central Mid)' },
    { value: 'AMC', label: 'AMC (Attacking Mid)' },
    { value: 'AML', label: 'AML (Left Winger)' },
    { value: 'AMR', label: 'AMR (Right Winger)' },
    { value: 'ST', label: 'ST (Striker)' }
  ];

  const modalRoot = document.createElement('div');
  modalRoot.id = 'player-modal-root';
  modalRoot.className = 'modal-backdrop';

  modalRoot.innerHTML = `
    <div class="modal-window">
      <div class="modal-header">
        <div class="modal-title"><i class="fa-solid fa-user-plus"></i> Add Player to Squad</div>
        <button class="modal-close-btn" id="btn-close-player-modal">&times;</button>
      </div>
      <form id="form-add-player" class="modal-body">
        <div class="form-group">
          <label class="form-label">Player Full Name</label>
          <input type="text" id="p-name" class="form-input" placeholder="e.g. Jude Bellingham" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Position</label>
            <select id="p-pos" class="form-select">
              ${posOptions.map(opt => `
                <option value="${opt.value}" ${opt.value === defaultPos ? 'selected' : ''}>${opt.label}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Shirt #</label>
            <input type="number" id="p-num" class="form-input" placeholder="e.g. 7" min="1" max="99" />
          </div>
          <div class="form-group">
            <label class="form-label">Age</label>
            <input type="number" id="p-age" class="form-input" value="23" min="15" max="45" required />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Transfer Value</label>
            <input type="text" id="p-val" class="form-input" value="€80M" required />
          </div>
          <div class="form-group">
            <label class="form-label">Weekly Wage</label>
            <input type="text" id="p-wage" class="form-input" value="€175k/w" required />
          </div>
        </div>

        <button type="submit" class="btn-action-primary" style="padding: 10px; font-size: 0.9rem; justify-content: center; margin-top: 6px;">
          Sign Player
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modalRoot);
  const closeModal = () => modalRoot.remove();
  modalRoot.querySelector('#btn-close-player-modal').onclick = closeModal;
  modalRoot.onclick = (e) => { if (e.target === modalRoot) closeModal(); };

  modalRoot.querySelector('#form-add-player').onsubmit = (e) => {
    e.preventDefault();
    const rawNum = document.getElementById('p-num').value;
    const shirtNumber = rawNum !== '' && !isNaN(Number(rawNum)) ? Number(rawNum) : null;

    store.addPlayer({
      name: document.getElementById('p-name').value,
      pos: document.getElementById('p-pos').value,
      num: shirtNumber,
      number: shirtNumber,
      shirtNumber: shirtNumber,
      age: Number(document.getElementById('p-age').value),
      nat: 'ENG',
      val: document.getElementById('p-val').value,
      wage: document.getElementById('p-wage').value,
      con: '2030',
      mor: 'Superb',
      fit: 100,
      rat: 8.0
    });
    showToast('Player signed to squad!');
    closeModal();
  };
}
