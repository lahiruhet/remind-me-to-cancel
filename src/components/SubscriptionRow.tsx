import { Subscription, SubscriptionStatus } from "@/types/subscription";
import { Button } from "./ui/Button";

interface SubscriptionRowProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

const getStatusColor = (status: SubscriptionStatus) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Paused":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function SubscriptionRow({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionRowProps) {
  return (
    <tr key={subscription.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {subscription.name}
        </div>
        {subscription.notes && (
          <div className="text-sm text-gray-500">{subscription.notes}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(subscription.renewalDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${subscription.cost.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {subscription.frequency}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
            subscription.status
          )}`}
        >
          {subscription.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <Button variant="secondary" size="sm" onClick={() => onEdit(subscription)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(subscription)}>
          Delete
        </Button>
      </td>
    </tr>
  );
}
