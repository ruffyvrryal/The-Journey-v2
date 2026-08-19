// Squad View - Roster & Player List
import { store } from '../state.js';
import { openAddPlayerModal } from './auth-modal.js';

export function renderSquadView(container) {
  container.innerHTML = `
    <div class="page-view-container">
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-users" style="color: #38bdf8;"></i>
          ${store.clubName} Senior Squad (${store.squad.length} Players)
        </div>
        <div class="page-actions-group">
          <button class="btn-action-primary" id="btn-add-player">
            <i class="fa-solid fa-plus"></i> Add Player
          </button>
        </div>
      </div>

      <div class="table-card-wrapper">
        <table class="full-data-table">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Pos</th>
              <th style="text-align: center;">Age</th>
              <th style="text-align: center;">Nat</th>
              <th>Value</th>
              <th>Wage</th>
              <th>Contract</th>
              <th>Morale</th>
              <th style="text-align: center;">Condition</th>
              <th style="text-align: center;">Rating</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${store.squad.map(p => {
              let posClass = 'pos-mf';
              if (p.pos === 'GK') posClass = 'pos-gk';
              else if (['DC', 'DL', 'DR', 'CB', 'LB', 'RB'].includes(p.pos)) posClass = 'pos-df';
              else if (['ST', 'AF', 'CF', 'AML', 'AMR'].includes(p.pos)) posClass = 'pos-fw';

              return `
                <tr>
                  <td style="font-weight: 700; font-size: 0.95rem; color: #ffffff;">${p.name}</td>
                  <td><span class="badge-position ${posClass}">${p.pos}</span></td>
                  <td style="text-align: center;">${p.age}</td>
                  <td style="text-align: center;">${p.nat}</td>
                  <td style="color: #38bdf8; font-weight: 600;">${p.val}</td>
                  <td>${p.wage}</td>
                  <td>${p.con}</td>
                  <td><span style="color: #4ade80; font-weight: 600;">${p.mor}</span></td>
                  <td style="text-align: center; color: ${p.fit >= 95 ? '#4ade80' : '#facc15'}; font-weight: 700;">${p.fit}%</td>
                  <td style="text-align: center;"><span class="badge-rating">${p.rat.toFixed(1)}</span></td>
                  <td style="text-align: center;">
                    <button class="btn-del-player" data-id="${p.id}" style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 4px;" title="Remove player">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const btnAdd = container.querySelector('#btn-add-player');
  if (btnAdd) btnAdd.onclick = () => openAddPlayerModal();

  container.querySelectorAll('.btn-del-player').forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-id'));
      if (confirm('Are you sure you want to remove this player from squad?')) {
        store.removePlayer(id);
      }
    };
  });
}
