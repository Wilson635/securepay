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