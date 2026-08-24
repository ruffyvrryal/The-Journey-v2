// Reactive State Store with Multi-Season Data Isolation for The Journey FM Vault
import { firebaseService } from './firebase-config.js';

// Default initial datasets for each season
function createInitialSeasonData() {
  return {
    '2024/25': {
      inGameDate: '2025-05-28',
      performance: 'Good',
      recentForm: ['W', 'D', 'W', 'W'],
      clubPosition: '3rd in Premier League | Season End',
      record: { wins: 23, draws: 6, losses: 9, goalsFor: 72, goalsAgainst: 38, points: 75 },
      results: [
        { id: 101, gameweek: 38, date: '25/05/2025', home: 'Man Utd', homeScore: 2, awayScore: 0, away: 'Brighton', competition: 'Premier League', status: 'FT' },
        { id: 102, gameweek: 37, date: '18/05/2025', home: 'Arsenal', homeScore: 1, awayScore: 1, away: 'Man Utd', competition: 'Premier League', status: 'FT' },
        { id: 103, gameweek: 36, date: '11/05/2025', home: 'Man Utd', homeScore: 3, awayScore: 2, away: 'Chelsea', competition: 'Premier League', status: 'FT' },
        { id: 104, gameweek: 35, date: '04/05/2025', home: 'Liverpool', homeScore: 1, awayScore: 2, away: 'Man Utd', competition: 'Premier League', status: 'FT' }
      ],
      standings: [
        { pos: 1, team: 'Manchester City', pld: 38, won: 28, drawn: 4, lost: 6, gf: 94, ga: 34, gd: 60, pts: 88, isUser: false },
        { pos: 2, team: 'Arsenal', pld: 38, won: 26, drawn: 6, lost: 6, gf: 88, ga: 29, gd: 59, pts: 84, isUser: false },
        { pos: 3, team: 'Manchester United', pld: 38, won: 23, drawn: 6, lost: 9, gf: 72, ga: 38, gd: 34, pts: 75, isUser: true },
        { pos: 4, team: 'Liverpool', pld: 38, won: 22, drawn: 7, lost: 9, gf: 78, ga: 41, gd: 37, pts: 73, isUser: false },
        { pos: 5, team: 'Aston Villa', pld: 38, won: 20, drawn: 8, lost: 10, gf: 66, ga: 48, gd: 18, pts: 68, isUser: false },
        { pos: 6, team: 'Chelsea', pld: 38, won: 19, drawn: 8, lost: 11, gf: 68, ga: 52, gd: 16, pts: 65, isUser: false },
        { pos: 7, team: 'Newcastle United', pld: 38, won: 18, drawn: 6, lost: 14, gf: 64, ga: 50, gd: 14, pts: 60, isUser: false },
        { pos: 8, team: 'Tottenham Hotspur', pld: 38, won: 17, drawn: 7, lost: 14, gf: 62, ga: 55, gd: 7, pts: 58, isUser: false },
        { pos: 9, team: 'West Ham', pld: 38, won: 15, drawn: 7, lost: 16, gf: 54, ga: 58, gd: -4, pts: 52, isUser: false },
        { pos: 10, team: 'Brighton', pld: 38, won: 13, drawn: 9, lost: 16, gf: 50, ga: 56, gd: -6, pts: 48, isUser: false }
      ],
      bestPlayers: [
        { id: 8, name: 'Bruno Fernandes', rating: 8.4, pos: 'AMC', apps: 36, goals: 15, assists: 14 },
        { id: 6, name: 'Kobbie Mainoo', rating: 8.1, pos: 'MC', apps: 34, goals: 6, assists: 7 },
        { id: 9, name: 'Alejandro Garnacho', rating: 8.0, pos: 'AML', apps: 35, goals: 12, assists: 9 }
      ],
      squad: [
        { id: 101, num: 24, name: 'André Onana', pos: 'GK', age: 29, nat: 'CMR', val: '€45M', wage: '€140k/w', con: '2028', mor: 'Good', fit: 97, rat: 7.4, apps: 36, goals: 0, assists: 0, cleanSheets: 12 },
        { id: 2, num: 6, name: 'Lisandro Martínez', pos: 'DC', age: 27, nat: 'ARG', val: '€70M', wage: '€180k/w', con: '2027', mor: 'Superb', fit: 95, rat: 7.7, apps: 32, goals: 2, assists: 1, cleanSheets: 10 },
        { id: 3, num: 15, name: 'Leny Yoro', pos: 'DC', age: 19, nat: 'FRA', val: '€65M', wage: '€110k/w', con: '2029', mor: 'Superb', fit: 98, rat: 7.6, apps: 28, goals: 1, assists: 0, cleanSheets: 9 },
        { id: 104, num: 23, name: 'Luke Shaw', pos: 'DL', age: 29, nat: 'ENG', val: '€35M', wage: '€160k/w', con: '2027', mor: 'Good', fit: 90, rat: 7.5, apps: 24, goals: 0, assists: 5, cleanSheets: 7 },
        { id: 105, num: 20, name: 'Diogo Dalot', pos: 'DR', age: 26, nat: 'POR', val: '€45M', wage: '€120k/w', con: '2028', mor: 'Good', fit: 96, rat: 7.6, apps: 35, goals: 2, assists: 6, cleanSheets: 11 },
        { id: 6, num: 37, name: 'Kobbie Mainoo', pos: 'MC', age: 20, nat: 'ENG', val: '€75M', wage: '€90k/w', con: '2029', mor: 'Superb', fit: 99, rat: 8.1, apps: 34, goals: 6, assists: 7, cleanSheets: 10 },
        { id: 13, num: 25, name: 'Manuel Ugarte', pos: 'DM', age: 24, nat: 'URU', val: '€50M', wage: '€130k/w', con: '2029', mor: 'Good', fit: 94, rat: 7.5, apps: 30, goals: 1, assists: 2, cleanSheets: 8 },
        { id: 8, num: 8, name: 'Bruno Fernandes', pos: 'AMC', age: 30, nat: 'POR', val: '€65M', wage: '€260k/w', con: '2026', mor: 'Superb', fit: 98, rat: 8.4, apps: 36, goals: 15, assists: 14, cleanSheets: 12 },
        { id: 9, num: 17, name: 'Alejandro Garnacho', pos: 'AML', age: 21, nat: 'ARG', val: '€80M', wage: '€100k/w', con: '2028', mor: 'Superb', fit: 97, rat: 8.0, apps: 35, goals: 12, assists: 9, cleanSheets: 11 },
        { id: 106, num: 10, name: 'Marcus Rashford', pos: 'AMR', age: 27, nat: 'ENG', val: '€70M', wage: '€300k/w', con: '2028', mor: 'Good', fit: 95, rat: 7.9, apps: 33, goals: 14, assists: 8, cleanSheets: 9 },
        { id: 12, num: 9, name: 'Rasmus Højlund', pos: 'ST', age: 22, nat: 'DEN', val: '€70M', wage: '€130k/w', con: '2028', mor: 'Good', fit: 94, rat: 7.7, apps: 31, goals: 16, assists: 4, cleanSheets: 9 },
        { id: 107, num: 11, name: 'Joshua Zirkzee', pos: 'ST', age: 24, nat: 'NED', val: '€45M', wage: '€110k/w', con: '2029', mor: 'Good', fit: 93, rat: 7.4, apps: 26, goals: 8, assists: 5, cleanSheets: 6 }
      ],
      tactics: {
        formation: '4-2-3-1 Transition',
        mentality: 'Positive',
        tempo: 'Standard',
        width: 'Fairly Wide',
        lineup: []
      },
      transfers: [
        { id: 201, type: 'IN', player: 'Leny Yoro', club: 'Lille', fee: '€62M', date: '18/07/2024', wage: '€110k/w' },
        { id: 202, type: 'IN', player: 'Joshua Zirkzee', club: 'Bologna', fee: '€42.5M', date: '14/07/2024', wage: '€110k/w' },
        { id: 203, type: 'IN', player: 'Manuel Ugarte', club: 'PSG', fee: '€50M', date: '30/08/2024', wage: '€130k/w' },
        { id: 204, type: 'OUT', player: 'Scott McTominay', club: 'Napoli', fee: '€30.5M', date: '30/08/2024', wage: '€80k/w' },
        { id: 205, type: 'OUT', player: 'Mason Greenwood', club: 'Marseille', fee: '€26M', date: '18/07/2024', wage: '€100k/w' }
      ],
      injuries: [
        { id: 201, player: 'Tyrell Malacia', injury: 'Knee Cartilage', duration: '3 weeks', returnDate: '15/06/2025', progress: 80 }
      ],
      shortlist: [
        { id: 201, name: 'Alphonso Davies', club: 'Bayern Munich', pos: 'DL', age: 24, val: '€75M', stars: 5, scout: 'Elite speed wing-back' },
        { id: 202, name: 'Michael Olise', club: 'Bayern Munich', pos: 'AMR', age: 23, val: '€70M', stars: 4.5, scout: 'Creative French winger' }
      ]
    },

    '2025/26': {
      inGameDate: '2026-05-24',
      performance: 'Superb',
      recentForm: ['W', 'W', 'W', 'D'],
      clubPosition: '2nd in Premier League | Title Contender',
      record: { wins: 27, draws: 5, losses: 6, goalsFor: 84, goalsAgainst: 28, points: 86 },
      results: [
        { id: 301, gameweek: 38, date: '24/05/2026', home: 'Man Utd', homeScore: 4, awayScore: 0, away: 'Everton', competition: 'Premier League', status: 'FT' },
        { id: 302, gameweek: 37, date: '17/05/2026', home: 'Man City', homeScore: 1, awayScore: 2, away: 'Man Utd', competition: 'Premier League', status: 'FT' },
        { id: 303, gameweek: 36, date: '10/05/2026', home: 'Man Utd', homeScore: 3, awayScore: 1, away: 'Tottenham', competition: 'Premier League', status: 'FT' },
        { id: 304, gameweek: 35, date: '03/05/2026', home: 'Newcastle', homeScore: 2, awayScore: 2, away: 'Man Utd', competition: 'Premier League', status: 'FT' }
      ],
      standings: [
        { pos: 1, team: 'Arsenal', pld: 38, won: 28, drawn: 5, lost: 5, gf: 90, ga: 26, gd: 64, pts: 89, isUser: false },
        { pos: 2, team: 'Manchester United', pld: 38, won: 27, drawn: 5, lost: 6, gf: 84, ga: 28, gd: 56, pts: 86, isUser: true },
        { pos: 3, team: 'Manchester City', pld: 38, won: 25, drawn: 7, lost: 6, gf: 86, ga: 32, gd: 54, pts: 82, isUser: false },
        { pos: 4, team: 'Chelsea', pld: 38, won: 22, drawn: 8, lost: 8, gf: 74, ga: 40, gd: 34, pts: 74, isUser: false },
        { pos: 5, team: 'Tottenham Hotspur', pld: 38, won: 21, drawn: 6, lost: 11, gf: 70, ga: 46, gd: 24, pts: 69, isUser: false },
        { pos: 6, team: 'Liverpool', pld: 38, won: 20, drawn: 8, lost: 10, gf: 72, ga: 44, gd: 28, pts: 68, isUser: false },
        { pos: 7, team: 'Aston Villa', pld: 38, won: 18, drawn: 9, lost: 11, gf: 60, ga: 47, gd: 13, pts: 63, isUser: false },
        { pos: 8, team: 'Newcastle United', pld: 38, won: 18, drawn: 7, lost: 13, gf: 62, ga: 52, gd: 10, pts: 61, isUser: false },
        { pos: 9, team: 'Brighton', pld: 38, won: 15, drawn: 9, lost: 14, gf: 56, ga: 55, gd: 1, pts: 54, isUser: false },
        { pos: 10, team: 'West Ham', pld: 38, won: 14, drawn: 7, lost: 17, gf: 50, ga: 60, gd: -10, pts: 49, isUser: false }
      ],
      bestPlayers: [
        { id: 8, name: 'Bruno Fernandes', rating: 8.8, pos: 'AMC', apps: 37, goals: 18, assists: 16 },
        { id: 10, name: 'Michael Olise', rating: 8.5, pos: 'AMR', apps: 36, goals: 14, assists: 13 },
        { id: 4, name: 'Alphonso Davies', rating: 8.4, pos: 'DL', apps: 35, goals: 4, assists: 11 }
      ],
      squad: [
        { id: 1, num: 1, name: 'Diogo Costa', pos: 'GK', age: 25, nat: 'POR', val: '€60M', wage: '€150k/w', con: '2029', mor: 'Superb', fit: 98, rat: 7.7, apps: 37, goals: 0, assists: 0, cleanSheets: 18 },
        { id: 2, num: 6, name: 'Lisandro Martínez', pos: 'DC', age: 28, nat: 'ARG', val: '€75M', wage: '€190k/w', con: '2028', mor: 'Superb', fit: 96, rat: 7.9, apps: 36, goals: 3, assists: 2, cleanSheets: 17 },
        { id: 3, num: 15, name: 'Leny Yoro', pos: 'DC', age: 20, nat: 'FRA', val: '€80M', wage: '€130k/w', con: '2030', mor: 'Superb', fit: 99, rat: 7.9, apps: 34, goals: 2, assists: 1, cleanSheets: 16 },
        { id: 4, num: 19, name: 'Alphonso Davies', pos: 'DL', age: 25, nat: 'CAN', val: '€85M', wage: '€210k/w', con: '2029', mor: 'Superb', fit: 97, rat: 8.4, apps: 35, goals: 4, assists: 11, cleanSheets: 17 },
        { id: 5, num: 2, name: 'Jeremie Frimpong', pos: 'DR', age: 25, nat: 'NED', val: '€75M', wage: '€170k/w', con: '2028', mor: 'Superb', fit: 96, rat: 8.0, apps: 34, goals: 5, assists: 9, cleanSheets: 15 },
        { id: 6, num: 37, name: 'Kobbie Mainoo', pos: 'MC', age: 21, nat: 'ENG', val: '€90M', wage: '€140k/w', con: '2030', mor: 'Superb', fit: 99, rat: 8.3, apps: 37, goals: 8, assists: 10, cleanSheets: 18 },
        { id: 7, num: 8, name: 'Youri Tielemans', pos: 'MC', age: 29, nat: 'BEL', val: '€50M', wage: '€170k/w', con: '2028', mor: 'Superb', fit: 95, rat: 8.2, apps: 33, goals: 6, assists: 8, cleanSheets: 14 },
        { id: 8, num: 10, name: 'Bruno Fernandes', pos: 'AMC', age: 31, nat: 'POR', val: '€60M', wage: '€280k/w', con: '2027', mor: 'Superb', fit: 98, rat: 8.8, apps: 37, goals: 18, assists: 16, cleanSheets: 18 },
        { id: 9, num: 17, name: 'Alejandro Garnacho', pos: 'AML', age: 21, nat: 'ARG', val: '€95M', wage: '€140k/w', con: '2030', mor: 'Superb', fit: 98, rat: 8.2, apps: 36, goals: 15, assists: 11, cleanSheets: 17 },
        { id: 10, num: 7, name: 'Michael Olise', pos: 'AMR', age: 24, nat: 'FRA', val: '€85M', wage: '€180k/w', con: '2029', mor: 'Superb', fit: 97, rat: 8.5, apps: 36, goals: 14, assists: 13, cleanSheets: 18 },
        { id: 12, num: 11, name: 'Rasmus Højlund', pos: 'ST', age: 23, nat: 'DEN', val: '€78M', wage: '€150k/w', con: '2029', mor: 'Good', fit: 94, rat: 7.9, apps: 35, goals: 19, assists: 5, cleanSheets: 16 },
        { id: 13, num: 25, name: 'Manuel Ugarte', pos: 'DM', age: 25, nat: 'URU', val: '€52M', wage: '€140k/w', con: '2028', mor: 'Good', fit: 95, rat: 7.6, apps: 30, goals: 1, assists: 3, cleanSheets: 14 }
      ],
      tactics: {
        formation: '4-2-3-1 Gegenpress High Tempo',
        mentality: 'Attacking',
        tempo: 'Higher',
        width: 'Fairly Wide',
        lineup: []
      },
      transfers: [
        { id: 301, type: 'IN', player: 'Diogo Costa', club: 'Porto', fee: '€65M', date: '01/07/2025', wage: '€150k/w' },
        { id: 302, type: 'IN', player: 'Michael Olise', club: 'Bayern Munich', fee: '€70M', date: '05/07/2025', wage: '€180k/w' },
        { id: 303, type: 'IN', player: 'Youri Tielemans', club: 'Aston Villa', fee: '€40M', date: '12/07/2025', wage: '€170k/w' },
        { id: 304, type: 'OUT', player: 'André Onana', club: 'Al-Nassr', fee: '€48M', date: '15/07/2025', wage: '€250k/w' },
        { id: 305, type: 'OUT', player: 'Casemiro', club: 'Al-Hilal', fee: '€24M', date: '20/07/2025', wage: '€350k/w' }
      ],
      injuries: [
        { id: 301, player: 'Mason Mount', injury: 'Calf Strain', duration: '1 week', returnDate: '01/06/2026', progress: 90 }
      ],
      shortlist: [
        { id: 301, name: 'Aaron Lemmens', club: 'Club Brugge', pos: 'ST', age: 22, val: '€65M', stars: 5, scout: 'Prolific Belgian wonderkid striker' },
        { id: 302, name: 'Florian Wirtz', club: 'Bayer Leverkusen', pos: 'AMC', age: 23, val: '€125M', stars: 5, scout: 'World-class creative midfielder' }
      ]
    },

    '2026/27': {
      inGameDate: '2026-07-23',
      performance: 'Excellent',
      recentForm: ['W', 'W', 'L', 'W'],
      clubPosition: '1st in Premier League | Today',
      record: { wins: 17, draws: 1, losses: 1, goalsFor: 58, goalsAgainst: 12, points: 52 },
      results: [
        { id: 1, gameweek: 19, date: '23/07/2026', home: 'Man Utd', homeScore: 2, awayScore: 0, away: 'Arsenal', competition: 'Premier League', status: 'FT' },
        { id: 2, gameweek: 18, date: '19/07/2026', home: 'Brighton', homeScore: 0, awayScore: 5, away: 'Man Utd', competition: 'Premier League', status: 'FT' },
        { id: 3, gameweek: 17, date: '12/07/2026', home: 'Man Utd', homeScore: 3, awayScore: 1, away: 'Chelsea', competition: 'Premier League', status: 'FT' },
        { id: 4, gameweek: 16, date: '05/07/2026', home: 'Liverpool', homeScore: 2, awayScore: 1, away: 'Man Utd', competition: 'Premier League', status: 'FT' }
      ],
      standings: [
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
      ],
      bestPlayers: [
        { id: 8, name: 'Bruno Fernandes', rating: 9.0, pos: 'AMC', apps: 19, goals: 14, assists: 12 },
        { id: 11, name: 'Aaron Lemmens', rating: 8.7, pos: 'ST', apps: 18, goals: 18, assists: 5 },
        { id: 7, name: 'Youri Tielemans', rating: 8.5, pos: 'MC', apps: 19, goals: 7, assists: 9 }
      ],
      squad: [
        { id: 1, num: 1, name: 'Diogo Costa', pos: 'GK', age: 26, nat: 'POR', val: '€65M', wage: '€160k/w', con: '2029', mor: 'Superb', fit: 98, rat: 7.8, apps: 19, goals: 0, assists: 0, cleanSheets: 11 },
        { id: 2, num: 6, name: 'Lisandro Martínez', pos: 'DC', age: 28, nat: 'ARG', val: '€75M', wage: '€190k/w', con: '2028', mor: 'Superb', fit: 96, rat: 7.9, apps: 19, goals: 2, assists: 1, cleanSheets: 11 },
        { id: 3, num: 15, name: 'Leny Yoro', pos: 'DC', age: 20, nat: 'FRA', val: '€85M', wage: '€140k/w', con: '2030', mor: 'Superb', fit: 100, rat: 8.1, apps: 19, goals: 1, assists: 1, cleanSheets: 11 },
        { id: 4, num: 19, name: 'Alphonso Davies', pos: 'DL', age: 25, nat: 'CAN', val: '€90M', wage: '€220k/w', con: '2029', mor: 'Superb', fit: 94, rat: 8.2, apps: 18, goals: 2, assists: 8, cleanSheets: 10 },
        { id: 5, num: 2, name: 'Jeremie Frimpong', pos: 'DR', age: 25, nat: 'NED', val: '€80M', wage: '€175k/w', con: '2028', mor: 'Superb', fit: 97, rat: 8.0, apps: 19, goals: 3, assists: 7, cleanSheets: 11 },
        { id: 6, num: 37, name: 'Kobbie Mainoo', pos: 'MC', age: 21, nat: 'ENG', val: '€95M', wage: '€150k/w', con: '2030', mor: 'Superb', fit: 99, rat: 8.4, apps: 19, goals: 5, assists: 8, cleanSheets: 11 },
        { id: 7, num: 8, name: 'Youri Tielemans', pos: 'MC', age: 29, nat: 'BEL', val: '€55M', wage: '€180k/w', con: '2028', mor: 'Superb', fit: 95, rat: 8.5, apps: 19, goals: 7, assists: 9, cleanSheets: 11 },
        { id: 8, num: 10, name: 'Bruno Fernandes', pos: 'AMC', age: 31, nat: 'POR', val: '€60M', wage: '€280k/w', con: '2027', mor: 'Superb', fit: 98, rat: 9.0, apps: 19, goals: 14, assists: 12, cleanSheets: 11 },
        { id: 9, num: 17, name: 'Alejandro Garnacho', pos: 'AML', age: 22, nat: 'ARG', val: '€105M', wage: '€160k/w', con: '2030', mor: 'Superb', fit: 97, rat: 8.3, apps: 18, goals: 10, assists: 9, cleanSheets: 10 },
        { id: 10, num: 7, name: 'Michael Olise', pos: 'AMR', age: 24, nat: 'FRA', val: '€90M', wage: '€190k/w', con: '2029', mor: 'Superb', fit: 96, rat: 8.2, apps: 19, goals: 9, assists: 11, cleanSheets: 11 },
        { id: 11, num: 9, name: 'Aaron Lemmens', pos: 'ST', age: 23, nat: 'BEL', val: '€110M', wage: '€210k/w', con: '2031', mor: 'Superb', fit: 99, rat: 8.7, apps: 18, goals: 18, assists: 5, cleanSheets: 10 },
        { id: 12, num: 11, name: 'Rasmus Højlund', pos: 'ST', age: 23, nat: 'DEN', val: '€80M', wage: '€150k/w', con: '2029', mor: 'Good', fit: 92, rat: 7.9, apps: 14, goals: 7, assists: 2, cleanSheets: 8 },
        { id: 13, num: 25, name: 'Manuel Ugarte', pos: 'DM', age: 25, nat: 'URU', val: '€55M', wage: '€140k/w', con: '2028', mor: 'Good', fit: 95, rat: 7.7, apps: 16, goals: 1, assists: 1, cleanSheets: 9 }
      ],
      tactics: {
        formation: '4-2-3-1 Gegenpress',
        mentality: 'Positive',
        tempo: 'Higher',
        width: 'Fairly Wide',
        lineup: []
      },
      transfers: [
        { id: 1, type: 'IN', player: 'Aaron Lemmens', club: 'Club Brugge', fee: '€68M', date: '01/07/2026', wage: '€210k/w' },
        { id: 2, type: 'IN', player: 'Alphonso Davies', club: 'Bayern Munich', fee: '€55M', date: '08/07/2026', wage: '€220k/w' },
        { id: 3, type: 'OUT', player: 'Casemiro', club: 'Al-Hilal', fee: '€24M', date: '15/07/2026', wage: '€350k/w' },
        { id: 4, type: 'OUT', player: 'Harry Maguire', club: 'West Ham', fee: '€18M', date: '10/07/2026', wage: '€190k/w' }
      ],
      injuries: [
        { id: 1, player: 'Luke Shaw', injury: 'Hamstring Strain', duration: '2 weeks', returnDate: '06/08/2026', progress: 65 },
        { id: 2, player: 'Mason Mount', injury: 'Twisted Ankle', duration: '5 days', returnDate: '28/07/2026', progress: 85 }
      ],
      shortlist: [
        { id: 1, name: 'Florian Wirtz', club: 'Bayer Leverkusen', pos: 'AMC', age: 23, val: '€130M', stars: 5, scout: 'World Class Playmaker' },
        { id: 2, name: 'Warren Zaïre-Emery', club: 'PSG', pos: 'MC', age: 20, val: '€95M', stars: 4.5, scout: 'Future Ballon d\'Or candidate' },
        { id: 3, name: 'Antonio Silva', club: 'Benfica', pos: 'DC', age: 22, val: '€65M', stars: 4.5, scout: 'Dominant aerial centre-back' }
      ]
    },

    '2027/28': {
      inGameDate: '2027-08-15',
      performance: 'Superb',
      recentForm: ['W', 'W', 'W', 'W'],
      clubPosition: '1st in Premier League | Gameweek 2',
      record: { wins: 2, draws: 0, losses: 0, goalsFor: 7, goalsAgainst: 1, points: 6 },
      results: [
        { id: 401, gameweek: 2, date: '15/08/2027', home: 'Man Utd', homeScore: 3, awayScore: 0, away: 'West Ham', competition: 'Premier League', status: 'FT' },
        { id: 402, gameweek: 1, date: '08/08/2027', home: 'Aston Villa', homeScore: 1, awayScore: 4, away: 'Man Utd', competition: 'Premier League', status: 'FT' }
      ],
      standings: [
        { pos: 1, team: 'Manchester United', pld: 2, won: 2, drawn: 0, lost: 0, gf: 7, ga: 1, gd: 6, pts: 6, isUser: true },
        { pos: 2, team: 'Newcastle United', pld: 2, won: 2, drawn: 0, lost: 0, gf: 5, ga: 1, gd: 4, pts: 6, isUser: false },
        { pos: 3, team: 'Arsenal', pld: 2, won: 1, drawn: 1, lost: 0, gf: 4, ga: 2, gd: 2, pts: 4, isUser: false },
        { pos: 4, team: 'Manchester City', pld: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 1, gd: 2, pts: 4, isUser: false },
        { pos: 5, team: 'Liverpool', pld: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 2, gd: 1, pts: 4, isUser: false },
        { pos: 6, team: 'Chelsea', pld: 2, won: 1, drawn: 0, lost: 1, gf: 3, ga: 3, gd: 0, pts: 3, isUser: false },
        { pos: 7, team: 'Tottenham Hotspur', pld: 2, won: 1, drawn: 0, lost: 1, gf: 2, ga: 2, gd: 0, pts: 3, isUser: false },
        { pos: 8, team: 'Brighton', pld: 2, won: 1, drawn: 0, lost: 1, gf: 2, ga: 3, gd: -1, pts: 3, isUser: false },
        { pos: 9, team: 'Everton', pld: 2, won: 0, drawn: 1, lost: 1, gf: 1, ga: 3, gd: -2, pts: 1, isUser: false },
        { pos: 10, team: 'Aston Villa', pld: 2, won: 0, drawn: 0, lost: 2, gf: 2, ga: 6, gd: -4, pts: 0, isUser: false }
      ],
      bestPlayers: [
        { id: 11, name: 'Aaron Lemmens', rating: 9.2, pos: 'ST', apps: 2, goals: 4, assists: 1 },
        { id: 401, name: 'Florian Wirtz', rating: 8.9, pos: 'AMC', apps: 2, goals: 2, assists: 3 },
        { id: 6, name: 'Kobbie Mainoo', rating: 8.8, pos: 'MC', apps: 2, goals: 1, assists: 2 }
      ],
      squad: [
        { id: 1, num: 1, name: 'Diogo Costa', pos: 'GK', age: 27, nat: 'POR', val: '€70M', wage: '€180k/w', con: '2031', mor: 'Superb', fit: 100, rat: 8.2, apps: 2, goals: 0, assists: 0, cleanSheets: 1 },
        { id: 2, num: 6, name: 'Lisandro Martínez', pos: 'DC', age: 29, nat: 'ARG', val: '€70M', wage: '€200k/w', con: '2030', mor: 'Superb', fit: 98, rat: 8.1, apps: 2, goals: 0, assists: 0, cleanSheets: 1 },
        { id: 3, num: 15, name: 'Leny Yoro', pos: 'DC', age: 21, nat: 'FRA', val: '€95M', wage: '€160k/w', con: '2032', mor: 'Superb', fit: 100, rat: 8.4, apps: 2, goals: 0, assists: 0, cleanSheets: 1 },
        { id: 402, num: 3, name: 'Antonio Silva', pos: 'DC', age: 23, nat: 'POR', val: '€75M', wage: '€150k/w', con: '2032', mor: 'Superb', fit: 98, rat: 8.0, apps: 1, goals: 0, assists: 0, cleanSheets: 1 },
        { id: 4, num: 19, name: 'Alphonso Davies', pos: 'DL', age: 26, nat: 'CAN', val: '€95M', wage: '€240k/w', con: '2031', mor: 'Superb', fit: 99, rat: 8.5, apps: 2, goals: 0, assists: 2, cleanSheets: 1 },
        { id: 5, num: 2, name: 'Jeremie Frimpong', pos: 'DR', age: 26, nat: 'NED', val: '€85M', wage: '€190k/w', con: '2030', mor: 'Superb', fit: 98, rat: 8.3, apps: 2, goals: 1, assists: 1, cleanSheets: 1 },
        { id: 6, num: 37, name: 'Kobbie Mainoo', pos: 'MC', age: 22, nat: 'ENG', val: '€115M', wage: '€180k/w', con: '2032', mor: 'Superb', fit: 100, rat: 8.8, apps: 2, goals: 1, assists: 2, cleanSheets: 1 },
        { id: 7, num: 8, name: 'Youri Tielemans', pos: 'MC', age: 30, nat: 'BEL', val: '€45M', wage: '€180k/w', con: '2028', mor: 'Superb', fit: 96, rat: 8.2, apps: 2, goals: 0, assists: 1, cleanSheets: 1 },
        { id: 401, num: 10, name: 'Florian Wirtz', pos: 'AMC', age: 24, nat: 'GER', val: '€135M', wage: '€260k/w', con: '2032', mor: 'Superb', fit: 99, rat: 8.9, apps: 2, goals: 2, assists: 3, cleanSheets: 1 },
        { id: 9, num: 17, name: 'Alejandro Garnacho', pos: 'AML', age: 23, nat: 'ARG', val: '€120M', wage: '€190k/w', con: '2032', mor: 'Superb', fit: 98, rat: 8.6, apps: 2, goals: 1, assists: 1, cleanSheets: 1 },
        { id: 10, num: 7, name: 'Michael Olise', pos: 'AMR', age: 25, nat: 'FRA', val: '€95M', wage: '€200k/w', con: '2031', mor: 'Superb', fit: 97, rat: 8.4, apps: 2, goals: 1, assists: 2, cleanSheets: 1 },
        { id: 11, num: 9, name: 'Aaron Lemmens', pos: 'ST', age: 24, nat: 'BEL', val: '€130M', wage: '€240k/w', con: '2032', mor: 'Superb', fit: 100, rat: 9.2, apps: 2, goals: 4, assists: 1, cleanSheets: 1 }
      ],
      tactics: {
        formation: '4-2-3-1 Fluid Control',
        mentality: 'Positive',
        tempo: 'Higher',
        width: 'Wide',
        lineup: []
      },
      transfers: [
        { id: 401, type: 'IN', player: 'Florian Wirtz', club: 'Bayer Leverkusen', fee: '€125M', date: '01/07/2027', wage: '€260k/w' },
        { id: 402, type: 'IN', player: 'Antonio Silva', club: 'Benfica', fee: '€65M', date: '08/07/2027', wage: '€150k/w' },
        { id: 403, type: 'OUT', player: 'Bruno Fernandes', club: 'Al-Ittihad', fee: '€45M', date: '15/07/2027', wage: '€350k/w' }
      ],
      injuries: [],
      shortlist: [
        { id: 401, name: 'Endrick', club: 'Real Madrid', pos: 'ST', age: 21, val: '€140M', stars: 5, scout: 'World-class wonderkid striker' },
        { id: 402, name: 'Arda Güler', club: 'Real Madrid', pos: 'AMC', age: 22, val: '€95M', stars: 4.5, scout: 'Magical Turkish playmaker' }
      ]
    }
  };
}

