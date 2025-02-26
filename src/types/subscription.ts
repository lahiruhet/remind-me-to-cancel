export type SubscriptionFrequency =
  | "Monthly"
  | "Yearly"
  | "Quarterly"
  | "Weekly";
export type SubscriptionStatus = "Active" | "Cancelled" | "Paused";

export interface Subscription {
  id: string;
  name: string;
  renewalDate: string;
  cost: number;
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFormData {
  name: string;
  renewalDate: string;
  cost: number;
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  notes?: string;
}

export interface SubscriptionFormWithPurchaseDate
  extends Omit<SubscriptionFormData, "renewalDate"> {
  purchaseDate: string;
}
