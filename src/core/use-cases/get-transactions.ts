import type {
    ITransactionRepository,
    PaginatedResult,
    Pagination,
    Result,
    SortOptions,
    TransactionFilters
} from "../ports/transaction-interface.ts";
import type {Transaction} from "../domain/entities/transaction.ts";
import {
    InvalidAmountRangeError,
    InvalidDateRangeError,
    type TransactionError
} from "../domain/errors/transaction-errors.ts";

export class GetTransactionsUseCase {
    private readonly repository: ITransactionRepository

    constructor(repository: ITransactionRepository) {
        this.repository = repository
    }


    async execute(
        filters: TransactionFilters,
        pagination: Pagination,
        sort?: SortOptions
    ): Promise<Result<PaginatedResult<Transaction>, TransactionError>> {
        // Validate amount range
        if (filters.amountMin !== undefined && filters.amountMax !== undefined) {
            if (filters.amountMin > filters.amountMax) {
                return { success: false, error: new InvalidAmountRangeError() };
            }
        }

        // Validate date range
        if (filters.dateFrom && filters.dateTo) {
            if (filters.dateFrom > filters.dateTo) {
                return { success: false, error: new InvalidDateRangeError() };
            }
        }

        // Validate pagination
        if (pagination.page < 1) {
            pagination.page = 1;
        }

        if (pagination.pageSize < 1) {
            pagination.pageSize = 20;
        }

        return this.repository.findAll(filters, pagination, sort);
    }
}