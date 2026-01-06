import type {ITransactionRepository, Result} from "../ports/transaction-interface.ts";
import {TransactionCannotBeRetriedError, type TransactionError} from "../domain/errors/transaction-errors.ts";
import {TransactionId} from "../domain/value-objects/transaction-id.ts";
import type {Transaction} from "../domain/entities/transaction.ts";

export class RetryTransactionUseCase {
    private readonly repository: ITransactionRepository

    constructor(repository: ITransactionRepository) {
        this.repository = repository
    }


    async execute(transactionId: string): Promise<Result<Transaction, TransactionError>> {
        try {
            const id = TransactionId.create(transactionId);

            // Verify transaction exists and can be retried
            const transactionResult = await this.repository.findById(id);

            if (!transactionResult.success) {
                return transactionResult;
            }

            const transaction = transactionResult.value;

            if (!transaction.canRetry()) {
                return {
                    success: false,
                    error: new TransactionCannotBeRetriedError(id.value),
                };
            }

            return this.repository.retry(id);
        } catch (error) {
            return {
                success: false,
                error: error as TransactionError,
            };
        }
    }
}
