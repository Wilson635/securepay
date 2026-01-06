import {GetTransactionDetailUseCase} from "../../core/use-cases/get-transaction-detail.ts";
import {CancelTransactionUseCase} from "../../core/use-cases/cancel-transaction.ts";
import {useCallback, useEffect, useState} from "react";
import type {Transaction} from "../../core/domain/entities/transaction.ts";
import {RetryTransactionUseCase} from "../../core/use-cases/retry-transaction.ts";
import {MockTransactionRepository} from "../../infrastructure/repositories/mock-transaction.ts";

interface UseTransactionDetailResult {
    transaction: Transaction | null;
    loading: boolean;
    error: string | null;
    retrying: boolean;
    cancelling: boolean;
    retry: () => Promise<void>;
    cancel: () => Promise<void>;
    refresh: () => void;
}

const repository = new MockTransactionRepository();

const detailUseCase = new GetTransactionDetailUseCase(repository);
const retryUseCase = new RetryTransactionUseCase(repository);
const cancelUseCase = new CancelTransactionUseCase(repository);

export function useTransactionDetail(
    transactionId: string | null,
    onSuccess?: () => void
): UseTransactionDetailResult {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retrying, setRetrying] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const fetchTransaction = useCallback(async () => {
        if (!transactionId) {
            setTransaction(null);
            return;
        }

        setLoading(true);
        setError(null);

        const result = await detailUseCase.execute(transactionId);

        if (result.success) {
            setTransaction(result.value);
        } else {
            setError(result.error.message);
            setTransaction(null);
        }

        setLoading(false);
    }, [transactionId]);

    useEffect(() => {
        fetchTransaction();
    }, [fetchTransaction]);

    const retry = async () => {
        if (!transactionId) return;

        setRetrying(true);
        setError(null);

        const result = await retryUseCase.execute(transactionId);

        if (result.success) {
            setTransaction(result.value);
            onSuccess?.();
        } else {
            setError(result.error.message);
        }

        setRetrying(false);
    };

    const cancel = async () => {
        if (!transactionId) return;

        setCancelling(true);
        setError(null);

        const result = await cancelUseCase.execute(transactionId);

        if (result.success) {
            setTransaction(result.value);
            onSuccess?.();
        } else {
            setError(result.error.message);
        }

        setCancelling(false);
    };

    const refresh = useCallback(() => {
        fetchTransaction();
    }, [fetchTransaction]);

    return {
        transaction,
        loading,
        error,
        retrying,
        cancelling,
        retry,
        cancel,
        refresh,
    };
}