import type {ITransactionRepository, Result} from "../ports/transaction-interface.ts";
import type {TransactionError} from "../domain/errors/transaction-errors.ts";
import {TransactionId} from "../domain/value-objects/transaction-id.ts";
import type {Transaction} from "../domain/entities/transaction.ts";

export class GetTransactionDetailUseCase {
    private readonly repository: ITransactionRepository

    constructor(repository: ITransactionRepository) {
        this.repository = repository
    }

    async execute(transactionId: string): Promise<Result<Transaction, TransactionError>> {
        try {
            const id = TransactionId.create(transactionId);
            return this.repository.findById(id);
        } catch (error) {
            return {
                success: false,
                error: error as TransactionError,
            };
        }
    }
}