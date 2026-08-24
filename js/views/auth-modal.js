// Auth Modal, Firebase Config, & Data Editor Modals
import { firebaseService } from '../firebase-config.js';
import { store } from '../state.js';
import { renderCountryOptions } from '../utils/countries.js';

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

export function openAddMatchModal(matchToEdit = null) {
  const existing = document.getElementById('match-modal-root');
  if (existing) existing.remove();

  const isEdit = !!matchToEdit;
  const squad = store.squad || [];
  const defaultDate = matchToEdit?.date || new Date().toLocaleDateString('en-GB');
  const defaultGw = matchToEdit?.gameweek || (store.results.length + 1);
  const defaultHome = matchToEdit?.home || store.clubName || 'Man Utd';
  const defaultAway = matchToEdit?.away || 'Opponent Club';
  const defaultHScore = matchToEdit?.homeScore !== undefined ? matchToEdit.homeScore : 2;
  const defaultAScore = matchToEdit?.awayScore !== undefined ? matchToEdit.awayScore : 0;
  const defaultComp = matchToEdit?.competition || store.leagueName || 'Premier League';

  // Build initial rosterState for every squad player:
  // rosterState[playerId] = { role: 'starter' | 'sub' | 'unused', minutes: number }
  const rosterState = {};

  if (isEdit) {
    const existingLineup = new Set((matchToEdit.lineup || []).map(Number));
    const existingSubs = new Set();
    if (Array.isArray(matchToEdit.subs)) {
      matchToEdit.subs.forEach(s => {
        const sId = typeof s === 'object' ? (s.playerInId || s.playerId) : s;
        if (sId) existingSubs.add(Number(sId));
      });
    }
    const pm = matchToEdit.playerMinutes || {};

    squad.forEach(p => {
      const pId = Number(p.id);
      const isStarter = existingLineup.has(pId);
      const isSub = existingSubs.has(pId);
      const explicitMins = pm[pId] !== undefined ? Number(pm[pId]) : pm[String(pId)] !== undefined ? Number(pm[String(pId)]) : null;

      let role = 'unused';
      let minutes = 0;

      if (explicitMins !== null) {
        minutes = explicitMins;
        if (isStarter) role = 'starter';
        else if (isSub || minutes > 0) role = 'sub';
        else role = 'unused';
      } else if (isStarter) {
        role = 'starter';
        minutes = 90;
      } else if (isSub) {
        role = 'sub';
        minutes = 30;
      }

      rosterState[pId] = { role, minutes };
    });
  } else {
    // New match: Default top 11 to Starters (90 min), rest to Unused (0 min)
    squad.forEach((p, idx) => {
      const pId = Number(p.id);
      if (idx < 11) {
        rosterState[pId] = { role: 'starter', minutes: 90 };
      } else {
        rosterState[pId] = { role: 'unused', minutes: 0 };
      }
    });
  }

  // Goalscorers & Assisters state
  let goalscorersList = matchToEdit?.goalscorers ? JSON.parse(JSON.stringify(matchToEdit.goalscorers)) : [];
  let assistersList = matchToEdit?.assisters ? JSON.parse(JSON.stringify(matchToEdit.assisters)) : [];

  // Dynamic state values
  let curDate = defaultDate;
  let curGw = defaultGw;
  let curHome = defaultHome;
  let curAway = defaultAway;
  let curHScore = defaultHScore;
  let curAScore = defaultAScore;
  let curComp = defaultComp;

  const modalRoot = document.createElement('div');
  modalRoot.id = 'match-modal-root';
  modalRoot.className = 'modal-backdrop';

  const syncStateFromDOM = () => {
    const elDate = modalRoot.querySelector('#match-date');
    const elGw = modalRoot.querySelector('#match-gw');
    const elHome = modalRoot.querySelector('#match-home');
    const elAway = modalRoot.querySelector('#match-away');
    const elHScore = modalRoot.querySelector('#match-hscore');
    const elAScore = modalRoot.querySelector('#match-ascore');
    const elComp = modalRoot.querySelector('#match-comp');

    if (elDate) curDate = elDate.value;
    if (elGw) curGw = Number(elGw.value) || 1;
    if (elHome) curHome = elHome.value;
    if (elAway) curAway = elAway.value;
    if (elHScore) curHScore = Number(elHScore.value) || 0;
    if (elAScore) curAScore = Number(elAScore.value) || 0;
    if (elComp) curComp = elComp.value;

    // Collect roster values from DOM
    modalRoot.querySelectorAll('.roster-player-row').forEach(row => {
      const pId = Number(row.getAttribute('data-player-id'));
      const role = row.querySelector('.select-player-role')?.value || 'unused';
      const mins = Number(row.querySelector('.input-player-mins')?.value) || 0;
      if (pId) {
        rosterState[pId] = { role, minutes: mins };
      }
    });

    // Collect scorers
    goalscorersList = [];
    modalRoot.querySelectorAll('#goalscorers-container [data-g-idx]').forEach(row => {
      const pId = Number(row.querySelector('.select-scorer')?.value);
      const count = Number(row.querySelector('.input-scorer-count')?.value) || 1;
      const p = squad.find(sq => sq.id === pId);
      if (p) goalscorersList.push({ playerId: pId, name: p.name, count });
    });

    // Collect assisters
    assistersList = [];
    modalRoot.querySelectorAll('#assisters-container [data-a-idx]').forEach(row => {
      const pId = Number(row.querySelector('.select-assister')?.value);
      const count = Number(row.querySelector('.input-assister-count')?.value) || 1;
      const p = squad.find(sq => sq.id === pId);
      if (p) assistersList.push({ playerId: pId, name: p.name, count });
    });
  };

  const renderModalContent = () => {
    const starterCount = Object.values(rosterState).filter(r => r.role === 'starter').length;
    const subCount = Object.values(rosterState).filter(r => r.role === 'sub').length;
    const totalActive = starterCount + subCount;

    modalRoot.innerHTML = `
      <div class="modal-window" style="max-width: 680px; max-height: 92vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <div class="modal-title">
            <i class="fa-solid fa-futbol" style="color: #38bdf8;"></i>
            ${isEdit ? 'Edit Match Fixture &amp; Player Playtime' : 'Record Match Result &amp; Player Playtime'}
          </div>
          <button class="modal-close-btn" id="btn-close-match-modal" type="button">&times;</button>
        </div>

        <div class="modal-body" style="overflow-y: auto; flex: 1; padding: 16px 20px; gap: 14px; display: flex; flex-direction: column;">

          <!-- Row 1: Competition, Gameweek, Match Date (Parallel Alignment) -->
          <div style="display: grid; grid-template-columns: 1.4fr 0.8fr 1fr; gap: 10px; align-items: end;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Competition</label>
              <select id="match-comp" class="form-select">
                <option value="Premier League" ${curComp === 'Premier League' ? 'selected' : ''}>Premier League</option>
                <option value="UEFA Champions League" ${curComp === 'UEFA Champions League' ? 'selected' : ''}>UEFA Champions League</option>
                <option value="FA Cup" ${curComp === 'FA Cup' ? 'selected' : ''}>FA Cup</option>
                <option value="Carabao Cup" ${curComp === 'Carabao Cup' ? 'selected' : ''}>Carabao Cup</option>
                <option value="Friendly" ${curComp === 'Friendly' ? 'selected' : ''}>Club Friendly</option>
              </select>
            </div>
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Gameweek / Rd</label>
              <input type="number" id="match-gw" class="form-input" value="${curGw}" min="1" max="60" />
            </div>
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-weight: 700; color: #94a3b8; margin-bottom: 4px;">Match Date</label>
              <input type="text" id="match-date" class="form-input" value="${curDate}" placeholder="DD/MM/YYYY" />
            </div>
          </div>

          <!-- Row 2: Teams & Scores (Parallel Alignment) -->
          <div style="background: #070a24; padding: 12px 14px; border-radius: 8px; border: 1px solid #1c2766;">
            <div style="display: grid; grid-template-columns: 1fr 70px 70px 1fr; gap: 10px; align-items: end;">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="form-label" style="color: #38bdf8; font-weight: 700; margin: 0;">Home Team</label>
                <input type="text" id="match-home" class="form-input" value="${curHome}" required style="margin: 0;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="form-label" style="text-align: center; font-weight: 700; margin: 0; color: #fbbf24;">Score</label>
                <input type="number" id="match-hscore" class="form-input" value="${curHScore}" min="0"
                  style="text-align: center; font-weight: 900; font-size: 1.25rem; color: #fbbf24; padding: 6px; margin: 0;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="form-label" style="text-align: center; font-weight: 700; margin: 0; color: #fbbf24;">Score</label>
                <input type="number" id="match-ascore" class="form-input" value="${curAScore}" min="0"
                  style="text-align: center; font-weight: 900; font-size: 1.25rem; color: #fbbf24; padding: 6px; margin: 0;" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="form-label" style="color: #38bdf8; font-weight: 700; margin: 0;">Away Team</label>
                <input type="text" id="match-away" class="form-input" value="${curAway}" required style="margin: 0;" />
              </div>
            </div>
          </div>

          <!-- Section 3: Player Lineup Roles & Minutes Played Editor (Connected to Analytics) -->
          <div class="form-group" style="margin: 0; background: #060920; border: 1px solid #1c2766; border-radius: 8px; padding: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <div>
                <label class="form-label" style="font-weight: 800; color: #38bdf8; font-size: 0.88rem; margin: 0; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-users"></i> Match Lineup &amp; Player Playtime
                </label>
                <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
                  Set each player's role (<strong>Starter / Sub / Unused</strong>) and exact minutes played. Automatically connected to <strong>Analytics</strong>!
                </div>
              </div>

              <!-- Quick Presets -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" id="btn-preset-top11" style="background: #102048; border: 1px solid #233772; color: #38bdf8; padding: 4px 10px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; cursor: pointer;" title="Set first 11 players as 90' Starters">
                  Top 11 (90')
                </button>
                <button type="button" id="btn-preset-all90" style="background: #102048; border: 1px solid #233772; color: #4ade80; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; cursor: pointer;" title="Set all players to 90 min">
                  All 90'
                </button>
                <button type="button" id="btn-preset-clear" style="background: #201214; border: 1px solid #4a1d24; color: #f87171; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; cursor: pointer;" title="Reset all to Unused (0')">
                  Clear
                </button>
              </div>
            </div>

            <!-- Participation Summary Bar -->
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 0.72rem; padding: 4px 8px; background: #030614; border-radius: 4px; border: 1px solid #141c44;">
              <span style="color: #4ade80; font-weight: 800;"><i class="fa-solid fa-circle-check"></i> ${starterCount} Starters</span>
              <span style="color: #64748b;">•</span>
              <span style="color: #fb923c; font-weight: 800;"><i class="fa-solid fa-arrow-right-arrow-left"></i> ${subCount} Subs</span>
              <span style="color: #64748b;">•</span>
              <span style="color: #cbd5e1; font-weight: 700;">${totalActive} Total Active Players</span>
            </div>

            <!-- Scrollable Squad Roster Table -->
            <div style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; padding-right: 4px;">
              ${squad.map(p => {
                const pId = Number(p.id);
                const r = rosterState[pId] || { role: 'unused', minutes: 0 };
                const isStarter = r.role === 'starter';
                const isSub = r.role === 'sub';
                const isUnused = r.role === 'unused';

                let rowBg = '#070a22';
                let rowBorder = '#182352';
                if (isStarter) {
                  rowBg = 'rgba(34, 197, 94, 0.08)';
                  rowBorder = 'rgba(34, 197, 94, 0.35)';
                } else if (isSub) {
                  rowBg = 'rgba(251, 146, 60, 0.08)';
                  rowBorder = 'rgba(251, 146, 60, 0.35)';
                }

                return `
                  <div class="roster-player-row" data-player-id="${pId}"
                    style="display: grid; grid-template-columns: 1fr 140px 90px; gap: 8px; align-items: center; background: ${rowBg}; border: 1px solid ${rowBorder}; border-radius: 6px; padding: 6px 10px; transition: all 0.15s ease;">
                    
                    <!-- Player Info -->
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                      <span style="font-weight: 800; color: #fbbf24; font-size: 0.72rem; min-width: 22px;">#${p.num || p.number || '—'}</span>
                      <span style="font-weight: 700; color: ${isUnused ? '#94a3b8' : '#ffffff'}; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</span>
                      <span style="font-size: 0.68rem; background: #0c1538; color: #38bdf8; padding: 1px 6px; border-radius: 3px; border: 1px solid #1e2c66;">${p.pos}</span>
                    </div>

                    <!-- Role Selector -->
                    <div>
                      <select class="form-select select-player-role" data-player-id="${pId}"
                        style="padding: 4px 8px; font-size: 0.75rem; font-weight: 700; color: ${isStarter ? '#4ade80' : isSub ? '#fb923c' : '#94a3b8'}; background: #040718; border-color: ${isStarter ? '#22c55e60' : isSub ? '#fb923c60' : '#1f2b5c'};">
                        <option value="starter" ${isStarter ? 'selected' : ''}>🟢 Starter (XI)</option>
                        <option value="sub" ${isSub ? 'selected' : ''}>🟠 Sub (Bench)</option>
                        <option value="unused" ${isUnused ? 'selected' : ''}>⚪ Unused (0')</option>
                      </select>
                    </div>

                    <!-- Minutes Input -->
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <input type="number" class="form-input input-player-mins" data-player-id="${pId}"
                        value="${r.minutes}" min="0" max="120"
                        style="padding: 4px 6px; text-align: center; font-weight: 900; font-size: 0.82rem; color: ${isStarter ? '#4ade80' : isSub ? '#fb923c' : '#64748b'}; width: 55px;"
                        title="Minutes played (0-120)" />
                      <span style="font-size: 0.72rem; color: #64748b; font-weight: 700;">min</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Section 4: Goalscorers -->
          <div class="form-group" style="margin: 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <label class="form-label" style="font-weight: 800; color: #4ade80; font-size: 0.85rem; margin: 0;">
                <i class="fa-solid fa-futbol"></i> Goalscorers (Auto-adds Goals to Player Stats)
              </label>
              <button type="button" id="btn-add-goalscorer-row" style="background: #102048; border: 1px solid #233772; color: #4ade80; padding: 3px 10px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                + Add Goalscorer
              </button>
            </div>
            <div id="goalscorers-container" style="display: flex; flex-direction: column; gap: 6px;">
              ${goalscorersList.length === 0 ? `
                <div style="font-size: 0.72rem; color: #64748b; font-style: italic;">No goalscorers added yet. Click "+ Add Goalscorer" to record scorers.</div>
              ` : goalscorersList.map((g, idx) => `
                <div style="display: flex; align-items: center; gap: 8px;" data-g-idx="${idx}">
                  <select class="form-select select-scorer" style="flex: 1; padding: 6px 10px; font-size: 0.8rem;">
                    ${squad.map(p => `
                      <option value="${p.id}" ${Number(p.id) === Number(g.playerId) ? 'selected' : ''}>#${p.num || p.number || '—'} ${p.name} (${p.pos})</option>
                    `).join('')}
                  </select>
                  <input type="number" class="form-input input-scorer-count" value="${g.count || 1}" min="1" max="10" style="width: 65px; padding: 6px; text-align: center; font-weight: 800;" title="Goals scored" />
                  <button type="button" class="btn-remove-scorer" data-idx="${idx}" style="background: #dc2626; color: white; border: none; border-radius: 4px; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section 5: Assisters -->
          <div class="form-group" style="margin: 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <label class="form-label" style="font-weight: 800; color: #38bdf8; font-size: 0.85rem; margin: 0;">
                <i class="fa-solid fa-handshake-angle"></i> Assisters (Auto-adds Assists to Player Stats)
              </label>
              <button type="button" id="btn-add-assister-row" style="background: #102048; border: 1px solid #233772; color: #38bdf8; padding: 3px 10px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                + Add Assister
              </button>
            </div>
            <div id="assisters-container" style="display: flex; flex-direction: column; gap: 6px;">
              ${assistersList.length === 0 ? `
                <div style="font-size: 0.72rem; color: #64748b; font-style: italic;">No assisters added yet. Click "+ Add Assister" to record assists.</div>
              ` : assistersList.map((a, idx) => `
                <div style="display: flex; align-items: center; gap: 8px;" data-a-idx="${idx}">
                  <select class="form-select select-assister" style="flex: 1; padding: 6px 10px; font-size: 0.8rem;">
                    ${squad.map(p => `
                      <option value="${p.id}" ${Number(p.id) === Number(a.playerId) ? 'selected' : ''}>#${p.num || p.number || '—'} ${p.name} (${p.pos})</option>
                    `).join('')}
                  </select>
                  <input type="number" class="form-input input-assister-count" value="${a.count || 1}" min="1" max="10" style="width: 65px; padding: 6px; text-align: center; font-weight: 800;" title="Assists made" />
                  <button type="button" class="btn-remove-assister" data-idx="${idx}" style="background: #dc2626; color: white; border: none; border-radius: 4px; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="modal-footer" style="padding: 12px 20px;">
          <button type="button" class="btn-modal-cancel" id="btn-cancel-match">Cancel</button>
          <button type="button" class="btn-action-primary" id="btn-save-match-result" style="padding: 8px 24px; font-size: 0.9rem; font-weight: 800;">
            ${isEdit ? 'Save Match Edits' : 'Record Match Result'}
          </button>
        </div>
      </div>
    `;

    // Bind Close & Cancel
    const closeModal = () => modalRoot.remove();
    modalRoot.querySelector('#btn-close-match-modal').onclick = closeModal;
    modalRoot.querySelector('#btn-cancel-match').onclick = closeModal;
    modalRoot.onclick = (e) => { if (e.target === modalRoot) closeModal(); };

    // Bind Role Changes
    modalRoot.querySelectorAll('.select-player-role').forEach(sel => {
      sel.onchange = () => {
        syncStateFromDOM();
        const pId = Number(sel.getAttribute('data-player-id'));
        const newRole = sel.value;
        if (pId && rosterState[pId]) {
          rosterState[pId].role = newRole;
          if (newRole === 'starter' && (rosterState[pId].minutes === 0 || !rosterState[pId].minutes)) {
            rosterState[pId].minutes = 90;
          } else if (newRole === 'sub' && (rosterState[pId].minutes === 0 || rosterState[pId].minutes === 90)) {
            rosterState[pId].minutes = 30;
          } else if (newRole === 'unused') {
            rosterState[pId].minutes = 0;
          }
        }
        renderModalContent();
      };
    });

    // Bind Minutes Changes
    modalRoot.querySelectorAll('.input-player-mins').forEach(inp => {
      inp.oninput = () => {
        const pId = Number(inp.getAttribute('data-player-id'));
        const mins = Number(inp.value) || 0;
        if (pId && rosterState[pId]) {
          rosterState[pId].minutes = mins;
          if (mins > 0 && rosterState[pId].role === 'unused') {
            rosterState[pId].role = mins >= 80 ? 'starter' : 'sub';
          } else if (mins === 0) {
            rosterState[pId].role = 'unused';
          }
        }
      };
      inp.onchange = () => {
        syncStateFromDOM();
        renderModalContent();
      };
    });

    // Presets
    const btnTop11 = modalRoot.querySelector('#btn-preset-top11');
    if (btnTop11) {
      btnTop11.onclick = () => {
        syncStateFromDOM();
        squad.forEach((p, idx) => {
          const pId = Number(p.id);
          if (idx < 11) {
            rosterState[pId] = { role: 'starter', minutes: 90 };
          } else {
            rosterState[pId] = { role: 'unused', minutes: 0 };
          }
        });
        renderModalContent();
      };
    }

    const btnAll90 = modalRoot.querySelector('#btn-preset-all90');
    if (btnAll90) {
      btnAll90.onclick = () => {
        syncStateFromDOM();
        squad.forEach(p => {
          rosterState[Number(p.id)] = { role: 'starter', minutes: 90 };
        });
        renderModalContent();
      };
    }

    const btnClear = modalRoot.querySelector('#btn-preset-clear');
    if (btnClear) {
      btnClear.onclick = () => {
        syncStateFromDOM();
        squad.forEach(p => {
          rosterState[Number(p.id)] = { role: 'unused', minutes: 0 };
        });
        renderModalContent();
      };
    }

    // Add Goalscorer Row
    const btnAddScorer = modalRoot.querySelector('#btn-add-goalscorer-row');
    if (btnAddScorer) {
      btnAddScorer.onclick = () => {
        syncStateFromDOM();
        if (squad.length > 0) {
          goalscorersList.push({ playerId: squad[0].id, count: 1 });
          renderModalContent();
        }
      };
    }

    // Remove Goalscorer Row
    modalRoot.querySelectorAll('.btn-remove-scorer').forEach(btn => {
      btn.onclick = () => {
        syncStateFromDOM();
        const idx = Number(btn.getAttribute('data-idx'));
        goalscorersList.splice(idx, 1);
        renderModalContent();
      };
    });

    // Add Assister Row
    const btnAddAssister = modalRoot.querySelector('#btn-add-assister-row');
    if (btnAddAssister) {
      btnAddAssister.onclick = () => {
        syncStateFromDOM();
        if (squad.length > 0) {
          assistersList.push({ playerId: squad[0].id, count: 1 });
          renderModalContent();
        }
      };
    }

    // Remove Assister Row
    modalRoot.querySelectorAll('.btn-remove-assister').forEach(btn => {
      btn.onclick = () => {
        syncStateFromDOM();
        const idx = Number(btn.getAttribute('data-idx'));
        assistersList.splice(idx, 1);
        renderModalContent();
      };
    });

    // Save Match Result
    const btnSave = modalRoot.querySelector('#btn-save-match-result');
    if (btnSave) {
      btnSave.onclick = () => {
        syncStateFromDOM();

        const starters = [];
        const subs = [];
        const playerMinutes = {};

        Object.keys(rosterState).forEach(pIdStr => {
          const pId = Number(pIdStr);
          const r = rosterState[pId];
          if (r.role === 'starter') {
            starters.push(pId);
            playerMinutes[pId] = Number(r.minutes) || 90;
          } else if (r.role === 'sub') {
            subs.push({ playerInId: pId, minutes: Number(r.minutes) || 30 });
            playerMinutes[pId] = Number(r.minutes) || 30;
          } else if (Number(r.minutes) > 0) {
            subs.push({ playerInId: pId, minutes: Number(r.minutes) });
            playerMinutes[pId] = Number(r.minutes);
          }
        });

        const payload = {
          gameweek: curGw,
          date: curDate,
          home: curHome.trim() || 'Man Utd',
          homeScore: curHScore,
          awayScore: curAScore,
          away: curAway.trim() || 'Opponent',
          competition: curComp,
          status: 'FT',
          lineup: starters,
          subs,
          playerMinutes,
          goalscorers: goalscorersList,
          assisters: assistersList
        };

        if (isEdit) {
          store.updateMatchResult(matchToEdit.id, payload);
          showToast(`Match GW ${curGw} updated! Appearances, playtime &amp; analytics recalculated.`);
        } else {
          store.addMatchResult(payload);
          showToast(`Match recorded! Lineup, playtime, goals &amp; analytics updated.`);
        }

        closeModal();
      };
    }
  };

  renderModalContent();
  document.body.appendChild(modalRoot);
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
    <div class="modal-window" style="max-width: 480px;">
      <div class="modal-header">
        <div class="modal-title"><i class="fa-solid fa-user-plus" style="color: #38bdf8;"></i> Sign New Player</div>
        <button class="modal-close-btn" id="btn-close-player-modal" type="button">&times;</button>
      </div>
      <div class="modal-body" style="gap: 14px; padding: 20px;">
        <div class="form-group">
          <label class="form-label">Player Full Name</label>
          <input type="text" id="p-name" class="form-input" placeholder="e.g. Jude Bellingham" required />
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr 0.8fr; gap: 10px;">
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
            <label class="form-label">Nationality (A - Z)</label>
            <select id="p-nat" class="form-select" style="font-size: 0.82rem;">
              ${renderCountryOptions('ENG')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Contract Until</label>
            <input type="text" id="p-con" class="form-input" value="2030" required />
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

        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin-top: 8px;">
          <button type="button" class="btn-modal-cancel" id="btn-cancel-add-player">Cancel</button>
          <button type="button" id="btn-confirm-sign-player" class="btn-action-primary" style="padding: 10px 22px; font-size: 0.9rem; font-weight: 800;">
            Sign Player
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalRoot);
  const closeModal = () => modalRoot.remove();
  modalRoot.querySelector('#btn-close-player-modal').onclick = closeModal;
  modalRoot.querySelector('#btn-cancel-add-player').onclick = closeModal;
  modalRoot.onclick = (e) => { if (e.target === modalRoot) closeModal(); };

  // Explicit button click listener to prevent any HTML form cancellation
  const btnSign = modalRoot.querySelector('#btn-confirm-sign-player');
  if (btnSign) {
    btnSign.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const nameInput = modalRoot.querySelector('#p-name');
      const name = nameInput?.value?.trim();
      if (!name) {
        showToast('Please enter a player name.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      const rawNum = modalRoot.querySelector('#p-num')?.value;
      const shirtNumber = (rawNum !== '' && rawNum !== null && !isNaN(Number(rawNum))) ? Number(rawNum) : null;
      const pos = modalRoot.querySelector('#p-pos')?.value || defaultPos;
      const age = Number(modalRoot.querySelector('#p-age')?.value) || 23;
      const nat = modalRoot.querySelector('#p-nat')?.value || 'ENG';
      const val = modalRoot.querySelector('#p-val')?.value || '€50M';
      const wage = modalRoot.querySelector('#p-wage')?.value || '€100k/w';
      const con = modalRoot.querySelector('#p-con')?.value || '2030';

      store.addPlayer({
        name,
        pos,
        num: shirtNumber,
        number: shirtNumber,
        shirtNumber: shirtNumber,
        age,
        nat,
        val,
        wage,
        con,
        mor: 'Superb',
        fit: 100,
        rat: 8.0,
        apps: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0
      });

      showToast(`Player signed: ${name} (${nat}) (#${shirtNumber || '—'})!`);
      closeModal();
    };
  }
}

