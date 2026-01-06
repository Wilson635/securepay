import { useState } from 'react';
import type { TransactionFilters } from './useTransactions';
import {ExportTransactionsUseCase} from "../../core/use-cases/export-transactions.ts";
import {MockTransactionRepository} from "../../infrastructure/repositories/mock-transaction.ts";

const repository = new MockTransactionRepository();
const exportUseCase = new ExportTransactionsUseCase(repository);

interface UseExportTransactionsResult {
    exporting: boolean;
    error: string | null;
    exportToCSV: (filters: TransactionFilters) => Promise<void>;
}

export function useExportTransactions(): UseExportTransactionsResult {
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportToCSV = async (filters: TransactionFilters) => {
        setExporting(true);
        setError(null);

        const result = await exportUseCase.execute(filters);

        if (result.success) {
            // Create blob and download
            const blob = new Blob([result.value], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            const date = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `securepay_transactions_${date}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            setError(result.error.message);
        }

        setExporting(false);
    };

    return { exporting, error, exportToCSV };
}
