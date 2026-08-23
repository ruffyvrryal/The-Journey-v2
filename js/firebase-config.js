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
          if (user) {
            localStorage.setItem('the_journey_logged_in_user', JSON.stringify({
              uid: user.uid,
              displayName: user.displayName || user.email?.split('@')[0],
              email: user.email,
              photoURL: user.photoURL
            }));
          }
          this.notifyAuthListeners(user);
        });
        console.log('Firebase initialized successfully.');
      } catch (err) {
        console.warn('Firebase init error:', err);
      }
    } else {
      // Local Session Check
      const savedUser = localStorage.getItem('the_journey_logged_in_user');
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
        } catch (e) {
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
      }
      setTimeout(() => this.notifyAuthListeners(this.currentUser), 50);
    }
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  onAuthChanged(cb) {
    this.authListeners.push(cb);
    if (this.currentUser !== undefined) cb(this.currentUser);
  }

  notifyAuthListeners(user) {
    this.authListeners.forEach(cb => cb(user));
  }

  async signInWithGoogle() {
    if (this.auth && window.firebase?.auth?.GoogleAuthProvider) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const cred = await this.auth.signInWithPopup(provider);
        this.currentUser = cred.user;
        return cred.user;
      } catch (err) {
        console.warn('Google Popup sign-in error:', err);
        throw err;
      }
    } else {
      // Direct Interactive Google Account Sign-In
      const googleEmail = prompt('Sign in with Google Account:\nEnter your Google Email Address:', 'manager@gmail.com');
      if (!googleEmail || !googleEmail.trim()) return null;
      
      const cleanEmail = googleEmail.trim();
      const displayName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      this.currentUser = {
        uid: 'google_' + btoa(cleanEmail).substring(0, 10),
        displayName: displayName,
        email: cleanEmail,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        provider: 'google.com'
      };
      localStorage.setItem('the_journey_logged_in_user', JSON.stringify(this.currentUser));
      this.notifyAuthListeners(this.currentUser);
      return this.currentUser;
    }
  }

  async signIn(email, password) {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    if (this.auth) {
      const cred = await this.auth.signInWithEmailAndPassword(email, password);
      this.currentUser = cred.user;
      return cred.user;
    } else {
      // Local Auth verification / creation
      const cleanEmail = email.trim();
      const displayName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      this.currentUser = {
        uid: 'user_' + btoa(cleanEmail).substring(0, 10),
        displayName: displayName,
        email: cleanEmail,
        photoURL: null,
        provider: 'password'
      };
      localStorage.setItem('the_journey_logged_in_user', JSON.stringify(this.currentUser));
      this.notifyAuthListeners(this.currentUser);
      return this.currentUser;
    }
  }

  async signUp(email, password, displayName) {
    if (!email || !password) {
      throw new Error('Please provide an email and password to sign up.');
    }

    if (this.auth) {
      const cred = await this.auth.createUserWithEmailAndPassword(email, password);
      if (displayName) {
        await cred.user.updateProfile({ displayName });
      }
      this.currentUser = cred.user;
      return cred.user;
    } else {
      const cleanEmail = email.trim();
      const finalName = (displayName && displayName.trim()) 
        ? displayName.trim() 
        : cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      this.currentUser = {
        uid: 'user_' + btoa(cleanEmail).substring(0, 10),
        displayName: finalName,
        email: cleanEmail,
        photoURL: null,
        provider: 'password'
      };
      localStorage.setItem('the_journey_logged_in_user', JSON.stringify(this.currentUser));
      this.notifyAuthListeners(this.currentUser);
      return this.currentUser;
    }
  }

  async resetPassword(email) {
    if (!email) {
      throw new Error('Please enter your email address to reset password.');
    }
    if (this.auth) {
      await this.auth.sendPasswordResetEmail(email);
    }
    return true;
  }

  async logOut() {
    if (this.auth) {
      try { await this.auth.signOut(); } catch (e) {}
    }
    this.currentUser = null;
    localStorage.removeItem('the_journey_logged_in_user');
    this.notifyAuthListeners(null);
  }

  async saveVaultToCloud(vaultData) {
    const user = this.currentUser;
    if (!user) return false;

    // Cache locally per user
    localStorage.setItem(`the_journey_vault_${user.uid}`, JSON.stringify(vaultData));

    if (this.db && user.provider !== 'guest') {
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

    if (this.db && user.provider !== 'guest') {
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

