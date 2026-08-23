// Reactive State Store for The Journey FM Vault
import { firebaseService } from './firebase-config.js';

class StateStore {
  constructor() {
    this.currentPage = 'home';
    this.selectedPlayerId = null;
    this.currentSeason = '2026/27';
    this.seasons = ['2024/25', '2025/26', '2026/27', '2027/28'];
    this.inGameDate = '2026-07-23';
    
    // Active Manager & Club Profile
    this.managerName = 'John Connor';
    this.clubName = 'Manchester United';
    this.leagueName = 'Premier League';
    this.clubPosition = '1st in Premier League | Today';
    this.performance = 'Excellent';
    this.recentForm = ['W', 'W', 'L', 'W']; // 4 indicators

    // Record Counters (from reference image)
    this.record = {
      wins: 17,
      draws: 1,
      losses: 1,
      goalsFor: 58,
      goalsAgainst: 12,
      points: 52
    };

    // Results (from reference image)
    this.results = [
      { id: 1, gameweek: 19, date: '23/07/2026', home: 'Man Utd', homeScore: 2, awayScore: 0, away: 'Arsenal', competition: 'Premier League', status: 'FT' },
      { id: 2, gameweek: 18, date: '19/07/2026', home: 'Brighton', homeScore: 0, awayScore: 5, away: 'Man Utd', competition: 'Premier League', status: 'FT' },
      { id: 3, gameweek: 17, date: '12/07/2026', home: 'Man Utd', homeScore: 3, awayScore: 1, away: 'Chelsea', competition: 'Premier League', status: 'FT' },
      { id: 4, gameweek: 16, date: '05/07/2026', home: 'Liverpool', homeScore: 2, awayScore: 1, away: 'Man Utd', competition: 'Premier League', status: 'FT' }
    ];

    // Mini Table / Standings (from reference image)
    this.standings = [
      { pos: 1, team: 'Manchester United', pld: 19, won: 17, drawn: 1, lost: 1, gf: 58, ga: 12, gd: 46, pts: 52, isUser: true },
      { pos: 2, team: 'Bolton Wanderers', pld: 19, won: 14, drawn: 3, lost: 2, gf: 41, ga: 18, gd: 23, pts: 45, isUser: false },
      { pos: 3, team: 'Fulham', pld: 19, won: 12, drawn: 3, lost: 4, gf: 38, ga: 22, gd: 16, pts: 39, isUser: false },
      { pos: 4, team: 'Blackburn Rovers', pld: 19, won: 9, drawn: 3, lost: 7, gf: 30, ga: 28, gd: 2, pts: 30, isUser: false },
      { pos: 5, team: 'Arsenal', pld: 19, won: 4, drawn: 3, lost: 12, gf: 19, ga: 35, gd: -16, pts: 15, isUser: false },
      { pos: 6, team: 'Manchester City', pld: 19, won: 11, drawn: 4, lost: 4, gf: 40, ga: 20, gd: 20, pts: 37, isUser: false },
      { pos: 7, team: 'Chelsea', pld: 19, won: 10, drawn: 5, lost: 4, gf: 36, ga: 21, gd: 15, pts: 35, isUser: false },
      { pos: 8, team: 'Liverpool', pld: 19, won: 10, drawn: 3, lost: 6, gf: 35, ga: 24, gd: 11, pts: 33, isUser: false },
      { pos: 9, team: 'Tottenham Hotspur', pld: 19, won: 9, drawn: 4, lost: 6, gf: 32, ga: 26, gd: 6, pts: 31, isUser: false },
      { pos: 10, team: 'Newcastle United', pld: 19, won: 8, drawn: 5, lost: 6, gf: 29, ga: 25, gd: 4, pts: 29, isUser: false }
    ];

    // Best Players (from reference image)
    this.bestPlayers = [
      { id: 1, name: 'Bruno Fernandes', rating: 9.0, pos: 'AMC', apps: 19, goals: 14, assists: 12 },
      { id: 2, name: 'Aaron Lemmens', rating: 8.7, pos: 'ST', apps: 18, goals: 18, assists: 5 },
      { id: 3, name: 'Youri Tielemans', rating: 8.5, pos: 'MC', apps: 19, goals: 7, assists: 9 }
    ];

    // Squad List
    this.squad = [
      { id: 1, name: 'Diogo Costa', pos: 'GK', age: 26, nat: 'POR', val: '€65M', wage: '€160k/w', con: '2029', mor: 'Superb', fit: 98, rat: 7.8 },
      { id: 2, name: 'Lisandro Martínez', pos: 'DC', age: 28, nat: 'ARG', val: '€75M', wage: '€190k/w', con: '2028', mor: 'Superb', fit: 96, rat: 7.9 },
      { id: 3, name: 'Leny Yoro', pos: 'DC', age: 20, nat: 'FRA', val: '€85M', wage: '€140k/w', con: '2030', mor: 'Superb', fit: 100, rat: 8.1 },
      { id: 4, name: 'Alphonso Davies', pos: 'DL', age: 25, nat: 'CAN', val: '€90M', wage: '€220k/w', con: '2029', mor: 'Superb', fit: 94, rat: 8.2 },
      { id: 5, name: 'Jeremie Frimpong', pos: 'DR', age: 25, nat: 'NED', val: '€80M', wage: '€175k/w', con: '2028', mor: 'Superb', fit: 97, rat: 8.0 },
      { id: 6, name: 'Kobbie Mainoo', pos: 'MC', age: 21, nat: 'ENG', val: '€95M', wage: '€150k/w', con: '2030', mor: 'Superb', fit: 99, rat: 8.4 },
      { id: 7, name: 'Youri Tielemans', pos: 'MC', age: 29, nat: 'BEL', val: '€55M', wage: '€180k/w', con: '2028', mor: 'Superb', fit: 95, rat: 8.5 },
      { id: 8, name: 'Bruno Fernandes', pos: 'AMC', age: 31, nat: 'POR', val: '€60M', wage: '€280k/w', con: '2027', mor: 'Superb', fit: 98, rat: 9.0 },
      { id: 9, name: 'Alejandro Garnacho', pos: 'AML', age: 22, nat: 'ARG', val: '€105M', wage: '€160k/w', con: '2030', mor: 'Superb', fit: 97, rat: 8.3 },
      { id: 10, name: 'Michael Olise', pos: 'AMR', age: 24, nat: 'FRA', val: '€90M', wage: '€190k/w', con: '2029', mor: 'Superb', fit: 96, rat: 8.2 },
      { id: 11, name: 'Aaron Lemmens', pos: 'ST', age: 23, nat: 'BEL', val: '€110M', wage: '€210k/w', con: '2031', mor: 'Superb', fit: 99, rat: 8.7 },
      { id: 12, name: 'Rasmus Højlund', pos: 'ST', age: 23, nat: 'DEN', val: '€80M', wage: '€150k/w', con: '2029', mor: 'Good', fit: 92, rat: 7.9 },
      { id: 13, name: 'Manuel Ugarte', pos: 'DM', age: 25, nat: 'URU', val: '€55M', wage: '€140k/w', con: '2028', mor: 'Good', fit: 95, rat: 7.7 }
    ];

    // Tactical Formation
    this.tactics = {
      formation: '4-2-3-1 Gegenpress',
      mentality: 'Positive',
      tempo: 'Higher',
      width: 'Fairly Wide',
      lineup: [
        { role: 'SK (Su)', name: 'Diogo Costa', num: 1 },
        { role: 'WB (At)', name: 'J. Frimpong', num: 2 },
        { role: 'BPD (De)', name: 'Leny Yoro', num: 15 },
        { role: 'BPD (De)', name: 'L. Martínez', num: 6 },
        { role: 'CWB (At)', name: 'A. Davies', num: 19 },
        { role: 'DLP (Su)', name: 'K. Mainoo', num: 37 },
        { role: 'B2B (Su)', name: 'Y. Tielemans', num: 8 },
        { role: 'IF (At)', name: 'M. Olise', num: 7 },
        { role: 'AP (Su)', name: 'B. Fernandes', num: 10 },
        { role: 'IW (At)', name: 'A. Garnacho', num: 17 },
        { role: 'AF (At)', name: 'A. Lemmens', num: 9 }
      ]
    };

    // Transfers
    this.transfers = [
      { id: 1, type: 'IN', player: 'Aaron Lemmens', club: 'Club Brugge', fee: '€68M', date: '01/07/2026', wage: '€210k/w' },
      { id: 2, type: 'IN', player: 'Alphonso Davies', club: 'Bayern Munich', fee: '€55M', date: '08/07/2026', wage: '€220k/w' },
      { id: 3, type: 'OUT', player: 'Casemiro', club: 'Al-Hilal', fee: '€24M', date: '15/07/2026', wage: '€350k/w' },
      { id: 4, type: 'OUT', player: 'Harry Maguire', club: 'West Ham', fee: '€18M', date: '10/07/2026', wage: '€190k/w' }
    ];

    // Injuries
    this.injuries = [
      { id: 1, player: 'Luke Shaw', injury: 'Hamstring Strain', duration: '2 weeks', returnDate: '06/08/2026', progress: 65 },
      { id: 2, player: 'Mason Mount', injury: 'Twisted Ankle', duration: '5 days', returnDate: '28/07/2026', progress: 85 }
    ];

    // Shortlist
    this.shortlist = [
      { id: 1, name: 'Florian Wirtz', club: 'Bayer Leverkusen', pos: 'AMC', age: 23, val: '€130M', stars: 5, scout: 'World Class Playmaker' },
      { id: 2, name: 'Warren Zaïre-Emery', club: 'PSG', pos: 'MC', age: 20, val: '€95M', stars: 4.5, scout: 'Future Ballon d\'Or candidate' },
      { id: 3, name: 'Antonio Silva', club: 'Benfica', pos: 'DC', age: 22, val: '€65M', stars: 4.5, scout: 'Dominant aerial centre-back' }
    ];

    this.listeners = [];
    this.loadPersistedData();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
    this.persist();
  }

