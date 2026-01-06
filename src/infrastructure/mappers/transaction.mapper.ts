import type {TransactionDto} from "../../shared/types/transaction-data.ts";
import  { type Beneficiary, type StatusHistoryEntry, Transaction} from "../../core/domain/entities/transaction.ts";
import {IBAN} from "../../core/domain/value-objects/iban.ts";
import {TransactionId} from "../../core/domain/value-objects/transaction-id.ts";
import {Money} from "../../core/domain/value-objects/money.ts";

export class TransactionMapper {
    static toDomain(dto: TransactionDto): Transaction {
        const beneficiary: Beneficiary = {
            name: dto.beneficiary.name,
            iban: IBAN.create(dto.beneficiary.iban),
            bankName: dto.beneficiary.bankName,
        };

        const statusHistory: StatusHistoryEntry[] = dto.statusHistory.map((entry) => ({
            status: entry.status,
            timestamp: new Date(entry.timestamp),
            reason: entry.reason,
        }));

        return new Transaction(
            TransactionId.create(dto.id),
            dto.reference,
            Money.create(dto.amount, dto.currency),
            dto.status,
            beneficiary,
            new Date(dto.createdAt),
            new Date(dto.updatedAt),
            statusHistory,
            dto.failureReason
        );
    }

    static toDto(transaction: Transaction): TransactionDto {
        return {
            id: transaction.id.value,
            reference: transaction.reference,
            amount: transaction.amount.amount,
            currency: transaction.amount.currency,
            status: transaction.status,
            beneficiary: {
                name: transaction.beneficiary.name,
                iban: transaction.beneficiary.iban.value,
                bankName: transaction.beneficiary.bankName,
            },
            createdAt: transaction.createdAt.toISOString(),
            updatedAt: transaction.updatedAt.toISOString(),
            statusHistory: transaction.statusHistory.map((entry) => ({
                status: entry.status,
                timestamp: entry.timestamp.toISOString(),
                reason: entry.reason,
            })),
            failureReason: transaction.failureReason,
        };
    }
}