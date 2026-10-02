// ==========================================================================
// Firebase Integration Service - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyB9FtR8ScsNNaUWaI1s9NggtFP5eokdeqM",
  authDomain: "medad-zhar.firebaseapp.com",
  projectId: "medad-zhar",
  storageBucket: "medad-zhar.firebasestorage.app",
  messagingSenderId: "796923480019",
  appId: "1:796923480019:web:30d64b687e1cd20a869126",
  measurementId: "G-Q8K6DKPS42"
};

export class FirebaseService {
  static isFirebaseInitialized = false;
  static app = null;
  static auth = null;
  static db = null;
  static storage = null;

  static async initFirebase() {
    try {
      // Dynamic import of Firebase v10 SDKs for Web ES Modules
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
      const { getAuth, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
      const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const { getStorage } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js');

      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);
      this.googleProvider = new GoogleAuthProvider();

      this.isFirebaseInitialized = true;
      console.log('🔥 Medad Zahr Successfully Connected to Firebase Cloud Firestore!');
      return true;
    } catch (e) {
      console.warn('Firebase initialized with REST API / Local Storage Fallback:', e.message);
      this.isFirebaseInitialized = false;
      return false;
    }
  }

  // --- Real-time Cloud Firestore Data Listener for All Users ---
  static async listenToCloudData({ onBooks, onPoems, onQuotes, onUsers }) {
    if (!this.isFirebaseInitialized || !this.db) return;
    try {
      const { collection, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

      // 1. Live Listen Books
      if (onBooks) {
        onSnapshot(collection(this.db, 'books'), (snapshot) => {
          const cloudBooks = [];
          snapshot.forEach(doc => {
            cloudBooks.push({ id: doc.id, ...doc.data() });
          });
          onBooks(cloudBooks);
        }, (err) => console.warn('Firestore Books Listener Warning:', err.message));
      }

      // 2. Live Listen Poems
      if (onPoems) {
        onSnapshot(collection(this.db, 'poems'), (snapshot) => {
          const cloudPoems = [];
          snapshot.forEach(doc => {
            cloudPoems.push({ id: doc.id, ...doc.data() });
          });
          onPoems(cloudPoems);
        }, (err) => console.warn('Firestore Poems Listener Warning:', err.message));
      }

      // 3. Live Listen Quotes
      if (onQuotes) {
        onSnapshot(collection(this.db, 'quotes'), (snapshot) => {
          const cloudQuotes = [];
          snapshot.forEach(doc => {
            cloudQuotes.push({ id: doc.id, ...doc.data() });
          });
          onQuotes(cloudQuotes);
        }, (err) => console.warn('Firestore Quotes Listener Warning:', err.message));
      }

      // 4. Live Listen Users
      if (onUsers) {
        onSnapshot(collection(this.db, 'users'), (snapshot) => {
          const cloudUsers = [];
          snapshot.forEach(doc => {
            cloudUsers.push({ id: doc.id, ...doc.data() });
          });
          onUsers(cloudUsers);
        }, (err) => console.warn('Firestore Users Listener Warning:', err.message));
      }
    } catch (err) {
      console.error('Firebase Realtime Listeners Error:', err);
    }
  }

  // --- Save Book to Cloud Firestore (100% Compatible with Spark Free Plan) ---
  static async saveCloudBook(bookData, pdfFile = null) {
    if (!this.isFirebaseInitialized || !this.db) return null;
    try {
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      let pdfDownloadUrl = bookData.pdfUrl || '';

      // 1. Prepare Base64 fallback if PDF file is provided
      let pdfBase64 = null;
      if (pdfFile) {
        try {
          pdfBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(pdfFile);
          });
        } catch (rErr) {
          console.warn('FileReader error:', rErr);
        }
      }

      // 2. Optional Cloud Storage upload (safely ignored if on Spark free plan)
      if (pdfFile && this.storage) {
        try {
          const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js');
          const storageRef = ref(this.storage, `pdfs/${Date.now()}_${pdfFile.name}`);
          const uploadResult = await uploadBytes(storageRef, pdfFile);
          pdfDownloadUrl = await getDownloadURL(uploadResult.ref);
        } catch (stErr) {
          console.warn('Firebase Storage fallback (Spark Free Plan):', stErr.message);
          pdfDownloadUrl = pdfBase64 || bookData.pdfUrl || '';
        }
      } else if (pdfBase64) {
        pdfDownloadUrl = pdfBase64;
      }

      const bookId = String(bookData.id || `b-${Date.now()}`);
      const payload = {
        ...bookData,
        id: bookId,
        pdfUrl: pdfDownloadUrl,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(this.db, 'books', bookId), payload, { merge: true });
      console.log('✅ Book successfully saved to Cloud Firestore for all users!');
      return payload;
    } catch (err) {
      console.error('Firebase Book Save Error:', err);
      return null;
    }
  }

  // --- Delete Book from Cloud Firestore ---
  static async deleteCloudBook(bookId) {
    if (!this.isFirebaseInitialized || !this.db) return false;
    try {
      const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      await deleteDoc(doc(this.db, 'books', String(bookId)));
      return true;
    } catch (err) {
      console.error('Firebase Delete Book Error:', err);
      return false;
    }
  }

  // --- Save Poem to Cloud Firestore ---
  static async saveCloudPoem(poemData) {
    if (!this.isFirebaseInitialized || !this.db) return null;
    try {
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const poemId = String(poemData.id || `p-${Date.now()}`);
      const payload = {
        ...poemData,
        id: poemId,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(this.db, 'poems', poemId), payload, { merge: true });
      return payload;
    } catch (err) {
      console.error('Firebase Poem Save Error:', err);
      return null;
    }
  }

  // --- Delete Poem from Cloud Firestore ---
  static async deleteCloudPoem(poemId) {
    if (!this.isFirebaseInitialized || !this.db) return false;
    try {
      const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      await deleteDoc(doc(this.db, 'poems', String(poemId)));
      return true;
    } catch (err) {
      console.error('Firebase Delete Poem Error:', err);
      return false;
    }
  }

  // --- Save Quote to Cloud Firestore ---
  static async saveCloudQuote(quoteText, bookTitle, author) {
    if (!this.isFirebaseInitialized || !this.db) return null;
    try {
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const quoteId = `q-${Date.now()}`;
      const payload = {
        id: quoteId,
        quoteText,
        bookTitle,
        author,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(this.db, 'quotes', quoteId), payload, { merge: true });
      return payload;
    } catch (err) {
      console.error('Firebase Quote Save Error:', err);
      return null;
    }
  }

  // --- Sync User Account to Cloud Firestore ---
  static async syncCloudUser(userData) {
    if (!this.isFirebaseInitialized || !this.db) return null;
    try {
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const userId = String(userData.id || userData.username || `usr-${Date.now()}`);
      const userRef = doc(this.db, 'users', userId);
      await setDoc(userRef, { ...userData, id: userId, updatedAt: new Date().toISOString() }, { merge: true });
      return userData;
    } catch (err) {
      console.error('Firebase User Sync Error:', err);
      return null;
    }
  }
}
