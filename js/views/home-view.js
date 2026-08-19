// Home Dashboard View - Exact Visual Match to Reference Image
import { store } from '../state.js';
import { openEditStatsModal, openAddMatchModal } from './auth-modal.js';

export function renderHomeView(container) {
  const topStandings = store.standings.slice(0, 5);
  const recentMatches = store.results.slice(0, 2);
  const formBars = store.recentForm.map(f => {
    if (f === 'W') return `<div class="form-bar win" title="Win"></div>`;
    if (f === 'D') return `<div class="form-bar draw" title="Draw"></div>`;
    return `<div class="form-bar loss" title="Loss"></div>`;
  }).join('');

  container.innerHTML = `
    <div class="dashboard-layout">
      <!-- 1. CLUB OVERVIEW CARD -->
      <div class="dash-card card-club-overview">
        <div>
          <div class="club-header-info">
            <div class="club-crest-container">
              <!-- Manchester United Badge Stylized -->
              <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" fill="#DA020E" stroke="#FFE600" stroke-width="4"/>
                <path d="M50 18 L60 38 L82 38 L65 52 L71 74 L50 60 L29 74 L35 52 L18 38 L40 38 Z" fill="#FFE600"/>
                <circle cx="50" cy="50" r="14" fill="#000000"/>
                <text x="50" y="55" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">MU</text>
              </svg>
            </div>
            <div class="club-name-group">
              <div class="club-main-title">${store.clubName === 'Manchester United' ? 'Man United' : store.clubName}</div>
              <div class="club-sub-status">${store.clubPosition}</div>
            </div>
          </div>

          <div class="card-divider"></div>

          <div class="club-stats-row">
            <div class="club-form-col">
              <span class="col-label">Form</span>
              <div class="form-bar-indicators">
                ${formBars}
              </div>
            </div>

            <div class="club-form-col" style="align-items: flex-end;">
              <span class="col-label">Performance</span>
              <div class="performance-pill-badge" id="btn-edit-performance" style="cursor: pointer;" title="Click to edit">
                <i class="fa-solid fa-thumbs-up"></i> ${store.performance}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. RESULTS CARD -->
      <div class="dash-card card-results">
        <div class="card-top-title-row">
          <div style="display: flex; align-items: baseline;">
            <span class="card-title-main">Results</span>
            <span class="card-subtitle-italic">${store.leagueName}</span>
          </div>
          <span class="gameweek-stamp">Gameweek 19 | 23/07/2026</span>
        </div>

        <div class="results-match-list">
          ${recentMatches.map(m => `
            <div class="result-row-box">
              <div class="result-team-pill">${m.home}</div>
              <div class="result-score-pill">${m.homeScore}-${m.awayScore}</div>
              <div class="result-team-pill">${m.away}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3. TABLES CARD (Top 5 & See More) -->
      <div class="dash-card card-tables">
        <div>
          <div class="card-top-title-row" style="margin-bottom: 6px;">
            <span class="card-title-main">Tables</span>
            <span class="table-league-tag">${store.leagueName}</span>
          </div>

          <table class="mini-table">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Team</th>
                <th>Pld</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              ${topStandings.map(t => `
                <tr class="${t.isUser ? 'highlight-team' : ''}">
                  <td class="pos">${t.pos}.</td>
                  <td class="team-name">${t.team}</td>
                  <td class="pld">${t.pld}</td>
                  <td class="pts">${t.pts}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <button class="btn-see-more" id="btn-home-see-more">
          SEE MORE <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <!-- 4, 5, 6. BOTTOM ROW: WIN - DRAW - LOSE RECORD STATS -->
      <div class="bottom-stats-cluster">
        <!-- WIN -->
        <div class="stat-box-card" id="btn-edit-record-w" title="Click to edit Season Record">
          <div class="stat-box-title">WIN</div>
          <div class="stat-underline"></div>
          <div class="stat-box-num">${store.record.wins}</div>
        </div>

        <!-- DRAW -->
        <div class="stat-box-card" id="btn-edit-record-d" title="Click to edit Season Record">
          <div class="stat-box-title">DRAW</div>
          <div class="stat-underline"></div>
          <div class="stat-box-num">${store.record.draws}</div>
        </div>

        <!-- LOSE -->
        <div class="stat-box-card" id="btn-edit-record-l" title="Click to edit Season Record">
          <div class="stat-box-title">LOSE</div>
          <div class="stat-underline"></div>
          <div class="stat-box-num">${store.record.losses}</div>
        </div>
      </div>

      <!-- 7. BOTTOM RIGHT: BEST PLAYERS -->
      <div class="dash-card card-best-players">
        <div class="best-players-header">Best Players</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${store.bestPlayers.map(p => {
            const widthPct = Math.min(100, Math.max(30, (p.rating / 10) * 100));
            return `
              <div class="best-player-row">
                <div class="best-player-bar-fill" style="width: ${widthPct}%;"></div>
                <span class="best-player-name">${p.name}</span>
                <span class="best-player-rating-badge">${p.rating.toFixed(1)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Bind interactive elements
  const btnSeeMore = container.querySelector('#btn-home-see-more');
  if (btnSeeMore) {
    btnSeeMore.onclick = () => store.setPage('tables');
  }

  const statCards = [
    container.querySelector('#btn-edit-record-w'),
    container.querySelector('#btn-edit-record-d'),
    container.querySelector('#btn-edit-record-l'),
    container.querySelector('#btn-edit-performance')
  ];
  statCards.forEach(el => {
    if (el) el.onclick = () => openEditStatsModal();
  });
}
