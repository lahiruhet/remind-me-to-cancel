"use client";

import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { useState, useEffect, useCallback } from "react";
import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { subscriptionService } from "@/lib/subscription-service";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { authService } from "@/lib/auth-service";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionToDelete, setSubscriptionToDelete] =
    useState<Subscription | null>(null);
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [sortField, setSortField] = useState<"renewalDate" | "cost" | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const loadSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await subscriptionService.getAll();
      setSubscriptions(data);
      setError(null);
    } catch (err) {
      setError("Failed to load subscriptions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setAuthInitialized(true);
    });

    // Try to sign in anonymously
    authService.signInAnonymously();

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  useEffect(() => {
    // Only load subscriptions after auth is initialized
    if (authInitialized) {
      loadSubscriptions();
    }
  }, [authInitialized, loadSubscriptions]);

  const handleCreateSubscription = useCallback(
    async (data: SubscriptionFormData) => {
      try {
        setIsLoading(true);
        await subscriptionService.create(data);
        await loadSubscriptions();
        setShowForm(false);
        setError(null);
      } catch (err) {
        setError("Failed to create subscription");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [loadSubscriptions]
  );

  const handleUpdateSubscription = useCallback(
    async (data: SubscriptionFormData) => {
      if (!editingSubscription) return;
      try {
        setIsLoading(true);
        await subscriptionService.update(editingSubscription.id, data);
        await loadSubscriptions();
        setEditingSubscription(null);
        setError(null);
      } catch (err) {
        setError("Failed to update subscription");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [editingSubscription, loadSubscriptions]
  );

  const confirmDeleteSubscription = useCallback(
    (subscription: Subscription) => {
      setSubscriptionToDelete(subscription);
    },
    []
  );

  const handleDeleteSubscription = useCallback(async () => {
    if (!subscriptionToDelete) return;
    try {
      setIsLoading(true);
      await subscriptionService.delete(subscriptionToDelete.id);
      await loadSubscriptions();
      setError(null);
      setSubscriptionToDelete(null);
    } catch (err) {
      setError("Failed to delete subscription");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionToDelete, loadSubscriptions]);

  const handleCancelDelete = useCallback(() => {
    setSubscriptionToDelete(null);
  }, []);

  const handleSort = (field: "cost" | "renewalDate") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedSubscriptions = useCallback(() => {
    if (!sortField) return subscriptions;

    return [...subscriptions].sort((a, b) => {
      if (sortField === "cost") {
        return sortDirection === "asc" ? a.cost - b.cost : b.cost - a.cost;
      } else if (sortField === "renewalDate") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dateA = new Date(a.renewalDate).getTime() - today.getTime();
        const dateB = new Date(b.renewalDate).getTime() - today.getTime();

        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  }, [subscriptions, sortField, sortDirection]);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Subscriptions</h1>
          {!showForm && !editingSubscription && (
            <Button onClick={() => setShowForm(true)}>Add Subscription</Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {(showForm || editingSubscription) && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingSubscription ? "Edit" : "Add"} Subscription
              </h2>
              <SubscriptionForm
                onSubmit={
                  editingSubscription
                    ? handleUpdateSubscription
                    : handleCreateSubscription
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditingSubscription(null);
                }}
                initialData={editingSubscription || undefined}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        <SubscriptionList
          subscriptions={getSortedSubscriptions()}
          onEdit={(subscription) => {
            setEditingSubscription(subscription);
            setShowForm(true);
          }}
          onDelete={confirmDeleteSubscription}
          isLoading={isLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {subscriptionToDelete && (
          <ConfirmModal
            title="Delete Subscription"
            message={`Are you sure you want to delete ${subscriptionToDelete.name}? This action cannot be undone.`}
            onConfirm={handleDeleteSubscription}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}
