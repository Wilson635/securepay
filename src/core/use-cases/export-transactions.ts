import type {ITransactionRepository, Result, TransactionFilters} from "../ports/transaction-interface.ts";
import {ExportLimitExceededError, type TransactionError} from "../domain/errors/transaction-errors.ts";
import type {Transaction, TransactionStatus} from "../domain/entities/transaction.ts";

export class ExportTransactionsUseCase {
    private readonly MAX_EXPORT_LIMIT = 10000;

    private readonly repository: ITransactionRepository

    constructor(repository: ITransactionRepository) {
        this.repository = repository
    }


    async execute(
        filters: TransactionFilters
    ): Promise<Result<string, TransactionError>> {
        // Get all filtered transactions
        const result = await this.repository.findAll(
            filters,
            { page: 1, pageSize: this.MAX_EXPORT_LIMIT + 1 },
            { sortBy: 'date', sortOrder: 'desc' }
        );

        if (!result.success) {
            return result;
        }

        const { data, total } = result.value;

        // Check export limit
        if (total > this.MAX_EXPORT_LIMIT) {
            return {
                success: false,
                error: new ExportLimitExceededError(total, this.MAX_EXPORT_LIMIT),
            };
        }

        // Generate CSV
        const csv = this.generateCSV(data);
        return { success: true, value: csv };
    }

    private generateCSV(transactions: Transaction[]): string {
        // UTF-8 BOM for Excel compatibility
        const BOM = '\uFEFF';

        const headers = [
            'Date',
            'Référence',
            'Bénéficiaire',
            'IBAN',
            'Montant',
            'Devise',
            'Statut',
        ];

        const rows = transactions.map((t) => [
            t.createdAt.toLocaleString('fr-FR'),
            t.reference,
            t.beneficiary.name,
            t.beneficiary.iban.mask(),
            t.amount.amount.toString(),
            t.amount.currency,
            this.translateStatus(t.status),
        ]);

        const csvContent = [
            headers.join(';'),
            ...rows.map((row) => row.join(';')),
        ].join('\n');

        return BOM + csvContent;
    }

    private translateStatus(status: TransactionStatus): string {
        const translations: Record<TransactionStatus, string> = {
            pending: 'En attente',
            completed: 'Complété',
            failed: 'Échoué',
            cancelled: 'Annulé',
        };
        return translations[status];
    }
}