class StateStore {
  constructor() {
    // Top-Level Application Mode: 'login' | 'manager_vault' | 'main_app'
    this.appMode = firebaseService.isLoggedIn() ? 'manager_vault' : 'login';
    this.currentPage = 'home';
    this.selectedPlayerId = null;
    this.currentSeason = '2026/27';
    this.seasons = ['2024/25', '2025/26', '2026/27', '2027/28'];
    
    // Active Manager & Club Profile
    this.managerName = 'John Connor';
    this.clubName = 'Manchester United';
    this.leagueName = 'Premier League';

    // Manager Career Vaults List (Matches Photo 2 Reference)
    this.activeVaultId = 'vault_connor';
    this.vaults = [
      {
        id: 'vault_connor',
        firstName: 'John',
        lastName: 'CONNOR',
        managerName: 'John Connor',
        clubName: 'Manchester United',
        season: '2026/27',
        winRate: '80%',
        drawRate: '15%',
        loseRate: '5%',
        avatarTheme: 'avatar-orange'
      },
      {
        id: 'vault_mccaully',
        firstName: 'Edward',
        lastName: 'McCAULLY',
        managerName: 'Edward McCaully',
        clubName: 'Wrexham',
        season: '2026/27',
        winRate: '80%',
        drawRate: '15%',
        loseRate: '5%',
        avatarTheme: 'avatar-blue'
      }
    ];

    // Multi-Season Isolated Datasets
    this.seasonData = createInitialSeasonData();
    this.reconcileSquadShirtNumbers();

    this.listeners = [];
    this._persistTimer = null;
    this.loadPersistedData();
  }

