import {useCallback, useEffect, useState} from "react";
import {Transaction, type TransactionStatus} from "../../core/domain/entities/transaction.ts";
import type {Currency} from "../../core/domain/value-objects/money.ts";
import { GetTransactionsUseCase } from "../../core/use-cases/get-transactions.ts";
import { MockTransactionRepository } from "../../infrastructure/repositories/mock-transaction.ts";

export interface TransactionFilters {
    search?: string;
    statuses?: TransactionStatus[];
    dateFrom?: Date;
    dateTo?: Date;
    amountMin?: number;
    amountMax?: number;
    currency?: Currency;
}

export interface SortOptions {
    sortBy?: 'date' | 'amount' | 'status';
    sortOrder?: 'asc' | 'desc';
}

interface UseTransactionsResult {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    total: number;
    currentPage: number;
    totalPages: number;
    filters: TransactionFilters;
    sort: SortOptions;
    setFilters: (filters: TransactionFilters) => void;
    setSort: (sort: SortOptions) => void;
    setPage: (page: number) => void;
    refresh: () => void;
}

const repository = new MockTransactionRepository();
const useCase = new GetTransactionsUseCase(repository);

export function useTransactions(pageSize: number = 20): UseTransactionsResult {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState<TransactionFilters>({});
    const [sort, setSort] = useState<SortOptions>({
        sortBy: 'date',
        sortOrder: 'desc',
    });

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);

        const result = await useCase.execute(
            filters,
            { page: currentPage, pageSize },
            sort
        );

        if (result.success) {
            setTransactions(result.value.data);
            setTotal(result.value.total);
            setTotalPages(result.value.totalPages);
        } else {
            setError(result.error.message);
            setTransactions([]);
        }

        setLoading(false);
    }, [filters, currentPage, pageSize, sort]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const refresh = useCallback(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        total,
        currentPage,
        totalPages,
        filters,
        sort,
        setFilters,
        setSort,
        setPage,
        refresh,
    };
}