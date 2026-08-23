// Contracts View - Salary Structure & Expiries
import { store } from '../state.js';
import { getPositionBadgeClass } from './squad-view.js';

export function renderContractsView(container) {
  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-file-contract" style="color: #f59e0b;"></i>
          Contracts & Wage Tracker
        </div>
        <div style="font-size: 0.85rem; color: #fbbf24; font-weight: 700;">
          Total Wage: €2.35M / p/w
        </div>
      </div>

      <div class="table-card-wrapper">
        <table class="full-data-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Position</th>
              <th>Weekly Wage</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${store.squad.map(p => `
              <tr>
                <td style="font-weight: 700; color: white;">${p.name}</td>
                <td><span class="badge-position ${getPositionBadgeClass(p.pos)}">${p.pos}</span></td>
                <td style="color: #38bdf8; font-weight: 600;">${p.wage}</td>
                <td style="font-weight: 600; color: ${p.con === '2027' ? '#ef4444' : '#ffffff'};">${p.con}</td>
                <td><span style="color: #4ade80;">Active</span></td>
                <td>
                  <button class="btn-action-secondary" style="padding: 3px 10px; font-size: 0.75rem;" onclick="alert('Contract extension offered to ${p.name}')">
                    Extend Contract
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