  setAppMode(mode) {
    this.appMode = mode;
    this.notify();
  }

  selectVault(vaultId) {
    const vault = this.vaults.find(v => v.id === vaultId) || this.vaults[0];
    if (vault) {
      this.activeVaultId = vault.id;
      this.managerName = vault.managerName || `${vault.firstName} ${vault.lastName}`;
      this.clubName = vault.clubName || 'Manchester United';
      if (vault.seasonData) {
        this.seasonData = vault.seasonData;
      }
      this.appMode = 'main_app';
      this.persist();
      this.notify();
    }
  }

  addVault(vaultData) {
    const newId = 'vault_' + Date.now();
    const newVault = {
      id: newId,
      firstName: vaultData.firstName || vaultData.managerName?.split(' ')[0] || 'Manager',
      lastName: vaultData.lastName || vaultData.managerName?.split(' ').slice(1).join(' ') || 'NEW',
      managerName: vaultData.managerName || `${vaultData.firstName || ''} ${vaultData.lastName || ''}`.trim(),
      clubName: vaultData.clubName || 'Manchester United',
      season: vaultData.season || this.currentSeason || '2026/27',
      winRate: vaultData.winRate || '80%',
      drawRate: vaultData.drawRate || '15%',
      loseRate: vaultData.loseRate || '5%',
      avatarTheme: vaultData.avatarTheme || (this.vaults.length % 2 === 0 ? 'avatar-orange' : 'avatar-blue'),
      seasonData: JSON.parse(JSON.stringify(createInitialSeasonData()))
    };
    this.vaults.push(newVault);
    this.persist();
    this.notify();
    return newVault;
  }