  setPage(page) {
    this.currentPage = page;
    this.notify();
  }

  setSeason(season) {
    this.currentSeason = season;
    this.notify();
  }

  addSeason(seasonName) {
    if (seasonName && !this.seasons.includes(seasonName)) {
      this.seasons.push(seasonName);
      this.currentSeason = seasonName;
      this.notify();
    }
  }

  updateRecord(w, d, l) {
    this.record.wins = Number(w);
    this.record.draws = Number(d);
    this.record.losses = Number(l);
    this.record.points = (this.record.wins * 3) + (this.record.draws * 1);
    this.notify();
  }

  addMatchResult(match) {
    this.results.unshift({
      id: Date.now(),
      ...match
    });
    // Auto update record
    if (match.home === 'Man Utd' || match.away === 'Man Utd') {
      const isHome = match.home === 'Man Utd';
      const myScore = isHome ? match.homeScore : match.awayScore;
      const oppScore = isHome ? match.awayScore : match.homeScore;
      
      if (myScore > oppScore) {
        this.record.wins++;
        this.recentForm.unshift('W');
      } else if (myScore === oppScore) {
        this.record.draws++;
        this.recentForm.unshift('D');
      } else {
        this.record.losses++;
        this.recentForm.unshift('L');
      }
      this.recentForm = this.recentForm.slice(0, 4);
    }
    this.notify();
  }

