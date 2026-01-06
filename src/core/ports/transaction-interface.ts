import type {Currency, TransactionStatus} from "../../shared/types";
import {Transaction} from "../domain/entities/transaction";
import {TransactionError} from "../domain/errors/transaction-errors";
import {TransactionId} from "../domain/value-objects/transaction-id";

export interface TransactionFilters {
    search?: string;
    statuses?: TransactionStatus[];
    dateFrom?: Date;
    dateTo?: Date;
    amountMin?: number;
    amountMax?: number;
    currency?: Currency;
}

export interface Pagination {
    page: number;
    pageSize: number;
}

export interface SortOptions {
    sortBy?: 'date' | 'amount' | 'status';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export type Result<T, E> = { success: true; value: T } | { success: false; error: E };

export interface ITransactionRepository {
    findAll(
        filters: TransactionFilters,
        pagination: Pagination,
        sort?: SortOptions
    ): Promise<Result<PaginatedResult<Transaction>, TransactionError>>;

    findById(id: TransactionId): Promise<Result<Transaction, TransactionError>>;

    retry(id: TransactionId): Promise<Result<Transaction, TransactionError>>;

    cancel(id: TransactionId): Promise<Result<Transaction, TransactionError>>;
}