// ==========================================================================
// Firebase Integration Service - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyBluFNKYARRM6TXRM_2_cqe4Diw65gTqNc",
  authDomain: "medad-zahr.firebaseapp.com",
  projectId: "medad-zahr",
  storageBucket: "medad-zahr.firebasestorage.app",
  messagingSenderId: "10461827397",
  appId: "1:10461827397:web:2362cc8c217e377aef6e2c",
  measurementId: "G-16BYJ9VHZ1"
};

export class FirebaseService {
  static isFirebaseInitialized = false;

  static async initFirebase() {
    try {
      // Dynamic import of Firebase v10 SDKs for Web ES Modules
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
      const { getAuth, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
      const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const { getStorage } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js');
      const { getAnalytics } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js');

      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);
      this.analytics = getAnalytics(this.app);
      this.googleProvider = new GoogleAuthProvider();

      this.isFirebaseInitialized = true;
      console.log('🔥 Medad Zahr Successfully Linked to Firebase Project: medad-zahr!');
      return true;
    } catch (e) {
      console.warn('Firebase initialized with REST API / Local Storage Fallback:', e.message);
      return false;
    }
  }

  // --- Upload PDF File to Firebase Storage ---
  static async uploadPDFBook(pdfFile, bookData) {
    if (!this.isFirebaseInitialized) return null;
    try {
      const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js');
      const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

      const storageRef = ref(this.storage, `pdfs/${Date.now()}_${pdfFile.name}`);
      const uploadResult = await uploadBytes(storageRef, pdfFile);
      const pdfDownloadUrl = await getDownloadURL(uploadResult.ref);

      const booksCol = collection(this.db, 'books');
      const docRef = await addDoc(booksCol, {
        ...bookData,
        pdfUrl: pdfDownloadUrl,
        createdAt: new Date().toISOString()
      });

      return { id: docRef.id, pdfUrl: pdfDownloadUrl };
    } catch (err) {
      console.error('Firebase PDF Upload Error:', err);
      return null;
    }
  }

  // --- Save Favorite Quote to Firestore ---
  static async saveQuote(quoteText, bookTitle, author) {
    if (!this.isFirebaseInitialized) return null;
    try {
      const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
      const quotesCol = collection(this.db, 'quotes');
      return await addDoc(quotesCol, {
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
}
