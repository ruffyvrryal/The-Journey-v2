// Injuries View - Medical Room
import { store } from '../state.js';

export function renderInjuriesView(container) {
  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-briefcase-medical" style="color: #ef4444;"></i>
          Medical Room & Injury Tracker
        </div>
      </div>

      <div class="table-card-wrapper">
        <table class="full-data-table">
          <thead>
            <tr>
              <th>Injured Player</th>
              <th>Injury Type</th>
              <th>Estimated Out</th>
              <th>Expected Return</th>
              <th>Rehabilitation</th>
            </tr>
          </thead>
          <tbody>
            ${store.injuries.map(inj => `
              <tr>
                <td style="font-weight: 700; color: white;">${inj.player}</td>
                <td style="color: #f87171; font-weight: 600;">${inj.injury}</td>
                <td>${inj.duration}</td>
                <td>${inj.returnDate}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 8px; background-color: #1e293b; border-radius: 4px; overflow: hidden;">
                      <div style="width: ${inj.progress}%; height: 100%; background-color: #22c55e;"></div>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 700; color: #4ade80;">${inj.progress}%</span>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
