import type {ITransactionRepository, Result} from "../ports/transaction-interface.ts";
import {TransactionCannotBeCancelledError, type TransactionError} from "../domain/errors/transaction-errors.ts";
import {TransactionId} from "../domain/value-objects/transaction-id.ts";
import type {Transaction} from "../domain/entities/transaction.ts";


export class CancelTransactionUseCase {
    private readonly repository: ITransactionRepository

    constructor(repository: ITransactionRepository) {
        this.repository = repository
    }


    async execute(transactionId: string): Promise<Result<Transaction, TransactionError>> {
        try {
            const id = TransactionId.create(transactionId);

            const transactionResult = await this.repository.findById(id);

            if (!transactionResult.success) {
                return transactionResult;
            }

            const transaction = transactionResult.value;

            if (!transaction.canCancel()) {
                return {
                    success: false,
                    error: new TransactionCannotBeCancelledError(id.value),
                };
            }

            return this.repository.cancel(id);
        } catch (error) {
            return {
                success: false,
                error: error as TransactionError,
            };
        }
    }
}