  updateVault(vaultId, updatedFields) {
    const index = this.vaults.findIndex(v => v.id === vaultId);
    if (index !== -1) {
      this.vaults[index] = {
        ...this.vaults[index],
        ...updatedFields
      };
      if (this.activeVaultId === vaultId) {
        if (updatedFields.managerName) this.managerName = updatedFields.managerName;
        if (updatedFields.clubName) this.clubName = updatedFields.clubName;
      }
      this.persist();
      this.notify();
    }
  }

  deleteVault(vaultId) {
    if (this.vaults.length <= 1) {
      alert('You must have at least one Manager Vault.');
      return;
    }
    this.vaults = this.vaults.filter(v => v.id !== vaultId);
    if (this.activeVaultId === vaultId) {
      this.activeVaultId = this.vaults[0].id;
      this.managerName = this.vaults[0].managerName;
      this.clubName = this.vaults[0].clubName;
    }
    this.persist();
    this.notify();
  }

  // Active Season Data Accessor (creates new season container if missing)
  getActiveSeasonData() {
    if (!this.seasonData[this.currentSeason]) {
      // Create new season container by cloning the latest available template
      const baseSeason = this.seasons[this.seasons.length - 2] || '2026/27';
      const base = this.seasonData[baseSeason] || createInitialSeasonData()['2026/27'];
      
      this.seasonData[this.currentSeason] = {
        inGameDate: `${this.currentSeason.split('/')[0]}-08-01`,
        performance: 'Good',
        recentForm: ['-', '-', '-', '-'],
        clubPosition: `1st in ${this.leagueName} | New Season`,
        record: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
        results: [],
        standings: JSON.parse(JSON.stringify(base.standings || [])),
        bestPlayers: [],
        squad: JSON.parse(JSON.stringify(base.squad || [])).map(p => ({
          ...p,
          age: p.age + 1,
          apps: 0,
          goals: 0,
          assists: 0,
          cleanSheets: 0,
          yel: 0,
          red: 0,
          pom: 0,
          totalMins: 0
        })),
        tactics: JSON.parse(JSON.stringify(base.tactics || {})),
        transfers: [],
        injuries: [],
        shortlist: JSON.parse(JSON.stringify(base.shortlist || []))
      };
    }
    return this.seasonData[this.currentSeason];
  }

