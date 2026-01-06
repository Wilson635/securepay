import { faker } from '@faker-js/faker';
import type {CurrencyDto, TransactionDto, TransactionStatusDto, StatusHistoryEntryDto} from "../shared/types/transaction-data.ts";

const STATUSES = ['pending', 'completed', 'failed', 'cancelled'] as const;
const CURRENCIES = ['XOF', 'EUR', 'USD'] as const;
const CURRENCY_WEIGHTS = { XOF: 0.7, EUR: 0.2, USD: 0.1 };

const BANKS_CI = [
    'Banque Atlantique CI',
    'BICICI',
    'Ecobank CI',
    'SGCI',
    'NSIA Banque',
    'Coris Bank CI',
    'UBA CI',
    'BNI',
    'Banque Populaire CI',
    'Versus Bank',
];

const FAILURE_REASONS = [
    'Solde insuffisant',
    'IBAN invalide',
    'Banque bénéficiaire indisponible',
    'Limite journalière dépassée',
    'Compte bénéficiaire clôturé',
    'Transaction suspecte détectée',
    'Erreur de connexion bancaire',
    'Données bénéficiaire incorrectes',
];

const COMPANY_TYPES = [
    'SARL',
    'SA',
    'SAS',
    'SASU',
    'GIE',
    'Coopérative',
    'Association',
    'ONG',
];


function selectWeightedCurrency(): CurrencyDto {
    const random = Math.random();
    let cumulative = 0;

    for (const [currency, weight] of Object.entries(CURRENCY_WEIGHTS)) {
        cumulative += weight;
        if (random <= cumulative) {
            return currency as CurrencyDto;
        }
    }

    return 'XOF';
}

function generateIBAN(currency: CurrencyDto): string {
    const countryCode = currency === 'XOF' ? 'CI' : currency === 'EUR' ? 'FR' : 'US';
    const checkDigits = faker.string.numeric(2);

    if (countryCode === 'CI') {
        // Format: CI93 XXXX XXXX XXXX XXXX XXXX
        const bankCode = faker.string.numeric(4);
        const accountNumber = faker.string.numeric(20);
        return `${countryCode}${checkDigits}${bankCode}${accountNumber}`;
    } else if (countryCode === 'FR') {
        // Format: FR76 XXXX XXXX XXXX XXXX XXXX XX
        const bankCode = faker.string.numeric(5);
        const branchCode = faker.string.numeric(5);
        const accountNumber = faker.string.numeric(11);
        const key = faker.string.numeric(2);
        return `${countryCode}${checkDigits}${bankCode}${branchCode}${accountNumber}${key}`;
    } else {
        // US format (simplified)
        const routingNumber = faker.string.numeric(9);
        const accountNumber = faker.string.numeric(12);
        return `${countryCode}${checkDigits}${routingNumber}${accountNumber}`;
    }
}

function generateCompanyName(): string {
    const hasType = Math.random() > 0.5;
    const baseName = faker.company.name();

    if (hasType) {
        const type = faker.helpers.arrayElement(COMPANY_TYPES);
        return `${baseName} ${type}`;
    }

    return baseName;
}

function generateStatusHistory(
    finalStatus: TransactionStatusDto,
    createdAt: Date
): StatusHistoryEntryDto[] {
    const history: StatusHistoryEntryDto[] = [];

    // Always start with pending
    history.push({
        status: 'pending',
        timestamp: createdAt.toISOString(),
        reason: 'Transaction créée',
    });

    // Add intermediate states based on final status
    if (finalStatus === 'completed') {
        // pending -> completed
        const completedDate = new Date(createdAt.getTime() + faker.number.int({ min: 60000, max: 7200000 }));
        history.push({
            status: 'completed',
            timestamp: completedDate.toISOString(),
            reason: 'Virement exécuté avec succès',
        });
    } else if (finalStatus === 'failed') {
        // pending -> failed
        const failedDate = new Date(createdAt.getTime() + faker.number.int({ min: 30000, max: 3600000 }));
        history.push({
            status: 'failed',
            timestamp: failedDate.toISOString(),
            reason: faker.helpers.arrayElement(FAILURE_REASONS),
        });
    } else if (finalStatus === 'cancelled') {
        // pending -> cancelled
        const cancelledDate = new Date(createdAt.getTime() + faker.number.int({ min: 10000, max: 1800000 }));
        history.push({
            status: 'cancelled',
            timestamp: cancelledDate.toISOString(),
            reason: 'Annulé par l\'utilisateur',
        });
    }

    return history;
}

