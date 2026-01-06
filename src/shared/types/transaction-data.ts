export type TransactionStatusDto = 'pending' | 'completed' | 'failed' | 'cancelled';
export type CurrencyDto = 'XOF' | 'EUR' | 'USD';

export interface StatusHistoryEntryDto {
    status: TransactionStatusDto;
    timestamp: string;
    reason?: string;
}

export interface BeneficiaryDto {
    name: string;
    iban: string;
    bankName: string;
}

export interface TransactionDto {
    id: string;
    reference: string;
    amount: number;
    currency: CurrencyDto;
    status: TransactionStatusDto;
    beneficiary: BeneficiaryDto;
    createdAt: string;
    updatedAt: string;
    statusHistory: StatusHistoryEntryDto[];
    failureReason?: string;
}