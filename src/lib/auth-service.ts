import { auth } from "./firebase";
import {
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  signInAnonymously: async () => {
    try {
      // Check if already signed in
      if (auth.currentUser) {
        console.log("Already signed in:", auth.currentUser.uid);
        return;
      }

      await signInAnonymously(auth);
      console.log("Signed in anonymously");
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      // Don't throw the error to prevent app crashing
    }
  },

  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Listen for auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};
