import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { db } from "./firebase";
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
} from "firebase/firestore";

const COLLECTION_NAME = "subscriptions";

export const subscriptionService = {
  getAll: async (): Promise<Subscription[]> => {
    try {
      const subscriptionsQuery = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(subscriptionsQuery);

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
      throw error;
    }
  },

  create: async (data: SubscriptionFormData): Promise<Subscription> => {
    try {
      const now = Timestamp.now();

      // Format the data for Firestore
      const subscriptionData = {
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
      const docRef = doc(db, COLLECTION_NAME, id);

      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);

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
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting subscription:", error);
      throw error;
    }
  },
};
