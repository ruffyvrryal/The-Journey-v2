// Tactics View - Tactical Board & Formation Lineup
import { store } from '../state.js';

export function renderTacticsView(container) {
  const formation = store.tactics.formation;
  const lineup = store.tactics.lineup;

  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-clipboard-list" style="color: #a855f7;"></i>
          Tactical System & Lineup (${formation})
        </div>
        <div class="page-actions-group">
          <span style="font-size: 0.85rem; color: #4ade80; font-weight: 600;">Mentality: ${store.tactics.mentality}</span>
        </div>
      </div>

      <div class="tactics-layout">
        <!-- Interactive Pitch -->
        <div class="pitch-container">
          <div class="pitch-line-center"></div>
          <div class="pitch-center-circle"></div>
          <div class="pitch-penalty-top"></div>
          <div class="pitch-penalty-bottom"></div>

          <div class="pitch-formation-grid">
            <!-- ST -->
            <div class="pitch-row">
              <div class="pitch-player-node">
                <div class="pitch-player-kit">9</div>
                <div class="pitch-player-name">${lineup[10].name}</div>
                <div class="pitch-player-role">${lineup[10].role}</div>
              </div>
            </div>

            <!-- AM (L, C, R) -->
            <div class="pitch-row">
              <div class="pitch-player-node">
                <div class="pitch-player-kit">17</div>
                <div class="pitch-player-name">${lineup[9].name}</div>
                <div class="pitch-player-role">${lineup[9].role}</div>
              </div>
              <div class="pitch-player-node">
                <div class="pitch-player-kit">10</div>
                <div class="pitch-player-name">${lineup[8].name}</div>
                <div class="pitch-player-role">${lineup[8].role}</div>
              </div>
              <div class="pitch-player-node">
                <div class="pitch-player-kit">7</div>
                <div class="pitch-player-name">${lineup[7].name}</div>
                <div class="pitch-player-role">${lineup[7].role}</div>
              </div>
            </div>

            <!-- CM (L, R) -->
            <div class="pitch-row">
              <div class="pitch-player-node">
                <div class="pitch-player-kit">37</div>
                <div class="pitch-player-name">${lineup[5].name}</div>
                <div class="pitch-player-role">${lineup[5].role}</div>
              </div>
              <div class="pitch-player-node">
                <div class="pitch-player-kit">8</div>
                <div class="pitch-player-name">${lineup[6].name}</div>
                <div class="pitch-player-role">${lineup[6].role}</div>
              </div>
            </div>

            <!-- DF (L, C, C, R) -->
            <div class="pitch-row">
              <div class="pitch-player-node">
                <div class="pitch-player-kit">19</div>
                <div class="pitch-player-name">${lineup[4].name}</div>
                <div class="pitch-player-role">${lineup[4].role}</div>
              </div>
              <div class="pitch-player-node">
                <div class="pitch-player-kit">6</div>
                <div class="pitch-player-name">${lineup[3].name}</div>
                <div class="pitch-player-role">${lineup[3].role}</div>
              </div>
              <div class="pitch-player-node">
                <div class="pitch-player-kit">15</div>
                <div class="pitch-player-name">${lineup[2].name}</div>
                <div class="pitch-player-role">${lineup[2].role}</div>
              </div>
              <div class="pitch-player-node">
                <div class="pitch-player-kit">2</div>
                <div class="pitch-player-name">${lineup[1].name}</div>
                <div class="pitch-player-role">${lineup[1].role}</div>
              </div>
            </div>

            <!-- GK -->
            <div class="pitch-row">
              <div class="pitch-player-node">
                <div class="pitch-player-kit" style="background: #f59e0b; color: black;">1</div>
                <div class="pitch-player-name">${lineup[0].name}</div>
                <div class="pitch-player-role">${lineup[0].role}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tactical Instructions Panel -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="dash-card">
            <h3 style="font-size: 1rem; color: var(--brand-yellow); margin-bottom: 8px;">In Possession</h3>
            <ul style="list-style: none; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px; color: #cbd5e1;">
              <li>⚡ <strong>Attacking Width:</strong> Fairly Wide</li>
              <li>⚡ <strong>Play Out of Defence:</strong> Enabled</li>
              <li>⚡ <strong>Passing Directness:</strong> Shorter Passing</li>
              <li>⚡ <strong>Tempo:</strong> Much Higher Tempo</li>
              <li>⚡ <strong>Final Third:</strong> Work Ball Into Box & Low Crosses</li>
            </ul>
          </div>

          <div class="dash-card">
            <h3 style="font-size: 1rem; color: #38bdf8; margin-bottom: 8px;">In Transition</h3>
            <ul style="list-style: none; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px; color: #cbd5e1;">
              <li>🛡️ <strong>When Possession Lost:</strong> Counter-Press</li>
              <li>🛡️ <strong>When Possession Won:</strong> Counter Attack</li>
              <li>🛡️ <strong>Goalkeeper Distribution:</strong> Roll it out to Full-backs</li>
            </ul>
          </div>

          <div class="dash-card">
            <h3 style="font-size: 1rem; color: #f43f5e; margin-bottom: 8px;">Out of Possession</h3>
            <ul style="list-style: none; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px; color: #cbd5e1;">
              <li>⚔️ <strong>High Press Line:</strong> High Defensive Line</li>
              <li>⚔️ <strong>Trigger Press:</strong> Much More Often</li>
              <li>⚔️ <strong>Offside Trap:</strong> Enabled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
