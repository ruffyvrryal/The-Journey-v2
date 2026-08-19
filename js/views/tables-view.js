// Tables View - Full 20 Team Interactive League Standings
import { store } from '../state.js';

export function renderTablesView(container) {
  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-trophy" style="color: #fbbf24;"></i>
          ${store.leagueName} Standings (${store.currentSeason})
        </div>
        <div class="page-actions-group">
          <button class="btn-action-secondary" id="btn-back-to-home">
            <i class="fa-solid fa-arrow-left"></i> Home Overview
          </button>
        </div>
      </div>

      <div class="table-card-wrapper">
        <table class="full-data-table">
          <thead>
            <tr>
              <th style="width: 40px;">Pos</th>
              <th>Club</th>
              <th style="text-align: center;">Pld</th>
              <th style="text-align: center;">W</th>
              <th style="text-align: center;">D</th>
              <th style="text-align: center;">L</th>
              <th style="text-align: center;">GF</th>
              <th style="text-align: center;">GA</th>
              <th style="text-align: center;">GD</th>
              <th style="text-align: center; color: var(--brand-yellow);">Pts</th>
            </tr>
          </thead>
          <tbody>
            ${store.standings.map(t => `
              <tr class="${t.isUser ? 'highlight-myteam' : ''}">
                <td style="font-weight: 700; color: ${t.pos <= 4 ? '#38bdf8' : t.pos >= 18 ? '#f87171' : '#94a3b8'};">${t.pos}</td>
                <td style="font-weight: 700;">
                  <span style="margin-right: 6px;">${t.isUser ? '⭐' : '🛡️'}</span>
                  ${t.team}
                </td>
                <td style="text-align: center;">${t.pld}</td>
                <td style="text-align: center;">${t.won}</td>
                <td style="text-align: center;">${t.drawn}</td>
                <td style="text-align: center;">${t.lost}</td>
                <td style="text-align: center;">${t.gf}</td>
                <td style="text-align: center;">${t.ga}</td>
                <td style="text-align: center; color: ${t.gd > 0 ? '#4ade80' : t.gd < 0 ? '#f87171' : '#94a3b8'};">${t.gd > 0 ? '+' + t.gd : t.gd}</td>
                <td style="text-align: center; font-size: 1rem; font-weight: 900; color: var(--brand-yellow);">${t.pts}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const btnBack = container.querySelector('#btn-back-to-home');
  if (btnBack) btnBack.onclick = () => store.setPage('home');
}
