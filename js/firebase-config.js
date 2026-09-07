// ==========================================================================
// MERZE MOVIES (مەرزە موڤیز) - FIREBASE CONFIGURATION
// Connects to user's real Firebase Project: merzemovies
// ==========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyAvL1WKP1hnG0Uv-_gojBOH6rLDYhx8RYA",
  authDomain: "merzemovies.firebaseapp.com",
  projectId: "merzemovies",
  storageBucket: "merzemovies.firebasestorage.app",
  messagingSenderId: "446883870875",
  appId: "1:446883870875:web:159e48fd0db5fa3955ee3e",
  measurementId: "G-CB1FVBH1YN"
};

// Initialize Firebase instances
let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;
let isFirebaseConnected = false;

try {
  if (typeof firebase !== 'undefined') {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firestoreDb = firebase.firestore();
    firebaseAuth = firebase.auth();
    isFirebaseConnected = true;
    console.log("✅ Merze Movies: بە سەرکەوتوویی بە Firebase بەسترایەوە (merzemovies)");

    // Ensure client has active auth state for Firestore security rules
    firebaseAuth.onAuthStateChanged((user) => {
      if (!user) {
        firebaseAuth.signInAnonymously().catch(err => {
          console.warn("Anonymous sign-in info:", err.message);
        });
      }
    });
  } else {
    console.warn("⚠️ Firebase SDK بارنەکراوە، دۆخی پاشەکەوتی خۆجێیی بەکاردێت.");
  }
} catch (err) {
  console.error("❌ هەڵە لە بەستنەوە بە Firebase:", err);
}

window.MerzeFirebase = {
  config: firebaseConfig,
  app: firebaseApp,
  db: firestoreDb,
  auth: firebaseAuth,
  isConnected: () => isFirebaseConnected
};
