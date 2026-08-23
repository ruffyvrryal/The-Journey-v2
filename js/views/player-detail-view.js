// Detailed Player Profile & Attributes Editor View
import { store } from '../state.js';
import { getPlayerCategory, getPositionBadgeClass, getCountryFlag } from './squad-view.js';
import { renderCountryOptions } from '../utils/countries.js';
import { showToast } from './auth-modal.js';

// Default attribute sets if none exist on the player yet (1-99 scale)
export function getDefaultAttributes(pos, rating = 8.0) {
  const isGk = getPlayerCategory(pos) === 'GK';
  // Map 1-10 FM rating to 1-99 base attribute value
  const baseVal = Math.min(99, Math.max(1, Math.round(rating * 9.0)));

  if (isGk) {
    return {
      // Goalkeeping
      aerialReach: baseVal,
      commandOfArea: Math.max(1, baseVal - 5),
      communication: Math.max(1, baseVal - 5),
      eccentricity: 45,
      handling: baseVal,
      kicking: Math.max(1, baseVal - 10),
      oneOnOnes: baseVal,
      reflexes: Math.min(99, baseVal + 5),
      rushingOut: Math.max(1, baseVal - 10),
      punching: Math.max(1, baseVal - 10),
      throwing: Math.max(1, baseVal - 5),
      // Mental
      anticipation: baseVal,
      bravery: baseVal,
      composure: Math.max(1, baseVal - 5),
      concentration: baseVal,
      decisions: Math.max(1, baseVal - 5),
      determination: Math.min(99, baseVal + 5),
      leadership: Math.max(1, baseVal - 10),
      positioning: baseVal,
      teamwork: Math.max(1, baseVal - 5),
      vision: Math.max(1, baseVal - 15),
      // Physical
      acceleration: Math.max(1, baseVal - 15),
      agility: baseVal,
      balance: Math.max(1, baseVal - 5),
      jumpingReach: baseVal,
      naturalFitness: 72,
      pace: Math.max(1, baseVal - 15),
      stamina: Math.max(1, baseVal - 10),
      strength: baseVal
    };
  }

  // Outfield player defaults
  return {
    // Technical
    corners: 54,
    crossing: 59,
    dribbling: baseVal,
    finishing: pos === 'ST' || pos === 'AF' || pos === 'CF' ? Math.min(99, baseVal + 5) : 54,
    firstTouch: baseVal,
    freeKicks: 59,
    heading: ['DC', 'CB', 'ST'].includes(pos) ? baseVal : 50,
    longShots: 59,
    longThrows: 36,
    marking: ['DC', 'DL', 'DR', 'CB', 'LB', 'RB', 'DM'].includes(pos) ? baseVal : 36,
    passing: baseVal,
    penaltyTaking: 63,
    tackling: ['DC', 'DL', 'DR', 'CB', 'LB', 'RB', 'DM'].includes(pos) ? baseVal : 45,
    technique: baseVal,
    // Mental
    aggression: 59,
    anticipation: baseVal,
    bravery: Math.max(1, baseVal - 5),
    composure: baseVal,
    concentration: Math.max(1, baseVal - 5),
    decisions: baseVal,
    determination: Math.min(99, baseVal + 9),
    flair: ['AML', 'AMR', 'AMC', 'ST'].includes(pos) ? Math.min(99, baseVal + 5) : 54,
    leadership: 54,
    offTheBall: baseVal,
    positioning: ['DC', 'DL', 'DR', 'DM', 'MC'].includes(pos) ? baseVal : 50,
    teamwork: baseVal,
    vision: ['AMC', 'MC', 'AML', 'AMR'].includes(pos) ? baseVal : 54,
    workRate: baseVal,
    // Physical
    acceleration: Math.min(99, baseVal + 5),
    agility: baseVal,
    balance: baseVal,
    jumpingReach: ['DC', 'CB', 'ST'].includes(pos) ? baseVal : 50,
    naturalFitness: 72,
    pace: Math.min(99, baseVal + 5),
    stamina: baseVal,
    strength: baseVal
  };
}

// Calculate FM Rating (1.0-10.0) from the mean of all attributes (1-99 scale)
export function calcRatingFromAttrs(attrsObj) {
  const vals = Object.values(attrsObj).map(v => Number(v) || 1);
  if (!vals.length) return 5.0;
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  // Map 1-99 → 1.0-10.0
  const rating = 1.0 + (avg - 1) * (9.0 / 98.0);
  return Math.min(10.0, Math.max(1.0, Math.round(rating * 10) / 10));
}

