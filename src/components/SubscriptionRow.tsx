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

const calculateDaysUntilRenewal = (renewalDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renewal = new Date(renewalDate);
  const differenceInTime = renewal.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  if (differenceInDays < 0) {
    return `${Math.abs(differenceInDays)} days ago`;
  } else if (differenceInDays === 0) {
    return "Today";
  } else if (differenceInDays === 1) {
    return "Tomorrow";
  } else {
    return `${differenceInDays} days`;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

export function SubscriptionRow({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionRowProps) {
  // Calculate purchase date from renewal date and frequency
  const getPurchaseDate = () => {
    const renewalDate = new Date(subscription.renewalDate);

    switch (subscription.frequency) {
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

    return formatDate(renewalDate.toISOString());
  };

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
        {getPurchaseDate()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {calculateDaysUntilRenewal(subscription.renewalDate)}
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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(subscription)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(subscription)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}
