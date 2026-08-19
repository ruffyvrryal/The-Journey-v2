// Firebase Service & Multi-User Cloud Vault Sync
class FirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.authListeners = [];
    this.init();
  }

  getSavedConfig() {
    try {
      const saved = localStorage.getItem('the_journey_firebase_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved Firebase config', e);
    }
    // Default fallback placeholder (or demo key)
    return null;
  }

  saveConfig(configObj) {
    localStorage.setItem('the_journey_firebase_config', JSON.stringify(configObj));
    this.init();
  }

  init() {
    const config = this.getSavedConfig();
    if (window.firebase && config && config.apiKey) {
      try {
        if (!firebase.apps.length) {
          this.app = firebase.initializeApp(config);
        } else {
          this.app = firebase.app();
        }
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        
        this.auth.onAuthStateChanged((user) => {
          this.currentUser = user;
          this.notifyAuthListeners(user);
        });
        console.log('Firebase initialized successfully.');
      } catch (err) {
        console.warn('Firebase init error:', err);
      }
    } else {
      // Local Guest / Demo Mode
      const savedGuest = localStorage.getItem('the_journey_guest_user');
      this.currentUser = savedGuest ? JSON.parse(savedGuest) : {
        uid: 'guest-vault-user',
        displayName: 'John Connor',
        email: 'john.connor@thejourney.fm',
        isGuest: true
      };
      setTimeout(() => this.notifyAuthListeners(this.currentUser), 50);
    }
  }

  onAuthChanged(cb) {
    this.authListeners.push(cb);
    if (this.currentUser) cb(this.currentUser);
  }

  notifyAuthListeners(user) {
    this.authListeners.forEach(cb => cb(user));
  }

  async signIn(email, password) {
    if (this.auth) {
      const cred = await this.auth.signInWithEmailAndPassword(email, password);
      return cred.user;
    } else {
      // Guest mode login emulation
      this.currentUser = {
        uid: 'user-' + btoa(email).substring(0, 8),
        displayName: email.split('@')[0],
        email: email,
        isGuest: false
      };
      localStorage.setItem('the_journey_guest_user', JSON.stringify(this.currentUser));
      this.notifyAuthListeners(this.currentUser);
      return this.currentUser;
    }
  }

  async signUp(email, password, displayName) {
    if (this.auth) {
      const cred = await this.auth.createUserWithEmailAndPassword(email, password);
      if (displayName) {
        await cred.user.updateProfile({ displayName });
      }
      return cred.user;
    } else {
      this.currentUser = {
        uid: 'user-' + btoa(email).substring(0, 8),
        displayName: displayName || email.split('@')[0],
        email: email,
        isGuest: false
      };
      localStorage.setItem('the_journey_guest_user', JSON.stringify(this.currentUser));
      this.notifyAuthListeners(this.currentUser);
      return this.currentUser;
    }
  }

  async logOut() {
    if (this.auth) {
      await this.auth.signOut();
    }
    this.currentUser = {
      uid: 'guest-vault-user',
      displayName: 'John Connor',
      email: 'john.connor@thejourney.fm',
      isGuest: true
    };
    localStorage.removeItem('the_journey_guest_user');
    this.notifyAuthListeners(this.currentUser);
  }

  async saveVaultToCloud(vaultData) {
    const user = this.currentUser;
    if (!user) return false;

    // Always cache locally
    localStorage.setItem(`the_journey_vault_${user.uid}`, JSON.stringify(vaultData));

    if (this.db && !user.isGuest) {
      try {
        await this.db.collection('users').doc(user.uid).collection('vaults').doc('active_save').set({
          ...vaultData,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
      } catch (e) {
        console.error('Firestore save failed:', e);
        return false;
      }
    }
    return true;
  }

  async loadVaultFromCloud() {
    const user = this.currentUser;
    if (!user) return null;

    if (this.db && !user.isGuest) {
      try {
        const doc = await this.db.collection('users').doc(user.uid).collection('vaults').doc('active_save').get();
        if (doc.exists) {
          return doc.data();
        }
      } catch (e) {
        console.warn('Firestore fetch failed, checking local:', e);
      }
    }

    // Check local storage
    const local = localStorage.getItem(`the_journey_vault_${user.uid}`);
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    return null;
  }
}

export const firebaseService = new FirebaseService();
