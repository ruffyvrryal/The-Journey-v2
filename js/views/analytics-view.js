// Analytics View - Charts, Metrics, and Analysis
import { store } from '../state.js';

export function renderAnalyticsView(container) {
  const winPct = ((store.record.wins / (store.record.wins + store.record.draws + store.record.losses)) * 100).toFixed(1);

  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-chart-line" style="color: #22c55e;"></i>
          Performance Data Analytics (${store.currentSeason})
        </div>
      </div>

      <div class="analytics-grid">
        <div class="metric-stat-box">
          <span class="lbl">Win Ratio</span>
          <span class="val" style="color: #22c55e;">${winPct}%</span>
          <span class="sub">${store.record.wins} Wins in 19 Matches</span>
        </div>

        <div class="metric-stat-box">
          <span class="lbl">Total Goals Scored</span>
          <span class="val" style="color: #38bdf8;">${store.record.goalsFor}</span>
          <span class="sub">3.05 Goals / Match</span>
        </div>

        <div class="metric-stat-box">
          <span class="lbl">Goals Conceded</span>
          <span class="val" style="color: #f87171;">${store.record.goalsAgainst}</span>
          <span class="sub">0.63 Goals Against / Match</span>
        </div>

        <div class="metric-stat-box">
          <span class="lbl">Clean Sheets</span>
          <span class="val" style="color: #fbbf24;">11</span>
          <span class="sub">58% Clean Sheet Rate</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px;">
        <div class="dash-card">
          <h3 style="font-size: 1rem; color: white; margin-bottom: 12px;">Top Goalscorers</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
              <span>Aaron Lemmens</span>
              <strong style="color: #4ade80;">18 Goals</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
              <span>Bruno Fernandes</span>
              <strong style="color: #4ade80;">14 Goals</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
              <span>Alejandro Garnacho</span>
              <strong style="color: #4ade80;">9 Goals</strong>
            </div>
          </div>
        </div>

        <div class="dash-card">
          <h3 style="font-size: 1rem; color: white; margin-bottom: 12px;">Top Assists</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
              <span>Bruno Fernandes</span>
              <strong style="color: #38bdf8;">12 Assists</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
              <span>Youri Tielemans</span>
              <strong style="color: #38bdf8;">9 Assists</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
              <span>Michael Olise</span>
              <strong style="color: #38bdf8;">8 Assists</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