  // Reactive Property Getters (Scoped to Active Season)
  get inGameDate() { return this.getActiveSeasonData().inGameDate || '2026-07-23'; }
  set inGameDate(val) { this.getActiveSeasonData().inGameDate = val; }

  get performance() { return this.getActiveSeasonData().performance || 'Good'; }
  set performance(val) { this.getActiveSeasonData().performance = val; }

  get recentForm() { return this.getActiveSeasonData().recentForm || ['W', 'W', 'L', 'W']; }
  set recentForm(val) { this.getActiveSeasonData().recentForm = val; }

  get clubPosition() { return this.getActiveSeasonData().clubPosition || `1st in ${this.leagueName}`; }
  set clubPosition(val) { this.getActiveSeasonData().clubPosition = val; }

  get record() { return this.getActiveSeasonData().record; }
  set record(val) { this.getActiveSeasonData().record = val; }

  get results() { return this.getActiveSeasonData().results; }
  set results(val) { this.getActiveSeasonData().results = val; }

  get standings() { return this.getActiveSeasonData().standings; }
  set standings(val) { this.getActiveSeasonData().standings = val; }

  get bestPlayers() { return this.getActiveSeasonData().bestPlayers; }
  set bestPlayers(val) { this.getActiveSeasonData().bestPlayers = val; }

