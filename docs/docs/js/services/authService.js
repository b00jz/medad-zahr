// ==========================================================================
// Authentication Service (User-driven & Google OAuth) - مِدادُ زَهْر
// ==========================================================================

import { store } from './store.js';
import { FirebaseService } from './firebase.js';

export class AuthService {
  /**
   * Create a clean initial user profile structure with 0 stats
   */
  static createCleanUserProfile({ name, username, email, bio = '', avatar = '', provider = 'email', role = 'user' }) {
    return {
      id: 'usr-' + Date.now(),
      name: name || username || 'قارئ جديد',
      username: username || (email ? email.split('@')[0] : 'user_' + Math.floor(Math.random() * 10000)),
      email: email || '',
      bio: bio || 'عضو في منصة مِدادُ زَهْر للقراءة والأدب.',
      role: role,
      provider: provider,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      stats: {
        booksRead: 0,
        pagesRead: 0,
        quotesSaved: 0,
        booksAdded: 0,
        poemsAdded: 0,
        streakDays: 1
      },
      shelf: {
        currentlyReading: [],
        wishlist: [],
        favorites: [],
        completed: []
      }
    };
  }

  /**
   * Google OAuth Login using real user credential or custom details
   */
  static async loginWithGoogle(userInfo = null) {
    let userPayload = userInfo;

    // Try Firebase Google Sign In if available
    if (!userPayload && FirebaseService.isFirebaseInitialized && FirebaseService.auth) {
      try {
        const { signInWithPopup, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
        const result = await signInWithPopup(FirebaseService.auth, new GoogleAuthProvider());
        if (result && result.user) {
          const gUser = result.user;
          userPayload = {
            name: gUser.displayName || 'مستخدم Google',
            username: gUser.email ? gUser.email.split('@')[0] : 'google_user',
            email: gUser.email || '',
            avatar: gUser.photoURL,
            provider: 'google'
          };
        }
      } catch (err) {
        console.warn('Firebase Google Sign-In popup closed or unconfigured:', err.message);
      }
    }

    if (!userPayload) {
      return { success: false, needDetails: true, message: 'Google authentication requires user details.' };
    }

    const newUser = this.createCleanUserProfile({
      name: userPayload.name,
      username: userPayload.username,
      email: userPayload.email,
      bio: userPayload.bio || 'تم التسجيل بواسطة حساب Google',
      avatar: userPayload.avatar,
      provider: 'google'
    });

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          store.setUser(data.user);
          return { success: true, user: data.user };
        }
      }
    } catch (e) {
      console.warn('Backend API Offline, using local store.');
    }

    store.setUser(newUser);
    return { success: true, user: newUser };
  }

  /**
   * Email & Password Login / Registration
   */
  static async loginWithEmail(email, password, name = '', username = '', bio = '') {
    if (!email) return { success: false, error: 'البريد الإلكتروني مطلوب' };

    const newUser = this.createCleanUserProfile({
      name: name || username || email.split('@')[0],
      username: username || email.split('@')[0],
      email: email,
      bio: bio || 'عضو جديد عبر البريد الإلكتروني',
      provider: 'email'
    });

    try {
      const res = await fetch('/api/auth/email/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          store.setUser(data.user);
          return { success: true, user: data.user };
        }
      }
    } catch (e) {
      console.warn('Backend API Offline, using local store.');
    }

    store.setUser(newUser);
    return { success: true, user: newUser };
  }

  /**
   * Update Profile Details (Name, Username, Bio, Avatar)
   */
  static updateProfileDetails(updates) {
    if (!store.state.user) return false;
    store.updateUserProfile(updates);
    return true;
  }

  /**
   * Logout user and reset to guest
   */
  static logout() {
    store.logoutUser();
  }
}
