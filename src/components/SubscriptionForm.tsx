import { useEffect } from "react";
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

export function SubscriptionForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: SubscriptionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    defaultValues: {
      name: initialData?.name || "",
      renewalDate:
        initialData?.renewalDate || new Date().toISOString().split("T")[0],
      cost: initialData?.cost || 0,
      frequency: initialData?.frequency || "Monthly",
      status: initialData?.status || "Active",
      notes: initialData?.notes || "",
    },
  });

  useEffect(() => {
    reset({
      name: initialData?.name || "",
      renewalDate:
        initialData?.renewalDate || new Date().toISOString().split("T")[0],
      cost: initialData?.cost || 0,
      frequency: initialData?.frequency || "Monthly",
      status: initialData?.status || "Active",
      notes: initialData?.notes || "",
    });
  }, [initialData, reset]);

  const onFormSubmit = async (data: SubscriptionFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
        <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700">
          Renewal Date *
        </label>
        <input
          type="date"
          id="renewalDate"
          {...register("renewalDate", { required: "Renewal date is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.renewalDate && (
          <span className="text-red-600 text-sm">{errors.renewalDate.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
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
        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
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
          <span className="text-red-600 text-sm">{errors.frequency.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
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
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
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
