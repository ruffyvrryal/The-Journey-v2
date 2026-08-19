// Schedules View - Fixture List & Results
import { store } from '../state.js';
import { openAddMatchModal } from './auth-modal.js';

export function renderSchedulesView(container) {
  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-calendar-days" style="color: #38bdf8;"></i>
          Match Schedule & Fixture List
        </div>
        <div class="page-actions-group">
          <button class="btn-action-primary" id="btn-add-match">
            <i class="fa-solid fa-plus"></i> Record Match Result
          </button>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${store.results.map(m => {
          let badge = 'badge-result-d';
          let outcome = 'D';
          if (m.home === 'Man Utd') {
            if (m.homeScore > m.awayScore) { badge = 'badge-result-w'; outcome = 'W'; }
            else if (m.homeScore < m.awayScore) { badge = 'badge-result-l'; outcome = 'L'; }
          } else if (m.away === 'Man Utd') {
            if (m.awayScore > m.homeScore) { badge = 'badge-result-w'; outcome = 'W'; }
            else if (m.awayScore < m.homeScore) { badge = 'badge-result-l'; outcome = 'L'; }
          }

          return `
            <div class="fixture-card">
              <div class="fixture-date-tag">
                <div>GW ${m.gameweek}</div>
                <div style="font-size: 0.72rem; color: #64748b;">${m.date}</div>
              </div>

              <div class="fixture-matchup">
                <div class="team-pill-name ${m.home === 'Man Utd' ? 'style="color: var(--brand-yellow);"' : ''}">${m.home}</div>
                <div class="fixture-score-badge">${m.homeScore} - ${m.awayScore}</div>
                <div class="team-pill-name away ${m.away === 'Man Utd' ? 'style="color: var(--brand-yellow);"' : ''}">${m.away}</div>
              </div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="${badge}">${outcome}</span>
                <span style="font-size: 0.75rem; color: #94a3b8;">${m.competition}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const btnAdd = container.querySelector('#btn-add-match');
  if (btnAdd) btnAdd.onclick = () => openAddMatchModal();
}
