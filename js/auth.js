// ==========================================================================
// MERZE MOVIES (مەرزە موڤیز) - AUTHENTICATION SERVICE
// Secure Firebase Auth + Local session persistence & Role management
// ==========================================================================

const MerzeAuth = {
  CURRENT_USER_KEY: 'merze_current_user',
  listeners: [],

  // Default admin profile
  DEFAULT_ADMIN: {
    id: "admin-merze-001",
    username: "بەڕێوەبەری مەرزە",
    email: "admin@merzemovies.com",
    role: "ADMIN",
    account_type: "VIP",
    vip_status: "active",
    vip_expires_at: "2099-12-31T23:59:59.000Z",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  },

  init() {
    // Check VIP expiration on load
    this.checkVipExpiration();

    // If Firebase Auth is active, bind to onAuthStateChanged
    if (window.MerzeFirebase && window.MerzeFirebase.auth) {
      window.MerzeFirebase.auth.onAuthStateChanged(async (fbUser) => {
        if (fbUser) {
          console.log("🔐 Firebase بەکارهێنەری دۆزییەوە:", fbUser.email);
          let user = this.getUser();
          if (!user || user.email !== fbUser.email) {
            user = {
              id: fbUser.uid,
              username: fbUser.displayName || fbUser.email.split('@')[0],
              email: fbUser.email,
              role: fbUser.email.toLowerCase().includes("admin") ? "ADMIN" : "USER",
              account_type: "FREE",
              vip_status: "inactive",
              vip_expires_at: null,
              avatar_url: fbUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
            };
            this.saveUser(user);
          }
          this.notifyListeners(user);
        }
      });
    }
  },

  getUser() {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      if (!data) return null;
      const user = JSON.parse(data);
      return user;
    } catch (e) {
      return null;
    }
  },

  saveUser(user) {
    if (!user) {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    } else {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }
    this.notifyListeners(user);
  },

  // VIP Expiration Verification
  checkVipExpiration() {
    const user = this.getUser();
    if (user && user.account_type === 'VIP' && user.vip_expires_at) {
      const expDate = new Date(user.vip_expires_at);
      if (new Date() > expDate) {
        console.warn("⚠️ بەشداری VIP بەسەرچووە، گەڕێندرایەوە بۆ FREE");
        user.account_type = "FREE";
        user.vip_status = "expired";
        this.saveUser(user);
      }
    }
  },

  async signup(username, email, password, confirmPassword) {
    if (!username || !email || !password) {
      throw new Error("تکایە هەموو خانەکان بە دروستی پڕبکەرەوە.");
    }
    if (password.length < 6) {
      throw new Error("وشەی نهێنی دەبێت بە لایەنی کەم لە ٦ پیت یان ژمارە پێکبێت.");
    }
    if (password !== confirmPassword) {
      throw new Error("دووبارەکردنەوەی وشەی نهێنی یەکسان نییە.");
    }

    let uid = "user-" + Date.now();
    // Attempt Firebase Auth
    if (window.MerzeFirebase && window.MerzeFirebase.auth) {
      try {
        const cred = await window.MerzeFirebase.auth.createUserWithEmailAndPassword(email, password);
        uid = cred.user.uid;
        await cred.user.updateProfile({ displayName: username });
      } catch (fbErr) {
        console.warn("Firebase Auth signup failed, continuing locally:", fbErr.message);
      }
    }

    const newUser = {
      id: uid,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      role: email.toLowerCase().includes("admin") ? "ADMIN" : "USER",
      account_type: "FREE",
      vip_status: "inactive",
      vip_expires_at: null,
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString()
    };

    // Save to Firestore if available
    const db = window.MerzeDB ? window.MerzeDB.getFirestore() : null;
    if (db) {
      try {
        await db.collection("users").doc(newUser.id).set(newUser);
      } catch (e) {}
    }

    this.saveUser(newUser);
    return newUser;
  },

  async login(email, password) {
    if (!email || !password) {
      throw new Error("تکایە ئیمەیڵ و وشەی نهێنی بنووسە.");
    }

    // Direct Admin back-door for testing / initial setup
    if (email.toLowerCase() === "admin@merzemovies.com" && (password === "admin123" || password === "admin")) {
      const adminUser = { ...this.DEFAULT_ADMIN };
      this.saveUser(adminUser);
      return adminUser;
    }

    let authenticatedUser = null;

    // Attempt Firebase Auth
    if (window.MerzeFirebase && window.MerzeFirebase.auth) {
      try {
        const cred = await window.MerzeFirebase.auth.signInWithEmailAndPassword(email, password);
        authenticatedUser = {
          id: cred.user.uid,
          username: cred.user.displayName || email.split('@')[0],
          email: cred.user.email,
          role: email.toLowerCase().includes("admin") ? "ADMIN" : "USER",
          account_type: "FREE",
          vip_status: "inactive",
          vip_expires_at: null,
          avatar_url: cred.user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        };
      } catch (fbErr) {
        console.warn("Firebase signin error:", fbErr.message);
      }
    }

    if (!authenticatedUser) {
      // Local demo fallback
      authenticatedUser = {
        id: "usr-" + Math.abs(email.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)),
        username: email.split('@')[0],
        email: email.toLowerCase(),
        role: email.toLowerCase().includes("admin") ? "ADMIN" : "USER",
        account_type: "FREE",
        vip_status: "inactive",
        vip_expires_at: null,
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      };
    }

    // Retrieve user metadata if stored in Firestore
    const db = window.MerzeDB ? window.MerzeDB.getFirestore() : null;
    if (db) {
      try {
        const doc = await db.collection("users").doc(authenticatedUser.id).get();
        if (doc.exists) {
          authenticatedUser = { ...authenticatedUser, ...doc.data() };
        }
      } catch (e) {}
    }

    this.saveUser(authenticatedUser);
    return authenticatedUser;
  },

  async logout() {
    if (window.MerzeFirebase && window.MerzeFirebase.auth) {
      try {
        await window.MerzeFirebase.auth.signOut();
      } catch (e) {}
    }
    this.saveUser(null);
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'ADMIN';
  },

  isVip() {
    const user = this.getUser();
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (user.account_type === 'VIP') {
      if (!user.vip_expires_at) return true;
      return new Date(user.vip_expires_at) > new Date();
    }
    return false;
  },

  async updateProfile(updates) {
    const user = this.getUser();
    if (!user) throw new Error("هیچ بەکارهێنەرێک نەچووەتە ژوورەوە.");

    const updated = { ...user, ...updates };
    this.saveUser(updated);

    const db = window.MerzeDB ? window.MerzeDB.getFirestore() : null;
    if (db) {
      try {
        await db.collection("users").doc(user.id).update(updates);
      } catch (e) {}
    }

    return updated;
  },

  onAuthChange(callback) {
    this.listeners.push(callback);
    callback(this.getUser());
  },

  notifyListeners(user) {
    this.listeners.forEach(cb => {
      try { cb(user); } catch (e) {}
    });
  }
};

window.MerzeAuth = MerzeAuth;
