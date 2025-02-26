"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { authService } from "@/lib/auth-service";
import { Button } from "./ui/Button";

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName || "User"}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className="text-sm">
        <div className="font-medium">{user.displayName || "User"}</div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleSignOut}
        isLoading={isLoading}
      >
        Sign Out
      </Button>
    </div>
  );
}
