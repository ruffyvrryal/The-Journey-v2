// Detailed Player Profile & Attributes Editor View
import { store } from '../state.js';
import { getPlayerCategory, getPositionBadgeClass, getCountryFlag } from './squad-view.js';
import { renderCountryOptions } from '../utils/countries.js';
import { showToast } from './auth-modal.js';

// Default attribute sets if none exist on the player yet (1-99 scale)
// Default attribute sets if none exist on the player yet (1-99 scale)
export function getDefaultAttributes(pos, rating = 8.0) {
  const isGk = getPlayerCategory(pos) === 'GK';
  // Map 1-10 FM rating to 1-99 base attribute value
  const baseVal = Math.min(99, Math.max(1, Math.round(rating * 9.0)));

  if (isGk) {
    return {
      // Goalkeeping (13)
      aerialReach: baseVal >= 70 ? baseVal : 70,
      commandOfArea: Math.max(1, baseVal - 5),
      communication: Math.max(1, baseVal - 15),
      eccentricity: 25,
      firstTouch: 50,
      handling: baseVal >= 70 ? baseVal : 70,
      kicking: Math.max(1, baseVal - 5),
      oneOnOnes: baseVal >= 75 ? baseVal : 75,
      passing: 55,
      punching: 90,
      reflexes: Math.min(99, Math.max(70, baseVal)),
      rushingOut: 55,
      throwing: 55,
      // Mental (14)
      aggression: 35,
      anticipation: Math.max(65, baseVal),
      bravery: 60,
      composure: 50,
      concentration: 50,
      decisions: 60,
      determination: Math.min(99, Math.max(75, baseVal + 5)),
      flair: 15,
      leadership: 35,
      offTheBall: 35,
      positioning: Math.min(99, Math.max(75, baseVal)),
      teamwork: 60,
      vision: 45,
      workRate: 55,
      // Physical (8)
      acceleration: 45,
      agility: Math.max(70, baseVal),
      balance: 60,
      jumpingReach: Math.min(99, Math.max(85, baseVal + 10)),
      naturalFitness: 65,
      pace: 45,
      stamina: 65,
      strength: Math.max(75, baseVal),
      // Technical (1)
      technique: 70
    };
  }

  // Outfield player defaults
  return {
    // Technical (10)
    crossing: ['AML', 'AMR', 'DL', 'DR'].includes(pos) ? baseVal : 65,
    dribbling: ['AML', 'AMR', 'AMC', 'ST'].includes(pos) ? Math.min(99, baseVal + 10) : 90,
    finishing: ['ST', 'AF', 'CF', 'AML', 'AMR'].includes(pos) ? Math.min(99, baseVal + 10) : 90,
    firstTouch: baseVal >= 80 ? baseVal : 90,
    heading: ['DC', 'CB', 'ST'].includes(pos) ? baseVal : 45,
    longShots: ['AMC', 'MC', 'AML', 'AMR'].includes(pos) ? baseVal : 75,
    marking: ['DC', 'DL', 'DR', 'DM'].includes(pos) ? baseVal : 20,
    passing: ['MC', 'AMC', 'DM'].includes(pos) ? baseVal : 75,
    tackling: ['DC', 'DL', 'DR', 'DM', 'MC'].includes(pos) ? baseVal : 20,
    technique: baseVal >= 80 ? baseVal : 85,
    // Mental (14)
    aggression: ['DC', 'DM', 'MC'].includes(pos) ? 65 : 30,
    anticipation: baseVal >= 80 ? baseVal : 85,
    bravery: 60,
    composure: baseVal >= 80 ? baseVal : 90,
    concentration: 80,
    decisions: 80,
    determination: Math.min(99, baseVal >= 80 ? baseVal : 90),
    flair: ['AML', 'AMR', 'AMC', 'ST'].includes(pos) ? 90 : 80,
    leadership: 65,
    offTheBall: baseVal >= 80 ? baseVal : 85,
    positioning: ['DC', 'DL', 'DR', 'DM', 'MC'].includes(pos) ? baseVal : 20,
    teamwork: 50,
    vision: ['AMC', 'MC', 'AML', 'AMR'].includes(pos) ? baseVal : 80,
    workRate: 65,
    // Physical (8)
    acceleration: ['AML', 'AMR', 'ST', 'DL', 'DR'].includes(pos) ? 99 : 85,
    agility: 80,
    balance: 80,
    jumpingReach: ['DC', 'CB', 'ST'].includes(pos) ? baseVal : 40,
    naturalFitness: 75,
    pace: ['AML', 'AMR', 'ST', 'DL', 'DR'].includes(pos) ? 95 : 85,
    stamina: 75,
    strength: ['DC', 'DM', 'ST'].includes(pos) ? baseVal : 60,
    // Set Pieces (4)
    corners: 65,
    freeKicks: 55,
    longThrows: 15,
    penaltyTaking: 90
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
  if (num >= 80) return 'attr-elite'; // 80-99 Green — Elite
  if (num >= 65) return 'attr-great'; // 65-79 Yellow/Gold — Great
  if (num >= 45) return 'attr-good';  // 45-64 Light Blue/Cyan — Good
  return 'attr-poor';                 // 1-44 Muted Gray — Developing
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
  const natInfo = getCountryFlag(player.nat || 'ENG');

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
          <span class="player-status-tag" style="background: #0c1538; border: 1px solid #1c2b66; display: inline-flex; align-items: center; gap: 6px; color: #e2e8f0;">
            ${natInfo.flagHtml} ${natInfo.name} (${player.nat || 'ENG'})
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
              <span class="bio-lbl" style="display: flex; align-items: center; justify-content: space-between;">
                <span>Nationality</span>
                <span id="player-bio-flag-preview">${natInfo.flagHtml}</span>
              </span>
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
          <div class="attr-header-title">Attributes</div>
          <div class="attr-header-actions">
            <button type="button" class="btn-import-link" id="btn-import-fminside-link" title="Import player attributes from an FMInside URL">
              <i class="fa-solid fa-link"></i> Import from FMInside
            </button>
            <button type="button" class="btn-import-attrs" id="btn-import-player-attrs" title="Import attributes from JSON file or text">
              <i class="fa-solid fa-file-import"></i> Import JSON
            </button>
            <button type="button" class="btn-export-attrs" id="btn-export-player-attrs" title="Export attributes as JSON file">
              <i class="fa-solid fa-download"></i> Export JSON
            </button>
            <input type="file" id="input-player-attrs-json" accept=".json,application/json" style="display:none;" />
            <div class="attr-scale-badge">1–99 scale</div>
          </div>
        </div>

        <div class="attributes-columns-grid ${isGk ? 'grid-gk' : 'grid-outfield'}">
          ${isGk ? `
            <!-- COLUMN 1: GOALKEEPING (13 Attributes) -->
            <div class="attr-col">
              <div class="attr-col-heading">Goalkeeping</div>
              <div class="attr-list">
                ${renderAttrInput('aerialReach', 'Aerial Reach', attrs.aerialReach !== undefined ? attrs.aerialReach : 70)}
                ${renderAttrInput('commandOfArea', 'Command of Area', attrs.commandOfArea !== undefined ? attrs.commandOfArea : 65)}
                ${renderAttrInput('communication', 'Communication', attrs.communication !== undefined ? attrs.communication : 50)}
                ${renderAttrInput('eccentricity', 'Eccentricity', attrs.eccentricity !== undefined ? attrs.eccentricity : 25)}
                ${renderAttrInput('firstTouch', 'First Touch', attrs.firstTouch !== undefined ? attrs.firstTouch : 50)}
                ${renderAttrInput('handling', 'Handling', attrs.handling !== undefined ? attrs.handling : 70)}
                ${renderAttrInput('kicking', 'Kicking', attrs.kicking !== undefined ? attrs.kicking : 70)}
                ${renderAttrInput('oneOnOnes', 'One on Ones', attrs.oneOnOnes !== undefined ? attrs.oneOnOnes : 75)}
                ${renderAttrInput('passing', 'Passing', attrs.passing !== undefined ? attrs.passing : 55)}
                ${renderAttrInput('punching', 'Punching (Tendency)', attrs.punching !== undefined ? attrs.punching : 90)}
                ${renderAttrInput('reflexes', 'Reflexes', attrs.reflexes !== undefined ? attrs.reflexes : 70)}
                ${renderAttrInput('rushingOut', 'Rushing Out (Tendency)', attrs.rushingOut !== undefined ? attrs.rushingOut : 55)}
                ${renderAttrInput('throwing', 'Throwing', attrs.throwing !== undefined ? attrs.throwing : 55)}
              </div>
            </div>

            <!-- COLUMN 2: MENTAL (14 Attributes - GK) -->
            <div class="attr-col">
              <div class="attr-col-heading">Mental</div>
              <div class="attr-list">
                ${renderAttrInput('aggression', 'Aggression', attrs.aggression !== undefined ? attrs.aggression : 35)}
                ${renderAttrInput('anticipation', 'Anticipation', attrs.anticipation !== undefined ? attrs.anticipation : 65)}
                ${renderAttrInput('bravery', 'Bravery', attrs.bravery !== undefined ? attrs.bravery : 60)}
                ${renderAttrInput('composure', 'Composure', attrs.composure !== undefined ? attrs.composure : 50)}
                ${renderAttrInput('concentration', 'Concentration', attrs.concentration !== undefined ? attrs.concentration : 50)}
                ${renderAttrInput('decisions', 'Decisions', attrs.decisions !== undefined ? attrs.decisions : 60)}
                ${renderAttrInput('determination', 'Determination', attrs.determination !== undefined ? attrs.determination : 75)}
                ${renderAttrInput('flair', 'Flair', attrs.flair !== undefined ? attrs.flair : 15)}
                ${renderAttrInput('leadership', 'Leadership', attrs.leadership !== undefined ? attrs.leadership : 35)}
                ${renderAttrInput('offTheBall', 'Off the Ball', attrs.offTheBall !== undefined ? attrs.offTheBall : 35)}
                ${renderAttrInput('positioning', 'Positioning', attrs.positioning !== undefined ? attrs.positioning : 75)}
                ${renderAttrInput('teamwork', 'Teamwork', attrs.teamwork !== undefined ? attrs.teamwork : 60)}
                ${renderAttrInput('vision', 'Vision', attrs.vision !== undefined ? attrs.vision : 45)}
                ${renderAttrInput('workRate', 'Work Rate', attrs.workRate !== undefined ? attrs.workRate : 55)}
              </div>
            </div>

            <!-- COLUMN 3: PHYSICAL + TECHNICAL (GK) -->
            <div class="attr-col-stacked">
              <div class="attr-col">
                <div class="attr-col-heading">Physical</div>
                <div class="attr-list">
                  ${renderAttrInput('acceleration', 'Acceleration', attrs.acceleration !== undefined ? attrs.acceleration : 45)}
                  ${renderAttrInput('agility', 'Agility', attrs.agility !== undefined ? attrs.agility : 70)}
                  ${renderAttrInput('balance', 'Balance', attrs.balance !== undefined ? attrs.balance : 60)}
                  ${renderAttrInput('jumpingReach', 'Jumping Reach', attrs.jumpingReach !== undefined ? attrs.jumpingReach : 85)}
                  ${renderAttrInput('naturalFitness', 'Natural Fitness', attrs.naturalFitness !== undefined ? attrs.naturalFitness : 65)}
                  ${renderAttrInput('pace', 'Pace', attrs.pace !== undefined ? attrs.pace : 45)}
                  ${renderAttrInput('stamina', 'Stamina', attrs.stamina !== undefined ? attrs.stamina : 65)}
                  ${renderAttrInput('strength', 'Strength', attrs.strength !== undefined ? attrs.strength : 75)}
                </div>
              </div>

              <div class="attr-col">
                <div class="attr-col-heading">Technical</div>
                <div class="attr-list">
                  ${renderAttrInput('technique', 'Technique', attrs.technique !== undefined ? attrs.technique : 70)}
                </div>
              </div>
            </div>
          ` : `
            <!-- COLUMN 1: TECHNICAL (10 Attributes - OUTFIELD) -->
            <div class="attr-col">
              <div class="attr-col-heading">Technical</div>
              <div class="attr-list">
                ${renderAttrInput('crossing', 'Crossing', attrs.crossing !== undefined ? attrs.crossing : 65)}
                ${renderAttrInput('dribbling', 'Dribbling', attrs.dribbling !== undefined ? attrs.dribbling : 90)}
                ${renderAttrInput('finishing', 'Finishing', attrs.finishing !== undefined ? attrs.finishing : 90)}
                ${renderAttrInput('firstTouch', 'First Touch', attrs.firstTouch !== undefined ? attrs.firstTouch : 90)}
                ${renderAttrInput('heading', 'Heading', attrs.heading !== undefined ? attrs.heading : 45)}
                ${renderAttrInput('longShots', 'Long Shots', attrs.longShots !== undefined ? attrs.longShots : 75)}
                ${renderAttrInput('marking', 'Marking', attrs.marking !== undefined ? attrs.marking : 20)}
                ${renderAttrInput('passing', 'Passing', attrs.passing !== undefined ? attrs.passing : 75)}
                ${renderAttrInput('tackling', 'Tackling', attrs.tackling !== undefined ? attrs.tackling : 20)}
                ${renderAttrInput('technique', 'Technique', attrs.technique !== undefined ? attrs.technique : 85)}
              </div>
            </div>

            <!-- COLUMN 2: MENTAL (14 Attributes - OUTFIELD) -->
            <div class="attr-col">
              <div class="attr-col-heading">Mental</div>
              <div class="attr-list">
                ${renderAttrInput('aggression', 'Aggression', attrs.aggression !== undefined ? attrs.aggression : 30)}
                ${renderAttrInput('anticipation', 'Anticipation', attrs.anticipation !== undefined ? attrs.anticipation : 85)}
                ${renderAttrInput('bravery', 'Bravery', attrs.bravery !== undefined ? attrs.bravery : 60)}
                ${renderAttrInput('composure', 'Composure', attrs.composure !== undefined ? attrs.composure : 90)}
                ${renderAttrInput('concentration', 'Concentration', attrs.concentration !== undefined ? attrs.concentration : 80)}
                ${renderAttrInput('decisions', 'Decisions', attrs.decisions !== undefined ? attrs.decisions : 80)}
                ${renderAttrInput('determination', 'Determination', attrs.determination !== undefined ? attrs.determination : 90)}
                ${renderAttrInput('flair', 'Flair', attrs.flair !== undefined ? attrs.flair : 90)}
                ${renderAttrInput('leadership', 'Leadership', attrs.leadership !== undefined ? attrs.leadership : 65)}
                ${renderAttrInput('offTheBall', 'Off the Ball', attrs.offTheBall !== undefined ? attrs.offTheBall : 85)}
                ${renderAttrInput('positioning', 'Positioning', attrs.positioning !== undefined ? attrs.positioning : 20)}
                ${renderAttrInput('teamwork', 'Teamwork', attrs.teamwork !== undefined ? attrs.teamwork : 50)}
                ${renderAttrInput('vision', 'Vision', attrs.vision !== undefined ? attrs.vision : 80)}
                ${renderAttrInput('workRate', 'Work Rate', attrs.workRate !== undefined ? attrs.workRate : 65)}
              </div>
            </div>

            <!-- COLUMN 3: PHYSICAL + SET PIECES (OUTFIELD) -->
            <div class="attr-col-stacked">
              <div class="attr-col">
                <div class="attr-col-heading">Physical</div>
                <div class="attr-list">
                  ${renderAttrInput('acceleration', 'Acceleration', attrs.acceleration !== undefined ? attrs.acceleration : 99)}
                  ${renderAttrInput('agility', 'Agility', attrs.agility !== undefined ? attrs.agility : 80)}
                  ${renderAttrInput('balance', 'Balance', attrs.balance !== undefined ? attrs.balance : 80)}
                  ${renderAttrInput('jumpingReach', 'Jumping Reach', attrs.jumpingReach !== undefined ? attrs.jumpingReach : 40)}
                  ${renderAttrInput('naturalFitness', 'Natural Fitness', attrs.naturalFitness !== undefined ? attrs.naturalFitness : 75)}
                  ${renderAttrInput('pace', 'Pace', attrs.pace !== undefined ? attrs.pace : 95)}
                  ${renderAttrInput('stamina', 'Stamina', attrs.stamina !== undefined ? attrs.stamina : 75)}
                  ${renderAttrInput('strength', 'Strength', attrs.strength !== undefined ? attrs.strength : 60)}
                </div>
              </div>

              <div class="attr-col">
                <div class="attr-col-heading">Set Pieces</div>
                <div class="attr-list">
                  ${renderAttrInput('corners', 'Corners', attrs.corners !== undefined ? attrs.corners : 65)}
                  ${renderAttrInput('freeKicks', 'Free Kick Taking', attrs.freeKicks !== undefined ? attrs.freeKicks : 55)}
                  ${renderAttrInput('longThrows', 'Long Throws', attrs.longThrows !== undefined ? attrs.longThrows : 15)}
                  ${renderAttrInput('penaltyTaking', 'Penalty Taking', attrs.penaltyTaking !== undefined ? attrs.penaltyTaking : 90)}
                </div>
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

  // Handle Position Change to switch between Goalkeeper and Outfield attribute matrices
  const posSelect = container.querySelector('#edit-player-pos');
  if (posSelect) {
    posSelect.onchange = () => {
      const newPos = posSelect.value;
      const wasGk = isGk;
      const nowGk = getPlayerCategory(newPos) === 'GK';
      if (wasGk !== nowGk) {
        handleSaveProfile(false);
        renderPlayerDetailView(container, player.id);
      }
    };
  }

  // Handle Nationality Change to live-preview flag
  const natSelect = container.querySelector('#edit-player-nat');
  if (natSelect) {
    natSelect.onchange = () => {
      const newNat = natSelect.value;
      const newNatInfo = getCountryFlag(newNat);
      const flagPreview = container.querySelector('#player-bio-flag-preview');
      if (flagPreview) flagPreview.innerHTML = newNatInfo.flagHtml;
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

  // Apply Attributes Helper
  const applyImportedAttributes = (attrObj) => {
    let count = 0;
    Object.entries(attrObj).forEach(([key, val]) => {
      const input = container.querySelector(`input[name="${key}"]`);
      if (input) {
        const numVal = Math.min(99, Math.max(1, Number(val) || 50));
        input.value = numVal;
        input.className = `attr-num-input ${getAttributeColor(numVal)}`;
        count++;
      }
    });
    recalcRating();
    return count;
  };

  // Bind Import from FMInside Link Button
  const btnImportLink = container.querySelector('#btn-import-fminside-link');
  if (btnImportLink) {
    btnImportLink.onclick = () => {
      openFmInsideImportModal({
        player,
        isGk,
        onApply: (data) => {
          if (data.attributes) {
            applyImportedAttributes(data.attributes);
          }
          if (data.name && container.querySelector('#edit-player-name')) {
            container.querySelector('#edit-player-name').value = data.name;
          }
          if (data.pos && container.querySelector('#edit-player-pos')) {
            container.querySelector('#edit-player-pos').value = data.pos;
          }
          if (data.age && container.querySelector('#edit-player-age')) {
            container.querySelector('#edit-player-age').value = data.age;
          }
          if (data.nat && container.querySelector('#edit-player-nat')) {
            container.querySelector('#edit-player-nat').value = data.nat;
            const flagPreview = container.querySelector('#player-bio-flag-preview');
            if (flagPreview) flagPreview.innerHTML = getCountryFlag(data.nat).flagHtml;
          }
          if (data.photo) {
            currentPhoto = data.photo;
            const photoFrameEl = container.querySelector('#photo-frame-clickable');
            if (photoFrameEl) {
              photoFrameEl.innerHTML = `<img src="${currentPhoto}" alt="${player.name}" class="player-profile-img" id="player-profile-img" />`;
            }
          }
          showToast(`⚡ FMInside data applied for ${data.name || player.name}! Remember to save.`);
        }
      });
    };
  }

  // Bind Import Attributes JSON Button (Modal & File picker)
  const btnImportAttrs = container.querySelector('#btn-import-player-attrs');
  const fileInputAttrs = container.querySelector('#input-player-attrs-json');
  if (btnImportAttrs) {
    btnImportAttrs.onclick = () => {
      openAttributesImportModal({
        isGk,
        playerName: player.name,
        onApply: (parsed) => {
          const appliedCount = applyImportedAttributes(parsed);
          showToast(`✅ ${appliedCount} attributes applied from JSON for ${player.name}! Remember to save.`);
        }
      });
    };
  }

  // Bind Export Attributes JSON Button
  const btnExportAttrs = container.querySelector('#btn-export-player-attrs');
  if (btnExportAttrs) {
    btnExportAttrs.onclick = () => {
      const currentAttrs = {};
      container.querySelectorAll('.attr-num-input').forEach(inp => {
        const key = inp.getAttribute('name');
        if (key) currentAttrs[key] = Number(inp.value) || 50;
      });

      const exportPayload = {
        playerName: player.name,
        position: player.pos,
        shirtNumber: numInputEl ? (Number(numInputEl.value) || null) : null,
        nationality: player.nat,
        rating: Number(container.querySelector('#edit-player-rat')?.value) || player.rat,
        attributes: currentAttrs
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${player.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_attributes.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(`📥 Exported attributes for ${player.name}`);
    };
  }

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

// ────────────────────────────────────────────────────────────────────────────
// ATTRIBUTES JSON IMPORT MODAL & NORMALIZATION
// ────────────────────────────────────────────────────────────────────────────

const ATTR_KEY_ALIASES = {
  // Goalkeeping
  aerialreach: 'aerialReach', 'aerial reach': 'aerialReach', aerial: 'aerialReach',
  commandofarea: 'commandOfArea', 'command of area': 'commandOfArea',
  communication: 'communication',
  eccentricity: 'eccentricity',
  firsttouch: 'firstTouch', 'first touch': 'firstTouch',
  handling: 'handling',
  kicking: 'kicking',
  oneonones: 'oneOnOnes', 'one on ones': 'oneOnOnes', '1 on 1': 'oneOnOnes',
  passing: 'passing',
  punching: 'punching', 'punching (tendency)': 'punching', tendencytopunch: 'punching',
  reflexes: 'reflexes',
  rushingout: 'rushingOut', 'rushing out': 'rushingOut', 'rushing out (tendency)': 'rushingOut',
  throwing: 'throwing',
  
  // Technical
  crossing: 'crossing',
  dribbling: 'dribbling',
  finishing: 'finishing',
  heading: 'heading',
  longshots: 'longShots', 'long shots': 'longShots',
  longthrows: 'longThrows', 'long throws': 'longThrows',
  marking: 'marking',
  tackling: 'tackling',
  technique: 'technique',
  corners: 'corners',
  freekicks: 'freeKicks', 'free kicks': 'freeKicks', 'free kick taking': 'freeKicks',
  penaltytaking: 'penaltyTaking', 'penalty taking': 'penaltyTaking', penalties: 'penaltyTaking',

  // Mental
  aggression: 'aggression',
  anticipation: 'anticipation',
  bravery: 'bravery',
  composure: 'composure',
  concentration: 'concentration',
  decisions: 'decisions',
  determination: 'determination',
  flair: 'flair',
  leadership: 'leadership',
  offtheball: 'offTheBall', 'off the ball': 'offTheBall',
  positioning: 'positioning',
  teamwork: 'teamwork',
  vision: 'vision',
  workrate: 'workRate', 'work rate': 'workRate',

  // Physical
  acceleration: 'acceleration',
  agility: 'agility',
  balance: 'balance',
  jumpingreach: 'jumpingReach', 'jumping reach': 'jumpingReach', jumping: 'jumpingReach',
  naturalfitness: 'naturalFitness', 'natural fitness': 'naturalFitness',
  pace: 'pace',
  stamina: 'stamina',
  strength: 'strength'
};

function normalizeAttributesJson(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const source = raw.attributes && typeof raw.attributes === 'object' ? raw.attributes : raw;
  const result = {};

  for (const [k, v] of Object.entries(source)) {
    if (typeof v === 'number' || (!isNaN(Number(v)) && typeof v === 'string' && v.trim() !== '')) {
      const numVal = Math.min(99, Math.max(1, Math.round(Number(v))));
      const cleanKey = k.toString().trim().toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
      const mappedKey = ATTR_KEY_ALIASES[cleanKey] || ATTR_KEY_ALIASES[k.toLowerCase()] || k;
      result[mappedKey] = numVal;
    }
  }
  return result;
}

function openAttributesImportModal({ isGk, playerName, onApply }) {
  const existing = document.getElementById('attr-import-modal-root');
  if (existing) existing.remove();

  const sampleJson = isGk ? {
    "attributes": {
      "aerialReach": 70,
      "commandOfArea": 65,
      "communication": 50,
      "eccentricity": 25,
      "firstTouch": 50,
      "handling": 70,
      "kicking": 70,
      "oneOnOnes": 75,
      "passing": 55,
      "punching": 90,
      "reflexes": 70,
      "rushingOut": 55,
      "throwing": 55,
      "aggression": 35,
      "anticipation": 65,
      "bravery": 60,
      "composure": 50,
      "concentration": 50,
      "decisions": 60,
      "determination": 75,
      "flair": 15,
      "leadership": 35,
      "offTheBall": 35,
      "positioning": 75,
      "teamwork": 60,
      "vision": 45,
      "workRate": 55,
      "acceleration": 45,
      "agility": 70,
      "balance": 60,
      "jumpingReach": 85,
      "naturalFitness": 65,
      "pace": 45,
      "stamina": 65,
      "strength": 75,
      "technique": 70
    }
  } : {
    "attributes": {
      "crossing": 65,
      "dribbling": 90,
      "finishing": 90,
      "firstTouch": 90,
      "heading": 45,
      "longShots": 75,
      "marking": 20,
      "passing": 75,
      "tackling": 20,
      "technique": 85,
      "aggression": 30,
      "anticipation": 85,
      "bravery": 60,
      "composure": 90,
      "concentration": 80,
      "decisions": 80,
      "determination": 90,
      "flair": 90,
      "leadership": 65,
      "offTheBall": 85,
      "positioning": 20,
      "teamwork": 50,
      "vision": 80,
      "workRate": 65,
      "acceleration": 99,
      "agility": 80,
      "balance": 80,
      "jumpingReach": 40,
      "naturalFitness": 75,
      "pace": 95,
      "stamina": 75,
      "strength": 60,
      "corners": 65,
      "freeKicks": 55,
      "longThrows": 15,
      "penaltyTaking": 90
    }
  };

  const modal = document.createElement('div');
  modal.id = 'attr-import-modal-root';
  modal.className = 'modal-backdrop';
  modal.style.cssText = 'z-index: 9999;';

  modal.innerHTML = `
    <div class="modal-window" style="max-width: 650px; max-height: 90vh; display: flex; flex-direction: column;">
      <div class="modal-header">
        <div class="modal-title">
          <i class="fa-solid fa-file-import" style="color: #38bdf8;"></i>
          Import Attributes — ${playerName}
        </div>
        <button class="modal-close-btn" id="btn-close-attr-import" type="button">&times;</button>
      </div>

      <div class="modal-body" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto;">
        <div style="font-size: 0.82rem; color: #94a3b8;">
          Upload a JSON file or paste attribute values below (1–99 scale).
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <button type="button" class="btn-action-secondary" id="btn-modal-upload-file" style="font-size: 0.8rem; padding: 6px 14px;">
            <i class="fa-solid fa-upload"></i> Upload .JSON File
          </button>
          <input type="file" id="modal-attr-file-input" accept=".json,application/json" style="display:none;" />
          <button type="button" class="btn-action-secondary" id="btn-load-sample-template" style="font-size: 0.8rem; padding: 6px 14px; background: rgba(255,255,255,0.06);">
            <i class="fa-solid fa-code"></i> Load Sample Template
          </button>
        </div>

        <div class="form-group" style="margin-top: 4px;">
          <label class="form-label" style="font-size: 0.8rem; color: #cbd5e1;">JSON Content</label>
          <textarea id="attr-json-textarea" class="notes-textarea" rows="10" placeholder="Paste your JSON here..." style="font-family: monospace; font-size: 0.82rem; line-height: 1.4; color: #38bdf8; background: #030617;"></textarea>
        </div>

        <div id="attr-parse-status" style="font-size: 0.8rem; color: #64748b;">
          Paste or upload JSON to validate attributes.
        </div>
      </div>

      <div style="padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; background: #070b24; border-top: 1px solid #1c2766; flex-shrink: 0;">
        <button type="button" class="btn-modal-cancel" id="btn-cancel-attr-import">Cancel</button>
        <button type="button" id="btn-confirm-attr-import" class="btn-action-primary" style="padding: 10px 22px; font-weight: 800;">
          <i class="fa-solid fa-check"></i> Apply Attributes
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('#btn-close-attr-import').onclick = closeModal;
  modal.querySelector('#btn-cancel-attr-import').onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  const textarea = modal.querySelector('#attr-json-textarea');
  const statusEl = modal.querySelector('#attr-parse-status');
  const fileInput = modal.querySelector('#modal-attr-file-input');
  const btnUpload = modal.querySelector('#btn-modal-upload-file');
  const btnSample = modal.querySelector('#btn-load-sample-template');

  btnUpload.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      textarea.value = evt.target.result;
      updateStatus();
    };
    reader.readAsText(file);
  };

  btnSample.onclick = () => {
    textarea.value = JSON.stringify(sampleJson, null, 2);
    updateStatus();
  };

  const updateStatus = () => {
    const txt = textarea.value.trim();
    if (!txt) {
      statusEl.innerHTML = '<span style="color: #64748b;">Paste or upload JSON to validate attributes.</span>';
      return null;
    }
    try {
      const parsed = JSON.parse(txt);
      const normalized = normalizeAttributesJson(parsed);
      const count = Object.keys(normalized).length;
      if (count > 0) {
        statusEl.innerHTML = `<span style="color: #4ade80; font-weight: 700;">✅ Found ${count} recognized attributes ready to apply!</span>`;
        return normalized;
      } else {
        statusEl.innerHTML = '<span style="color: #f87171;">⚠️ Valid JSON, but no matching attributes recognized.</span>';
        return null;
      }
    } catch (err) {
      statusEl.innerHTML = `<span style="color: #f87171;">❌ Invalid JSON syntax: ${err.message}</span>`;
      return null;
    }
  };

  textarea.oninput = updateStatus;

  modal.querySelector('#btn-confirm-attr-import').onclick = () => {
    const parsed = updateStatus();
    if (!parsed) {
      showToast('Please provide valid attribute JSON first.', 'error');
      return;
    }
    closeModal();
    onApply(parsed);
  };
}