export function getAttributeColor(val) {
  const num = Number(val) || 0;
  if (num >= 80) return 'attr-elite'; // 80-99 Gold/Yellow — Elite
  if (num >= 65) return 'attr-great'; // 65-79 Green — Great
  if (num >= 45) return 'attr-good';  // 45-64 Blue — Good
  return 'attr-poor';                 // 1-44 Gray — Developing
}

export function renderPlayerDetailView(container, playerId) {
  const player = store.squad.find(p => p.id === Number(playerId));
  if (!player) {
    store.clearSelectedPlayer();
    return;
  }

  // Position categorization
  const isGk = getPlayerCategory(player.pos) === 'GK';
  const posClass = getPositionBadgeClass(player.pos);

  // Initialize or retrieve attributes
  const attrs = player.attributes || getDefaultAttributes(player.pos, player.rat);

  // Stats defaults
  const apps = player.apps !== undefined ? player.apps : 19;
  const goals = player.goals !== undefined ? player.goals : (['ST', 'AF', 'CF', 'AML', 'AMR'].includes(player.pos) ? 14 : ['AMC', 'MC'].includes(player.pos) ? 6 : 1);
  const assists = player.assists !== undefined ? player.assists : (['AMC', 'MC', 'AML', 'AMR', 'DL', 'DR'].includes(player.pos) ? 9 : 2);
  const cleanSheets = player.cleanSheets !== undefined ? player.cleanSheets : (isGk || ['DC', 'DL', 'DR'].includes(player.pos) ? 10 : 0);
  const yel = player.yel !== undefined ? player.yel : 2;
  const red = player.red !== undefined ? player.red : 0;
  const pom = player.pom !== undefined ? player.pom : 3;

  // Bio defaults
  const shirtNum = (player.num !== undefined && player.num !== null && player.num !== '') 
    ? Number(player.num) 
    : (player.number !== undefined && player.number !== null && player.number !== '') 
      ? Number(player.number) 
      : (player.shirtNumber !== undefined && player.shirtNumber !== null && player.shirtNumber !== '') 
        ? Number(player.shirtNumber) 
        : (isGk ? 1 : player.id <= 11 ? player.id : null);
  const preferredFoot = player.foot || (['DL', 'AML', 'LB', 'LW'].includes(player.pos) ? 'Left' : 'Right');
  const height = player.height || (isGk || ['DC', 'CB', 'ST'].includes(player.pos) ? '188 cm' : '178 cm');
  const weight = player.weight || '74 kg';
  const squadStatus = player.squadStatus || 'Key Player';
  const traits = player.traits || 'Dives into tackles, Dictates tempo, Shoots with power';
  const notes = player.notes || 'Integral member of the starting eleven. Key tactical focus in high pressing transitions.';

  // Photo state (Base64 data or external URL)
  let currentPhoto = player.photo || null;

  // Helper to render an editable attribute row
  const renderAttrInput = (key, label, value) => {
    const colorClass = getAttributeColor(value);
    return `
      <div class="attr-row">
        <label class="attr-label" for="attr-${key}">${label}</label>
        <div class="attr-input-wrap">
          <input 
            type="number" 
            id="attr-${key}" 
            name="${key}" 
            class="attr-num-input ${colorClass}" 
            min="1" 
            max="99" 
            value="${value}" 
          />
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="page-view-container player-detail-page">
      <!-- TOP NAV & ACTION HEADER -->
      <div class="player-nav-top-bar">
        <button class="btn-back-to-squad" id="btn-back-squad">
          <i class="fa-solid fa-arrow-left"></i> Back to Squad List
        </button>

        <div class="player-top-status-group">
          <span class="player-status-tag ${posClass}" id="player-header-shirt-tag">
            <i class="fa-solid fa-shirt"></i> #${shirtNum ?? '—'} • ${player.pos}
          </span>
          <span class="player-status-tag tag-contract">
            <i class="fa-solid fa-file-signature"></i> Contract Exp: ${player.con}
          </span>
          <span class="player-status-tag tag-fitness">
            <i class="fa-solid fa-heart-pulse"></i> ${player.fit}% Fit
          </span>
        </div>

        <div class="player-save-actions">
          <button class="btn-action-primary btn-save-profile" id="btn-save-player-profile">
            <i class="fa-solid fa-floppy-disk"></i> Save Profile
          </button>
        </div>
      </div>

      <!-- MAIN HERO PLAYER IDENTITY CARD -->
      <div class="player-hero-card">
        <!-- PHOTO UPLOAD & FACEPACK SECTION -->
        <div class="player-photo-section">
          <div class="player-photo-frame" id="photo-frame-clickable" title="Click to upload new photo">
            ${currentPhoto ? `
              <img src="${currentPhoto}" alt="${player.name}" class="player-profile-img" id="player-profile-img" />
            ` : `
              <div class="player-photo-placeholder" id="player-photo-placeholder">
                <span class="photo-initials">${player.name.charAt(0)}</span>
                <div class="photo-upload-overlay">
                  <i class="fa-solid fa-camera"></i>
                  <span>Upload</span>
                </div>
              </div>
            `}
          </div>

          <!-- Hidden File Upload Input -->
          <input type="file" id="player-photo-input" accept="image/*" style="display: none;" />

          <!-- Photo Control Buttons -->
          <div class="photo-controls-group">
            <button type="button" class="btn-photo-action" id="btn-trigger-upload" title="Upload image from computer">
              <i class="fa-solid fa-upload"></i> Upload Photo
            </button>
            <button type="button" class="btn-photo-action" id="btn-photo-url" title="Paste Image URL">
              <i class="fa-solid fa-link"></i> URL
            </button>
            ${currentPhoto ? `
              <button type="button" class="btn-photo-action btn-photo-remove" id="btn-remove-photo" title="Remove custom photo">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- CORE PLAYER METADATA & QUICK STATS -->
        <div class="player-bio-section">
          <div class="player-bio-header-row">
            <div class="player-name-number-wrap">
              <input type="text" id="edit-player-name" class="input-hero-name" value="${player.name}" placeholder="Player Name" required />
              <div class="player-position-pill ${posClass}">
                <select id="edit-player-pos" class="select-hero-pos">
                  <option value="GK" ${player.pos === 'GK' ? 'selected' : ''}>GK - Goalkeeper</option>
                  <option value="DC" ${player.pos === 'DC' ? 'selected' : ''}>DC - Centre Back</option>
                  <option value="DL" ${player.pos === 'DL' ? 'selected' : ''}>DL - Left Back</option>
                  <option value="DR" ${player.pos === 'DR' ? 'selected' : ''}>DR - Right Back</option>
                  <option value="DM" ${player.pos === 'DM' ? 'selected' : ''}>DM - Defensive Mid</option>
                  <option value="MC" ${player.pos === 'MC' ? 'selected' : ''}>MC - Central Mid</option>
                  <option value="AMC" ${player.pos === 'AMC' ? 'selected' : ''}>AMC - Attacking Mid</option>
                  <option value="AML" ${player.pos === 'AML' ? 'selected' : ''}>AML - Left Winger</option>
                  <option value="AMR" ${player.pos === 'AMR' ? 'selected' : ''}>AMR - Right Winger</option>
                  <option value="ST" ${player.pos === 'ST' ? 'selected' : ''}>ST - Striker</option>
                </select>
              </div>
            </div>

            <div class="hero-rating-badge-wrap">
              <span class="hero-rating-lbl">FM RATING</span>
              <input type="number" step="0.1" min="1.0" max="10.0" id="edit-player-rat" class="input-hero-rating" value="${Number(player.rat || 8.0).toFixed(1)}" readonly title="Auto-calculated from attributes" />
              <span class="rating-auto-lbl">Auto</span>
            </div>
          </div>

          <!-- BIOGRAPHICAL DATA TILES -->
          <div class="player-bio-grid">
            <div class="bio-tile">
              <span class="bio-lbl">Shirt #</span>
              <input type="number" id="edit-player-num" class="bio-input" value="${shirtNum !== null && shirtNum !== undefined ? shirtNum : ''}" min="1" max="99" placeholder="e.g. 7" />
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Age</span>
              <input type="number" id="edit-player-age" class="bio-input" value="${player.age}" min="15" max="45" />
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Nationality</span>
              <select id="edit-player-nat" class="bio-select">
                ${renderCountryOptions(player.nat || 'ENG')}
              </select>
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Preferred Foot</span>
              <select id="edit-player-foot" class="bio-select">
                <option value="Right" ${preferredFoot === 'Right' ? 'selected' : ''}>Right</option>
                <option value="Left" ${preferredFoot === 'Left' ? 'selected' : ''}>Left</option>
                <option value="Both" ${preferredFoot === 'Both' ? 'selected' : ''}>Both (Either)</option>
              </select>
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Height</span>
              <input type="text" id="edit-player-height" class="bio-input" value="${height}" placeholder="185 cm" />
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Weight</span>
              <input type="text" id="edit-player-weight" class="bio-input" value="${weight}" placeholder="75 kg" />
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Market Value</span>
              <input type="text" id="edit-player-val" class="bio-input bio-val-highlight" value="${player.val}" />
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Weekly Wage</span>
              <input type="text" id="edit-player-wage" class="bio-input" value="${player.wage}" />
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Contract Expiry</span>
              <input type="text" id="edit-player-con" class="bio-input" value="${player.con}" />
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Morale</span>
              <select id="edit-player-mor" class="bio-select">
                <option value="Superb" ${player.mor === 'Superb' ? 'selected' : ''}>Superb</option>
                <option value="Very Good" ${player.mor === 'Very Good' ? 'selected' : ''}>Very Good</option>
                <option value="Good" ${player.mor === 'Good' ? 'selected' : ''}>Good</option>
                <option value="Okay" ${player.mor === 'Okay' ? 'selected' : ''}>Okay</option>
                <option value="Poor" ${player.mor === 'Poor' ? 'selected' : ''}>Poor</option>
              </select>
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Condition %</span>
              <input type="number" id="edit-player-fit" class="bio-input" value="${player.fit}" min="1" max="100" />
            </div>
            <div class="bio-tile">
              <span class="bio-lbl">Squad Role</span>
              <select id="edit-player-status" class="bio-select">
                <option value="Star Player" ${squadStatus === 'Star Player' ? 'selected' : ''}>Star Player</option>
                <option value="Key Player" ${squadStatus === 'Key Player' ? 'selected' : ''}>Key Player</option>
                <option value="First Team Regular" ${squadStatus === 'First Team Regular' ? 'selected' : ''}>First Team Regular</option>
                <option value="Squad Player" ${squadStatus === 'Squad Player' ? 'selected' : ''}>Squad Player</option>
                <option value="Impact Sub" ${squadStatus === 'Impact Sub' ? 'selected' : ''}>Impact Sub</option>
                <option value="Prospect" ${squadStatus === 'Prospect' ? 'selected' : ''}>Prospect</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- SEASON PERFORMANCE STATS BAR -->
      <div class="player-stats-cluster">
        <div class="stats-cluster-title">
          <i class="fa-solid fa-chart-line" style="color: #38bdf8;"></i> Season Statistics (${store.currentSeason})
        </div>
        <div class="stats-cluster-grid">
          <div class="player-stat-box">
            <span class="s-lbl">Appearances</span>
            <input type="number" id="edit-stat-apps" class="s-input" value="${apps}" min="0" />
          </div>
          <div class="player-stat-box">
            <span class="s-lbl">Goals</span>
            <input type="number" id="edit-stat-goals" class="s-input highlight-goals" value="${goals}" min="0" />
          </div>
          <div class="player-stat-box">
            <span class="s-lbl">Assists</span>
            <input type="number" id="edit-stat-assists" class="s-input highlight-assists" value="${assists}" min="0" />
          </div>
          <div class="player-stat-box">
            <span class="s-lbl">${isGk ? 'Clean Sheets' : 'Tackles / Match'}</span>
            <input type="number" id="edit-stat-cs" class="s-input" value="${cleanSheets}" min="0" />
          </div>
          <div class="player-stat-box">
            <span class="s-lbl">Yellow Cards</span>
            <input type="number" id="edit-stat-yel" class="s-input" value="${yel}" min="0" />
          </div>
          <div class="player-stat-box">
            <span class="s-lbl">Red Cards</span>
            <input type="number" id="edit-stat-red" class="s-input" value="${red}" min="0" />
          </div>
          <div class="player-stat-box">
            <span class="s-lbl">Player of Match</span>
            <input type="number" id="edit-stat-pom" class="s-input" value="${pom}" min="0" />
          </div>
        </div>
      </div>

      <!-- FM ATTRIBUTES MATRIX (1-99 SCALE) -->
      <div class="player-attributes-card">
        <div class="attributes-card-header">
          <div class="attr-header-title">
            <i class="fa-solid fa-sliders" style="color: var(--brand-yellow);"></i>
            Player Attributes (1–99 Scale)
          </div>
          <div class="attr-legend-bar">
            <span class="legend-item"><span class="legend-dot dot-elite"></span> 80–99 Elite</span>
            <span class="legend-item"><span class="legend-dot dot-great"></span> 65–79 Great</span>
            <span class="legend-item"><span class="legend-dot dot-good"></span> 45–64 Good</span>
            <span class="legend-item"><span class="legend-dot dot-poor"></span> 1–44 Developing</span>
          </div>
        </div>

        <div class="attributes-columns-grid ${isGk ? 'grid-gk' : 'grid-outfield'}">
          ${isGk ? `
            <!-- GOALKEEPING COLUMN -->
            <div class="attr-col">
              <div class="attr-col-heading">Goalkeeping</div>
              <div class="attr-list">
                ${renderAttrInput('aerialReach', 'Aerial Reach', attrs.aerialReach || 15)}
                ${renderAttrInput('commandOfArea', 'Command of Area', attrs.commandOfArea || 14)}
                ${renderAttrInput('communication', 'Communication', attrs.communication || 14)}
                ${renderAttrInput('eccentricity', 'Eccentricity', attrs.eccentricity || 10)}
                ${renderAttrInput('handling', 'Handling', attrs.handling || 16)}
                ${renderAttrInput('kicking', 'Kicking', attrs.kicking || 15)}
                ${renderAttrInput('oneOnOnes', 'One on Ones', attrs.oneOnOnes || 16)}
                ${renderAttrInput('reflexes', 'Reflexes', attrs.reflexes || 17)}
                ${renderAttrInput('rushingOut', 'Rushing Out', attrs.rushingOut || 13)}
                ${renderAttrInput('punching', 'Tendency to Punch', attrs.punching || 12)}
                ${renderAttrInput('throwing', 'Throwing', attrs.throwing || 14)}
              </div>
            </div>

            <!-- MENTAL COLUMN (GK) -->
            <div class="attr-col">
              <div class="attr-col-heading">Mental</div>
              <div class="attr-list">
                ${renderAttrInput('anticipation', 'Anticipation', attrs.anticipation || 15)}
                ${renderAttrInput('bravery', 'Bravery', attrs.bravery || 16)}
                ${renderAttrInput('composure', 'Composure', attrs.composure || 15)}
                ${renderAttrInput('concentration', 'Concentration', attrs.concentration || 16)}
                ${renderAttrInput('decisions', 'Decisions', attrs.decisions || 14)}
                ${renderAttrInput('determination', 'Determination', attrs.determination || 17)}
                ${renderAttrInput('leadership', 'Leadership', attrs.leadership || 13)}
                ${renderAttrInput('positioning', 'Positioning', attrs.positioning || 16)}
                ${renderAttrInput('teamwork', 'Teamwork', attrs.teamwork || 14)}
                ${renderAttrInput('vision', 'Vision', attrs.vision || 12)}
              </div>
            </div>

            <!-- PHYSICAL COLUMN -->
            <div class="attr-col">
              <div class="attr-col-heading">Physical</div>
              <div class="attr-list">
                ${renderAttrInput('acceleration', 'Acceleration', attrs.acceleration || 12)}
                ${renderAttrInput('agility', 'Agility', attrs.agility || 16)}
                ${renderAttrInput('balance', 'Balance', attrs.balance || 14)}
                ${renderAttrInput('jumpingReach', 'Jumping Reach', attrs.jumpingReach || 16)}
                ${renderAttrInput('naturalFitness', 'Natural Fitness', attrs.naturalFitness || 16)}
                ${renderAttrInput('pace', 'Pace', attrs.pace || 12)}
                ${renderAttrInput('stamina', 'Stamina', attrs.stamina || 13)}
                ${renderAttrInput('strength', 'Strength', attrs.strength || 15)}
              </div>
            </div>
          ` : `
            <!-- TECHNICAL COLUMN -->
            <div class="attr-col">
              <div class="attr-col-heading">Technical</div>
              <div class="attr-list">
                ${renderAttrInput('corners', 'Corners', attrs.corners || 12)}
                ${renderAttrInput('crossing', 'Crossing', attrs.crossing || 13)}
                ${renderAttrInput('dribbling', 'Dribbling', attrs.dribbling || 15)}
                ${renderAttrInput('finishing', 'Finishing', attrs.finishing || 14)}
                ${renderAttrInput('firstTouch', 'First Touch', attrs.firstTouch || 16)}
                ${renderAttrInput('freeKicks', 'Free Kick Taking', attrs.freeKicks || 13)}
                ${renderAttrInput('heading', 'Heading', attrs.heading || 12)}
                ${renderAttrInput('longShots', 'Long Shots', attrs.longShots || 14)}
                ${renderAttrInput('longThrows', 'Long Throws', attrs.longThrows || 8)}
                ${renderAttrInput('marking', 'Marking', attrs.marking || 11)}
                ${renderAttrInput('passing', 'Passing', attrs.passing || 16)}
                ${renderAttrInput('penaltyTaking', 'Penalty Taking', attrs.penaltyTaking || 14)}
                ${renderAttrInput('tackling', 'Tackling', attrs.tackling || 12)}
                ${renderAttrInput('technique', 'Technique', attrs.technique || 16)}
              </div>
            </div>

            <!-- MENTAL COLUMN -->
            <div class="attr-col">
              <div class="attr-col-heading">Mental</div>
              <div class="attr-list">
                ${renderAttrInput('aggression', 'Aggression', attrs.aggression || 12)}
                ${renderAttrInput('anticipation', 'Anticipation', attrs.anticipation || 16)}
                ${renderAttrInput('bravery', 'Bravery', attrs.bravery || 14)}
                ${renderAttrInput('composure', 'Composure', attrs.composure || 16)}
                ${renderAttrInput('concentration', 'Concentration', attrs.concentration || 14)}
                ${renderAttrInput('decisions', 'Decisions', attrs.decisions || 15)}
                ${renderAttrInput('determination', 'Determination', attrs.determination || 17)}
                ${renderAttrInput('flair', 'Flair', attrs.flair || 15)}
                ${renderAttrInput('leadership', 'Leadership', attrs.leadership || 14)}
                ${renderAttrInput('offTheBall', 'Off The Ball', attrs.offTheBall || 16)}
                ${renderAttrInput('positioning', 'Positioning', attrs.positioning || 13)}
                ${renderAttrInput('teamwork', 'Teamwork', attrs.teamwork || 15)}
                ${renderAttrInput('vision', 'Vision', attrs.vision || 16)}
                ${renderAttrInput('workRate', 'Work Rate', attrs.workRate || 16)}
              </div>
            </div>

            <!-- PHYSICAL COLUMN -->
            <div class="attr-col">
              <div class="attr-col-heading">Physical</div>
              <div class="attr-list">
                ${renderAttrInput('acceleration', 'Acceleration', attrs.acceleration || 15)}
                ${renderAttrInput('agility', 'Agility', attrs.agility || 15)}
                ${renderAttrInput('balance', 'Balance', attrs.balance || 14)}
                ${renderAttrInput('jumpingReach', 'Jumping Reach', attrs.jumpingReach || 12)}
                ${renderAttrInput('naturalFitness', 'Natural Fitness', attrs.naturalFitness || 16)}
                ${renderAttrInput('pace', 'Pace', attrs.pace || 15)}
                ${renderAttrInput('stamina', 'Stamina', attrs.stamina || 16)}
                ${renderAttrInput('strength', 'Strength', attrs.strength || 14)}
              </div>
            </div>
          `}
        </div>
      </div>

      <!-- TACTICAL TRAITS & MANAGER NOTES -->
      <div class="player-notes-card">
        <div class="notes-field-group">
          <label class="notes-lbl"><i class="fa-solid fa-wand-magic-sparkles"></i> Player Traits & Preferred Moves</label>
          <input type="text" id="edit-player-traits" class="notes-input" value="${traits}" placeholder="e.g. Dictates tempo, Shoots with power, Cuts inside..." />
        </div>

        <div class="notes-field-group">
          <label class="notes-lbl"><i class="fa-solid fa-clipboard-user"></i> Manager Scouting & Tactical Instructions</label>
          <textarea id="edit-player-notes" class="notes-textarea" rows="3" placeholder="Enter custom tactical role notes, player development plans, training instructions...">${notes}</textarea>
        </div>
      </div>

      <!-- BOTTOM SAVE & RELEASE BAR -->
      <div class="player-bottom-bar">
        <button type="button" class="btn-release-danger" id="btn-release-player">
          <i class="fa-solid fa-trash-can"></i> Release from Squad
        </button>
        <button type="button" class="btn-action-primary btn-save-profile-bottom" id="btn-save-bottom">
          <i class="fa-solid fa-floppy-disk"></i> Save Changes to Vault
        </button>
      </div>
    </div>
  `;

  // Helper: recalculate FM rating from current attribute inputs
  const recalcRating = () => {
    const allInputs = container.querySelectorAll('.attr-num-input');
    if (!allInputs.length) return;
    const attrMap = {};
    allInputs.forEach(inp => {
      const key = inp.getAttribute('name');
      if (key) attrMap[key] = Number(inp.value) || 1;
    });
    const newRat = calcRatingFromAttrs(attrMap);
    const ratInput = container.querySelector('#edit-player-rat');
    if (ratInput) ratInput.value = newRat.toFixed(1);
  };

  // Dynamic color updating for attribute inputs as user types + live rating recalc
  container.querySelectorAll('.attr-num-input').forEach(input => {
    input.oninput = () => {
      const val = Number(input.value) || 0;
      input.className = `attr-num-input ${getAttributeColor(val)}`;
      recalcRating();
    };
  });

  // Initial rating calculation on page load
  recalcRating();

  // Photo Upload Triggering
  const fileInput = container.querySelector('#player-photo-input');
  const btnTrigger = container.querySelector('#btn-trigger-upload');
  const photoFrame = container.querySelector('#photo-frame-clickable');

  if (btnTrigger && fileInput) {
    btnTrigger.onclick = () => fileInput.click();
  }
  if (photoFrame && fileInput) {
    photoFrame.onclick = () => fileInput.click();
  }

  // Handle File Upload to Base64
  if (fileInput) {
    fileInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be under 2MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        currentPhoto = event.target.result;
        // Update photo preview immediately
        const photoFrameEl = container.querySelector('#photo-frame-clickable');
        if (photoFrameEl) {
          photoFrameEl.innerHTML = `<img src="${currentPhoto}" alt="${player.name}" class="player-profile-img" id="player-profile-img" />`;
        }
        showToast(`Photo loaded for ${player.name}! Remember to click Save.`);
      };
      reader.readAsDataURL(file);
    };
  }

  // Handle Paste Image URL
  const btnUrl = container.querySelector('#btn-photo-url');
  if (btnUrl) {
    btnUrl.onclick = () => {
      const url = prompt('Enter or paste image URL for player facepack:', currentPhoto || '');
      if (url && url.trim()) {
        currentPhoto = url.trim();
        const photoFrameEl = container.querySelector('#photo-frame-clickable');
        if (photoFrameEl) {
          photoFrameEl.innerHTML = `<img src="${currentPhoto}" alt="${player.name}" class="player-profile-img" id="player-profile-img" />`;
        }
        showToast('Image URL updated! Click Save to apply.');
      }
    };
  }

  // Handle Remove Photo
  const btnRemovePhoto = container.querySelector('#btn-remove-photo');
  if (btnRemovePhoto) {
    btnRemovePhoto.onclick = () => {
      currentPhoto = null;
      const photoFrameEl = container.querySelector('#photo-frame-clickable');
      if (photoFrameEl) {
        photoFrameEl.innerHTML = `
          <div class="player-photo-placeholder" id="player-photo-placeholder">
            <span class="photo-initials">${player.name.charAt(0)}</span>
            <div class="photo-upload-overlay">
              <i class="fa-solid fa-camera"></i>
              <span>Upload</span>
            </div>
          </div>
        `;
      }
      showToast('Photo removed.');
    };
  }

  // Handle Save Profile
  const handleSaveProfile = (showNotification = true) => {
    // Collect all attributes
    const updatedAttrs = {};
    container.querySelectorAll('.attr-num-input').forEach(inp => {
      const key = inp.getAttribute('name');
      if (key) {
        updatedAttrs[key] = Number(inp.value) || 10;
      }
    });

    // Collect shirt number
    const rawNumInput = container.querySelector('#edit-player-num')?.value;
    const finalNum = (rawNumInput !== '' && rawNumInput !== null && rawNumInput !== undefined && !isNaN(Number(rawNumInput))) 
      ? Number(rawNumInput) 
      : null;

    const updatedData = {
      name: container.querySelector('#edit-player-name')?.value || player.name,
      pos: container.querySelector('#edit-player-pos')?.value || player.pos,
      rat: Number(container.querySelector('#edit-player-rat')?.value) || calcRatingFromAttrs(updatedAttrs),
      num: finalNum,
      number: finalNum,
      shirtNumber: finalNum,
      age: Number(container.querySelector('#edit-player-age')?.value) || player.age,
      nat: (container.querySelector('#edit-player-nat')?.value || player.nat || 'ENG').toUpperCase(),
      foot: container.querySelector('#edit-player-foot')?.value || preferredFoot,
      height: container.querySelector('#edit-player-height')?.value || height,
      weight: container.querySelector('#edit-player-weight')?.value || weight,
      val: container.querySelector('#edit-player-val')?.value || player.val,
      wage: container.querySelector('#edit-player-wage')?.value || player.wage,
      con: container.querySelector('#edit-player-con')?.value || player.con,
      mor: container.querySelector('#edit-player-mor')?.value || player.mor,
      fit: Number(container.querySelector('#edit-player-fit')?.value) || player.fit,
      squadStatus: container.querySelector('#edit-player-status')?.value || squadStatus,
      photo: currentPhoto,
      apps: Number(container.querySelector('#edit-stat-apps')?.value) || 0,
      goals: Number(container.querySelector('#edit-stat-goals')?.value) || 0,
      assists: Number(container.querySelector('#edit-stat-assists')?.value) || 0,
      cleanSheets: Number(container.querySelector('#edit-stat-cs')?.value) || 0,
      yel: Number(container.querySelector('#edit-stat-yel')?.value) || 0,
      red: Number(container.querySelector('#edit-stat-red')?.value) || 0,
      pom: Number(container.querySelector('#edit-stat-pom')?.value) || 0,
      attributes: updatedAttrs,
      traits: container.querySelector('#edit-player-traits')?.value || '',
      notes: container.querySelector('#edit-player-notes')?.value || ''
    };

    store.updatePlayer(player.id, updatedData);
    if (showNotification) {
      showToast(`Profile & shirt #${finalNum !== null ? finalNum : '—'} saved for ${updatedData.name}!`);
    }
  };

  // Back Button Handler (auto-saves any entered changes before returning)
  const handleBack = () => {
    handleSaveProfile(false);
    store.clearSelectedPlayer();
    store.setPage('squad');
  };
  const btnBack = container.querySelector('#btn-back-squad');
  if (btnBack) btnBack.onclick = handleBack;

  // Live update top header badge and player object when shirt number changes
  const numInputEl = container.querySelector('#edit-player-num');
  const topShirtBadge = container.querySelector('#player-header-shirt-tag');
  if (numInputEl) {
    const syncLiveShirt = () => {
      const val = numInputEl.value.trim();
      const n = (val !== '' && !isNaN(Number(val))) ? Number(val) : null;
      if (topShirtBadge) {
        topShirtBadge.innerHTML = `<i class="fa-solid fa-shirt"></i> #${n !== null ? n : '—'} • ${container.querySelector('#edit-player-pos')?.value || player.pos}`;
      }
    };
    numInputEl.oninput = syncLiveShirt;
    numInputEl.onchange = syncLiveShirt;
  }

  const btnSaveTop = container.querySelector('#btn-save-player-profile');
  const btnSaveBottom = container.querySelector('#btn-save-bottom');
  if (btnSaveTop) btnSaveTop.onclick = () => handleSaveProfile(true);
  if (btnSaveBottom) btnSaveBottom.onclick = () => handleSaveProfile(true);

  // Handle Release Player
  const btnRelease = container.querySelector('#btn-release-player');
  if (btnRelease) {
    btnRelease.onclick = () => {
      if (confirm(`Are you sure you want to release ${player.name} from the squad?`)) {
        store.removePlayer(player.id);
        showToast(`${player.name} released.`);
        store.clearSelectedPlayer();
        store.setPage('squad');
      }
    };
  }
}
