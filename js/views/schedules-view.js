// Schedules View - Fixture List & Interactive Results Management
import { store } from '../state.js';
import { openAddMatchModal, showToast } from './auth-modal.js';

export function renderSchedulesView(container) {
  const clubName = store.clubName || 'Man Utd';
  const results = store.results || [];
  const rec = store.record || { wins: 0, draws: 0, losses: 0 };
  const totalMatches = (rec.wins || 0) + (rec.draws || 0) + (rec.losses || 0);
  const winRate = totalMatches > 0 ? Math.round(((rec.wins || 0) / totalMatches) * 100) : 0;

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

      <!-- Quick Season Record Bar -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 14px;">
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 8px 12px; text-align: center;">
          <span style="font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Matches</span>
          <div style="font-size: 1.3rem; font-weight: 900; color: #ffffff;">${totalMatches}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 8px 12px; text-align: center;">
          <span style="font-size: 0.7rem; color: #22c55e; font-weight: 700; text-transform: uppercase;">Won</span>
          <div style="font-size: 1.3rem; font-weight: 900; color: #22c55e;">${rec.wins || 0}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 8px 12px; text-align: center;">
          <span style="font-size: 0.7rem; color: #cbd5e1; font-weight: 700; text-transform: uppercase;">Drawn</span>
          <div style="font-size: 1.3rem; font-weight: 900; color: #cbd5e1;">${rec.draws || 0}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 8px 12px; text-align: center;">
          <span style="font-size: 0.7rem; color: #ef4444; font-weight: 700; text-transform: uppercase;">Lost</span>
          <div style="font-size: 1.3rem; font-weight: 900; color: #ef4444;">${rec.losses || 0}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 8px 12px; text-align: center;">
          <span style="font-size: 0.7rem; color: #fbbf24; font-weight: 700; text-transform: uppercase;">Win Rate</span>
          <div style="font-size: 1.3rem; font-weight: 900; color: #fbbf24;">${winRate}%</div>
        </div>
      </div>

      <!-- Match Fixtures List -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${results.length === 0 ? `
          <div style="text-align: center; padding: 40px; background: rgba(8, 12, 48, 0.6); border: 1px dashed #202a63; border-radius: 12px; color: #94a3b8;">
            <i class="fa-solid fa-futbol" style="font-size: 2.2rem; color: #38bdf8; margin-bottom: 10px;"></i>
            <p>No match fixtures recorded yet for this season.</p>
            <button class="btn-action-primary" id="btn-add-match-empty" style="margin-top: 12px; display: inline-flex;">+ Record First Match</button>
          </div>
        ` : results.map(m => {
          const homeNorm = (m.home || '').toLowerCase();
          const awayNorm = (m.away || '').toLowerCase();
          const isHome = homeNorm.includes('man utd') || homeNorm.includes('manchester united') || homeNorm.includes(clubName.toLowerCase());
          const isAway = awayNorm.includes('man utd') || awayNorm.includes('manchester united') || awayNorm.includes(clubName.toLowerCase());

          let badge = 'badge-result-d';
          let outcome = 'D';

          if (isHome) {
            if (m.homeScore > m.awayScore) { badge = 'badge-result-w'; outcome = 'W'; }
            else if (m.homeScore < m.awayScore) { badge = 'badge-result-l'; outcome = 'L'; }
          } else if (isAway) {
            if (m.awayScore > m.homeScore) { badge = 'badge-result-w'; outcome = 'W'; }
            else if (m.awayScore < m.homeScore) { badge = 'badge-result-l'; outcome = 'L'; }
          }

          // Scorers summary line
          const scorersSummary = m.goalscorers && m.goalscorers.length > 0 
            ? m.goalscorers.map(g => `${g.name || 'Player'} (${g.count > 1 ? g.count : '1'})`).join(', ')
            : null;

          return `
            <div class="fixture-card" data-match-id="${m.id}" style="position: relative; flex-wrap: wrap;">
              <div class="fixture-date-tag">
                <div style="font-weight: 800; color: #ffffff;">GW ${m.gameweek || '—'}</div>
                <div style="font-size: 0.72rem; color: #64748b;">${m.date || '—'}</div>
              </div>

              <div class="fixture-matchup">
                <div class="team-pill-name ${isHome ? 'user-team' : ''}" style="${isHome ? 'color: var(--brand-yellow); font-weight: 800;' : ''}">${m.home}</div>
                <div class="fixture-score-badge" style="cursor: pointer;" title="Click to edit">${m.homeScore} - ${m.awayScore}</div>
                <div class="team-pill-name away ${isAway ? 'user-team' : ''}" style="${isAway ? 'color: var(--brand-yellow); font-weight: 800;' : ''}">${m.away}</div>
              </div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="${badge}">${outcome}</span>
                <span style="font-size: 0.75rem; color: #94a3b8; min-width: 90px;">${m.competition || 'League'}</span>

                <!-- Edit & Delete Action Buttons -->
                <div style="display: flex; align-items: center; gap: 6px;">
                  <button class="btn-edit-match" data-id="${m.id}" title="Edit Match Fixture & Stats" style="background: #16a34a; color: white; border: none; border-radius: 4px; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn-delete-match" data-id="${m.id}" title="Delete Match Record" style="background: #dc2626; color: white; border: none; border-radius: 4px; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              ${scorersSummary ? `
                <div style="width: 100%; font-size: 0.72rem; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px; margin-top: 4px; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-futbol" style="color: #fbbf24; font-size: 0.65rem;"></i>
                  <span><strong>Goalscorers:</strong> ${scorersSummary}</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Bind Add Match Button
  const btnAdd = container.querySelector('#btn-add-match');
  if (btnAdd) btnAdd.onclick = () => openAddMatchModal();

  const btnAddEmpty = container.querySelector('#btn-add-match-empty');
  if (btnAddEmpty) btnAddEmpty.onclick = () => openAddMatchModal();

  // Bind Edit Match Buttons
  container.querySelectorAll('.btn-edit-match').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute('data-id'));
      const match = store.results.find(m => m.id === id);
      if (match) openAddMatchModal(match);
    };
  });

  // Bind Delete Match Buttons
  container.querySelectorAll('.btn-delete-match').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute('data-id'));
      const match = store.results.find(m => m.id === id);
      if (match) {
        if (confirm(`Are you sure you want to remove the match record for ${match.home} vs ${match.away}?`)) {
          store.deleteMatchResult(id);
          showToast('Match record deleted.');
        }
      }
    };
  });
}
