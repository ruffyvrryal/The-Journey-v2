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

  // Selected lineup set (defaults to top 11 squad players or match lineup)
  const selectedLineup = new Set(matchToEdit?.lineup ? matchToEdit.lineup.map(Number) : squad.slice(0, 11).map(p => p.id));
  
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
    modalRoot.innerHTML = `
      <div class="modal-window" style="max-width: 620px; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <div class="modal-title">
            <i class="fa-solid fa-futbol" style="color: #38bdf8;"></i>
            ${isEdit ? 'Edit Match Fixture & Result' : 'Record Match Result'}
          </div>
          <button class="modal-close-btn" id="btn-close-match-modal" type="button">&times;</button>
        </div>

        <div class="modal-body" style="overflow-y: auto; flex: 1; padding: 18px 22px; gap: 16px;">
          <!-- Row 1: Competition, Gameweek, Date -->
          <div style="display: grid; grid-template-columns: 1.4fr 0.8fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">Competition</label>
              <select id="match-comp" class="form-select">
                <option value="Premier League" ${curComp === 'Premier League' ? 'selected' : ''}>Premier League</option>
                <option value="UEFA Champions League" ${curComp === 'UEFA Champions League' ? 'selected' : ''}>UEFA Champions League</option>
                <option value="FA Cup" ${curComp === 'FA Cup' ? 'selected' : ''}>FA Cup</option>
                <option value="Carabao Cup" ${curComp === 'Carabao Cup' ? 'selected' : ''}>Carabao Cup</option>
                <option value="Friendly" ${curComp === 'Friendly' ? 'selected' : ''}>Club Friendly</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Gameweek / Rd</label>
              <input type="number" id="match-gw" class="form-input" value="${curGw}" min="1" max="60" />
            </div>
            <div class="form-group">
              <label class="form-label">Match Date</label>
              <input type="text" id="match-date" class="form-input" value="${curDate}" placeholder="DD/MM/YYYY" />
            </div>
          </div>

          <!-- Row 2: Teams & Scores -->
          <div style="display: grid; grid-template-columns: 1fr 70px 70px 1fr; gap: 8px; align-items: flex-end; background: #070a24; padding: 12px; border-radius: 8px; border: 1px solid #1c2766;">
            <div class="form-group">
              <label class="form-label" style="color: #38bdf8; font-weight: 700;">Home Team</label>
              <input type="text" id="match-home" class="form-input" value="${curHome}" required />
            </div>
            <div class="form-group">
              <label class="form-label" style="text-align: center; font-weight: 700;">Score</label>
              <input type="number" id="match-hscore" class="form-input" value="${curHScore}" min="0" style="text-align: center; font-weight: 900; font-size: 1.25rem; color: #fbbf24; padding: 4px;" />
            </div>
            <div class="form-group">
              <label class="form-label" style="text-align: center; font-weight: 700;">Score</label>
              <input type="number" id="match-ascore" class="form-input" value="${curAScore}" min="0" style="text-align: center; font-weight: 900; font-size: 1.25rem; color: #fbbf24; padding: 4px;" />
            </div>
            <div class="form-group">
              <label class="form-label" style="color: #38bdf8; font-weight: 700;">Away Team</label>
              <input type="text" id="match-away" class="form-input" value="${curAway}" required />
            </div>
          </div>

          <!-- Section 3: Match Lineup & Appearances (Directly updates Squad and Analytics!) -->
          <div class="form-group">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <label class="form-label" style="font-weight: 800; color: #38bdf8; font-size: 0.85rem;">
                <i class="fa-solid fa-users"></i> Team Lineup (${selectedLineup.size} Players Selected)
              </label>
              <button type="button" id="btn-quick-starting-11" style="background: #102048; border: 1px solid #233772; color: #38bdf8; padding: 3px 10px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                Select Top 11
              </button>
            </div>
            <div style="font-size: 0.72rem; color: #cbd5e1; margin-bottom: 6px;">
              Every checked player will automatically receive <strong>+1 Match Appearance</strong> in the <strong>Squad</strong> and <strong>Data Analytics</strong> tables.
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 6px; max-height: 140px; overflow-y: auto; background: #05071a; padding: 8px; border-radius: 6px; border: 1px solid #16204e;">
              ${squad.map(p => {
                const isChecked = selectedLineup.has(p.id);
                return `
                  <label style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: ${isChecked ? '#ffffff' : '#94a3b8'}; cursor: pointer; background: ${isChecked ? '#0e1c4e' : 'transparent'}; padding: 4px 6px; border-radius: 4px; border: 1px solid ${isChecked ? '#233772' : 'transparent'};">
                    <input type="checkbox" class="chk-lineup-player" data-id="${p.id}" ${isChecked ? 'checked' : ''} />
                    <span style="font-weight: 800; color: #fbbf24; font-size: 0.7rem;">#${p.num || p.number || '—'}</span>
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">${p.name.split(' ').pop()} (${p.pos})</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Section 4: Goalscorers -->
          <div class="form-group">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <label class="form-label" style="font-weight: 800; color: #4ade80; font-size: 0.85rem;">
                <i class="fa-solid fa-futbol"></i> Goalscorers (Auto-adds Goals to Player Stats)
              </label>
              <button type="button" id="btn-add-goalscorer-row" style="background: #102048; border: 1px solid #233772; color: #4ade80; padding: 3px 10px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                + Add Goalscorer
              </button>
            </div>
            <div id="goalscorers-container" style="display: flex; flex-direction: column; gap: 6px;">
              ${goalscorersList.length === 0 ? `
                <div style="font-size: 0.72rem; color: #64748b; font-style: italic;">No goalscorers added yet. Click "+ Add Goalscorer" to select players who scored.</div>
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
          <div class="form-group">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <label class="form-label" style="font-weight: 800; color: #38bdf8; font-size: 0.85rem;">
                <i class="fa-solid fa-handshake-angle"></i> Assisters (Auto-adds Assists to Player Stats)
              </label>
              <button type="button" id="btn-add-assister-row" style="background: #102048; border: 1px solid #233772; color: #38bdf8; padding: 3px 10px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                + Add Assister
              </button>
            </div>
            <div id="assisters-container" style="display: flex; flex-direction: column; gap: 6px;">
              ${assistersList.length === 0 ? `
                <div style="font-size: 0.72rem; color: #64748b; font-style: italic;">No assisters added yet. Click "+ Add Assister" to select players who assisted.</div>
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

        <div class="modal-footer" style="padding: 12px 22px;">
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

    // Bind Lineup Checkbox Changes
    modalRoot.querySelectorAll('.chk-lineup-player').forEach(chk => {
      chk.onchange = () => {
        syncStateFromDOM();
        const pId = Number(chk.getAttribute('data-id'));
        if (chk.checked) selectedLineup.add(pId);
        else selectedLineup.delete(pId);
        renderModalContent();
      };
    });

    // Quick Select 11
    const btnQuick11 = modalRoot.querySelector('#btn-quick-starting-11');
    if (btnQuick11) {
      btnQuick11.onclick = () => {
        syncStateFromDOM();
        selectedLineup.clear();
        squad.slice(0, 11).forEach(p => selectedLineup.add(p.id));
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

        const payload = {
          gameweek: curGw,
          date: curDate,
          home: curHome.trim() || 'Man Utd',
          homeScore: curHScore,
          awayScore: curAScore,
          away: curAway.trim() || 'Opponent',
          competition: curComp,
          status: 'FT',
          lineup: Array.from(selectedLineup),
          goalscorers: goalscorersList,
          assisters: assistersList
        };

        if (isEdit) {
          store.updateMatchResult(matchToEdit.id, payload);
          showToast(`Match GW ${curGw} updated! Squad appearances & analytics recalculated.`);
        } else {
          store.addMatchResult(payload);
          showToast(`Match recorded! Lineup appearances, goals, and analytics updated.`);
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
      const val = modalRoot.querySelector('#p-val')?.value || '€50M';
      const wage = modalRoot.querySelector('#p-wage')?.value || '€100k/w';

      store.addPlayer({
        name,
        pos,
        num: shirtNumber,
        number: shirtNumber,
        shirtNumber: shirtNumber,
        age,
        nat: 'ENG',
        val,
        wage,
        con: '2030',
        mor: 'Superb',
        fit: 100,
        rat: 8.0,
        apps: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0
      });

      showToast(`Player signed: ${name} (#${shirtNumber || '—'})!`);
      closeModal();
    };
  }
}

