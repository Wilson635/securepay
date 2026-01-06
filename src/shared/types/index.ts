type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
type Currency = 'XOF' | 'EUR' | 'USD';

interface Transaction {
    id: string;
    reference: string;
    amount: number;
    currency: Currency;
    status: TransactionStatus;
    beneficiary: {
        name: string;
        iban: string;
        bankName: string;
    };
    createdAt: string;
    updatedAt: string;
    failureReason: string;

}

export type { Transaction, TransactionStatus, Currency };