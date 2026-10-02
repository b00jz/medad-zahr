// ==========================================================================
// Firebase Integration Service - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyBwdnUGqysaMpADRocsaQpD3EFbgTpzNr8",
  authDomain: "medad-zahr-6373a.firebaseapp.com",
  projectId: "medad-zahr-6373a",
  storageBucket: "medad-zahr-6373a.firebasestorage.app",
  messagingSenderId: "1073256327944",
  appId: "1:1073256327944:web:be4ddd10b452f84d835abd",
  measurementId: "G-5C4BJPQV7R"
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

  // --- Save Book to Cloud Firestore & Storage ---
  static async saveCloudBook(bookData, pdfFile = null) {
    if (!this.isFirebaseInitialized || !this.db) return null;
    try {
      const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      let pdfDownloadUrl = null;

      if (pdfFile) {
        const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js');
        const storageRef = ref(this.storage, `pdfs/${Date.now()}_${pdfFile.name}`);
        const uploadResult = await uploadBytes(storageRef, pdfFile);
        pdfDownloadUrl = await getDownloadURL(uploadResult.ref);
      }

      const docRef = await addDoc(collection(this.db, 'books'), {
        ...bookData,
        pdfUrl: pdfDownloadUrl || bookData.pdfUrl || '',
        createdAt: new Date().toISOString()
      });

      return { id: docRef.id, ...bookData };
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
      await deleteDoc(doc(this.db, 'books', bookId));
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
      const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const docRef = await addDoc(collection(this.db, 'poems'), {
        ...poemData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...poemData };
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
      await deleteDoc(doc(this.db, 'poems', poemId));
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
      const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      return await addDoc(collection(this.db, 'quotes'), {
        quoteText,
        bookTitle,
        author,
        createdAt: new Date().toISOString()
      });
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
      const userRef = doc(this.db, 'users', userData.id || `usr-${Date.now()}`);
      await setDoc(userRef, { ...userData, updatedAt: new Date().toISOString() }, { merge: true });
      return userData;
    } catch (err) {
      console.error('Firebase User Sync Error:', err);
      return null;
    }
  }
}
