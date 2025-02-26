import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "subscriptions";

export const subscriptionService = {
  getAll: async (): Promise<Subscription[]> => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error("User not authenticated when getting subscriptions");
        return []; // Return empty array instead of throwing error
      }

      console.log("Fetching subscriptions for userId:", userId);

      const subscriptionsQuery = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(subscriptionsQuery);
      console.log(`Found ${snapshot.docs.length} subscriptions`);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          renewalDate: data.renewalDate,
          cost: data.cost,
          frequency: data.frequency,
          status: data.status,
          notes: data.notes || undefined,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
        } as Subscription;
      });
    } catch (error) {
      console.error("Error getting subscriptions:", error);
      return []; // Return empty array on error
    }
  },

  create: async (data: SubscriptionFormData): Promise<Subscription> => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error("User not authenticated when creating subscription");
        throw new Error("User not authenticated");
      }

      console.log("Creating subscription for userId:", userId);

      const now = Timestamp.now();

      // Format the data for Firestore
      const subscriptionData = {
        userId, // Add the user ID to associate with this subscription
        name: data.name,
        renewalDate: data.renewalDate,
        cost: Number(data.cost), // Ensure this is a number
        frequency: data.frequency,
        status: data.status,
        notes: data.notes || null, // Use null instead of undefined
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        subscriptionData
      );

      console.log("Created subscription with ID:", docRef.id);

      return {
        id: docRef.id,
        ...data,
        createdAt: now.toDate().toISOString(),
        updatedAt: now.toDate().toISOString(),
      };
    } catch (error) {
      console.error("Error creating subscription:", error);
      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  },

  update: async (
    id: string,
    data: SubscriptionFormData
  ): Promise<Subscription> => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      console.log(`Updating subscription ${id} for userId: ${userId}`);

      const docRef = doc(db, COLLECTION_NAME, id);

      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);
      console.log(`Updated subscription ${id}`);

      // Get the updated document to return
      const updatedSubscription: Subscription = {
        id,
        ...data,
        createdAt: "", // This will be filled on the next line
        updatedAt: new Date().toISOString(),
      };

      // Note: In a real-world scenario, you might want to get the actual document
      // after update to ensure data consistency, but for simplicity we're constructing it

      return updatedSubscription;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      console.log(`Deleting subscription ${id} for userId: ${userId}`);

      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      console.log(`Deleted subscription ${id}`);
    } catch (error) {
      console.error("Error deleting subscription:", error);
      throw error;
    }
  },
};
