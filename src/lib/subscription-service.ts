import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { v4 as uuidv4 } from "uuid";

// Mock data
let subscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    renewalDate: "2024-04-01",
    cost: 15.99,
    frequency: "Monthly",
    status: "Active",
    notes: "Premium plan",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Spotify",
    renewalDate: "2024-04-15",
    cost: 9.99,
    frequency: "Monthly",
    status: "Active",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    renewalDate: "2025-03-01",
    cost: 599.99,
    frequency: "Yearly",
    status: "Active",
    notes: "All apps plan",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
];

export const subscriptionService = {
  getAll: async (): Promise<Subscription[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return subscriptions;
  },

  create: async (data: SubscriptionFormData): Promise<Subscription> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newSubscription: Subscription = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    subscriptions.push(newSubscription);
    return newSubscription;
  },

  update: async (
    id: string,
    data: SubscriptionFormData
  ): Promise<Subscription> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = subscriptions.findIndex((sub) => sub.id === id);
    if (index === -1) throw new Error("Subscription not found");

    const updatedSubscription: Subscription = {
      ...subscriptions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    subscriptions[index] = updatedSubscription;
    return updatedSubscription;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = subscriptions.findIndex((sub) => sub.id === id);
    if (index === -1) throw new Error("Subscription not found");
    subscriptions = subscriptions.filter((sub) => sub.id !== id);
  },
};
