# The Journey V2 - Football Manager Career Vault ⚽🎮

**The Journey V2** is a cloud-synced Football Manager companion web application designed to store, manage, and visualize your FM career game data with multi-user isolation, real-time tactical board, match schedules, contract wage structures, and deep analytics.

---

## 🌟 Key Features

1. **Pixel-Perfect FM Dashboard (Home View)**:
   - **Club Overview**: Manchester United crest, league position, form indicators, and performance status.
   - **Recent Results**: Gameweek score boxes (e.g., *Man Utd 2 - 0 Arsenal*, *Brighton 0 - 5 Man Utd*).
   - **League Standings Preview**: Real-time Top 5 table snippet with quick navigation to full league table.
   - **Record Counters**: Huge bold **WIN (17)**, **DRAW (1)**, and **LOSE (1)** dynamic statistics.
   - **Best Players**: Rating leaderboards with dynamic progress bars (*Bruno Fernandes 9.0*, *Aaron Lemmens 8.7*, *Youri Tielemans 8.5*).
   - **Sleek Tablet & Browser Frame**: Custom bezel with camera notch and address bar `www.thejourney.com/html/chaseyourdreams`.

2. **Per-User Cloud Vault & Firebase Integration**:
   - Authentication (Email & Password / Guest Mode).
   - Each manager has an isolated Firestore cloud save.
   - Built-in Firebase configuration modal for seamless connection to your free Firebase project.

3. **Complete FM Management Modules**:
   - 👥 **Squad**: Full senior roster list with age, nationality, market valuation, wage, morale, fitness %, and ratings.
   - 📋 **Tactics**: Interactive pitch with customizable formations (4-2-3-1, 4-3-3, etc.) and in/out of possession instructions.
   - 📅 **Schedules**: Gameweek match logs and fixture results recorder.
   - 📊 **Data Analytics**: Goals scored, goals conceded, clean sheets, and top scorers/assists.
   - 📑 **Contracts**: Weekly wage structure and contract expiry monitor.
   - 🏥 **Injuries**: Medical room with recovery progress percentages and estimated return dates.
   - 💱 **Transfers**: In/Out transfer history, net spend calculator, and transfer budget tracker.
   - 🏆 **Tables**: Full 20-team interactive Premier League standings with automatic GD/points calculation.
   - 🎯 **Shortlists**: Scouting targets with scout verdicts and star ratings.

---

## 🚀 Deployment to Vercel

1. Push this repository to your GitHub account (named `The Journey V2`).
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your `The Journey V2` GitHub repository.
4. Keep the default settings and click **Deploy**.
5. Your app is live with SSL and global CDN!

---

## 🔒 Free Firebase Setup (Optional for Multi-Device Cloud Sync)

1. Create a free project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Enable **Cloud Firestore** in test/production mode.
4. Copy your web app `firebaseConfig` keys.
5. In **The Journey**, click your user profile avatar at the top right -> go to the **Firebase Config** tab -> paste the config JSON and click **Save**.

---

**Created by Ruffy Prasetya**
