// Squad View - Positionally Separated Roster Tables
import { store } from '../state.js';
import { openAddPlayerModal, showToast } from './auth-modal.js';
import { renderPlayerDetailView } from './player-detail-view.js';

// Position Categorization Helper
export function getPlayerCategory(pos) {
  if (!pos) return 'MID';
  const p = pos.toUpperCase().trim();
  if (p === 'GK' || p.includes('GOAL') || p === 'G') {
    return 'GK';
  }
  if (['DC', 'DL', 'DR', 'CB', 'LB', 'RB', 'CWB', 'WB', 'SW', 'DF', 'DEF'].includes(p) || p.startsWith('D ') || p.startsWith('D/')) {
    return 'DEF';
  }
  if (['ST', 'AF', 'CF', 'AML', 'AMR', 'LW', 'RW', 'IF', 'IW', 'SS', 'FW', 'FWD', 'ATT'].includes(p) || p.startsWith('AM/F') || p.startsWith('F ')) {
    return 'FWD';
  }
  return 'MID'; // Default to Midfielders (DM, MC, AMC, ML, MR, CM, CAM, CDM, etc.)
}

export function getPositionBadgeClass(pos) {
  const cat = getPlayerCategory(pos);
  switch (cat) {
    case 'GK': return 'pos-gk';
    case 'DEF': return 'pos-df';
    case 'MID': return 'pos-mf';
    case 'FWD': return 'pos-fw';
    default: return 'pos-mf';
  }
}

// Helper to extract shirt number robustly and auto-assign if missing
export function getPlayerShirtNumber(p, fallbackIndex = 1, pos = 'MC') {
  if (!p) return 1;
  const candidates = [p.num, p.number, p.shirtNumber];
  for (const c of candidates) {
    if (c !== undefined && c !== null && c !== '' && !isNaN(Number(c))) {
      const parsed = Number(c);
      if (parsed > 0) return parsed;
    }
  }
  // If player has no number, auto-assign based on position and ID
  const isGk = getPlayerCategory(pos || p.pos) === 'GK';
  const autoNum = isGk ? 1 : ((Number(p.id) || 10) % 90 + 2 || fallbackIndex + 1);
  p.num = autoNum;
  p.number = autoNum;
  p.shirtNumber = autoNum;
  return autoNum;
}

