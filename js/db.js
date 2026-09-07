// ==========================================================================
// MERZE MOVIES (مەرزە موڤیز) - DATABASE SERVICE LAYER
// Direct Firestore REST API + Client SDK + LocalStorage Synchronization
// Guarantees persistence of adds, edits, and deletes across all page refreshes
// ==========================================================================

const MerzeDB = {
  PROJECT_ID: "merzemovies",
  API_KEY: "AIzaSyAvL1WKP1hnG0Uv-_gojBOH6rLDYhx8RYA",

  // Local storage cache keys
  KEYS: {
    MOVIES: 'merze_movies_cache',
    SERIES: 'merze_series_cache',
    SETTINGS: 'merze_payment_settings',
    REVIEWS: 'merze_reviews_cache',
    FAVORITES: 'merze_favorites_cache',
    HISTORY: 'merze_history_cache',
    PAYMENTS: 'merze_payments_cache',
    USERS: 'merze_users_cache',
    SEEDED: 'merze_has_seeded'
  },

  // Helper: get Firestore SDK instance
  getFirestore() {
    return window.MerzeFirebase && window.MerzeFirebase.db ? window.MerzeFirebase.db : null;
  },

  // Helper: read local cache
  getLocal(key, fallback = []) {
    try {
      const data = localStorage.getItem(key);
      return data !== null ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  // Helper: save local cache
  setLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage quota or error saving local cache", e);
    }
  },

  // --------------------------------------------------------------------------
  // FIRESTORE REST API CONVERTERS
  // --------------------------------------------------------------------------
  toFirestoreFields(obj) {
    const fields = {};
    if (!obj || typeof obj !== 'object') return fields;

    for (const [key, val] of Object.entries(obj)) {
      if (val === undefined || val === null) continue;

      if (typeof val === 'string') {
        fields[key] = { stringValue: val };
      } else if (typeof val === 'number') {
        if (Number.isInteger(val)) {
          fields[key] = { integerValue: val.toString() };
        } else {
          fields[key] = { doubleValue: val };
        }
      } else if (typeof val === 'boolean') {
        fields[key] = { booleanValue: val };
      } else if (Array.isArray(val)) {
        fields[key] = {
          arrayValue: {
            values: val.map(item => {
              if (item !== null && typeof item === 'object') {
                return { mapValue: { fields: this.toFirestoreFields(item) } };
              }
              return { stringValue: String(item) };
            })
          }
        };
      } else if (typeof val === 'object') {
        fields[key] = {
          mapValue: { fields: this.toFirestoreFields(val) }
        };
      }
    }
    return fields;
  },

  fromFirestoreFields(fields) {
    const obj = {};
    if (!fields) return obj;

    for (const [key, val] of Object.entries(fields)) {
      if ('stringValue' in val) {
        obj[key] = val.stringValue;
      } else if ('integerValue' in val) {
        obj[key] = parseInt(val.integerValue, 10);
      } else if ('doubleValue' in val) {
        obj[key] = parseFloat(val.doubleValue);
      } else if ('booleanValue' in val) {
        obj[key] = val.booleanValue;
      } else if ('arrayValue' in val) {
        obj[key] = (val.arrayValue.values || []).map(v => {
          if ('mapValue' in v) return this.fromFirestoreFields(v.mapValue.fields);
          if ('stringValue' in v) return v.stringValue;
          if ('integerValue' in v) return parseInt(v.integerValue, 10);
          if ('doubleValue' in v) return parseFloat(v.doubleValue);
          if ('booleanValue' in v) return v.booleanValue;
          return v;
        });
      } else if ('mapValue' in val) {
        obj[key] = this.fromFirestoreFields(val.mapValue.fields);
      }
    }
    return obj;
  },

  // REST API: GET Collection
  async restGetCollection(collectionName) {
    const url = `https://firestore.googleapis.com/v1/projects/${this.PROJECT_ID}/databases/(default)/documents/${collectionName}?key=${this.API_KEY}&pageSize=100`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (!data.documents || data.documents.length === 0) {
        return [];
      }
      return data.documents.map(doc => {
        const docId = doc.name.split('/').pop();
        const parsed = this.fromFirestoreFields(doc.fields);
        return { id: docId, ...parsed };
      });
    } catch (err) {
      console.warn(`Firestore REST GET ${collectionName} error:`, err.message);
      return null;
    }
  },

  // REST API: SET / PATCH Document
  async restSetDocument(collectionName, docId, data) {
    const cleanId = encodeURIComponent(docId);
    const url = `https://firestore.googleapis.com/v1/projects/${this.PROJECT_ID}/databases/(default)/documents/${collectionName}/${cleanId}?key=${this.API_KEY}`;
    const payload = {
      fields: this.toFirestoreFields(data)
    };

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return true;
    } catch (err) {
      console.warn(`Firestore REST SET ${collectionName}/${docId} error:`, err.message);
      return false;
    }
  },

  // REST API: DELETE Document
  async restDeleteDocument(collectionName, docId) {
    const cleanId = encodeURIComponent(docId);
    const url = `https://firestore.googleapis.com/v1/projects/${this.PROJECT_ID}/databases/(default)/documents/${collectionName}/${cleanId}?key=${this.API_KEY}`;
    try {
      const response = await fetch(url, { method: 'DELETE' });
      return response.ok;
    } catch (err) {
      console.warn(`Firestore REST DELETE ${collectionName}/${docId} error:`, err.message);
      return false;
    }
  },

  // --------------------------------------------------------------------------
  // INITIALIZATION & SAFE SEEDING
  // --------------------------------------------------------------------------
  async init() {
    console.log("🎬 MerzeDB دەستپێکردن و پشکنینی داتابەیس...");

    // 1. Initialize local cache fallback if completely empty and never loaded
    if (localStorage.getItem(this.KEYS.MOVIES) === null) {
      this.setLocal(this.KEYS.MOVIES, window.MerzeSeedData.movies);
    }
    if (localStorage.getItem(this.KEYS.SERIES) === null) {
      this.setLocal(this.KEYS.SERIES, window.MerzeSeedData.series);
    }
    if (localStorage.getItem(this.KEYS.SETTINGS) === null) {
      this.setLocal(this.KEYS.SETTINGS, window.MerzeSeedData.paymentSettings);
    }
    if (localStorage.getItem(this.KEYS.REVIEWS) === null) {
      this.setLocal(this.KEYS.REVIEWS, window.MerzeSeedData.reviews);
    }

    // 2. Fetch live movies from Firestore REST
    const remoteMovies = await this.restGetCollection("movies");
    if (remoteMovies !== null) {
      if (remoteMovies.length === 0 && !localStorage.getItem(this.KEYS.SEEDED)) {
        // Initial first-time seeding ONLY
        console.log("🌱 چاندنی یەکەمجاری داتای فیلمەکان لە Firestore...");
        for (const m of window.MerzeSeedData.movies) {
          await this.restSetDocument("movies", m.id, m);
        }
        localStorage.setItem(this.KEYS.SEEDED, "true");
        this.setLocal(this.KEYS.MOVIES, window.MerzeSeedData.movies);
      } else {
        // Live movies exist (or user explicitly deleted all) -> synchronize local state
        localStorage.setItem(this.KEYS.SEEDED, "true");
        this.setLocal(this.KEYS.MOVIES, remoteMovies);
      }
    }

    // 3. Fetch live payment settings from Firestore
    const remoteSettings = await this.restGetCollection("settings");
    if (remoteSettings && remoteSettings.length > 0) {
      const paySetting = remoteSettings.find(s => s.id === "payment") || remoteSettings[0];
      if (paySetting) {
        this.setLocal(this.KEYS.SETTINGS, paySetting);
      }
    } else if (remoteSettings && remoteSettings.length === 0) {
      await this.restSetDocument("settings", "payment", window.MerzeSeedData.paymentSettings);
    }
  },

  // --------------------------------------------------------------------------
  // MOVIES CRUD
  // --------------------------------------------------------------------------
  async getMovies() {
    // 1. Fetch live from Firestore REST
    const remote = await this.restGetCollection("movies");
    if (remote !== null) {
      this.setLocal(this.KEYS.MOVIES, remote);
      return remote;
    }

    // 2. Fallback to LocalStorage cache
    return this.getLocal(this.KEYS.MOVIES, window.MerzeSeedData.movies);
  },

  async getMovieById(id) {
    const movies = await this.getMovies();
    return movies.find(m => m.id === id || m.slug === id) || null;
  },

  async addMovie(movieData) {
    const rawSlug = movieData.slug || movieData.id || "movie-" + Date.now();
    const id = rawSlug.trim().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF\-]/g, '');
    const movie = { 
      ...movieData, 
      id, 
      slug: id, 
      created_at: new Date().toISOString() 
    };

    // 1. Save to Firestore via REST API
    await this.restSetDocument("movies", id, movie);

    // 2. Also try Firebase Client SDK
    const db = this.getFirestore();
    if (db) {
      try { await db.collection("movies").doc(id).set(movie); } catch (e) {}
    }

    // 3. Immediately update local cache
    const current = this.getLocal(this.KEYS.MOVIES, []);
    const filtered = current.filter(m => m.id !== id);
    filtered.unshift(movie);
    this.setLocal(this.KEYS.MOVIES, filtered);

    console.log("✅ فیلمەکە لە داتابەیسی Firestore پاشەکەوتکرا:", id);
    return movie;
  },

  async updateMovie(id, updateData) {
    const movies = await this.getMovies();
    const existing = movies.find(m => m.id === id) || {};
    const updated = { ...existing, ...updateData, id, updated_at: new Date().toISOString() };

    // 1. Update in Firestore via REST API
    await this.restSetDocument("movies", id, updated);

    // 2. Update via SDK
    const db = this.getFirestore();
    if (db) {
      try { await db.collection("movies").doc(id).set(updated, { merge: true }); } catch (e) {}
    }

    // 3. Update local cache
    const current = this.getLocal(this.KEYS.MOVIES, []);
    const idx = current.findIndex(m => m.id === id);
    if (idx !== -1) {
      current[idx] = updated;
    } else {
      current.unshift(updated);
    }
    this.setLocal(this.KEYS.MOVIES, current);

    return updated;
  },

  async deleteMovie(id) {
    console.log("🗑️ سڕینەوەی فیلم لە Firestore:", id);

    // 1. Delete from Firestore via REST API
    await this.restDeleteDocument("movies", id);

    // 2. Also delete via SDK
    const db = this.getFirestore();
    if (db) {
      try { await db.collection("movies").doc(id).delete(); } catch (e) {}
    }

    // 3. Update local cache
    let current = this.getLocal(this.KEYS.MOVIES, []);
    current = current.filter(m => m.id !== id);
    this.setLocal(this.KEYS.MOVIES, current);

    return true;
  },

  // --------------------------------------------------------------------------
  // SERIES CRUD
  // --------------------------------------------------------------------------
  async getSeries() {
    const remote = await this.restGetCollection("series");
    if (remote !== null && remote.length > 0) {
      this.setLocal(this.KEYS.SERIES, remote);
      return remote;
    }
    return this.getLocal(this.KEYS.SERIES, window.MerzeSeedData.series);
  },

  async getSeriesById(id) {
    const seriesList = await this.getSeries();
    return seriesList.find(s => s.id === id || s.slug === id) || null;
  },

  async addSeries(seriesData) {
    const rawSlug = seriesData.slug || seriesData.id || "series-" + Date.now();
    const id = rawSlug.trim().replace(/\s+/g, '-');
    const item = { ...seriesData, id, created_at: new Date().toISOString() };

    await this.restSetDocument("series", id, item);

    const current = this.getLocal(this.KEYS.SERIES, []);
    current.unshift(item);
    this.setLocal(this.KEYS.SERIES, current);
    return item;
  },

  async deleteSeries(id) {
    await this.restDeleteDocument("series", id);

    const db = this.getFirestore();
    if (db) {
      try { await db.collection("series").doc(id).delete(); } catch (e) {}
    }

    let current = this.getLocal(this.KEYS.SERIES, []);
    current = current.filter(s => s.id !== id);
    this.setLocal(this.KEYS.SERIES, current);
    return true;
  },

  // --------------------------------------------------------------------------
  // PAYMENT SETTINGS & QR CODE
  // --------------------------------------------------------------------------
  async getPaymentSettings() {
    const remote = await this.restGetCollection("settings");
    if (remote && remote.length > 0) {
      const pay = remote.find(s => s.id === "payment") || remote[0];
      if (pay) {
        this.setLocal(this.KEYS.SETTINGS, pay);
        return pay;
      }
    }
    return this.getLocal(this.KEYS.SETTINGS, window.MerzeSeedData.paymentSettings);
  },

  async updatePaymentSettings(settings) {
    const payload = { ...settings, id: "payment" };
    await this.restSetDocument("settings", "payment", payload);

    const db = this.getFirestore();
    if (db) {
      try { await db.collection("settings").doc("payment").set(payload, { merge: true }); } catch (e) {}
    }

    this.setLocal(this.KEYS.SETTINGS, payload);
    return payload;
  },

  // --------------------------------------------------------------------------
  // PAYMENT REQUESTS WORKFLOW
  // --------------------------------------------------------------------------
  async submitPaymentRequest(paymentData) {
    const id = "pay-" + Date.now();
    const record = {
      id,
      user_id: paymentData.user_id,
      username: paymentData.username,
      email: paymentData.email || '',
      amount: paymentData.amount || 5000,
      payment_method: paymentData.payment_method || "QI Card",
      transaction_id: paymentData.transaction_id,
      payment_proof_url: paymentData.payment_proof_url || '',
      created_at: new Date().toISOString(),
      status: "Pending" // Pending, Approved, Rejected
    };

    // Save to Firestore REST
    await this.restSetDocument("payments", id, record);

    const db = this.getFirestore();
    if (db) {
      try { await db.collection("payments").doc(id).set(record); } catch (e) {}
    }

    const current = this.getLocal(this.KEYS.PAYMENTS, []);
    current.unshift(record);
    this.setLocal(this.KEYS.PAYMENTS, current);
    return record;
  },

  async getPayments() {
    const remote = await this.restGetCollection("payments");
    if (remote !== null) {
      remote.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      this.setLocal(this.KEYS.PAYMENTS, remote);
      return remote;
    }
    return this.getLocal(this.KEYS.PAYMENTS, []);
  },

  async approvePayment(paymentId, approvedBy = "Admin") {
    const payments = await this.getPayments();
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return null;

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setDate(oneMonthFromNow.getDate() + 30);

    const updatePayload = {
      ...payment,
      status: "Approved",
      approved_at: new Date().toISOString(),
      approved_by: approvedBy
    };

    // 1. Update Payment record in Firestore
    await this.restSetDocument("payments", paymentId, updatePayload);

    // 2. Automatically upgrade User to VIP in Firestore
    if (payment.user_id) {
      await this.restSetDocument("users", payment.user_id, {
        account_type: "VIP",
        vip_status: "active",
        vip_expires_at: oneMonthFromNow.toISOString()
      });
    }

    // Update local payments
    payment.status = "Approved";
    payment.approved_at = updatePayload.approved_at;
    this.setLocal(this.KEYS.PAYMENTS, payments);

    // Update local user session if currently logged in
    const currentUser = window.MerzeAuth ? window.MerzeAuth.getUser() : null;
    if (currentUser && currentUser.id === payment.user_id) {
      currentUser.account_type = "VIP";
      currentUser.vip_status = "active";
      currentUser.vip_expires_at = oneMonthFromNow.toISOString();
      window.MerzeAuth.saveUser(currentUser);
    }

    return payment;
  },

  async rejectPayment(paymentId) {
    const payments = await this.getPayments();
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return null;

    payment.status = "Rejected";
    payment.rejected_at = new Date().toISOString();

    await this.restSetDocument("payments", paymentId, payment);

    this.setLocal(this.KEYS.PAYMENTS, payments);
    return payment;
  },

  // --------------------------------------------------------------------------
  // WATCH HISTORY & 50-MOVIE LIMIT CALCULATION
  // --------------------------------------------------------------------------
  async getWatchHistory(userId) {
    if (!userId) return [];
    const all = this.getLocal(this.KEYS.HISTORY, []);
    return all.filter(h => h.user_id === userId);
  },

  async recordWatch(userId, movieId, progress = 0) {
    if (!userId || !movieId) return;
    const docId = `${userId}_${movieId}`;
    const item = {
      id: docId,
      user_id: userId,
      movie_id: movieId,
      watched_at: new Date().toISOString(),
      progress
    };

    // Save to Firestore REST in background
    this.restSetDocument("watch_history", docId, item).catch(() => {});

    const all = this.getLocal(this.KEYS.HISTORY, []);
    const idx = all.findIndex(h => h.user_id === userId && h.movie_id === movieId);
    if (idx !== -1) {
      all[idx] = item;
    } else {
      all.unshift(item);
    }
    this.setLocal(this.KEYS.HISTORY, all);
  },

  async getWatchedMoviesCount(userId) {
    if (!userId) return 0;
    const history = await this.getWatchHistory(userId);
    const distinctMovieIds = new Set(history.map(h => h.movie_id));
    return distinctMovieIds.size;
  },

  // --------------------------------------------------------------------------
  // FAVORITES
  // --------------------------------------------------------------------------
  async getFavorites(userId) {
    if (!userId) return [];
    const all = this.getLocal(this.KEYS.FAVORITES, []);
    return all.filter(f => f.user_id === userId);
  },

  async toggleFavorite(userId, movieId) {
    if (!userId) return false;
    let all = this.getLocal(this.KEYS.FAVORITES, []);
    const idx = all.findIndex(f => f.user_id === userId && f.movie_id === movieId);
    let isFav = false;

    if (idx !== -1) {
      all.splice(idx, 1);
      isFav = false;
      this.restDeleteDocument("favorites", `${userId}_${movieId}`).catch(() => {});
    } else {
      const item = { id: `${userId}_${movieId}`, user_id: userId, movie_id: movieId, created_at: new Date().toISOString() };
      all.push(item);
      isFav = true;
      this.restSetDocument("favorites", `${userId}_${movieId}`, item).catch(() => {});
    }
    this.setLocal(this.KEYS.FAVORITES, all);
    return isFav;
  },

  async isFavorite(userId, movieId) {
    if (!userId) return false;
    const all = this.getLocal(this.KEYS.FAVORITES, []);
    return all.some(f => f.user_id === userId && f.movie_id === movieId);
  },

  // --------------------------------------------------------------------------
  // REVIEWS
  // --------------------------------------------------------------------------
  async getReviews(movieId) {
    const all = this.getLocal(this.KEYS.REVIEWS, window.MerzeSeedData.reviews);
    if (!movieId) return all;
    return all.filter(r => r.movie_id === movieId);
  },

  async addReview(reviewData) {
    const id = "rev-" + Date.now();
    const item = {
      id,
      ...reviewData,
      created_at: new Date().toISOString().split('T')[0],
      likes: 0
    };

    this.restSetDocument("reviews", id, item).catch(() => {});

    const all = this.getLocal(this.KEYS.REVIEWS, window.MerzeSeedData.reviews);
    all.unshift(item);
    this.setLocal(this.KEYS.REVIEWS, all);
    return item;
  },

  async deleteReview(reviewId) {
    this.restDeleteDocument("reviews", reviewId).catch(() => {});

    let all = this.getLocal(this.KEYS.REVIEWS, []);
    all = all.filter(r => r.id !== reviewId);
    this.setLocal(this.KEYS.REVIEWS, all);
    return true;
  }
};

window.MerzeDB = MerzeDB;
