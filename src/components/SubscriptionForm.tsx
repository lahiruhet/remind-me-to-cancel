import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Subscription,
  SubscriptionFormData,
  SubscriptionFrequency,
  SubscriptionStatus,
} from "@/types/subscription";
import { Button } from "./ui/Button";

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Subscription;
  isLoading?: boolean;
}

const frequencies: SubscriptionFrequency[] = [
  "Monthly",
  "Yearly",
  "Quarterly",
  "Weekly",
];
const statuses: SubscriptionStatus[] = ["Active", "Cancelled", "Paused"];

// Add a helper function for formatting dates
const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
};

export function SubscriptionForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: SubscriptionFormProps) {
  // Calculate initial purchase date if editing
  const calculateInitialPurchaseDate = () => {
    if (!initialData?.renewalDate)
      return new Date().toISOString().split("T")[0];

    const renewalDate = new Date(initialData.renewalDate);

    switch (initialData.frequency) {
      case "Monthly":
        renewalDate.setMonth(renewalDate.getMonth() - 1);
        break;
      case "Yearly":
        renewalDate.setFullYear(renewalDate.getFullYear() - 1);
        break;
      case "Quarterly":
        renewalDate.setMonth(renewalDate.getMonth() - 3);
        break;
      case "Weekly":
        renewalDate.setDate(renewalDate.getDate() - 7);
        break;
    }

    return renewalDate.toISOString().split("T")[0];
  };

  const [selectedFrequency, setSelectedFrequency] =
    useState<SubscriptionFrequency>(initialData?.frequency || "Monthly");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionFormData & { purchaseDate: string }>({
    defaultValues: {
      name: initialData?.name || "",
      purchaseDate: calculateInitialPurchaseDate(),
      cost: initialData?.cost || 0,
      frequency: initialData?.frequency || "Monthly",
      status: initialData?.status || "Active",
      notes: initialData?.notes || "",
    },
  });

  useEffect(() => {
    reset({
      name: initialData?.name || "",
      purchaseDate: calculateInitialPurchaseDate(),
      cost: initialData?.cost || 0,
      frequency: initialData?.frequency || "Monthly",
      status: initialData?.status || "Active",
      notes: initialData?.notes || "",
    });
    setSelectedFrequency(initialData?.frequency || "Monthly");
  }, [initialData, reset]);

  // Watch for frequency changes
  const frequency = watch("frequency");
  useEffect(() => {
    setSelectedFrequency(frequency as SubscriptionFrequency);
  }, [frequency]);

  const calculateRenewalDate = (
    purchaseDate: string,
    frequency: SubscriptionFrequency
  ) => {
    const date = new Date(purchaseDate);

    switch (frequency) {
      case "Monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "Yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
      case "Quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "Weekly":
        date.setDate(date.getDate() + 7);
        break;
    }

    return date.toISOString().split("T")[0];
  };

  const onFormSubmit = async (
    data: SubscriptionFormData & { purchaseDate: string }
  ) => {
    // Calculate renewal date from purchase date
    const renewalDate = calculateRenewalDate(data.purchaseDate, data.frequency);

    // Submit with calculated renewal date
    await onSubmit({
      name: data.name,
      renewalDate: renewalDate,
      cost: data.cost,
      frequency: data.frequency,
      status: data.status,
      notes: data.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name *
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.name && (
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="purchaseDate"
          className="block text-sm font-medium text-gray-700"
        >
          Purchase Date *
        </label>
        <input
          type="date"
          id="purchaseDate"
          {...register("purchaseDate", {
            required: "Purchase date is required",
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.purchaseDate && (
          <span className="text-red-600 text-sm">
            {errors.purchaseDate.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="cost"
          className="block text-sm font-medium text-gray-700"
        >
          Cost *
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="cost"
            step="0.01"
            {...register("cost", {
              required: "Cost is required",
              valueAsNumber: true,
              min: { value: 0, message: "Cost must be non-negative" },
            })}
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.cost && (
            <span className="text-red-600 text-sm">{errors.cost.message}</span>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="frequency"
          className="block text-sm font-medium text-gray-700"
        >
          Frequency *
        </label>
        <select
          id="frequency"
          {...register("frequency", { required: "Frequency is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {frequencies.map((freq) => (
            <option key={freq} value={freq}>
              {freq}
            </option>
          ))}
        </select>
        {errors.frequency && (
          <span className="text-red-600 text-sm">
            {errors.frequency.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Renewal Date (calculated)
        </label>
        <div className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50 text-sm text-gray-500">
          {formatDisplayDate(
            calculateRenewalDate(
              watch("purchaseDate") || new Date().toISOString().split("T")[0],
              selectedFrequency
            )
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status *
        </label>
        <select
          id="status"
          {...register("status", { required: "Status is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && (
          <span className="text-red-600 text-sm">{errors.status.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register("notes")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Update" : "Create"} Subscription
        </Button>
      </div>
    </form>
  );
}
