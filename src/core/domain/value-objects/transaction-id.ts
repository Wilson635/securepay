export class TransactionId {
    public readonly value: string

    private constructor(value: string) {
        this.value = value
    }

    static create(value: string): TransactionId {
        if (!value || value.trim().length === 0) {
            throw new Error('Transaction ID cannot be empty');
        }

        if (!/^txn_\d{5}$/.test(value)) {
            throw new Error('Invalid Transaction ID format. Expected: txn_XXXXX');
        }

        return new TransactionId(value);
    }

    static generate(index: number): TransactionId {
        return new TransactionId(`txn_${String(index).padStart(5, '0')}`);
    }

    equals(other: TransactionId): boolean {
        return this.value === other.value;
    }
}
