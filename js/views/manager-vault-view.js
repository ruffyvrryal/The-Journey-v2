// Manager Career Vault Hub View matching Reference Photo 2
import { store } from '../state.js';
import { firebaseService } from '../firebase-config.js';
import { showToast } from './auth-modal.js';

export function renderManagerVaultView(container) {
  const currentUser = firebaseService.currentUser;
  const userDisplayName = (currentUser?.displayName || currentUser?.email?.split('@')[0] || 'USER').toUpperCase();
  const rawUserName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  let searchQuery = '';

  const renderVaultGrid = (filterText = '') => {
    const gridEl = container.querySelector('#manager-vaults-grid');
    if (!gridEl) return;

    const filtered = store.vaults.filter(v => {
      const q = filterText.toLowerCase();
      const mName = (v.managerName || `${v.firstName} ${v.lastName}`).toLowerCase();
      const club = (v.clubName || '').toLowerCase();
      const season = (v.season || '').toLowerCase();
      return mName.includes(q) || club.includes(q) || season.includes(q);
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-vaults-message">
          <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: #64748b; margin-bottom: 12px;"></i>
          <p>No manager vaults found matching "<strong>${filterText}</strong>".</p>
          <button class="btn-create-first-vault" id="btn-add-vault-empty">+ Add New Manager Vault</button>
        </div>
      `;
      const btnEmpty = gridEl.querySelector('#btn-add-vault-empty');
      if (btnEmpty) btnEmpty.onclick = () => openVaultModal();
      return;
    }

    gridEl.innerHTML = filtered.map(v => {
      const firstName = v.firstName || v.managerName?.split(' ')[0] || 'Manager';
      const lastName = v.lastName || v.managerName?.split(' ').slice(1).join(' ') || 'LEADER';
      const clubName = v.clubName || 'Manchester United';
      const season = v.season || store.currentSeason || '2026/27';
      const win = v.winRate || '80%';
      const draw = v.drawRate || '15%';
      const lose = v.loseRate || '5%';
      const avatarTheme = v.avatarTheme || 'avatar-orange';

      return `
        <div class="manager-vault-card" data-id="${v.id}">
          <!-- Top White Profile Header -->
          <div class="card-white-top">
            <!-- Manager Avatar Badge -->
            <div class="manager-avatar-circle ${avatarTheme}">
              <svg viewBox="0 0 100 100" class="manager-vector-art">
                <circle cx="50" cy="50" r="48" fill="inherit" />
                <path d="M50 20 C38 20 32 30 32 42 C32 50 36 58 44 62 L44 68 L56 68 L56 62 C64 58 68 50 68 42 C68 30 62 20 50 20 Z" fill="#fbcfe8" />
                <path d="M30 38 C28 26 38 15 50 15 C62 15 72 26 70 38 C68 34 60 26 50 26 C40 26 32 34 30 38 Z" fill="#1e293b" />
                <path d="M42 48 C42 48 45 52 50 52 C55 52 58 48 58 48" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round" />
                <path d="M40 56 C44 62 56 62 60 56 L60 62 C56 66 44 66 40 62 Z" fill="#1e293b" />
                <path d="M22 92 C22 75 34 70 50 70 C66 70 78 75 78 92 Z" fill="#3b82f6" />
                <polygon points="50,70 44,82 50,92 56,82" fill="#ffffff" />
                <polygon points="50,78 47,84 50,90 53,84" fill="#ef4444" />
              </svg>
            </div>

            <!-- Manager Name -->
            <div class="manager-name-stack">
              <span class="m-first-name">${firstName}</span>
              <span class="m-last-name">${lastName}</span>
            </div>

            <!-- Top Right Action Icons -->
            <div class="card-action-icons">
              <button class="btn-card-icon btn-edit-vault" data-id="${v.id}" title="Edit Manager Vault">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-card-icon btn-delete-vault" data-id="${v.id}" title="Delete Manager Vault">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>

          <!-- Middle Black Metadata Bar -->
          <div class="card-black-meta-bar">
            <span class="meta-season-tag">${season}</span>
            <span class="meta-club-tag">${clubName}</span>
          </div>

          <!-- Magenta Digital LED 3-Column Stats -->
          <div class="card-pink-stats-strip">
            <div class="led-stat-col">
              <span class="led-lbl">WIN</span>
              <span class="led-val">${win}</span>
            </div>
            <div class="led-stat-col">
              <span class="led-lbl">DRAW</span>
              <span class="led-val">${draw}</span>
            </div>
            <div class="led-stat-col">
              <span class="led-lbl">LOSE</span>
              <span class="led-val">${lose}</span>
            </div>
          </div>

          <!-- Bottom Action Button -->
          <div class="card-bottom-bar btn-enter-vault" data-id="${v.id}">
            <span>Enter Vault</span>
          </div>
        </div>
      `;
    }).join('');

    // Bind Enter Vault Clicks
    gridEl.querySelectorAll('.btn-enter-vault, .manager-vault-card').forEach(card => {
      card.onclick = (e) => {
        if (e.target.closest('.card-action-icons')) return;
        const id = card.getAttribute('data-id');
        store.selectVault(id);
        showToast(`Entering ${store.managerName}'s career vault!`);
      };
    });

    // Bind Edit Vault Clicks
    gridEl.querySelectorAll('.btn-edit-vault').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const vault = store.vaults.find(v => v.id === id);
        if (vault) openVaultModal(vault);
      };
    });

    // Bind Delete Vault Clicks
    gridEl.querySelectorAll('.btn-delete-vault').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const vault = store.vaults.find(v => v.id === id);
        if (vault) {
          if (confirm(`Are you sure you want to permanently delete ${vault.managerName || vault.firstName}'s vault (${vault.clubName})?`)) {
            store.deleteVault(id);
            renderVaultGrid(searchQuery);
            showToast('Manager vault deleted.');
          }
        }
      };
    });
  };

  container.innerHTML = `
    <div class="manager-vault-screen">
      <!-- Top Header (Sign Out & Welcome User) -->
      <header class="vault-top-header">
        <button class="btn-vault-signout" id="btn-vault-signout">
          SIGN OUT
        </button>

        <div class="vault-user-badge">
          <span class="vault-user-text">WELCOME, ${userDisplayName}!</span>
          <div class="vault-user-avatar-icon">
            <svg viewBox="0 0 100 100" width="34" height="34">
              <rect width="100" height="100" rx="14" fill="#38bdf8" />
              <path d="M50 25 C40 25 35 33 35 44 C35 52 40 58 50 58 C60 58 65 52 65 44 C65 33 60 25 50 25 Z" fill="#ffffff" />
              <path d="M22 88 C22 68 34 64 50 64 C66 64 78 68 78 88 Z" fill="#0f172a" />
              <polygon points="50,64 44,76 50,86 56,76" fill="#ffffff" />
              <polygon points="50,72 47,78 50,84 53,78" fill="#ef4444" />
            </svg>
          </div>
        </div>
      </header>

      <!-- Giant Arcade Yellow Center Title -->
      <div class="vault-hero-title-section">
        <h1 class="giant-arcade-yellow-heading">
          WELCOME TO<br>${userDisplayName}'S VAULT
        </h1>
      </div>

      <!-- Black Navigation Sub-Bar (Matches Photo 2) -->
      <div class="vault-sub-nav-bar">
        <button class="btn-add-vault-blue" id="btn-add-vault-main">
          ADD VAULT
        </button>

        <div class="vault-search-container">
          <i class="fa-solid fa-magnifying-glass vault-search-icon"></i>
          <input 
            type="text" 
            id="vault-search-input" 
            class="vault-search-input" 
            placeholder="Vault search..." 
            value="${searchQuery}"
          />
        </div>

        <div class="vault-sub-right-label">
          <span>Manager's Vault</span>
        </div>
      </div>

      <!-- Vault Cards Grid -->
      <div class="vault-cards-grid-container" id="manager-vaults-grid"></div>

      <!-- Modal Container for Add / Edit Vault -->
      <div id="vault-modal-container"></div>
    </div>
  `;

  // Render initial cards
  renderVaultGrid();

  // Bind Search Input
  const searchInput = container.querySelector('#vault-search-input');
  if (searchInput) {
    searchInput.oninput = (e) => {
      searchQuery = e.target.value;
      renderVaultGrid(searchQuery);
    };
  }

  // Bind Add Vault Main Button
  const btnAdd = container.querySelector('#btn-add-vault-main');
  if (btnAdd) {
    btnAdd.onclick = () => openVaultModal();
  }

  // Bind Sign Out
  const btnSignout = container.querySelector('#btn-vault-signout');
  if (btnSignout) {
    btnSignout.onclick = async () => {
      if (confirm('Do you want to sign out?')) {
        await firebaseService.logOut();
        store.setAppMode('login');
        showToast('Signed out successfully.');
      }
    };
  }

  // Open Add / Edit Modal Helper
  function openVaultModal(vaultToEdit = null) {
    const isEdit = !!vaultToEdit;
    const modalWrap = container.querySelector('#vault-modal-container');
    if (!modalWrap) return;

    modalWrap.innerHTML = `
      <div class="vault-modal-backdrop">
        <div class="vault-modal-card">
          <div class="vault-modal-header">
            <h3>${isEdit ? 'EDIT MANAGER VAULT' : 'CREATE NEW MANAGER VAULT'}</h3>
            <button class="btn-close-modal" id="btn-close-vault-modal"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form id="vault-modal-form" class="vault-modal-body" onsubmit="return false;">
            <div class="form-row-2col">
              <div class="modal-form-group">
                <label>First Name</label>
                <input type="text" id="mv-first-name" class="modal-input" value="${vaultToEdit?.firstName || ''}" placeholder="John" required />
              </div>
              <div class="modal-form-group">
                <label>Last Name (Uppercase)</label>
                <input type="text" id="mv-last-name" class="modal-input" value="${vaultToEdit?.lastName || ''}" placeholder="CONNOR" required />
              </div>
            </div>

            <div class="form-row-2col">
              <div class="modal-form-group">
                <label>Club Name</label>
                <input type="text" id="mv-club-name" class="modal-input" value="${vaultToEdit?.clubName || ''}" placeholder="Manchester United" required />
              </div>
              <div class="modal-form-group">
                <label>Current Season</label>
                <input type="text" id="mv-season" class="modal-input" value="${vaultToEdit?.season || '2026/27'}" placeholder="2026/27" required />
              </div>
            </div>

            <div class="form-row-3col">
              <div class="modal-form-group">
                <label>Win Rate</label>
                <input type="text" id="mv-win-rate" class="modal-input" value="${vaultToEdit?.winRate || '80%'}" placeholder="80%" />
              </div>
              <div class="modal-form-group">
                <label>Draw Rate</label>
                <input type="text" id="mv-draw-rate" class="modal-input" value="${vaultToEdit?.drawRate || '15%'}" placeholder="15%" />
              </div>
              <div class="modal-form-group">
                <label>Lose Rate</label>
                <input type="text" id="mv-lose-rate" class="modal-input" value="${vaultToEdit?.loseRate || '5%'}" placeholder="5%" />
              </div>
            </div>

            <div class="modal-form-group">
              <label>Avatar Color Theme</label>
              <select id="mv-avatar-theme" class="modal-input">
                <option value="avatar-orange" ${vaultToEdit?.avatarTheme === 'avatar-orange' ? 'selected' : ''}>Coral / Orange Circle</option>
                <option value="avatar-blue" ${vaultToEdit?.avatarTheme === 'avatar-blue' ? 'selected' : ''}>Sky Blue Circle</option>
                <option value="avatar-purple" ${vaultToEdit?.avatarTheme === 'avatar-purple' ? 'selected' : ''}>Purple Neon Circle</option>
                <option value="avatar-emerald" ${vaultToEdit?.avatarTheme === 'avatar-emerald' ? 'selected' : ''}>Emerald Green Circle</option>
              </select>
            </div>

            <div class="vault-modal-actions">
              <button type="button" class="btn-modal-cancel" id="btn-cancel-vault-modal">Cancel</button>
              <button type="submit" class="btn-modal-save">${isEdit ? 'SAVE CHANGES' : 'CREATE VAULT'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const form = modalWrap.querySelector('#vault-modal-form');
    const btnClose = modalWrap.querySelector('#btn-close-vault-modal');
    const btnCancel = modalWrap.querySelector('#btn-cancel-vault-modal');

    const closeModal = () => {
      modalWrap.innerHTML = '';
    };

    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;

    if (form) {
      form.onsubmit = () => {
        const first = modalWrap.querySelector('#mv-first-name').value.trim();
        const last = modalWrap.querySelector('#mv-last-name').value.trim().toUpperCase();
        const club = modalWrap.querySelector('#mv-club-name').value.trim();
        const season = modalWrap.querySelector('#mv-season').value.trim();
        const win = modalWrap.querySelector('#mv-win-rate').value.trim();
        const draw = modalWrap.querySelector('#mv-draw-rate').value.trim();
        const lose = modalWrap.querySelector('#mv-lose-rate').value.trim();
        const avatarTheme = modalWrap.querySelector('#mv-avatar-theme').value;

        if (!first || !club) {
          showToast('Please enter both manager name and club name.', 'error');
          return;
        }

        const payload = {
          firstName: first,
          lastName: last || 'MANAGER',
          managerName: `${first} ${last}`.trim(),
          clubName: club,
          season: season || '2026/27',
          winRate: win.includes('%') ? win : `${win}%`,
          drawRate: draw.includes('%') ? draw : `${draw}%`,
          loseRate: lose.includes('%') ? lose : `${lose}%`,
          avatarTheme
        };

        if (isEdit) {
          store.updateVault(vaultToEdit.id, payload);
          showToast(`Updated vault: ${payload.managerName}!`);
        } else {
          store.addVault(payload);
          showToast(`Created new manager vault for ${payload.managerName}!`);
        }

        closeModal();
        renderVaultGrid(searchQuery);
      };
    }
  }
}
