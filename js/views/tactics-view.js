// Authentic Football Manager Match Day Tactics Planner View
import { store } from '../state.js';
import { getPlayerCategory, getPositionBadgeClass, getPlayerShirtNumber } from './squad-view.js';
import { showToast } from './auth-modal.js';

// Available Formations & Preset Pitch Layouts
export const FORMATION_PRESETS = {
  '5-2-1-2 Wing Play': {
    name: '5-2-1-2 Wing Play',
    style: 'Wing Play',
    mentality: 'Balanced',
    slots: [
      { id: 0, pkd: 'GK', ipRole: 'BGK', oopRole: 'SK', x: 50, y: 88, roleColor: 'ip-slate', oopColor: 'oop-purple', posCode: 'GK' },
      { id: 1, pkd: 'D (C)', ipRole: 'BCB', oopRole: 'WCB', x: 28, y: 72, roleColor: 'ip-teal', oopColor: 'oop-teal', posCode: 'DC' },
      { id: 2, pkd: 'D (C)', ipRole: 'BCB', oopRole: 'CB', x: 50, y: 74, roleColor: 'ip-teal', oopColor: 'oop-blue', posCode: 'DC' },
      { id: 3, pkd: 'D (C)', ipRole: 'WCB', oopRole: 'SWD', x: 72, y: 72, roleColor: 'ip-cyan', oopColor: 'oop-green', posCode: 'DC' },
      { id: 4, pkd: 'WB (L)', ipRole: 'WB', oopRole: 'WB', x: 12, y: 55, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DL' },
      { id: 5, pkd: 'WB (R)', ipRole: 'AWB', oopRole: 'PWB', x: 88, y: 55, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DR' },
      { id: 6, pkd: 'M (C)', ipRole: 'AP', oopRole: 'DM', x: 36, y: 44, roleColor: 'ip-blue', oopColor: 'oop-green', posCode: 'MC' },
      { id: 7, pkd: 'M (C)', ipRole: 'CM', oopRole: 'WDM', x: 64, y: 44, roleColor: 'ip-cyan', oopColor: 'oop-green', posCode: 'MC' },
      { id: 8, pkd: 'AM (C)', ipRole: 'FR', oopRole: 'AM', x: 50, y: 28, roleColor: 'ip-magenta', oopColor: 'oop-purple', posCode: 'AMC' },
      { id: 9, pkd: 'ST (C)', ipRole: 'P', oopRole: 'SCF', x: 36, y: 12, roleColor: 'ip-fuchsia', oopColor: 'oop-magenta', posCode: 'ST' },
      { id: 10, pkd: 'ST (C)', ipRole: 'CHF', oopRole: 'OCF', x: 64, y: 12, roleColor: 'ip-magenta', oopColor: 'oop-magenta', posCode: 'ST' }
    ]
  },
  '4-2-3-1 Gegenpress': {
    name: '4-2-3-1 Gegenpress',
    style: 'Gegenpress',
    mentality: 'Positive',
    slots: [
      { id: 0, pkd: 'GK', ipRole: 'SK', oopRole: 'SK', x: 50, y: 88, roleColor: 'ip-slate', oopColor: 'oop-purple', posCode: 'GK' },
      { id: 1, pkd: 'D (L)', ipRole: 'CWB', oopRole: 'WB', x: 15, y: 72, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DL' },
      { id: 2, pkd: 'D (C)', ipRole: 'BPD', oopRole: 'CB', x: 38, y: 74, roleColor: 'ip-teal', oopColor: 'oop-blue', posCode: 'DC' },
      { id: 3, pkd: 'D (C)', ipRole: 'BPD', oopRole: 'CB', x: 62, y: 74, roleColor: 'ip-teal', oopColor: 'oop-blue', posCode: 'DC' },
      { id: 4, pkd: 'D (R)', ipRole: 'WB', oopRole: 'WB', x: 85, y: 72, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DR' },
      { id: 5, pkd: 'M (C)', ipRole: 'DLP', oopRole: 'DM', x: 38, y: 52, roleColor: 'ip-blue', oopColor: 'oop-green', posCode: 'MC' },
      { id: 6, pkd: 'M (C)', ipRole: 'B2B', oopRole: 'CM', x: 62, y: 52, roleColor: 'ip-cyan', oopColor: 'oop-blue', posCode: 'MC' },
      { id: 7, pkd: 'AM (L)', ipRole: 'IW', oopRole: 'WM', x: 18, y: 32, roleColor: 'ip-magenta', oopColor: 'oop-purple', posCode: 'AML' },
      { id: 8, pkd: 'AM (C)', ipRole: 'AP', oopRole: 'AM', x: 50, y: 30, roleColor: 'ip-blue', oopColor: 'oop-purple', posCode: 'AMC' },
      { id: 9, pkd: 'AM (R)', ipRole: 'IF', oopRole: 'WM', x: 82, y: 32, roleColor: 'ip-magenta', oopColor: 'oop-purple', posCode: 'AMR' },
      { id: 10, pkd: 'ST (C)', ipRole: 'AF', oopRole: 'CF', x: 50, y: 12, roleColor: 'ip-fuchsia', oopColor: 'oop-magenta', posCode: 'ST' }
    ]
  },
  '4-3-3 Fluid Possession': {
    name: '4-3-3 Fluid Possession',
    style: 'Control Possession',
    mentality: 'Positive',
    slots: [
      { id: 0, pkd: 'GK', ipRole: 'BGK', oopRole: 'SK', x: 50, y: 88, roleColor: 'ip-slate', oopColor: 'oop-purple', posCode: 'GK' },
      { id: 1, pkd: 'D (L)', ipRole: 'WB', oopRole: 'WB', x: 15, y: 72, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DL' },
      { id: 2, pkd: 'D (C)', ipRole: 'BPD', oopRole: 'CB', x: 38, y: 74, roleColor: 'ip-teal', oopColor: 'oop-blue', posCode: 'DC' },
      { id: 3, pkd: 'D (C)', ipRole: 'BPD', oopRole: 'CB', x: 62, y: 74, roleColor: 'ip-teal', oopColor: 'oop-blue', posCode: 'DC' },
      { id: 4, pkd: 'D (R)', ipRole: 'WB', oopRole: 'WB', x: 85, y: 72, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DR' },
      { id: 5, pkd: 'DM', ipRole: 'HB', oopRole: 'DM', x: 50, y: 58, roleColor: 'ip-blue', oopColor: 'oop-green', posCode: 'DM' },
      { id: 6, pkd: 'M (C)', ipRole: 'MEZ', oopRole: 'CM', x: 32, y: 44, roleColor: 'ip-cyan', oopColor: 'oop-blue', posCode: 'MC' },
      { id: 7, pkd: 'M (C)', ipRole: 'AP', oopRole: 'CM', x: 68, y: 44, roleColor: 'ip-blue', oopColor: 'oop-blue', posCode: 'MC' },
      { id: 8, pkd: 'AM (L)', ipRole: 'IF', oopRole: 'WM', x: 18, y: 22, roleColor: 'ip-magenta', oopColor: 'oop-purple', posCode: 'AML' },
      { id: 9, pkd: 'AM (R)', ipRole: 'IW', oopRole: 'WM', x: 82, y: 22, roleColor: 'ip-magenta', oopColor: 'oop-purple', posCode: 'AMR' },
      { id: 10, pkd: 'ST (C)', ipRole: 'AF', oopRole: 'CF', x: 50, y: 12, roleColor: 'ip-fuchsia', oopColor: 'oop-magenta', posCode: 'ST' }
    ]
  },
  '3-4-2-1 Vertical Tiki-Taka': {
    name: '3-4-2-1 Vertical Tiki-Taka',
    style: 'Tiki-Taka',
    mentality: 'Positive',
    slots: [
      { id: 0, pkd: 'GK', ipRole: 'BGK', oopRole: 'SK', x: 50, y: 88, roleColor: 'ip-slate', oopColor: 'oop-purple', posCode: 'GK' },
      { id: 1, pkd: 'D (C)', ipRole: 'WCB', oopRole: 'WCB', x: 28, y: 74, roleColor: 'ip-teal', oopColor: 'oop-teal', posCode: 'DC' },
      { id: 2, pkd: 'D (C)', ipRole: 'BCB', oopRole: 'CB', x: 50, y: 76, roleColor: 'ip-teal', oopColor: 'oop-blue', posCode: 'DC' },
      { id: 3, pkd: 'D (C)', ipRole: 'WCB', oopRole: 'WCB', x: 72, y: 74, roleColor: 'ip-teal', oopColor: 'oop-teal', posCode: 'DC' },
      { id: 4, pkd: 'M (L)', ipRole: 'CWB', oopRole: 'WM', x: 12, y: 50, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DL' },
      { id: 5, pkd: 'M (C)', ipRole: 'DLP', oopRole: 'DM', x: 38, y: 48, roleColor: 'ip-blue', oopColor: 'oop-green', posCode: 'MC' },
      { id: 6, pkd: 'M (C)', ipRole: 'CM', oopRole: 'B2B', x: 62, y: 48, roleColor: 'ip-cyan', oopColor: 'oop-blue', posCode: 'MC' },
      { id: 7, pkd: 'M (R)', ipRole: 'CWB', oopRole: 'WM', x: 88, y: 50, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DR' },
      { id: 8, pkd: 'AM (L)', ipRole: 'SS', oopRole: 'AM', x: 36, y: 28, roleColor: 'ip-magenta', oopColor: 'oop-purple', posCode: 'AMC' },
      { id: 9, pkd: 'AM (R)', ipRole: 'AP', oopRole: 'AM', x: 64, y: 28, roleColor: 'ip-blue', oopColor: 'oop-purple', posCode: 'AMC' },
      { id: 10, pkd: 'ST (C)', ipRole: 'AF', oopRole: 'PF', x: 50, y: 12, roleColor: 'ip-fuchsia', oopColor: 'oop-magenta', posCode: 'ST' }
    ]
  },
  '4-4-2 Direct Counter': {
    name: '4-4-2 Direct Counter',
    style: 'Direct Counter-Attack',
    mentality: 'Cautious',
    slots: [
      { id: 0, pkd: 'GK', ipRole: 'GK', oopRole: 'GK', x: 50, y: 88, roleColor: 'ip-slate', oopColor: 'oop-purple', posCode: 'GK' },
      { id: 1, pkd: 'D (L)', ipRole: 'FB', oopRole: 'FB', x: 15, y: 72, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DL' },
      { id: 2, pkd: 'D (C)', ipRole: 'CD', oopRole: 'CD', x: 38, y: 74, roleColor: 'ip-teal', oopColor: 'oop-blue', posCode: 'DC' },
      { id: 3, pkd: 'D (C)', ipRole: 'CD', oopRole: 'CD', x: 62, y: 74, roleColor: 'ip-teal', oopColor: 'oop-blue', posCode: 'DC' },
      { id: 4, pkd: 'D (R)', ipRole: 'FB', oopRole: 'FB', x: 85, y: 72, roleColor: 'ip-green', oopColor: 'oop-green', posCode: 'DR' },
      { id: 5, pkd: 'M (L)', ipRole: 'WM', oopRole: 'WM', x: 15, y: 46, roleColor: 'ip-green', oopColor: 'oop-purple', posCode: 'AML' },
      { id: 6, pkd: 'M (C)', ipRole: 'B2B', oopRole: 'CM', x: 38, y: 46, roleColor: 'ip-cyan', oopColor: 'oop-blue', posCode: 'MC' },
      { id: 7, pkd: 'M (C)', ipRole: 'DLP', oopRole: 'DM', x: 62, y: 46, roleColor: 'ip-blue', oopColor: 'oop-green', posCode: 'MC' },
      { id: 8, pkd: 'M (R)', ipRole: 'W', oopRole: 'WM', x: 85, y: 46, roleColor: 'ip-green', oopColor: 'oop-purple', posCode: 'AMR' },
      { id: 9, pkd: 'ST (C)', ipRole: 'TF', oopRole: 'PF', x: 38, y: 14, roleColor: 'ip-magenta', oopColor: 'oop-magenta', posCode: 'ST' },
      { id: 10, pkd: 'ST (C)', ipRole: 'AF', oopRole: 'CF', x: 62, y: 14, roleColor: 'ip-fuchsia', oopColor: 'oop-magenta', posCode: 'ST' }
    ]
  }
};

// Information badge generator for realistic FM status
function getPlayerInfBadge(p, idx) {
  if (p.fit < 85) return `<span class="inf-badge inf-inj" title="Injury Concern">Inj</span>`;
  if (p.mor === 'Superb') return `<span class="inf-badge inf-pr" title="Superb Form & Morale">PR</span>`;
  if (idx % 5 === 0) return `<span class="inf-badge inf-yel" title="Yellow Card Warning">Yel</span>`;
  if (idx % 6 === 0) return `<span class="inf-badge inf-rst" title="Needs Rest">Rst</span>`;
  if (idx % 7 === 0) return `<span class="inf-badge inf-esc" title="European Squad Chosen">ESC</span>`;
  return `<span class="inf-badge inf-pr">PR</span>`;
}

// Generate stars string
function renderStars(rating = 4.0) {
  const full = Math.min(5, Math.floor(rating / 1.8));
  let str = '';
  for (let i = 0; i < full; i++) str += '<i class="fa-solid fa-star star-filled"></i>';
  if (str === '') str = '<i class="fa-solid fa-star star-filled"></i><i class="fa-solid fa-star star-filled"></i><i class="fa-solid fa-star star-filled"></i>';
  return str;
}

export function renderTacticsView(container) {
  const currentFormationKey = store.tactics.formation && FORMATION_PRESETS[store.tactics.formation] 
    ? store.tactics.formation 
    : '5-2-1-2 Wing Play';
  
  const preset = FORMATION_PRESETS[currentFormationKey] || FORMATION_PRESETS['5-2-1-2 Wing Play'];
  const allSquad = store.squad || [];

  // Match squad players to tactical slots
  // Starters (11 slots)
  const starters = [];
  const assignedPlayerIds = new Set();

  preset.slots.forEach((slot, idx) => {
    // Look for matching player in current lineup, or pick suitable squad player
    let player = null;
    if (store.tactics.lineup && store.tactics.lineup[idx] && store.tactics.lineup[idx].id) {
      player = allSquad.find(p => p.id === store.tactics.lineup[idx].id);
    }
    if (!player) {
      // Find unassigned player fitting the position code
      player = allSquad.find(p => !assignedPlayerIds.has(p.id) && getPlayerCategory(p.pos) === getPlayerCategory(slot.posCode));
    }
    if (!player) {
      player = allSquad.find(p => !assignedPlayerIds.has(p.id)) || allSquad[idx % allSquad.length] || { id: idx, name: `Player ${idx+1}`, pos: slot.posCode, rat: 7.2, goals: 0, assists: 0, fit: 98, mor: 'Superb' };
    }
    assignedPlayerIds.add(player.id);
    starters.push({
      slot,
      player,
      ipRole: store.tactics.lineup?.[idx]?.ipRole || slot.ipRole,
      oopRole: store.tactics.lineup?.[idx]?.oopRole || slot.oopRole
    });
  });

  // Substitutes (next 9 squad players)
  const substitutes = [];
  allSquad.filter(p => !assignedPlayerIds.has(p.id)).slice(0, 9).forEach((p, sIdx) => {
    substitutes.push({
      sSlot: `S${sIdx + 1}`,
      player: p,
      pos: p.pos
    });
  });

  // Next fixture from schedule
  const nextMatch = store.results?.[0] ? `vs ${store.results[0].away === store.clubName ? store.results[0].home : store.results[0].away} in 2 days` : 'Next Match in 2 days';

  container.innerHTML = `
    <div class="page-view-container fm-tactics-page">
      <!-- TOP BREADCRUMB & METADATA BAR -->
      <div class="tactics-top-meta-bar">
        <div class="tactics-breadcrumb">
          <i class="fa-solid fa-gamepad" style="color: #c084fc;"></i>
          <span>Match Day</span> <i class="fa-solid fa-chevron-right breadcrumb-arrow"></i> <strong>Tactics Planner</strong>
        </div>
      </div>

      <!-- MAIN TACTICAL CONTROLS & SUB-HEADER -->
      <div class="tactics-control-header">
        <div class="tactics-ctrl-left">
          <!-- Formation Selector Pill -->
          <div class="tactic-dropdown-pill main-formation-pill">
            <span class="pill-prefix-num">1</span>
            <select id="select-tactic-formation" class="pill-select">
              ${Object.keys(FORMATION_PRESETS).map(fk => `
                <option value="${fk}" ${fk === currentFormationKey ? 'selected' : ''}>${fk}</option>
              `).join('')}
            </select>
          </div>

          <button class="btn-tactic-add" id="btn-add-tactic" title="Create New Tactic">+</button>

          <!-- Style Dropdown -->
          <div class="tactic-dropdown-pill">
            <select id="select-tactic-style" class="pill-select">
              <option value="Wing Play" ${store.tactics.style === 'Wing Play' ? 'selected' : ''}>Wing Play Style</option>
              <option value="Gegenpress" ${store.tactics.style === 'Gegenpress' ? 'selected' : ''}>Gegenpress Style</option>
              <option value="Tiki-Taka" ${store.tactics.style === 'Tiki-Taka' ? 'selected' : ''}>Tiki-Taka Style</option>
              <option value="Control Possession" ${store.tactics.style === 'Control Possession' ? 'selected' : ''}>Control Possession</option>
              <option value="Direct Counter-Attack" ${store.tactics.style === 'Direct Counter-Attack' ? 'selected' : ''}>Direct Counter</option>
              <option value="Fluid Counter-Attack" ${store.tactics.style === 'Fluid Counter-Attack' ? 'selected' : ''}>Fluid Counter</option>
              <option value="Route One" ${store.tactics.style === 'Route One' ? 'selected' : ''}>Route One</option>
              <option value="Catenaccio" ${store.tactics.style === 'Catenaccio' ? 'selected' : ''}>Catenaccio</option>
            </select>
          </div>

          <!-- Mentality Dropdown -->
          <div class="tactic-dropdown-pill">
            <select id="select-tactic-mentality" class="pill-select">
              <option value="Very Defensive" ${store.tactics.mentality === 'Very Defensive' ? 'selected' : ''}>Very Defensive Mentality</option>
              <option value="Defensive" ${store.tactics.mentality === 'Defensive' ? 'selected' : ''}>Defensive Mentality</option>
              <option value="Cautious" ${store.tactics.mentality === 'Cautious' ? 'selected' : ''}>Cautious Mentality</option>
              <option value="Balanced" ${(!store.tactics.mentality || store.tactics.mentality === 'Balanced') ? 'selected' : ''}>Balanced Mentality</option>
              <option value="Positive" ${store.tactics.mentality === 'Positive' ? 'selected' : ''}>Positive Mentality</option>
              <option value="Attacking" ${store.tactics.mentality === 'Attacking' ? 'selected' : ''}>Attacking Mentality</option>
              <option value="Very Attacking" ${store.tactics.mentality === 'Very Attacking' ? 'selected' : ''}>Very Attacking Mentality</option>
            </select>
          </div>
        </div>

        <div class="tactics-ctrl-right">
          <!-- Familiarity Gauge -->
          <div class="tactics-meter-block" title="Tactical Familiarity: 85%">
            <span class="meter-label">Familiarity</span>
            <div class="meter-bar-container">
              <div class="meter-bar-segment seg-green active"></div>
              <div class="meter-bar-segment seg-green active"></div>
              <div class="meter-bar-segment seg-green active"></div>
              <div class="meter-bar-segment seg-green active"></div>
              <div class="meter-bar-segment seg-green active"></div>
              <div class="meter-bar-segment seg-green"></div>
            </div>
          </div>

          <!-- Intensity Gauge -->
          <div class="tactics-meter-block" title="Tactical Intensity: 75%">
            <span class="meter-label">Intensity</span>
            <div class="meter-bar-container">
              <div class="meter-bar-segment seg-orange active"></div>
              <div class="meter-bar-segment seg-orange active"></div>
              <div class="meter-bar-segment seg-orange active"></div>
              <div class="meter-bar-segment seg-orange active"></div>
              <div class="meter-bar-segment seg-orange"></div>
              <div class="meter-bar-segment seg-orange"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- SUB-NAVIGATION BAR -->
      <div class="tactics-sub-nav-row">
        <div class="sub-nav-tabs">
          <button class="tactics-tab-btn active"><i class="fa-solid fa-shapes"></i> Team Shape</button>
          <button class="tactics-tab-btn" id="btn-team-instructions"><i class="fa-solid fa-sliders"></i> Team Instructions</button>
        </div>

        <div class="sub-nav-match-info">
          <span class="next-opponent-tag"><i class="fa-solid fa-shield"></i> ${nextMatch}</span>
          <button class="btn-subnav-action" id="btn-tactic-advice"><i class="fa-solid fa-star"></i> Advice ▾</button>
          <button class="btn-subnav-action" id="btn-tactic-undo"><i class="fa-solid fa-rotate-left"></i> Undo</button>
          <button class="btn-subnav-action btn-quick-pick" id="btn-quick-pick"><i class="fa-solid fa-wand-magic-sparkles"></i> Quick Pick ▾</button>
        </div>
      </div>

      <!-- MAIN TACTICS SPLIT WORKSPACE -->
      <div class="tactics-workspace-grid">
        <!-- LEFT: THE FM AUTHENTIC TACTICAL PITCH -->
        <div class="tactics-pitch-wrapper">
          <!-- Pitch Filter Tabs -->
          <div class="pitch-filter-tabs">
            <div class="pitch-tab-pills">
              <button class="pitch-pill-btn active" data-pitch-view="combined">Combined</button>
              <button class="pitch-pill-btn" data-pitch-view="ip">In Possession</button>
              <button class="pitch-pill-btn" data-pitch-view="oop">Out of Possession</button>
              <button class="pitch-pill-btn" data-pitch-view="both">Both</button>
            </div>
            <button class="pitch-collapse-btn" title="Toggle full width pitch"><i class="fa-solid fa-angles-left"></i></button>
          </div>

          <!-- Grass Pitch Surface -->
          <div class="fm-grass-pitch" id="tactics-grass-pitch">
            <!-- Pitch Markings Overlay -->
            <div class="pitch-overlay-lines">
              <div class="p-line-box top-box"></div>
              <div class="p-line-arc top-arc"></div>
              <div class="p-line-goal top-goal"></div>
              <div class="p-line-halfway"></div>
              <div class="p-line-circle"></div>
              <div class="p-line-spot"></div>
              <div class="p-line-box bottom-box"></div>
              <div class="p-line-arc bottom-arc"></div>
              <div class="p-line-goal bottom-goal"></div>
            </div>

            <!-- Pitch Interactive Player Tokens -->
            <div class="pitch-nodes-layer">
              ${starters.map((item, idx) => {
                const p = item.player;
                const slot = item.slot;
                const shirtNumber = getPlayerShirtNumber(p, idx + 1, slot.posCode);
                const roleColorClass = slot.roleColor || 'ip-teal';
                const oopColorClass = slot.oopColor || 'oop-purple';

                return `
                  <div class="fm-pitch-token" 
                       style="left: ${slot.x}%; top: ${slot.y}%;" 
                       data-id="${p.id}" 
                       data-slot-id="${slot.id}"
                       title="Click to view ${p.name}'s profile or swap player">
                    
                    <!-- Role Badges Banner -->
                    <div class="token-roles-strip">
                      <span class="role-badge ${roleColorClass}">${item.ipRole}</span>
                      <span class="role-badge ${oopColorClass}">${item.oopRole}</span>
                    </div>

                    <!-- Ability Stars -->
                    <div class="token-ability-stars">
                      ${renderStars(p.rat || 7.5)}
                    </div>

                    <!-- 3D Jersey Kit Token with Shirt Number -->
                    <div class="token-kit-icon ${slot.posCode === 'GK' ? 'kit-gk' : 'kit-outfield'}">
                      <span class="kit-shirt-num">${shirtNumber}</span>
                    </div>

                    <!-- Player Name Label -->
                    <div class="token-player-name-plate">
                      <span class="token-p-name">${p.name.split(' ').pop()}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Bottom Substitutes Tray -->
          <div class="tactics-substitutes-tray">
            <div class="sub-tray-header">
              <span class="sub-tray-title">Substitutes</span>
              <span class="sub-count-indicator">9 of 9 <span class="sub-dots">•••••••••</span></span>
            </div>
            <div class="sub-bench-grid">
              ${substitutes.map((s, idx) => {
                const p = s.player;
                const shirtNum = getPlayerShirtNumber(p, idx + 12, p.pos);
                return `
                  <div class="sub-bench-card" data-id="${p.id}" title="Click to view ${p.name}">
                    <span class="sub-code">${s.sSlot}</span>
                    <span class="sub-num">#${shirtNum}</span>
                    <span class="sub-name">${p.name.split(' ').pop()}</span>
                    <span class="sub-pos">${p.pos}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- RIGHT: AUTHENTIC FM TACTICAL SELECTION TABLE -->
        <div class="tactics-table-panel">
          <div class="tactics-table-top-controls">
            <div class="table-control-left">
              <div class="t-select-pill">
                <i class="fa-regular fa-eye"></i> Selection Info ▾
              </div>
            </div>
            <div class="table-control-right">
              <div class="t-select-pill">
                <i class="fa-solid fa-filter"></i> Filter ▾
              </div>
            </div>
          </div>

          <div class="tactics-table-scroll-wrapper">
            <table class="fm-tactics-data-table">
              <thead>
                <tr>
                  <th style="width: 44px;">Pkd</th>
                  <th style="min-width: 70px;">IP Role</th>
                  <th style="min-width: 70px;">OOP Role</th>
                  <th style="width: 80px; text-align: center;">Tactic Ability</th>
                  <th style="width: 32px; text-align: center;">PI</th>
                  <th style="min-width: 140px;">Player</th>
                  <th style="min-width: 85px;">Positions</th>
                  <th style="width: 40px; text-align: center;">Inf</th>
                  <th style="width: 60px; text-align: center;">Fa...</th>
                  <th style="width: 36px; text-align: center;" title="Condition">Con</th>
                  <th style="width: 36px; text-align: center;" title="Match Sharpness">Shp</th>
                  <th style="width: 36px; text-align: center;" title="Morale">Mor</th>
                  <th style="width: 40px; text-align: center;" title="Season Goals">Gls</th>
                  <th style="width: 40px; text-align: center;" title="Season Assists">Ast</th>
                  <th style="width: 50px; text-align: center;" title="Average Rating">Av Rat</th>
                </tr>
              </thead>
              <tbody>
                <!-- Starters (11 Rows) -->
                ${starters.map((item, idx) => {
                  const p = item.player;
                  const slot = item.slot;
                  const shirtNum = getPlayerShirtNumber(p, idx + 1, slot.posCode);
                  const goals = p.goals !== undefined ? p.goals : 0;
                  const assists = p.assists !== undefined ? p.assists : 0;
                  const rating = p.rat ? Number(p.rat).toFixed(2) : '7.15';
                  const fitVal = Number(p.fit) || 98;

                  return `
                    <tr class="tactics-table-row starter-row" data-id="${p.id}" data-slot-id="${slot.id}">
                      <!-- Pkd -->
                      <td>
                        <span class="pkd-slot-badge ${slot.posCode === 'GK' ? 'pkd-gk' : 'pkd-field'}">${slot.pkd}</span>
                      </td>

                      <!-- IP Role -->
                      <td>
                        <div class="role-select-box ${slot.roleColor}">
                          <span>${item.ipRole}</span> <i class="fa-solid fa-chevron-down role-caret"></i>
                        </div>
                      </td>

                      <!-- OOP Role -->
                      <td>
                        <div class="role-select-box ${slot.oopColor}">
                          <span>${item.oopRole}</span> <i class="fa-solid fa-chevron-down role-caret"></i>
                        </div>
                      </td>

                      <!-- Tactic Ability -->
                      <td style="text-align: center;">
                        <div class="tactics-stars-row">
                          ${renderStars(p.rat || 7.5)}
                        </div>
                      </td>

                      <!-- PI -->
                      <td style="text-align: center;">
                        <span class="pi-icon-pill" title="Player Instructions"><i class="fa-solid fa-user"></i></span>
                      </td>

                      <!-- Player -->
                      <td>
                        <div class="t-player-cell-wrap">
                          <div class="t-jersey-mini ${slot.posCode === 'GK' ? 'j-gk' : 'j-outfield'}">
                            <span>${shirtNum}</span>
                          </div>
                          <div class="t-player-name-link clickable-open-player" data-id="${p.id}" title="Click to view & edit detailed profile">
                            <i class="fa-solid fa-shirt" style="font-size: 0.65rem; color: #ef4444; margin-right: 2px;"></i>
                            <span class="t-p-fullname">${p.name}</span>
                          </div>
                        </div>
                      </td>

                      <!-- Positions -->
                      <td>
                        <span class="t-pos-txt">${p.pos === 'DC' ? 'D (C)' : p.pos === 'GK' ? 'GK' : p.pos === 'DL' ? 'D/WB (L)' : p.pos === 'DR' ? 'D/WB (R)' : p.pos === 'MC' ? 'M (C), DM' : p.pos === 'ST' ? 'AM (RL), ST (C)' : p.pos}</span>
                      </td>

                      <!-- Inf -->
                      <td style="text-align: center;">
                        ${getPlayerInfBadge(p, idx)}
                      </td>

                      <!-- Familiarity Bar -->
                      <td style="text-align: center;">
                        <div class="t-fam-bar-wrap" title="Tactical Familiarity: 90%">
                          <div class="t-fam-fill" style="width: 88%;"></div>
                        </div>
                      </td>

                      <!-- Con -->
                      <td style="text-align: center;">
                        <span class="t-con-heart" title="Condition: ${fitVal}%"><i class="fa-solid fa-heart"></i></span>
                      </td>

                      <!-- Shp -->
                      <td style="text-align: center;">
                        <span class="t-shp-check" title="Match Sharp"><i class="fa-solid fa-check"></i></span>
                      </td>

                      <!-- Mor -->
                      <td style="text-align: center;">
                        <span class="t-mor-icon" title="Morale: ${p.mor || 'Superb'}"><i class="fa-solid fa-arrow-up"></i></span>
                      </td>

                      <!-- Gls -->
                      <td style="text-align: center; font-weight: 700; color: ${goals > 0 ? '#fbbf24' : '#94a3b8'};">
                        ${goals}
                      </td>

                      <!-- Ast -->
                      <td style="text-align: center; font-weight: 700; color: ${assists > 0 ? '#38bdf8' : '#94a3b8'};">
                        ${assists}
                      </td>

                      <!-- Av Rat -->
                      <td style="text-align: center;">
                        <span class="badge-rating rating-pill-fm">${rating}</span>
                      </td>
                    </tr>
                  `;
                }).join('')}

                <!-- Substitutes (S1 to S9 Rows) -->
                ${substitutes.map((s, idx) => {
                  const p = s.player;
                  const shirtNum = getPlayerShirtNumber(p, idx + 12, p.pos);
                  const goals = p.goals !== undefined ? p.goals : 0;
                  const assists = p.assists !== undefined ? p.assists : 0;
                  const rating = p.rat ? Number(p.rat).toFixed(2) : '6.95';
                  const fitVal = Number(p.fit) || 95;

                  return `
                    <tr class="tactics-table-row sub-row" data-id="${p.id}">
                      <!-- Pkd -->
                      <td>
                        <span class="pkd-slot-badge pkd-sub">${s.sSlot}</span>
                      </td>

                      <!-- IP Role -->
                      <td colspan="2" style="color: #64748b; font-size: 0.75rem;">
                        <span class="sub-role-dash">— Substitute —</span>
                      </td>

                      <!-- Tactic Ability -->
                      <td style="text-align: center;">
                        <div class="tactics-stars-row">
                          ${renderStars(p.rat || 7.0)}
                        </div>
                      </td>

                      <!-- PI -->
                      <td style="text-align: center;">
                        <span class="pi-icon-pill"><i class="fa-solid fa-user"></i></span>
                      </td>

                      <!-- Player -->
                      <td>
                        <div class="t-player-cell-wrap">
                          <div class="t-jersey-mini j-outfield">
                            <span>${shirtNum}</span>
                          </div>
                          <div class="t-player-name-link clickable-open-player" data-id="${p.id}">
                            <i class="fa-solid fa-shirt" style="font-size: 0.65rem; color: #94a3b8; margin-right: 2px;"></i>
                            <span class="t-p-fullname">${p.name}</span>
                          </div>
                        </div>
                      </td>

                      <!-- Positions -->
                      <td>
                        <span class="t-pos-txt">${p.pos}</span>
                      </td>

                      <!-- Inf -->
                      <td style="text-align: center;">
                        ${getPlayerInfBadge(p, idx + 12)}
                      </td>

                      <!-- Familiarity Bar -->
                      <td style="text-align: center;">
                        <div class="t-fam-bar-wrap">
                          <div class="t-fam-fill" style="width: 75%;"></div>
                        </div>
                      </td>

                      <!-- Con -->
                      <td style="text-align: center;">
                        <span class="t-con-heart"><i class="fa-solid fa-heart"></i></span>
                      </td>

                      <!-- Shp -->
                      <td style="text-align: center;">
                        <span class="t-shp-check"><i class="fa-solid fa-check"></i></span>
                      </td>

                      <!-- Mor -->
                      <td style="text-align: center;">
                        <span class="t-mor-icon"><i class="fa-solid fa-arrow-up"></i></span>
                      </td>

                      <!-- Gls -->
                      <td style="text-align: center; color: #94a3b8;">${goals}</td>

                      <!-- Ast -->
                      <td style="text-align: center; color: #94a3b8;">${assists}</td>

                      <!-- Av Rat -->
                      <td style="text-align: center;">
                        <span class="badge-rating rating-pill-fm">${rating}</span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Bottom Footer Bar -->
          <div class="tactics-table-footer-bar">
            <div class="footer-rule-tag">
              <i class="fa-solid fa-trophy" style="color: var(--brand-yellow);"></i> Rules • ${store.leagueName}
            </div>
            <div class="footer-actions-right">
              <button class="btn-footer-pill" id="btn-tactic-expand">Expand <i class="fa-solid fa-chevron-right"></i></button>
              <span class="footer-meta-note">Football Manager Tactics Planner v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Formation Change Dropdown
  const selectFormation = container.querySelector('#select-tactic-formation');
  if (selectFormation) {
    selectFormation.onchange = (e) => {
      const chosen = e.target.value;
      if (FORMATION_PRESETS[chosen]) {
        store.tactics.formation = chosen;
        store.tactics.style = FORMATION_PRESETS[chosen].style;
        store.tactics.mentality = FORMATION_PRESETS[chosen].mentality;
        store.notify();
        showToast(`Switched formation to ${chosen}`);
      }
    };
  }

  // Bind Style Change Dropdown
  const selectStyle = container.querySelector('#select-tactic-style');
  if (selectStyle) {
    selectStyle.onchange = (e) => {
      store.tactics.style = e.target.value;
      store.notify();
      showToast(`Tactical style updated: ${e.target.value}`);
    };
  }

  // Bind Mentality Change Dropdown
  const selectMentality = container.querySelector('#select-tactic-mentality');
  if (selectMentality) {
    selectMentality.onchange = (e) => {
      store.tactics.mentality = e.target.value;
      store.notify();
      showToast(`Team Mentality set to ${e.target.value}`);
    };
  }

  // Bind Quick Pick Button
  const btnQuickPick = container.querySelector('#btn-quick-pick');
  if (btnQuickPick) {
    btnQuickPick.onclick = () => {
      // Auto-assign top-rated players into starting slots
      const sortedSquad = [...allSquad].sort((a, b) => (Number(b.rat) || 0) - (Number(a.rat) || 0));
      const newLineup = [];
      const usedIds = new Set();

      preset.slots.forEach((slot) => {
        let best = sortedSquad.find(p => !usedIds.has(p.id) && getPlayerCategory(p.pos) === getPlayerCategory(slot.posCode));
        if (!best) best = sortedSquad.find(p => !usedIds.has(p.id)) || sortedSquad[0];
        if (best) {
          usedIds.add(best.id);
          newLineup.push({
            id: best.id,
            name: best.name,
            role: slot.ipRole,
            ipRole: slot.ipRole,
            oopRole: slot.oopRole
          });
        }
      });

      store.tactics.lineup = newLineup;
      store.notify();
      showToast('Quick Pick: AI selected optimal starting XI based on form & sharpness!');
    };
  }

  // Bind Add Tactic Button
  const btnAddTactic = container.querySelector('#btn-add-tactic');
  if (btnAddTactic) {
    btnAddTactic.onclick = () => {
      const name = prompt('Enter name for new tactical system:', '4-3-3 Tiki-Taka');
      if (name) {
        store.tactics.formation = name;
        store.notify();
        showToast(`Created tactical slot: ${name}`);
      }
    };
  }

  // Bind Pitch Filter Tab Buttons
  container.querySelectorAll('.pitch-pill-btn').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('.pitch-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-pitch-view');
      const pitchEl = container.querySelector('#tactics-grass-pitch');
      if (pitchEl) {
        pitchEl.setAttribute('data-view-mode', mode);
      }
    };
  });

  // Bind Clicking Player on Pitch or Table to Open Detailed Player View
  container.querySelectorAll('.fm-pitch-token, .clickable-open-player').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      const id = Number(el.getAttribute('data-id'));
      if (id) {
        store.selectPlayer(id);
      }
    };
  });

  // Bind Clickable Rows on Table
  container.querySelectorAll('.tactics-table-row').forEach(row => {
    row.onclick = (e) => {
      if (e.target.closest('.role-select-box') || e.target.closest('select')) return;
      const id = Number(row.getAttribute('data-id'));
      if (id) {
        store.selectPlayer(id);
      }
    };
  });
}