  get squad() { return this.getActiveSeasonData().squad; }
  set squad(val) { this.getActiveSeasonData().squad = val; }

  get tactics() { return this.getActiveSeasonData().tactics; }
  set tactics(val) { this.getActiveSeasonData().tactics = val; }

  get transfers() { return this.getActiveSeasonData().transfers; }
  set transfers(val) { this.getActiveSeasonData().transfers = val; }

  get injuries() { return this.getActiveSeasonData().injuries; }
  set injuries(val) { this.getActiveSeasonData().injuries = val; }

  get shortlist() { return this.getActiveSeasonData().shortlist; }
  set shortlist(val) { this.getActiveSeasonData().shortlist = val; }

  // Subscription
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify UI listeners immediately (no save — for instant responsiveness)
  notifyOnly() {
    this.listeners.forEach(fn => fn(this));
  }

  // Notify UI + debounced persist (1.5s after last call)
  notify() {
    this.listeners.forEach(fn => fn(this));
    this._schedulePersist();
  }

  _schedulePersist() {
    if (this._persistTimer) clearTimeout(this._persistTimer);
    this._persistTimer = setTimeout(() => {
      this._persistTimer = null;
      this.persist();
    }, 1500);
  }

  setPage(page) {
    this.currentPage = page;
    this.notifyOnly(); // Pure navigation — no save needed
  }

