import { Money } from '../value-objects/money'
import { IBAN } from '../value-objects/iban'
import { TransactionId } from '../value-objects/transaction-id'

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface StatusHistoryEntry {
    status: TransactionStatus
    timestamp: Date
    reason?: string
}

export interface Beneficiary {
    name: string
    iban: IBAN
    bankName: string
}

export class Transaction {
    public readonly id: TransactionId
    public readonly reference: string
    public readonly amount: Money
    public readonly status: TransactionStatus
    public readonly beneficiary: Beneficiary
    public readonly createdAt: Date
    public readonly updatedAt: Date
    public readonly statusHistory: StatusHistoryEntry[]
    public readonly failureReason?: string

    constructor(
        id: TransactionId,
        reference: string,
        amount: Money,
        status: TransactionStatus,
        beneficiary: Beneficiary,
        createdAt: Date,
        updatedAt: Date,
        statusHistory: StatusHistoryEntry[] = [],
        failureReason?: string
    ) {
        this.id = id
        this.reference = reference
        this.amount = amount
        this.status = status
        this.beneficiary = beneficiary
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.statusHistory = statusHistory
        this.failureReason = failureReason
    }

    canRetry(): boolean {
        return this.status === 'failed'
    }

    canCancel(): boolean {
        return this.status === 'pending'
    }

    isCompleted(): boolean {
        return this.status === 'completed'
    }

    withStatus(
        newStatus: TransactionStatus,
        reason?: string
    ): Transaction {
        const newHistoryEntry: StatusHistoryEntry = {
            status: newStatus,
            timestamp: new Date(),
            reason,
        }

        return new Transaction(
            this.id,
            this.reference,
            this.amount,
            newStatus,
            this.beneficiary,
            this.createdAt,
            new Date(),
            [...this.statusHistory, newHistoryEntry],
            newStatus === 'failed' ? reason : undefined
        )
    }
}