function generateTransaction(index: number): TransactionDto {
    const status = faker.helpers.arrayElement(STATUSES);
    const currency = selectWeightedCurrency();
    const createdAt = faker.date.between({
        from: '2024-01-01T00:00:00.000Z',
        to: '2024-12-31T23:59:59.999Z'
    });

    // Generate realistic amounts based on currency
    let amount: number;
    if (currency === 'XOF') {
        // XOF amounts are typically large (no decimals)
        // Range: 50,000 to 50,000,000 FCFA
        amount = faker.number.int({ min: 50_000, max: 50_000_000 });
    } else if (currency === 'EUR') {
        // EUR amounts with 2 decimals
        // Range: 100 to 100,000 EUR
        amount = parseFloat(faker.finance.amount({ min: 100, max: 100_000, dec: 2 }));
    } else {
        // USD amounts with 2 decimals
        // Range: 100 to 100,000 USD
        amount = parseFloat(faker.finance.amount({ min: 100, max: 100_000, dec: 2 }));
    }

    const statusHistory = generateStatusHistory(status, createdAt);
    const lastHistoryEntry = statusHistory[statusHistory.length - 1];
    const failureReason = status === 'failed' ? lastHistoryEntry.reason : undefined;

    return {
        id: `txn_${String(index).padStart(5, '0')}`,
        reference: `PAY-2024-${faker.string.numeric(6)}`,
        amount,
        currency,
        status,
        beneficiary: {
            name: generateCompanyName(),
            iban: generateIBAN(currency),
            bankName: faker.helpers.arrayElement(BANKS_CI),
        },
        createdAt: createdAt.toISOString(),
        updatedAt: lastHistoryEntry.timestamp,
        statusHistory,
        failureReason,
    };
}


export const mockTransactions: TransactionDto[] = Array.from(
    { length: 500 },
    (_, i) => generateTransaction(i + 1)
);

// Sort by date (most recent first)
mockTransactions.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

// Export for use in application
if (typeof window === 'undefined') {
    // Node.js environment (for scripts)
    console.log(`✅ Generated ${mockTransactions.length} transactions`);
    console.log(`📊 Status distribution:`);
    const statusCounts = mockTransactions.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {} as Record<TransactionStatusDto, number>);
    console.log(statusCounts);

    console.log(`💰 Currency distribution:`);
    const currencyCounts = mockTransactions.reduce((acc, t) => {
        acc[t.currency] = (acc[t.currency] || 0) + 1;
        return acc;
    }, {} as Record<CurrencyDto, number>);
    console.log(currencyCounts);
}


/*********

import type {Currency, Transaction, TransactionStatus} from "../shared/types";

const generateMockTransactions = (): Transaction[] => {
    const statuses: TransactionStatus[] = ['pending', 'completed', 'failed', 'cancelled'];
    const currencies: Currency[] = ['XOF', 'EUR', 'USD'];
    const companies = [
        'Orange Money CI', 'MTN Mobile Money', 'Wave Sénégal', 'Moov Africa',
        'Société Ivoirienne de Banque', 'Ecobank Côte d\'Ivoire', 'NSIA Banque',
        'Coris Bank International', 'Banque Atlantique', 'UBA Côte d\'Ivoire'
    ];

    const failureReasons = [
        'Solde insuffisant',
        'IBAN invalide',
        'Banque bénéficiaire indisponible',
        'Limite journalière dépassée',
        'Compte bénéficiaire clôturé',
        'Transaction suspecte détectée',
        'Erreur de connexion bancaire',
        'Données bénéficiaire incorrectes',
    ];

    const transactions: Transaction[] = [];

    for (let i = 1; i <= 150; i++) {
        const currency = currencies[Math.floor(Math.random() * currencies.length)];
        const amount = currency === 'XOF'
            ? Math.floor(Math.random() * 50000000) + 50000
            : Math.floor(Math.random() * 100000) + 100;

        const createdAt = new Date(2024, 0, 1 + Math.floor(Math.random() * 365));

        transactions.push({
            id: `txn_${String(i).padStart(5, '0')}`,
            reference: `PAY-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
            amount,
            currency,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            beneficiary: {
                name: companies[Math.floor(Math.random() * companies.length)],
                iban: `CI93${String(Math.floor(Math.random() * 10000000000000000000)).padStart(20, '0')}`,
                bankName: 'Banque Atlantique CI',
            },
            createdAt: createdAt.toISOString(),
            updatedAt: createdAt.toISOString(),
            failureReason: Math.random() < 0.3 ? failureReasons[Math.floor(Math.random() * failureReasons.length)] : "",
        });
    }

    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export default generateMockTransactions;
 */