  // Switch Season (Switches full season dataset)
  setSeason(season) {
    if (this.currentSeason !== season) {
      this.currentSeason = season;
      this.selectedPlayerId = null; // Reset open player profile on season switch
      this.notify();
    }
  }

  // Add New Season
  addSeason(seasonName) {
    if (seasonName && !this.seasons.includes(seasonName)) {
      this.seasons.push(seasonName);
      this.currentSeason = seasonName;
      this.selectedPlayerId = null;
      this.getActiveSeasonData(); // Initialize new dataset
      this.notify();
    }
  }

  selectPlayer(id) {
    this.selectedPlayerId = id;
    this.notifyOnly(); // Navigation-only — no save
  }

  clearSelectedPlayer() {
    this.selectedPlayerId = null;
    this.notifyOnly(); // Navigation-only — no save
  }

  updateRecord(w, d, l) {
    const rec = this.getActiveSeasonData().record;
    rec.wins = Number(w);
    rec.draws = Number(d);
    rec.losses = Number(l);
    rec.points = (rec.wins * 3) + (rec.draws * 1);
    this.notify();
  }

  recalculateSeasonStats() {
    const season = this.getActiveSeasonData();
    const results = season.results || [];
    let wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;
    const formArr = [];

    const club = (this.clubName || 'Man Utd').toLowerCase();

    results.forEach(m => {
      const homeNorm = (m.home || '').toLowerCase();
      const awayNorm = (m.away || '').toLowerCase();
      const isHome = homeNorm.includes('man utd') || homeNorm.includes('manchester united') || homeNorm.includes(club);
      const isAway = awayNorm.includes('man utd') || awayNorm.includes('manchester united') || awayNorm.includes(club);

      if (isHome || isAway) {
        const myScore = isHome ? Number(m.homeScore) : Number(m.awayScore);
        const oppScore = isHome ? Number(m.awayScore) : Number(m.homeScore);
        gf += myScore;
        ga += oppScore;

        if (myScore > oppScore) {
          wins++;
          formArr.push('W');
        } else if (myScore === oppScore) {
          draws++;
          formArr.push('D');
        } else {
          losses++;
          formArr.push('L');
        }
      }
    });

    season.record = {
      wins,
      draws,
      losses,
      goalsFor: gf,
      goalsAgainst: ga,
      points: (wins * 3) + (draws * 1)
    };
    season.recentForm = formArr.length > 0 ? formArr.slice(0, 5) : ['W', 'W', 'D', 'W'];

    // Update active manager vault card percentages
    const totalMatches = wins + draws + losses;
    if (totalMatches > 0) {
      const winRate = Math.round((wins / totalMatches) * 100);
      const drawRate = Math.round((draws / totalMatches) * 100);
      const loseRate = Math.max(0, 100 - winRate - drawRate);

      const activeVault = this.vaults.find(v => v.id === this.activeVaultId);
      if (activeVault) {
        activeVault.winRate = `${winRate}%`;
        activeVault.drawRate = `${drawRate}%`;
        activeVault.loseRate = `${loseRate}%`;
      }
    }

    // Recalculate standings row for user team
    if (Array.isArray(season.standings)) {
      const userRow = season.standings.find(s => s.isUser || s.team.toLowerCase().includes('manchester united') || s.team.toLowerCase().includes(club));
      if (userRow) {
        userRow.pld = totalMatches > 0 ? totalMatches : userRow.pld;
        userRow.won = wins;
        userRow.drawn = draws;
        userRow.lost = losses;
        userRow.gf = gf > 0 ? gf : userRow.gf;
        userRow.ga = ga > 0 ? ga : userRow.ga;
        userRow.gd = userRow.gf - userRow.ga;
        userRow.pts = (wins * 3) + (draws * 1);
      }
    }

    // Recalculate squad players' match appearances, minutes, goals, assists, and clean sheets
    if (Array.isArray(season.squad) && Array.isArray(season.results) && season.results.length > 0) {
      const appsMap = {};
      const minsMap = {};
      const goalsMap = {};
      const assistsMap = {};
      const cleanSheetsMap = {};

      results.forEach(m => {
        const pm = m.playerMinutes || {};
        const starters = new Set((m.lineup || []).map(Number));
        const subs = new Set();
        if (Array.isArray(m.subs)) {
          m.subs.forEach(s => {
            const sId = typeof s === 'object' ? (s.playerInId || s.playerId) : s;
            if (sId) subs.add(Number(sId));
          });
        }
        const hasPm = Object.keys(pm).length > 0;

        season.squad.forEach(p => {
          const pId = Number(p.id);
          let mins = 0;
          if (hasPm) {
            mins = Number(pm[pId] !== undefined ? pm[pId] : pm[String(pId)] || 0);
          } else if (starters.has(pId)) {
            mins = 90;
          } else if (subs.has(pId)) {
            mins = 30;
          }

          if (mins > 0 || starters.has(pId) || subs.has(pId)) {
            appsMap[pId] = (appsMap[pId] || 0) + 1;
            minsMap[pId] = (minsMap[pId] || 0) + mins;
          }
        });

        // Goals
        if (Array.isArray(m.goalscorers)) {
          m.goalscorers.forEach(g => {
            const gId = Number(g.playerId);
            const count = Number(g.count) || 1;
            goalsMap[gId] = (goalsMap[gId] || 0) + count;
          });
        }

        // Assists
        if (Array.isArray(m.assisters)) {
          m.assisters.forEach(a => {
            const aId = Number(a.playerId);
            const count = Number(a.count) || 1;
            assistsMap[aId] = (assistsMap[aId] || 0) + count;
          });
        }

        // Clean sheets
        const homeNorm = (m.home || '').toLowerCase();
        const awayNorm = (m.away || '').toLowerCase();
        const isHome = homeNorm.includes('man utd') || homeNorm.includes('manchester united') || homeNorm.includes(club);
        const isAway = awayNorm.includes('man utd') || awayNorm.includes('manchester united') || awayNorm.includes(club);
        const conceded = isHome ? Number(m.awayScore) : Number(m.homeScore);
        if (conceded === 0 && (isHome || isAway)) {
          season.squad.forEach(p => {
            const pId = Number(p.id);
            const played = starters.has(pId) || subs.has(pId) || (Number(pm[pId]) > 0);
            if (played && ['GK', 'DC', 'DL', 'DR', 'DM'].includes(p.pos)) {
              cleanSheetsMap[pId] = (cleanSheetsMap[pId] || 0) + 1;
            }
          });
        }
      });

      season.squad.forEach(p => {
        const pId = Number(p.id);
        if (appsMap[pId] !== undefined) p.apps = appsMap[pId];
        if (minsMap[pId] !== undefined) p.totalMins = minsMap[pId];
        if (goalsMap[pId] !== undefined) p.goals = goalsMap[pId];
        if (assistsMap[pId] !== undefined) p.assists = assistsMap[pId];
        if (p.pos === 'GK' || ['DC', 'DL', 'DR'].includes(p.pos)) {
          if (cleanSheetsMap[pId] !== undefined) p.cleanSheets = cleanSheetsMap[pId];
        }
      });
    }
  }