// ────────────────────────────────────────────────────────────────────────────
// FMINSIDE LINK IMPORTER & MULTI-STRATEGY HTML / TEXT PARSER
// ────────────────────────────────────────────────────────────────────────────

export function parseFmInsideHtml(content, url = '') {
  const result = {
    attributes: {},
    name: null,
    pos: null,
    nat: null,
    age: null,
    photo: null,
    isUrl: false
  };

  if (!content || typeof content !== 'string') return result;
  const trimmed = content.trim();

  // If user pasted just a URL into the textarea
  if (/^https?:\/\/[^\s]+$/i.test(trimmed)) {
    result.isUrl = true;
    url = trimmed;
  }

  // Name from URL slug
  if (url) {
    const slug = url.split('/').pop().replace(/^[0-9]+-/, '').replace(/-/g, ' ');
    if (slug) result.name = slug.replace(/\b\w/g, l => l.toUpperCase());
  }

  // Definitions of all FM attributes with all known naming variations
  const ATTR_DEFINITIONS = [
    // Goalkeeping
    { key: 'aerialReach', names: ['aerial reach', 'aerialreach', 'aerial'] },
    { key: 'commandOfArea', names: ['command of area', 'commandofarea'] },
    { key: 'communication', names: ['communication'] },
    { key: 'eccentricity', names: ['eccentricity'] },
    { key: 'firstTouch', names: ['first touch', 'firsttouch'] },
    { key: 'handling', names: ['handling'] },
    { key: 'kicking', names: ['kicking'] },
    { key: 'oneOnOnes', names: ['one on ones', '1 on 1', 'one on one', 'oneonones', '1-on-1'] },
    { key: 'passing', names: ['passing'] },
    { key: 'punching', names: ['punching (tendency)', 'tendency to punch', 'punching', 'punch'] },
    { key: 'reflexes', names: ['reflexes', 'reflex'] },
    { key: 'rushingOut', names: ['rushing out (tendency)', 'rushing out', 'rushingout'] },
    { key: 'throwing', names: ['throwing', 'throws'] },

    // Technical
    { key: 'corners', names: ['corners', 'corner'] },
    { key: 'crossing', names: ['crossing', 'crosses'] },
    { key: 'dribbling', names: ['dribbling', 'dribble'] },
    { key: 'finishing', names: ['finishing'] },
    { key: 'heading', names: ['heading', 'header'] },
    { key: 'longShots', names: ['long shots', 'longshots', 'long shot'] },
    { key: 'longThrows', names: ['long throws', 'longthrows', 'long throw'] },
    { key: 'marking', names: ['marking'] },
    { key: 'penaltyTaking', names: ['penalty taking', 'penalties', 'penalty', 'penaltytaking'] },
    { key: 'freeKicks', names: ['free kick taking', 'free kicks', 'freekicks', 'free kick'] },
    { key: 'tackling', names: ['tackling', 'tackle'] },
    { key: 'technique', names: ['technique'] },

    // Mental
    { key: 'aggression', names: ['aggression'] },
    { key: 'anticipation', names: ['anticipation'] },
    { key: 'bravery', names: ['bravery'] },
    { key: 'composure', names: ['composure'] },
    { key: 'concentration', names: ['concentration'] },
    { key: 'decisions', names: ['decisions', 'decision'] },
    { key: 'determination', names: ['determination'] },
    { key: 'flair', names: ['flair'] },
    { key: 'leadership', names: ['leadership'] },
    { key: 'offTheBall', names: ['off the ball', 'offtheball'] },
    { key: 'positioning', names: ['positioning'] },
    { key: 'teamwork', names: ['teamwork'] },
    { key: 'vision', names: ['vision'] },
    { key: 'workRate', names: ['work rate', 'workrate'] },

    // Physical
    { key: 'acceleration', names: ['acceleration'] },
    { key: 'agility', names: ['agility'] },
    { key: 'balance', names: ['balance'] },
    { key: 'jumpingReach', names: ['jumping reach', 'jumpingreach', 'jumping'] },
    { key: 'naturalFitness', names: ['natural fitness', 'naturalfitness'] },
    { key: 'pace', names: ['pace'] },
    { key: 'stamina', names: ['stamina'] },
    { key: 'strength', names: ['strength'] }
  ];

  const scaleFMto99 = (num) => Math.min(99, Math.max(1, Math.round((num / 20) * 99)));

  // Strategy 1: HTML DOM Extraction (if HTML was pasted)
  if (/<[a-z][\s\S]*>/i.test(content)) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      const h1 = doc.querySelector('h1');
      if (h1 && h1.textContent.trim()) {
        result.name = h1.textContent.trim().replace(/\s+/g, ' ');
      }

      const ogImg = doc.querySelector('meta[property="og:image"]');
      if (ogImg && ogImg.content && !ogImg.content.includes('default') && !ogImg.content.includes('logo')) {
        result.photo = ogImg.content;
      } else {
        const faceImg = doc.querySelector('img[src*="faces"], img[src*="players"], img[src*="cuts"]');
        if (faceImg && faceImg.src) result.photo = faceImg.src;
      }

      const natImg = doc.querySelector('img[src*="flags"], img[alt*="flag" i], [class*="flag"]');
      if (natImg) {
        const natName = natImg.getAttribute('alt') || natImg.getAttribute('title') || '';
        if (natName) {
          const country = getCountryFlag(natName);
          if (country) result.nat = country.code;
        }
      }
    } catch (e) {}
  }

  // Strategy 2: Line-by-Line Token Analysis (for Ctrl+A, Ctrl+C copied text)
  const lines = content
    .replace(/<[^>]*>/g, '\n') // Replace HTML tags with newlines
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    for (const def of ATTR_DEFINITIONS) {
      if (result.attributes[def.key] !== undefined) continue;

      for (const name of def.names) {
        // Same line: "Aerial Reach 16" or "Aerial Reach: 16" or "16 Aerial Reach"
        const sameLineRegex = new RegExp(`^(?:${name}[:\\s\\t-]+([0-9]{1,2})|([0-9]{1,2})[:\\s\\t-]+${name})$`, 'i');
        const sameLineMatch = line.match(sameLineRegex) || line.match(new RegExp(`(?:^|\\s)${name}[:\\s\\t-]+([0-9]{1,2})(?:\\s|$)`, 'i'));
        
        if (sameLineMatch) {
          const num = parseInt(sameLineMatch[1] || sameLineMatch[2], 10);
          if (!isNaN(num) && num >= 1 && num <= 20) {
            result.attributes[def.key] = scaleFMto99(num);
            break;
          }
        }

        // Multi-line: Line has attribute name, next line (or line + 2) has the number
        if (lineLower === name || lineLower.startsWith(name)) {
          for (let offset = 1; offset <= 3; offset++) {
            if (i + offset < lines.length) {
              const nextLine = lines[i + offset].trim();
              const num = parseInt(nextLine, 10);
              if (!isNaN(num) && num >= 1 && num <= 20 && String(num) === nextLine.replace(/[^0-9]/g, '')) {
                result.attributes[def.key] = scaleFMto99(num);
                break;
              }
            }
          }
        }
      }
    }
  }

  // Strategy 3: Sliding Window Regex across Full Text
  const cleanFullText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  for (const def of ATTR_DEFINITIONS) {
    if (result.attributes[def.key] === undefined) {
      for (const name of def.names) {
        const rgx = new RegExp(`\\b${name}\\b[^a-zA-Z0-9]{0,25}?([0-9]{1,2})\\b`, 'i');
        const match = cleanFullText.match(rgx);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num >= 1 && num <= 20) {
            result.attributes[def.key] = scaleFMto99(num);
            break;
          }
        }
      }
    }
  }

  // Extract Age and Position
  if (!result.age) {
    const ageM = cleanFullText.match(/\b(?:Age|Age:)\s*([0-9]{2})\b/i);
    if (ageM && Number(ageM[1]) >= 15 && Number(ageM[1]) <= 45) {
      result.age = Number(ageM[1]);
    }
  }
  if (!result.pos) {
    const posM = cleanFullText.match(/\b(GK|DC|DL|DR|CB|LB|RB|DM|MC|CM|AMC|CAM|AML|AMR|LW|RW|ST|CF|AF)\b/);
    if (posM) {
      result.pos = posM[1].toUpperCase();
    }
  }

  return result;
}

