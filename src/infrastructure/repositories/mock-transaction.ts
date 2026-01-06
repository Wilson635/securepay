import { Transaction } from '../../core/domain/entities/transaction';
import { TransactionId } from '../../core/domain/value-objects/transaction-id';
import { TransactionError, TransactionNotFoundError } from '../../core/domain/errors/transaction-errors';
import { TransactionMapper } from '../mappers/transaction.mapper';
import type { ITransactionRepository } from "../../core/ports/transaction-interface.ts";
import type {TransactionFilters, Result, PaginatedResult, Pagination, SortOptions} from "../../core/ports/transaction-interface.ts";
import {mockTransactions} from "../../scripts/generate-mock-data.ts";

export class MockTransactionRepository implements ITransactionRepository {
    private transactions: Transaction[];

    constructor() {
        this.transactions = mockTransactions.map(dto => TransactionMapper.toDomain(dto));
    }

    async findAll(
        filters: TransactionFilters,
        pagination: Pagination,
        sort?: SortOptions
    ): Promise<Result<PaginatedResult<Transaction>, TransactionError>> {
        try {
            // Simulate network delay
            await this.delay(300 + Math.random() * 200);

            // Simulate random errors (10% chance)
            if (Math.random() < 0.1) {
                throw new Error('Network error: Failed to fetch transactions');
            }

            let filtered = [...this.transactions];

            // Apply filters
            if (filters.search) {
                const search = filters.search.toLowerCase();
                filtered = filtered.filter(
                    (t) =>
                        t.reference.toLowerCase().includes(search) ||
                        t.beneficiary.name.toLowerCase().includes(search)
                );
            }

            if (filters.statuses && filters.statuses.length > 0) {
                filtered = filtered.filter((t) => filters.statuses!.includes(t.status));
            }

            if (filters.dateFrom) {
                filtered = filtered.filter((t) => t.createdAt >= filters.dateFrom!);
            }

            if (filters.dateTo) {
                filtered = filtered.filter((t) => t.createdAt <= filters.dateTo!);
            }

            if (filters.amountMin !== undefined) {
                filtered = filtered.filter((t) => t.amount.amount >= filters.amountMin!);
            }

            if (filters.amountMax !== undefined) {
                filtered = filtered.filter((t) => t.amount.amount <= filters.amountMax!);
            }

            if (filters.currency) {
                filtered = filtered.filter((t) => t.amount.currency === filters.currency);
            }

            // Apply sorting
            if (sort?.sortBy) {
                filtered.sort((a, b) => {
                    let comparison = 0;

                    if (sort.sortBy === 'date') {
                        comparison = a.createdAt.getTime() - b.createdAt.getTime();
                    } else if (sort.sortBy === 'amount') {
                        comparison = a.amount.amount - b.amount.amount;
                    } else if (sort.sortBy === 'status') {
                        comparison = a.status.localeCompare(b.status);
                    }

                    return sort.sortOrder === 'desc' ? -comparison : comparison;
                });
            }

            const total = filtered.length;
            const totalPages = Math.ceil(total / pagination.pageSize);
            const start = (pagination.page - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            const data = filtered.slice(start, end);

            return {
                success: true,
                value: {
                    data,
                    total,
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    totalPages,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error as TransactionError,
            };
        }
    }

    async findById(id: TransactionId): Promise<Result<Transaction, TransactionError>> {
        await this.delay(200);

        const transaction = this.transactions.find((t) => t.id.equals(id));

        if (!transaction) {
            return {
                success: false,
                error: new TransactionNotFoundError(id.value),
            };
        }

        return { success: true, value: transaction };
    }

    async retry(id: TransactionId): Promise<Result<Transaction, TransactionError>> {
        await this.delay(500);

        const index = this.transactions.findIndex((t) => t.id.equals(id));

        if (index === -1) {
            return {
                success: false,
                error: new TransactionNotFoundError(id.value),
            };
        }

        const updatedTransaction = this.transactions[index].withStatus('pending', 'Transaction retried');
        this.transactions[index] = updatedTransaction;

        return { success: true, value: updatedTransaction };
    }

    async cancel(id: TransactionId): Promise<Result<Transaction, TransactionError>> {
        await this.delay(500);

        const index = this.transactions.findIndex((t) => t.id.equals(id));

        if (index === -1) {
            return {
                success: false,
                error: new TransactionNotFoundError(id.value),
            };
        }

        const updatedTransaction = this.transactions[index].withStatus('cancelled', 'Cancelled by user');
        this.transactions[index] = updatedTransaction;

        return { success: true, value: updatedTransaction };
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}