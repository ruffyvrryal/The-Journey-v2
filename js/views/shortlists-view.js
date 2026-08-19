// Shortlists View - Scouting Targets
import { store } from '../state.js';

export function renderShortlistsView(container) {
  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-star" style="color: #eab308;"></i>
          Target Scouting Shortlist
        </div>
      </div>

      <div class="table-card-wrapper">
        <table class="full-data-table">
          <thead>
            <tr>
              <th>Target Player</th>
              <th>Club</th>
              <th>Pos</th>
              <th style="text-align: center;">Age</th>
              <th>Est. Valuation</th>
              <th>Scout Priority</th>
              <th>Scout Verdict</th>
            </tr>
          </thead>
          <tbody>
            ${store.shortlist.map(s => `
              <tr>
                <td style="font-weight: 700; color: white;">${s.name}</td>
                <td>${s.club}</td>
                <td><span class="badge-position pos-mf">${s.pos}</span></td>
                <td style="text-align: center;">${s.age}</td>
                <td style="color: #38bdf8; font-weight: 700;">${s.val}</td>
                <td style="color: #fbbf24; font-size: 0.9rem;">${'★'.repeat(Math.floor(s.stars))}${'½'.repeat(s.stars % 1 ? 1 : 0)}</td>
                <td style="color: #cbd5e1; font-style: italic; font-size: 0.8rem;">"${s.scout}"</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
