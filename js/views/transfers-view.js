// Transfers View - In/Out History & Budget
import { store } from '../state.js';

export function renderTransfersView(container) {
  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-arrow-right-arrow-left" style="color: #06b6d4;"></i>
          Transfer Hub (${store.currentSeason})
        </div>
        <div style="font-size: 0.85rem; color: #38bdf8; font-weight: 700;">
          Net Spend: -€81M
        </div>
      </div>

      <div class="table-card-wrapper">
        <table class="full-data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Player Name</th>
              <th>Club</th>
              <th>Fee</th>
              <th>Date</th>
              <th>Wage</th>
            </tr>
          </thead>
          <tbody>
            ${store.transfers.map(tr => `
              <tr>
                <td>
                  <span style="background-color: ${tr.type === 'IN' ? '#15803d' : '#991b1b'}; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 0.75rem;">
                    ${tr.type}
                  </span>
                </td>
                <td style="font-weight: 700; color: white;">${tr.player}</td>
                <td>${tr.club}</td>
                <td style="color: var(--brand-yellow); font-weight: 700;">${tr.fee}</td>
                <td>${tr.date}</td>
                <td>${tr.wage}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
