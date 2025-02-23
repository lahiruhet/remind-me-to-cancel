"use client";

import { useState, useEffect, useCallback } from "react";
import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { subscriptionService } from "@/lib/subscription-service";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);

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
    loadSubscriptions();
  }, [loadSubscriptions]);

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

  const confirmDeleteSubscription = useCallback((subscription: Subscription) => {
    setSubscriptionToDelete(subscription);
  }, []);

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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Subscription Manager
        </h1>
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
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingSubscription ? "Edit Subscription" : "Add New Subscription"}
            </h3>
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

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <SubscriptionList
            subscriptions={subscriptions}
            onEdit={setEditingSubscription}
            onDelete={confirmDeleteSubscription}
            isLoading={isLoading}
          />
        </div>
      </div>

      {subscriptionToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete the subscription "${subscriptionToDelete.name}"?`}
          onConfirm={handleDeleteSubscription}
          onCancel={handleCancelDelete}
        />
      )}
    </main>
  );
}
