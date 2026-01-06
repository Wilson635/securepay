import * as React from "react";
import type {TransactionStatus} from "../../../shared/types";

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const config = {
        pending: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', label: 'En attente' },
        completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: 'Complété' },
        failed: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: 'Échoué' },
        cancelled: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-300', label: 'Annulé' },
    };

    const { bg, text, label } = config[status];

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
    );
};

export default StatusBadge;