export function openFmInsideImportModal({ player, isGk, onApply }) {
  const existing = document.getElementById('fminside-import-modal-root');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'fminside-import-modal-root';
  modal.className = 'modal-backdrop';
  modal.style.cssText = 'z-index: 9999;';

  modal.innerHTML = `
    <div class="modal-window" style="max-width: 700px; max-height: 90vh; display: flex; flex-direction: column;">
      <div class="modal-header">
        <div class="modal-title">
          <i class="fa-solid fa-bolt" style="color: #c084fc;"></i>
          Import FMInside Attributes — ${player.name}
        </div>
        <button class="modal-close-btn" id="btn-close-fminside-modal" type="button">&times;</button>
      </div>

      <div class="modal-body" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto;">
        
        <!-- 3-Step Simple Guide Box -->
        <div style="background: rgba(192, 132, 252, 0.08); border: 1px solid rgba(192, 132, 252, 0.25); border-radius: 8px; padding: 10px 14px;">
          <div style="font-size: 0.85rem; font-weight: 800; color: #e9d5ff; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <i class="fa-solid fa-sparkles" style="color: #facc15;"></i> Fast 3-Second Import (100% Guaranteed):
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px; font-size: 0.76rem; color: #cbd5e1;">
            <div style="background: #060a22; padding: 8px; border-radius: 6px; border: 1px solid #16204c;">
              <strong style="color: #38bdf8;">Step 1:</strong> Open player page on <a href="https://fminside.net" target="_blank" style="color: #38bdf8; text-decoration: underline;">FMInside</a>
            </div>
            <div style="background: #060a22; padding: 8px; border-radius: 6px; border: 1px solid #16204c;">
              <strong style="color: #facc15;">Step 2:</strong> Press <kbd style="background: #1e1b4b; padding: 1px 4px; border-radius: 3px;">Ctrl + A</kbd> then <kbd style="background: #1e1b4b; padding: 1px 4px; border-radius: 3px;">Ctrl + C</kbd>
            </div>
            <div style="background: #060a22; padding: 8px; border-radius: 6px; border: 1px solid #16204c;">
              <strong style="color: #4ade80;">Step 3:</strong> Paste (<kbd style="background: #1e1b4b; padding: 1px 4px; border-radius: 3px;">Ctrl + V</kbd>) in the box below!
            </div>
          </div>
        </div>

        <!-- Direct Paste Box (Primary) -->
        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label class="form-label" style="font-size: 0.82rem; color: #ffffff; font-weight: 800;">
              📋 Paste FMInside Page Content Here
            </label>
            <div style="display: flex; gap: 8px;">
              <button type="button" id="btn-sample-trubin" style="background: none; border: none; color: #38bdf8; font-size: 0.73rem; cursor: pointer; text-decoration: underline;">
                Try Trubin (GK)
              </button>
              <button type="button" id="btn-sample-haaland" style="background: none; border: none; color: #38bdf8; font-size: 0.73rem; cursor: pointer; text-decoration: underline;">
                Try Haaland (ST)
              </button>
            </div>
          </div>
          <textarea 
            id="fminside-paste-textarea" 
            class="notes-textarea" 
            rows="6" 
            placeholder="Paste FMInside page text (Ctrl+V) here to automatically parse attributes..."
            style="font-family: monospace; font-size: 0.78rem; color: #38bdf8; background: #030617; border-color: #2b3e85;"
          ></textarea>
        </div>

        <!-- URL Fetch Helper (Secondary) -->
        <details style="background: #05081c; border: 1px solid #16204c; border-radius: 8px; padding: 8px 12px;">
          <summary style="font-size: 0.78rem; color: #94a3b8; cursor: pointer; font-weight: 600;">
            🌐 Or Fetch via URL (Direct Link)
          </summary>
          <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; gap: 8px;">
              <input 
                type="url" 
                id="fminside-url-input" 
                class="form-input" 
                placeholder="https://fminside.net/players/..."
                style="flex: 1; font-size: 0.8rem;"
              />
              <button type="button" class="btn-action-primary" id="btn-fetch-fminside" style="padding: 6px 14px; font-size: 0.8rem; font-weight: 700; white-space: nowrap;">
                <i class="fa-solid fa-cloud-arrow-down"></i> Fetch URL
              </button>
            </div>
          </div>
        </details>

        <!-- Import Options -->
        <div style="background: #05081c; border: 1px solid #16204c; border-radius: 8px; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px;">
          <div style="font-size: 0.78rem; font-weight: 700; color: #e2e8f0; margin-bottom: 2px;">Import Options</div>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #cbd5e1; cursor: pointer;">
            <input type="checkbox" id="chk-import-attrs" checked /> Apply all attributes (converted to 1–99 scale)
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #cbd5e1; cursor: pointer;">
            <input type="checkbox" id="chk-import-bio" /> Update biographical info (Name, Position, Age, Nat)
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #cbd5e1; cursor: pointer;">
            <input type="checkbox" id="chk-import-photo" checked /> Update Player Facepack Photo (if found)
          </label>
        </div>

        <!-- Parse Status & Live Preview Area -->
        <div id="fminside-preview-area" style="display: none; background: #070b28; border: 1px solid #1c2766; border-radius: 8px; padding: 12px 14px;">
          <!-- Injected via JS -->
        </div>

      </div>

      <div style="padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; background: #070b24; border-top: 1px solid #1c2766; flex-shrink: 0;">
        <button type="button" class="btn-modal-cancel" id="btn-cancel-fminside-modal">Cancel</button>
        <button type="button" id="btn-confirm-fminside-import" class="btn-action-primary" style="padding: 10px 22px; font-weight: 800;" disabled>
          <i class="fa-solid fa-check"></i> Apply to Profile
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('#btn-close-fminside-modal').onclick = closeModal;
  modal.querySelector('#btn-cancel-fminside-modal').onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  const pasteArea = modal.querySelector('#fminside-paste-textarea');
  const urlInput = modal.querySelector('#fminside-url-input');
  const btnFetch = modal.querySelector('#btn-fetch-fminside');
  const previewArea = modal.querySelector('#fminside-preview-area');
  const btnConfirm = modal.querySelector('#btn-confirm-fminside-import');
  const btnTrubin = modal.querySelector('#btn-sample-trubin');
  const btnHaaland = modal.querySelector('#btn-sample-haaland');
  let parsedData = null;

  // Display parsed data preview
  const displayPreview = (data) => {
    parsedData = data;
    const attrCount = Object.keys(data.attributes || {}).length;

    if (data.isUrl) {
      previewArea.style.display = 'block';
      previewArea.innerHTML = `
        <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px; padding: 10px 12px; font-size: 0.8rem; line-height: 1.4; color: #e2e8f0;">
          <strong style="color: #38bdf8;">🌐 URL Detected!</strong><br>
          FMInside blocks automated external bot requests. Please:
          <ol style="margin: 4px 0 0; padding-left: 16px;">
            <li>Click <a href="${pasteArea.value.trim()}" target="_blank" style="color: #38bdf8; font-weight: bold; text-decoration: underline;">Open Player in FMInside ↗</a></li>
            <li>Press <strong>Ctrl+A</strong> then <strong>Ctrl+C</strong> on the player page.</li>
            <li>Paste (<strong>Ctrl+V</strong>) back into the box above!</li>
          </ol>
        </div>
      `;
      btnConfirm.disabled = true;
      return;
    }

    if (attrCount === 0 && !data.name) {
      previewArea.style.display = 'block';
      previewArea.innerHTML = `<span style="color: #f87171;">⚠️ No player attributes could be recognized. Make sure you copied the FMInside player page.</span>`;
      btnConfirm.disabled = true;
      return;
    }

    const sampleAttrs = Object.entries(data.attributes || {}).slice(0, 12);
    const natFlag = data.nat ? getCountryFlag(data.nat).flagHtml : '';

    previewArea.style.display = 'block';
    previewArea.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1c2b66; padding-bottom: 8px; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${data.photo ? `<img src="${data.photo}" alt="" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid #38bdf8;" />` : ''}
          <div>
            <strong style="color: #ffffff; font-size: 0.9rem;">${data.name || player.name}</strong>
            <div style="font-size: 0.75rem; color: #94a3b8; display: flex; align-items: center; gap: 6px;">
              ${natFlag} ${data.nat || player.nat} • ${data.pos || player.pos} ${data.age ? `• ${data.age} yrs` : ''}
            </div>
          </div>
        </div>
        <span style="background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.4); border-radius: 4px; padding: 2px 8px; font-size: 0.78rem; font-weight: 700;">
          ✅ ${attrCount} Attributes Mapped (1–99)
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 6px; font-size: 0.75rem;">
        ${sampleAttrs.map(([k, v]) => `
          <div style="background: #030617; padding: 4px 6px; border-radius: 4px; display: flex; justify-content: space-between;">
            <span style="color: #cbd5e1; text-transform: capitalize;">${k.replace(/([A-Z])/g, ' $1')}</span>
            <strong class="attr-${v >= 80 ? 'elite' : v >= 65 ? 'great' : v >= 45 ? 'good' : 'poor'}">${v}</strong>
          </div>
        `).join('')}
        ${attrCount > 12 ? `<div style="color: #64748b; font-size: 0.72rem; align-self: center;">+ ${attrCount - 12} more attributes</div>` : ''}
      </div>
    `;

    btnConfirm.disabled = false;
  };

  // Instant Auto-Parse on Paste into Textarea
  const handlePasteParse = () => {
    const text = pasteArea.value.trim();
    if (!text) {
      previewArea.style.display = 'none';
      btnConfirm.disabled = true;
      return;
    }
    const result = parseFmInsideHtml(text, urlInput ? urlInput.value.trim() : '');
    displayPreview(result);
  };

  pasteArea.oninput = handlePasteParse;
  pasteArea.onpaste = () => setTimeout(handlePasteParse, 50);

  // Sample Buttons
  if (btnTrubin) {
    btnTrubin.onclick = () => {
      pasteArea.value = `Anatolii Trubin - Benfica GK
Goalkeeping
Aerial Reach 16
Command of Area 14
Communication 14
Eccentricity 4
Handling 16
Kicking 15
One on Ones 15
Reflexes 16
Rushing Out 13
Tendency to Punch 11
Throwing 14
Mental
Aggression 9
Anticipation 15
Bravery 15
Composure 15
Concentration 14
Decisions 14
Determination 16
Flair 5
Leadership 12
Off the Ball 4
Positioning 16
Teamwork 13
Vision 11
Work Rate 12
Physical
Acceleration 11
Agility 12
Balance 11
Jumping Reach 17
Natural Fitness 14
Pace 11
Stamina 13
Strength 16
Technical
Technique 11`;
      handlePasteParse();
    };
  }

  if (btnHaaland) {
    btnHaaland.onclick = () => {
      pasteArea.value = `Erling Haaland - Man City ST
Technical
Corners 7
Crossing 10
Dribbling 14
Finishing 19
First Touch 16
Free Kick Taking 12
Heading 16
Long Shots 13
Long Throws 5
Marking 7
Passing 13
Penalty Taking 19
Tackling 8
Technique 15
Mental
Aggression 15
Anticipation 18
Bravery 18
Composure 18
Concentration 15
Decisions 16
Determination 20
Flair 15
Leadership 12
Off the Ball 18
Positioning 10
Teamwork 14
Vision 13
Work Rate 16
Physical
Acceleration 17
Agility 14
Balance 17
Jumping Reach 18
Natural Fitness 17
Pace 19
Stamina 16
Strength 19`;
      handlePasteParse();
    };
  }

  // URL Fetch Handler (with fallback message)
  if (btnFetch && urlInput) {
    btnFetch.onclick = async () => {
      const url = urlInput.value.trim();
      if (!url) {
        showToast('Please enter an FMInside URL', 'error');
        return;
      }

      btnFetch.disabled = true;
      btnFetch.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching...';
      previewArea.style.display = 'block';
      previewArea.innerHTML = '<span style="color: #38bdf8;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching player data from FMInside...</span>';

      try {
        const proxies = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
          `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
        ];

        let html = null;
        for (const proxyUrl of proxies) {
          try {
            const res = await fetch(proxyUrl, { cache: 'no-cache' });
            if (res.ok) {
              if (proxyUrl.includes('allorigins.win/get')) {
                const json = await res.json();
                if (json && json.contents && json.contents.length > 200) {
                  html = json.contents;
                  break;
                }
              } else {
                const text = await res.text();
                if (text && text.length > 200) {
                  html = text;
                  break;
                }
              }
            }
          } catch (e) {
            // try next proxy
          }
        }

        if (!html) {
          throw new Error('Cloudflare blocked automated proxy fetching. Please copy & paste the FMInside page text into the box above.');
        }

        pasteArea.value = html;
        const result = parseFmInsideHtml(html, url);
        displayPreview(result);
      } catch (err) {
        previewArea.style.display = 'block';
        previewArea.innerHTML = `
          <div style="color: #f87171; font-size: 0.8rem; line-height: 1.4;">
            <strong>⚠️ Notice:</strong> ${err.message}<br>
            <span style="color: #94a3b8;">Simply open <a href="${url}" target="_blank" style="color: #38bdf8; text-decoration: underline;">FMInside</a>, press <strong>Ctrl+A</strong> & <strong>Ctrl+C</strong>, then paste into the box above!</span>
          </div>
        `;
        btnConfirm.disabled = true;
      } finally {
        btnFetch.disabled = false;
        btnFetch.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Fetch URL';
      }
    };
  }

  // Confirm and Apply to Profile
  btnConfirm.onclick = () => {
    if (!parsedData) return;

    const shouldImportAttrs = modal.querySelector('#chk-import-attrs')?.checked;
    const shouldImportBio = modal.querySelector('#chk-import-bio')?.checked;
    const shouldImportPhoto = modal.querySelector('#chk-import-photo')?.checked;

    const payload = {};

    if (shouldImportAttrs && parsedData.attributes) {
      payload.attributes = parsedData.attributes;
    }
    if (shouldImportBio) {
      if (parsedData.name) payload.name = parsedData.name;
      if (parsedData.pos) payload.pos = parsedData.pos;
      if (parsedData.age) payload.age = parsedData.age;
      if (parsedData.nat) payload.nat = parsedData.nat;
    }
    if (shouldImportPhoto && parsedData.photo) {
      payload.photo = parsedData.photo;
    }

    closeModal();
    onApply(payload);
  };
}




