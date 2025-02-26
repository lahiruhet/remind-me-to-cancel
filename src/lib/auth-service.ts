import { auth } from "./firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

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

  // Listen for auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};