  addMatchResult(match) {
    const season = this.getActiveSeasonData();
    const newMatch = {
      id: match.id || Date.now(),
      gameweek: match.gameweek || (season.results.length + 1),
      date: match.date || new Date().toLocaleDateString('en-GB'),
      home: match.home || this.clubName || 'Man Utd',
      away: match.away || 'Opponent',
      homeScore: Number(match.homeScore) || 0,
      awayScore: Number(match.awayScore) || 0,
      competition: match.competition || this.leagueName || 'Premier League',
      status: 'FT',
      lineup: match.lineup || [],
      subs: match.subs || [],
      playerMinutes: match.playerMinutes || {},
      goalscorers: match.goalscorers || [],
      assisters: match.assisters || []
    };

    season.results.unshift(newMatch);
    this.recalculateSeasonStats();
    this.notify();
  }

  updateMatchResult(matchId, updatedData) {
    const season = this.getActiveSeasonData();
    const idx = season.results.findIndex(m => m.id === matchId);
    if (idx !== -1) {
      season.results[idx] = {
        ...season.results[idx],
        ...updatedData
      };
      this.recalculateSeasonStats();
      this.notify();
    }
  }

  deleteMatchResult(matchId) {
    const season = this.getActiveSeasonData();
    season.results = season.results.filter(m => m.id !== matchId);
    this.recalculateSeasonStats();
    this.notify();
  }

  addPlayer(player) {
    const season = this.getActiveSeasonData();
    season.squad.push({
      id: Date.now(),
      ...player
    });
    this.notify();
  }

  updatePlayer(id, updatedFields) {
    const season = this.getActiveSeasonData();
    const index = season.squad.findIndex(p => p.id === id);
    if (index !== -1) {
      season.squad[index] = {
        ...season.squad[index],
        ...updatedFields
      };
      this.notify();
    }
  }

  removePlayer(id) {
    if (this.selectedPlayerId === id) {
      this.selectedPlayerId = null;
    }
    const season = this.getActiveSeasonData();
    season.squad = season.squad.filter(p => p.id !== id);
    this.notify();
  }

  clearSquad() {
    this.selectedPlayerId = null;
    const season = this.getActiveSeasonData();
    season.squad = [];
    this.recalculateSeasonStats();
    this.notify();
  }

  addTransfer(transfer) {
    const season = this.getActiveSeasonData();
    season.transfers.unshift({
      id: Date.now(),
      ...transfer
    });
    this.notify();
  }

  addShortlist(item) {
    const season = this.getActiveSeasonData();
    season.shortlist.push({
      id: Date.now(),
      ...item
    });
    this.notify();
  }

  // Reconcile and backfill shirt numbers if loading legacy cached data
  reconcileSquadShirtNumbers() {
    const defaultInitial = createInitialSeasonData();
    Object.keys(this.seasonData).forEach(sKey => {
      const sData = this.seasonData[sKey];
      if (sData && Array.isArray(sData.squad)) {
        const defaultSquad = defaultInitial[sKey]?.squad || defaultInitial['2026/27'].squad;
        sData.squad.forEach((p, idx) => {
          const existingNum = (p.num !== undefined && p.num !== null && p.num !== '') 
            ? Number(p.num) 
            : (p.number !== undefined && p.number !== null && p.number !== '') 
              ? Number(p.number) 
              : (p.shirtNumber !== undefined && p.shirtNumber !== null && p.shirtNumber !== '') 
                ? Number(p.shirtNumber) 
                : null;

          if (existingNum !== null) {
            p.num = existingNum;
            p.number = existingNum;
            p.shirtNumber = existingNum;
          } else {
            // Find in default template
            const match = defaultSquad.find(dp => dp.id === p.id || (dp.name && p.name && dp.name.toLowerCase() === p.name.toLowerCase()));
            if (match && match.num) {
              p.num = Number(match.num);
              p.number = Number(match.num);
              p.shirtNumber = Number(match.num);
            } else {
              const fallback = p.pos === 'GK' ? 1 : (idx + 2);
              p.num = fallback;
              p.number = fallback;
              p.shirtNumber = fallback;
            }
          }
        });
      }
    });
  }

  async persist() {
    const dataToSave = {
      currentSeason: this.currentSeason,
      seasons: this.seasons,
      managerName: this.managerName,
      clubName: this.clubName,
      seasonData: this.seasonData,
      vaults: this.vaults,
      activeVaultId: this.activeVaultId
    };
    // Always save locally for instant recovery
    const user = firebaseService.currentUser;
    if (user) {
      try {
        localStorage.setItem(`the_journey_vault_${user.uid}`, JSON.stringify(dataToSave));
      } catch (e) { /* quota exceeded — skip */ }
    }
    // Push to Firestore in background (non-blocking)
    firebaseService.saveVaultToCloud(dataToSave).catch(() => {});
  }

  async loadPersistedData() {
    const data = await firebaseService.loadVaultFromCloud();
    if (data) {
      if (data.currentSeason) this.currentSeason = data.currentSeason;
      if (data.seasons) this.seasons = data.seasons;
      if (data.managerName) this.managerName = data.managerName;
      if (data.clubName) this.clubName = data.clubName;
      if (data.seasonData) this.seasonData = data.seasonData;
      if (data.vaults && Array.isArray(data.vaults) && data.vaults.length > 0) {
        this.vaults = data.vaults;
      }
      if (data.activeVaultId) this.activeVaultId = data.activeVaultId;
    }
    this.reconcileSquadShirtNumbers();
    this.notify();
  }
}

export const store = new StateStore();

