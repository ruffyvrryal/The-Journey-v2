// Analytics View - Comprehensive Squad Statistical Analytics, Match Breakdown, & Nationality Diversity
import { store } from '../state.js';
import { getPlayerShirtNumber, getPositionBadgeClass, getPlayerCategory, getCountryFlag } from './squad-view.js';

let currentSortField = 'goals';
let currentSortAsc = false;
let currentPosFilter = 'all';
let currentSearchQuery = '';

export function renderAnalyticsView(container) {
  const squad = store.squad || [];
  const results = store.results || [];
  const rec = store.record || { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
  const totalMatches = (rec.wins || 0) + (rec.draws || 0) + (rec.losses || 0);
  const winPct = totalMatches > 0 ? (((rec.wins || 0) / totalMatches) * 100).toFixed(1) : '0.0';

  // Calculate team-wide totals
  const totalGoals = squad.reduce((sum, p) => sum + (Number(p.goals) || 0), 0);
  const totalAssists = squad.reduce((sum, p) => sum + (Number(p.assists) || 0), 0);
  const totalYellows = squad.reduce((sum, p) => sum + (Number(p.yel) || 0), 0);
  const totalReds = squad.reduce((sum, p) => sum + (Number(p.red) || 0), 0);
  const cleanSheetsCount = squad.filter(p => p.pos === 'GK').reduce((max, p) => Math.max(max, Number(p.cleanSheets) || 0), 0);

  // Nationality Breakdown Aggregation
  const natCountMap = {};
  squad.forEach(p => {
    const nat = (p.nat || 'ENG').toUpperCase().trim();
    if (!natCountMap[nat]) {
      natCountMap[nat] = {
        code: nat,
        ...getCountryFlag(nat),
        count: 0,
        players: []
      };
    }
    natCountMap[nat].count++;
    natCountMap[nat].players.push(p.name);
  });

  const natList = Object.values(natCountMap).sort((a, b) => b.count - a.count);
  const totalNations = natList.length;

  // Identify Top Performers
  const sortedByGoals = [...squad].sort((a, b) => (Number(b.goals) || 0) - (Number(a.goals) || 0));
  const sortedByAssists = [...squad].sort((a, b) => (Number(b.assists) || 0) - (Number(a.assists) || 0));
  const sortedByRating = [...squad].sort((a, b) => (Number(b.rat) || 0) - (Number(a.rat) || 0));
  const sortedByApps = [...squad].sort((a, b) => (Number(b.apps) || 0) - (Number(a.apps) || 0));

  const topScorer = sortedByGoals[0] || { name: '—', goals: 0 };
  const topAssister = sortedByAssists[0] || { name: '—', assists: 0 };
  const topRated = sortedByRating[0] || { name: '—', rat: 7.0 };
  const topApps = sortedByApps[0] || { name: '—', apps: 0 };

  // Compute each player's total season minutes from all match playerMinutes records (for backward compat)
  const minutesMap = {};
  results.forEach(m => {
    const pm = m.playerMinutes || {};
    Object.entries(pm).forEach(([pid, mins]) => {
      const numId = Number(pid);
      minutesMap[numId] = (minutesMap[numId] || 0) + Number(mins);
    });
    // Fallback: if no playerMinutes, count starters as 90 mins each
    if (Object.keys(pm).length === 0 && Array.isArray(m.lineup)) {
      m.lineup.forEach(pid => {
        const numId = Number(pid);
        minutesMap[numId] = (minutesMap[numId] || 0) + 90;
      });
    }
  });

  const renderTableBody = () => {
    const tableBodyEl = container.querySelector('#analytics-players-tbody');
    if (!tableBodyEl) return;

    // Filter
    let list = squad.filter(p => {
      if (currentPosFilter !== 'all' && getPlayerCategory(p.pos) !== currentPosFilter) return false;
      if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || 
               (p.pos && p.pos.toLowerCase().includes(q)) ||
               (p.nat && p.nat.toLowerCase().includes(q));
      }
      return true;
    });

    // Sort
    list.sort((a, b) => {
      let valA = a[currentSortField];
      let valB = b[currentSortField];

      if (currentSortField === 'num' || currentSortField === 'number' || currentSortField === 'shirtNumber') {
        valA = getPlayerShirtNumber(a);
        valB = getPlayerShirtNumber(b);
      } else if (currentSortField === 'ga') {
        valA = (Number(a.goals) || 0) + (Number(a.assists) || 0);
        valB = (Number(b.goals) || 0) + (Number(b.assists) || 0);
      } else if (currentSortField === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        return currentSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (currentSortField === 'nat') {
        valA = (a.nat || 'ENG').toLowerCase();
        valB = (b.nat || 'ENG').toLowerCase();
        return currentSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (currentSortField === 'pos') {
        valA = (a.pos || '').toLowerCase();
        valB = (b.pos || '').toLowerCase();
        return currentSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (currentSortField === 'totalMins') {
        valA = minutesMap[Number(a.id)] ?? (Number(a.totalMins) || 0);
        valB = minutesMap[Number(b.id)] ?? (Number(b.totalMins) || 0);
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      return currentSortAsc ? (valA - valB) : (valB - valA);
    });

    if (list.length === 0) {
      tableBodyEl.innerHTML = `
        <tr>
          <td colspan="13" style="text-align: center; padding: 24px; color: #64748b;">
            No players found matching current filters.
          </td>
        </tr>
      `;
      return;
    }

    tableBodyEl.innerHTML = list.map((p, idx) => {
      const shirtNum = getPlayerShirtNumber(p);
      const natInfo = getCountryFlag(p.nat);
      const apps = Number(p.apps) || 0;
      const goals = Number(p.goals) || 0;
      const assists = Number(p.assists) || 0;
      const ga = goals + assists;
      const rating = p.rat ? Number(p.rat).toFixed(2) : '7.00';
      const yel = Number(p.yel) || 0;
      const red = Number(p.red) || 0;
      const cs = Number(p.cleanSheets) || 0;
      const posBadgeClass = getPositionBadgeClass(p.pos);
      const mins = minutesMap[Number(p.id)] ?? (Number(p.totalMins) || 0);

      return `
        <tr class="analytics-player-row" data-id="${p.id}" style="cursor: pointer; transition: background 0.15s ease;" title="Click to view & edit ${p.name}'s profile">
          <!-- Shirt # -->
          <td style="text-align: center;">
            <span class="shirt-number-badge" style="cursor: default;">${shirtNum}</span>
          </td>

          <!-- Player Name -->
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <strong style="color: #f1f5f9;">${p.name}</strong>
            </div>
          </td>

          <!-- Nationality with Real Flag Image -->
          <td style="text-align: center;">
            <span class="nation-tag" title="${natInfo.name} (${p.nat || 'ENG'})">
              ${natInfo.flagHtml}
              <span>${p.nat || 'ENG'}</span>
            </span>
          </td>

          <!-- Position -->
          <td style="text-align: center;">
            <span class="pos-badge ${posBadgeClass}">${p.pos}</span>
          </td>

          <!-- Appearances -->
          <td style="text-align: center; font-weight: 800; color: #ffffff;">
            ${apps}
          </td>

          <!-- Minutes Played -->
          <td style="text-align: center; font-weight: 800; color: ${mins > 0 ? '#fb923c' : '#64748b'};">
            ${mins > 0 ? `<span title="${mins} minutes played" style="font-size: 0.78rem;">${mins}'</span>` : `<span style="color: #374151;">—</span>`}
          </td>

          <!-- Goals -->
          <td style="text-align: center; font-weight: 900; color: ${goals > 0 ? '#4ade80' : '#94a3b8'};">
            ${goals}
          </td>

          <!-- Assists -->
          <td style="text-align: center; font-weight: 900; color: ${assists > 0 ? '#38bdf8' : '#94a3b8'};">
            ${assists}
          </td>

          <!-- Goal Contributions (G+A) -->
          <td style="text-align: center; font-weight: 900; color: ${ga > 0 ? '#fbbf24' : '#64748b'};">
            ${ga}
          </td>

          <!-- Average Rating -->
          <td style="text-align: center;">
            <span class="badge-rating" style="padding: 2px 8px; font-weight: 800;">${rating}</span>
          </td>

          <!-- Clean Sheets -->
          <td style="text-align: center; font-weight: 700; color: ${cs > 0 ? '#34d399' : '#64748b'};">
            ${cs}
          </td>

          <!-- Yellow Cards -->
          <td style="text-align: center; font-weight: 800; color: ${yel > 0 ? '#facc15' : '#64748b'};">
            ${yel > 0 ? `<span style="background: rgba(234, 179, 8, 0.2); padding: 2px 6px; border-radius: 3px;">${yel}</span>` : '0'}
          </td>

          <!-- Red Cards -->
          <td style="text-align: center; font-weight: 800; color: ${red > 0 ? '#ef4444' : '#64748b'};">
            ${red > 0 ? `<span style="background: rgba(239, 68, 68, 0.25); color: #f87171; padding: 2px 6px; border-radius: 3px;">${red}</span>` : '0'}
          </td>
        </tr>
      `;
    }).join('');

    // Bind row clicks to open detailed player profile
    tableBodyEl.querySelectorAll('.analytics-player-row').forEach(row => {
      row.onclick = () => {
        const id = Number(row.getAttribute('data-id'));
        if (id) store.selectPlayer(id);
      };
    });
  };

  container.innerHTML = `
    <div class="page-view-container">
      <!-- Header -->
      <div class="page-header-row">
        <div class="page-title">
          <i class="fa-solid fa-chart-pie" style="color: #22c55e;"></i>
          Squad Performance & Match Data Analytics (${store.currentSeason})
        </div>
      </div>

      <!-- Top Metric Cards -->
      <div class="analytics-grid" style="margin-bottom: 16px;">
        <div class="metric-stat-box">
          <span class="lbl">Top Goalscorer</span>
          <span class="val" style="color: #4ade80; font-size: 1.45rem;">${topScorer.name.split(' ').pop()} (${topScorer.goals || 0})</span>
          <span class="sub">Team Leading Striker</span>
        </div>

        <div class="metric-stat-box">
          <span class="lbl">Top Playmaker</span>
          <span class="val" style="color: #38bdf8; font-size: 1.45rem;">${topAssister.name.split(' ').pop()} (${topAssister.assists || 0})</span>
          <span class="sub">Most Assists Created</span>
        </div>

        <div class="metric-stat-box">
          <span class="lbl">Most Appearances</span>
          <span class="val" style="color: #fbbf24; font-size: 1.45rem;">${topApps.name.split(' ').pop()} (${topApps.apps || 0})</span>
          <span class="sub">Key Regular Starter</span>
        </div>

        <div class="metric-stat-box">
          <span class="lbl">Highest Rating</span>
          <span class="val" style="color: #c084fc; font-size: 1.45rem;">${topRated.name.split(' ').pop()} (${topRated.rat ? Number(topRated.rat).toFixed(2) : '7.00'})</span>
          <span class="sub">Season MVP</span>
        </div>
      </div>

      <!-- Team Overview Stats Strip -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 16px;">
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 10px 14px; text-align: center;">
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Team Goals</span>
          <div style="font-size: 1.35rem; font-weight: 900; color: #4ade80;">${totalGoals}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 10px 14px; text-align: center;">
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Team Assists</span>
          <div style="font-size: 1.35rem; font-weight: 900; color: #38bdf8;">${totalAssists}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 10px 14px; text-align: center;">
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Clean Sheets</span>
          <div style="font-size: 1.35rem; font-weight: 900; color: #34d399;">${cleanSheetsCount}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 10px 14px; text-align: center;">
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Yellow Cards</span>
          <div style="font-size: 1.35rem; font-weight: 900; color: #facc15;">${totalYellows}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 10px 14px; text-align: center;">
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Red Cards</span>
          <div style="font-size: 1.35rem; font-weight: 900; color: #ef4444;">${totalReds}</div>
        </div>
        <div style="background: #080d32; border: 1px solid #1c2766; border-radius: 8px; padding: 10px 14px; text-align: center;">
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Win Rate</span>
          <div style="font-size: 1.35rem; font-weight: 900; color: #22c55e;">${winPct}%</div>
        </div>
      </div>

      <!-- SQUAD NATIONALITY & CULTURAL DIVERSITY BREAKDOWN SECTION -->
      <div style="background: #080c30; border: 1px solid #1c2766; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.95rem; color: #ffffff;">
            <i class="fa-solid fa-earth-americas" style="color: #38bdf8;"></i>
            <span>Squad Nationality Distribution (${totalNations} Nations Represented)</span>
          </div>
          <span style="font-size: 0.75rem; color: #94a3b8; background: #05071c; border: 1px solid #192455; padding: 3px 10px; border-radius: 6px;">
            ${squad.length} Total Players
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
          ${natList.map(n => {
            const pct = squad.length > 0 ? ((n.count / squad.length) * 100).toFixed(1) : 0;
            return `
              <div style="background: #05071a; border: 1px solid #16204c; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    ${n.flagHtmlLg || `<img src="${n.flagUrl}" class="national-flag-img-lg" alt="${n.name}" loading="lazy" />`}
                    <div>
                      <strong style="color: #ffffff; font-size: 0.85rem;">${n.name}</strong>
                      <span style="font-size: 0.7rem; color: #64748b; margin-left: 4px;">(${n.code})</span>
                    </div>
                  </div>
                  <span style="font-weight: 900; color: #38bdf8; font-size: 0.9rem;">${n.count}</span>
                </div>

                <!-- Progress Bar -->
                <div style="height: 5px; background: #162048; border-radius: 3px; overflow: hidden; margin-top: 2px;">
                  <div style="height: 100%; width: ${pct}%; background: linear-gradient(90deg, #38bdf8, #22c55e); border-radius: 3px;"></div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #94a3b8;">
                  <span>${pct}% of Squad</span>
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;" title="${n.players.join(', ')}">
                    ${n.players.join(', ')}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Squad Statistical Analytics Table Container -->
      <div style="background: #080c30; border: 1px solid #1c2766; border-radius: 12px; padding: 14px; overflow: hidden; display: flex; flex-direction: column; gap: 12px;">
        <!-- Filters and Search Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <!-- Position Filter Pills -->
          <div style="display: flex; align-items: center; gap: 4px; background: #05071a; padding: 3px; border-radius: 6px; border: 1px solid #18224e;">
            <button class="pos-filter-btn ${currentPosFilter === 'all' ? 'active' : ''}" data-cat="all">All</button>
            <button class="pos-filter-btn ${currentPosFilter === 'gk' ? 'active' : ''}" data-cat="gk">GK</button>
            <button class="pos-filter-btn ${currentPosFilter === 'df' ? 'active' : ''}" data-cat="df">DEF</button>
            <button class="pos-filter-btn ${currentPosFilter === 'mf' ? 'active' : ''}" data-cat="mf">MID</button>
            <button class="pos-filter-btn ${currentPosFilter === 'fw' ? 'active' : ''}" data-cat="fw">FWD</button>
          </div>

          <!-- Search Input -->
          <div style="position: relative; width: 240px;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 0.75rem;"></i>
            <input 
              type="text" 
              id="analytics-search-input" 
              placeholder="Search by name, nat, pos..." 
              value="${currentSearchQuery}"
              style="width: 100%; background: #04061a; border: 1px solid #1c275a; border-radius: 6px; padding: 6px 10px 6px 30px; font-size: 0.8rem; color: #ffffff; outline: none;"
            />
          </div>
        </div>

        <!-- Sortable Interactive Analytics Table -->
        <div style="overflow-x: auto;">
          <table class="squad-data-table" style="width: 100%; font-size: 0.82rem;">
            <thead>
              <tr>
                <th class="sortable-th" data-sort="num" style="width: 48px; text-align: center; cursor: pointer;">
                  # <span class="sort-icon">${currentSortField === 'num' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="name" style="min-width: 150px; cursor: pointer;">
                  Player Name <span class="sort-icon">${currentSortField === 'name' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="nat" style="width: 75px; text-align: center; cursor: pointer;" title="Nationality">
                  Nat <span class="sort-icon">${currentSortField === 'nat' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="pos" style="width: 65px; text-align: center; cursor: pointer;">
                  Pos <span class="sort-icon">${currentSortField === 'pos' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="apps" style="width: 60px; text-align: center; cursor: pointer;" title="Appearances in Matches">
                  Apps <span class="sort-icon">${currentSortField === 'apps' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="totalMins" style="width: 65px; text-align: center; cursor: pointer;" title="Total Minutes Played">
                  Mins <span class="sort-icon">${currentSortField === 'totalMins' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="goals" style="width: 65px; text-align: center; cursor: pointer;" title="Season Goals">
                  Goals <span class="sort-icon">${currentSortField === 'goals' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="assists" style="width: 65px; text-align: center; cursor: pointer;" title="Season Assists">
                  Ast <span class="sort-icon">${currentSortField === 'assists' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="ga" style="width: 65px; text-align: center; cursor: pointer;" title="Goal Contributions (Goals + Assists)">
                  G+A <span class="sort-icon">${currentSortField === 'ga' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="rat" style="width: 75px; text-align: center; cursor: pointer;" title="Average Match Rating">
                  Av Rat <span class="sort-icon">${currentSortField === 'rat' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="cleanSheets" style="width: 65px; text-align: center; cursor: pointer;" title="Clean Sheets">
                  CS <span class="sort-icon">${currentSortField === 'cleanSheets' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="yel" style="width: 60px; text-align: center; cursor: pointer;" title="Yellow Cards">
                  Yel <span class="sort-icon">${currentSortField === 'yel' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
                <th class="sortable-th" data-sort="red" style="width: 60px; text-align: center; cursor: pointer;" title="Red Cards">
                  Red <span class="sort-icon">${currentSortField === 'red' ? (currentSortAsc ? '▲' : '▼') : ''}</span>
                </th>
              </tr>
            </thead>
            <tbody id="analytics-players-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Initial table render
  renderTableBody();

  // Bind Header Column Click Sorting
  container.querySelectorAll('.sortable-th').forEach(th => {
    th.onclick = () => {
      const field = th.getAttribute('data-sort');
      if (currentSortField === field) {
        currentSortAsc = !currentSortAsc;
      } else {
        currentSortField = field;
        currentSortAsc = false;
      }

      // Re-render whole view to refresh header icons and table
      renderAnalyticsView(container);
    };
  });

  // Bind Position Filter Buttons
  container.querySelectorAll('.pos-filter-btn').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('.pos-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPosFilter = btn.getAttribute('data-cat');
      renderTableBody();
    };
  });

  // Bind Search Input
  const searchInput = container.querySelector('#analytics-search-input');
  if (searchInput) {
    searchInput.oninput = (e) => {
      currentSearchQuery = e.target.value;
      renderTableBody();
    };
  }
}