export function renderSquadView(container) {
  // If a player is selected, render their full detailed profile screen
  if (store.selectedPlayerId) {
    renderPlayerDetailView(container, store.selectedPlayerId);
    return;
  }

  const allPlayers = store.squad || [];

  // Auto-backfill any missing shirt numbers immediately
  allPlayers.forEach((p, idx) => {
    getPlayerShirtNumber(p, idx + 1, p.pos);
  });

  // Group players by position, then sort by shirt number
  const sortByShirt = (arr) => [...arr].sort((a, b) => {
    const na = getPlayerShirtNumber(a);
    const nb = getPlayerShirtNumber(b);
    return na - nb;
  });

  const goalkeepers  = sortByShirt(allPlayers.filter(p => getPlayerCategory(p.pos) === 'GK'));
  const defenders   = sortByShirt(allPlayers.filter(p => getPlayerCategory(p.pos) === 'DEF'));
  const midfielders = sortByShirt(allPlayers.filter(p => getPlayerCategory(p.pos) === 'MID'));
  const forwards    = sortByShirt(allPlayers.filter(p => getPlayerCategory(p.pos) === 'FWD'));

  // Compute Squad Summary Stats
  const totalCount = allPlayers.length;
  const avgAge = totalCount > 0 
    ? (allPlayers.reduce((acc, p) => acc + (Number(p.age) || 24), 0) / totalCount).toFixed(1)
    : '24.0';

  // Helper to render an individual player row
  const renderPlayerRow = (p, idx) => {
    const posClass = getPositionBadgeClass(p.pos);
    const fitVal = Number(p.fit) || 95;
    const fitColor = fitVal >= 95 ? '#22c55e' : fitVal >= 85 ? '#eab308' : '#ef4444';
    const ratingVal = typeof p.rat === 'number' ? p.rat.toFixed(1) : Number(p.rat || 7.5).toFixed(1);
    const shirtNum = getPlayerShirtNumber(p, idx + 1, p.pos);

    return `
      <tr class="squad-player-row clickable-player-row" data-id="${p.id}" title="Click to view & edit detailed profile and upload photo for ${p.name}">
        <td class="shirt-num-cell">
          <span class="shirt-number-badge" data-id="${p.id}" title="Shirt #${shirtNum} (Click to edit)">${shirtNum}</span>
        </td>
        <td class="player-name-cell">
          <div class="player-avatar-circle ${p.photo ? 'has-custom-photo' : ''}">
            ${p.photo ? `
              <img src="${p.photo}" alt="${p.name}" class="player-avatar-mini-img" />
            ` : `
              <span>${p.name.charAt(0)}</span>
            `}
          </div>
          <div class="player-name-meta">
            <span class="player-primary-name">${p.name}</span>
            <span class="player-click-hint"><i class="fa-solid fa-arrow-up-right-from-square"></i> Profile</span>
          </div>
        </td>
        <td>
          <span class="badge-position ${posClass}">${p.pos}</span>
        </td>
        <td style="text-align: center; font-weight: 600;">${p.age}</td>
        <td style="text-align: center;">
          <span class="nation-tag">${p.nat || 'ENG'}</span>
        </td>
        <td class="val-cell">${p.val}</td>
        <td class="wage-cell">${p.wage}</td>
        <td style="font-weight: 600; color: ${p.con === '2027' ? '#f87171' : '#e2e8f0'};">${p.con}</td>
        <td>
          <span class="morale-pill ${p.mor === 'Superb' ? 'morale-superb' : 'morale-good'}">${p.mor || 'Good'}</span>
        </td>
        <td style="text-align: center;">
          <div class="condition-meter-wrap" title="Condition: ${fitVal}%">
            <div class="condition-meter-bar" style="width: ${fitVal}%; background-color: ${fitColor};"></div>
            <span class="condition-text">${fitVal}%</span>
          </div>
        </td>
        <td style="text-align: center;">
          <span class="badge-rating">${ratingVal}</span>
        </td>
        <td style="text-align: center;">
          <button class="btn-del-player" data-id="${p.id}" data-name="${p.name}" title="Remove ${p.name}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  };

  // Helper to render a position group table section
  const renderPositionSection = (groupKey, groupTitle, iconClass, colorTheme, defaultPosCode, playersList) => {
    return `
      <div class="position-group-card theme-${colorTheme}" id="pos-group-${groupKey}">
        <div class="position-group-header">
          <div class="position-group-title-left">
            <div class="position-group-icon-badge ${colorTheme}">
              <i class="${iconClass}"></i>
            </div>
            <div>
              <div class="position-group-heading">${groupTitle}</div>
              <div class="position-group-sub">
                <span class="pos-counter-pill">${playersList.length} ${playersList.length === 1 ? 'Player' : 'Players'}</span>
              </div>
            </div>
          </div>

          <div class="position-group-actions">
            <button class="btn-group-add-player" data-pos="${defaultPosCode}">
              <i class="fa-solid fa-plus"></i> Add ${defaultPosCode}
            </button>
          </div>
        </div>

        <div class="position-table-container">
          ${playersList.length > 0 ? `
            <table class="full-data-table squad-table">
              <thead>
                <tr>
                  <th class="shirt-num-th" title="Shirt Number">#</th>
                  <th>Player Name</th>
                  <th>Position</th>
                  <th style="text-align: center;">Age</th>
                  <th style="text-align: center;">Nat</th>
                  <th>Value</th>
                  <th>Wage</th>
                  <th>Contract</th>
                  <th>Morale</th>
                  <th style="text-align: center; min-width: 95px;">Condition</th>
                  <th style="text-align: center;">Rating</th>
                  <th style="text-align: center; width: 60px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${playersList.map(renderPlayerRow).join('')}
              </tbody>
            </table>
          ` : `
            <div class="empty-position-state">
              <i class="${iconClass} empty-icon"></i>
              <div class="empty-text">No ${groupTitle.toLowerCase()} registered in the active squad.</div>
              <button class="btn-action-secondary btn-group-add-player" data-pos="${defaultPosCode}" style="margin-top: 6px;">
                <i class="fa-solid fa-plus"></i> Sign a ${defaultPosCode}
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="page-view-container squad-page-view">
      <!-- SQUAD TOP HEADER -->
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-users" style="color: #38bdf8;"></i>
          ${store.clubName} Senior Squad
        </div>
        <div class="page-actions-group">
          <button class="btn-action-primary" id="btn-add-player-global">
            <i class="fa-solid fa-user-plus"></i> Sign New Player
          </button>
        </div>
      </div>

      <!-- SQUAD OVERVIEW METRIC SUMMARY & POSITION JUMP FILTER -->
      <div class="squad-summary-grid">
        <div class="squad-stat-tile">
          <span class="stat-lbl">Total Squad</span>
          <span class="stat-val">${totalCount} <span class="stat-unit">Players</span></span>
        </div>
        <div class="squad-stat-tile">
          <span class="stat-lbl">Average Age</span>
          <span class="stat-val">${avgAge} <span class="stat-unit">Years</span></span>
        </div>
        <div class="squad-stat-tile">
          <span class="stat-lbl">Goalkeepers</span>
          <span class="stat-val val-gk">${goalkeepers.length}</span>
        </div>
        <div class="squad-stat-tile">
          <span class="stat-lbl">Defenders</span>
          <span class="stat-val val-df">${defenders.length}</span>
        </div>
        <div class="squad-stat-tile">
          <span class="stat-lbl">Midfielders</span>
          <span class="stat-val val-mf">${midfielders.length}</span>
        </div>
        <div class="squad-stat-tile">
          <span class="stat-lbl">Forwards</span>
          <span class="stat-val val-fw">${forwards.length}</span>
        </div>
      </div>

      <!-- POSITION QUICK-FILTER PILLS -->
      <div class="squad-filter-bar">
        <button class="squad-filter-pill active" data-filter="all">
          <i class="fa-solid fa-layer-group"></i> All Positions (${totalCount})
        </button>
        <button class="squad-filter-pill" data-filter="gk">
          <span class="filter-dot dot-gk"></span> Goalkeepers (${goalkeepers.length})
        </button>
        <button class="squad-filter-pill" data-filter="def">
          <span class="filter-dot dot-df"></span> Defenders (${defenders.length})
        </button>
        <button class="squad-filter-pill" data-filter="mid">
          <span class="filter-dot dot-mf"></span> Midfielders (${midfielders.length})
        </button>
        <button class="squad-filter-pill" data-filter="fwd">
          <span class="filter-dot dot-fw"></span> Forwards (${forwards.length})
        </button>
      </div>

      <!-- SEPARATE TABLES BASED ON POSITION -->
      <div class="squad-tables-stack" id="squad-tables-stack">
        <!-- 1. GOALKEEPERS TABLE -->
        ${renderPositionSection('gk', 'Goalkeepers', 'fa-solid fa-hands-holding-circle', 'gk', 'GK', goalkeepers)}

        <!-- 2. DEFENDERS TABLE -->
        ${renderPositionSection('def', 'Defenders', 'fa-solid fa-shield-halved', 'df', 'DC', defenders)}

        <!-- 3. MIDFIELDERS TABLE -->
        ${renderPositionSection('mid', 'Midfielders', 'fa-solid fa-arrows-split-up-and-left', 'mf', 'MC', midfielders)}

        <!-- 4. FORWARDS TABLE -->
        ${renderPositionSection('fwd', 'Forwards & Wingers', 'fa-solid fa-crosshairs', 'fw', 'ST', forwards)}
      </div>
    </div>
  `;

  // Bind Global Add Player Button
  const btnGlobalAdd = container.querySelector('#btn-add-player-global');
  if (btnGlobalAdd) {
    btnGlobalAdd.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openAddPlayerModal('MC');
    };
  }

  // Bind Position Group Add Player Buttons
  container.querySelectorAll('.btn-group-add-player').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const defaultPos = btn.getAttribute('data-pos') || 'MC';
      openAddPlayerModal(defaultPos);
    };
  });

  // Bind Delete Player Buttons
  container.querySelectorAll('.btn-del-player').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute('data-id'));
      const playerName = btn.getAttribute('data-name') || 'this player';
      if (confirm(`Are you sure you want to release ${playerName} from the senior squad?`)) {
        store.removePlayer(id);
        showToast(`${playerName} released from squad.`);
      }
    };
  });

  // Bind Shirt Number Badge Quick Edit
  container.querySelectorAll('.shirt-number-badge').forEach(badge => {
    badge.onclick = (e) => {
      e.stopPropagation();
      const id = Number(badge.getAttribute('data-id'));
      const player = store.squad.find(p => p.id === id);
      if (player) {
        const current = getPlayerShirtNumber(player);
        const newNum = prompt(`Set shirt number for ${player.name}:`, current || '');
        if (newNum !== null && newNum.trim() !== '') {
          const parsed = Number(newNum);
          if (!isNaN(parsed) && parsed > 0) {
            store.updatePlayer(player.id, { num: parsed, number: parsed, shirtNumber: parsed });
            showToast(`${player.name} assigned shirt #${parsed}`);
          }
        }
      }
    };
  });

  // Bind Clickable Player Rows to Open Detailed Player View
  container.querySelectorAll('.clickable-player-row').forEach(row => {
    row.onclick = (e) => {
      // Ignore if clicking on delete button or shirt badge
      if (e.target.closest('.btn-del-player') || e.target.closest('.shirt-number-badge')) return;
      const id = Number(row.getAttribute('data-id'));
      if (id) {
        store.selectPlayer(id);
      }
    };
  });

  // Bind Position Quick-Filter Pills
  container.querySelectorAll('.squad-filter-pill').forEach(pill => {
    pill.onclick = () => {
      container.querySelectorAll('.squad-filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      const groups = {
        gk: container.querySelector('#pos-group-gk'),
        def: container.querySelector('#pos-group-def'),
        mid: container.querySelector('#pos-group-mid'),
        fwd: container.querySelector('#pos-group-fwd')
      };

      if (filter === 'all') {
        Object.values(groups).forEach(g => { if (g) g.style.display = 'block'; });
      } else {
        Object.keys(groups).forEach(k => {
          if (groups[k]) {
            groups[k].style.display = k === filter ? 'block' : 'none';
          }
        });
        // Scroll to the selected group smoothly
        if (groups[filter]) {
          groups[filter].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
  });
}

