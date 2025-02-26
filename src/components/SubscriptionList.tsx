import { Subscription } from "@/types/subscription";
import { SubscriptionRow } from "./SubscriptionRow";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
  isLoading?: boolean;
  sortField: "renewalDate" | "cost" | null;
  sortDirection: "asc" | "desc";
  onSort: (field: "renewalDate" | "cost") => void;
}

export function SubscriptionList({
  subscriptions,
  onEdit,
  onDelete,
  isLoading,
  sortField,
  sortDirection,
  onSort,
}: SubscriptionListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No subscriptions found. Add one to get started!
      </div>
    );
  }

  const SortHeader = ({
    field,
    label,
  }: {
    field: "cost" | "renewalDate";
    label: string;
  }) => {
    const isSorted = sortField === field;
    return (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <button
          className="flex items-center space-x-1 focus:outline-none group"
          onClick={() => onSort(field)}
        >
          <span>{label}</span>
          <span
            className={`transform transition-transform ${
              isSorted ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`}
          >
            {isSorted && sortDirection === "asc" ? "↑" : "↓"}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Purchase Date
            </th>
            <SortHeader field="renewalDate" label="Days Until Renewal" />
            <SortHeader field="cost" label="Cost" />
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Frequency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscriptions.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
