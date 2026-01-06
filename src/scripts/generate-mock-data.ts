import { faker } from '@faker-js/faker';
import type {
    CurrencyDto,
    TransactionDto,
    TransactionStatusDto,
    StatusHistoryEntryDto,
} from '../shared/types/transaction-data';


const STATUSES: readonly TransactionStatusDto[] = ['pending', 'completed', 'failed', 'cancelled'] as const;

const CURRENCY_WEIGHTS: Record<CurrencyDto, number> = {
    XOF: 0.7,
    EUR: 0.2,
    USD: 0.1,
};

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
] as const;

const FAILURE_REASONS = [
    'Solde insuffisant',
    'IBAN invalide',
    'Banque bénéficiaire indisponible',
    'Limite journalière dépassée',
    'Compte bénéficiaire clôturé',
    'Transaction suspecte détectée',
    'Erreur de connexion bancaire',
    'Données bénéficiaire incorrectes',
] as const;

const COMPANY_TYPES = [
    'SARL',
    'SA',
    'SAS',
    'SASU',
    'GIE',
    'Coopérative',
    'Association',
    'ONG',
] as const;

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
        // pending -> completed (1min to 2h later)
        const completedDate = new Date(
            createdAt.getTime() + faker.number.int({ min: 60_000, max: 7_200_000 })
        );
        history.push({
            status: 'completed',
            timestamp: completedDate.toISOString(),
            reason: 'Virement exécuté avec succès',
        });
    } else if (finalStatus === 'failed') {
        // pending -> failed (30s to 1h later)
        const failedDate = new Date(
            createdAt.getTime() + faker.number.int({ min: 30_000, max: 3_600_000 })
        );
        history.push({
            status: 'failed',
            timestamp: failedDate.toISOString(),
            reason: faker.helpers.arrayElement(FAILURE_REASONS),
        });
    } else if (finalStatus === 'cancelled') {
        // pending -> cancelled (10s to 30min later)
        const cancelledDate = new Date(
            createdAt.getTime() + faker.number.int({ min: 10_000, max: 1_800_000 })
        );
        history.push({
            status: 'cancelled',
            timestamp: cancelledDate.toISOString(),
            reason: "Annulé par l'utilisateur",
        });
    }

    return history;
}


function generateTransaction(index: number): TransactionDto {
    const status = faker.helpers.arrayElement(STATUSES);
    const currency = selectWeightedCurrency(); // ← Uses CURRENCY_WEIGHTS
    const createdAt = faker.date.between({
        from: '2024-01-01T00:00:00.000Z',
        to: '2024-12-31T23:59:59.999Z',
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
mockTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


if (typeof window === 'undefined') {
    console.log(`✅ Generated ${mockTransactions.length} transactions`);

    console.log(`\n📊 Status distribution:`);
    const statusCounts = mockTransactions.reduce(
        (acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        },
        {} as Record<TransactionStatusDto, number>
    );
    console.table(statusCounts);

    console.log(`\n💰 Currency distribution:`);
    const currencyCounts = mockTransactions.reduce(
        (acc, t) => {
            acc[t.currency] = (acc[t.currency] || 0) + 1;
            return acc;
        },
        {} as Record<CurrencyDto, number>
    );
    console.table(currencyCounts);

    console.log(`\n📈 Statistics:`);
    console.log(`- Total amount (XOF): ${mockTransactions
        .filter((t) => t.currency === 'XOF')
        .reduce((sum, t) => sum + t.amount, 0)
        .toLocaleString('fr-FR')} FCFA`);

    console.log(`- Average amount (EUR): ${(
        mockTransactions
            .filter((t) => t.currency === 'EUR')
            .reduce((sum, t) => sum + t.amount, 0) /
        mockTransactions.filter((t) => t.currency === 'EUR').length
    ).toFixed(2)} €`);

    console.log(`\n✨ Sample transactions:`);
    console.log(mockTransactions.slice(0, 3).map((t) => ({
        id: t.id,
        reference: t.reference,
        amount: t.amount,
        currency: t.currency,
        status: t.status,
    })));
}