  selectPlayer(id) {
    this.selectedPlayerId = id;
    this.notify();
  }

  clearSelectedPlayer() {
    this.selectedPlayerId = null;
    this.notify();
  }

  addPlayer(player) {
    this.squad.push({
      id: Date.now(),
      ...player
    });
    this.notify();
  }

  updatePlayer(id, updatedFields) {
    const index = this.squad.findIndex(p => p.id === id);
    if (index !== -1) {
      this.squad[index] = {
        ...this.squad[index],
        ...updatedFields
      };
      this.notify();
    }
  }

  removePlayer(id) {
    if (this.selectedPlayerId === id) {
      this.selectedPlayerId = null;
    }
    this.squad = this.squad.filter(p => p.id !== id);
    this.notify();
  }

  addTransfer(transfer) {
    this.transfers.unshift({
      id: Date.now(),
      ...transfer
    });
    this.notify();
  }

  addShortlist(item) {
    this.shortlist.push({
      id: Date.now(),
      ...item
    });
    this.notify();
  }

  async persist() {
    const dataToSave = {
      currentSeason: this.currentSeason,
      seasons: this.seasons,
      inGameDate: this.inGameDate,
      managerName: this.managerName,
      clubName: this.clubName,
      performance: this.performance,
      record: this.record,
      results: this.results,
      standings: this.standings,
      bestPlayers: this.bestPlayers,
      squad: this.squad,
      tactics: this.tactics,
      transfers: this.transfers,
      injuries: this.injuries,
      shortlist: this.shortlist
    };
    await firebaseService.saveVaultToCloud(dataToSave);
  }

  async loadPersistedData() {
    const data = await firebaseService.loadVaultFromCloud();
    if (data) {
      if (data.currentSeason) this.currentSeason = data.currentSeason;
      if (data.seasons) this.seasons = data.seasons;
      if (data.managerName) this.managerName = data.managerName;
      if (data.record) this.record = data.record;
      if (data.results) this.results = data.results;
      if (data.standings) this.standings = data.standings;
      if (data.bestPlayers) this.bestPlayers = data.bestPlayers;
      if (data.squad) this.squad = data.squad;
      if (data.tactics) this.tactics = data.tactics;
      if (data.transfers) this.transfers = data.transfers;
      if (data.injuries) this.injuries = data.injuries;
      if (data.shortlist) this.shortlist = data.shortlist;
      this.notify();
    }
  }
}

export const store = new StateStore();
