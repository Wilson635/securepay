import React, { useState } from 'react';
import {useTransactions} from "../hooks/useTransactions.ts";
import type {Transaction} from "../../core/domain/entities/transaction.ts";
import {ExportButton} from "../components/transactions/ExportButton.tsx";
import {TransactionFiltersComponent} from "../components/transactions/TransactionFilters.tsx";
import {TransactionTable} from "../components/transactions/TransactionTable.tsx";
import {TransactionDetail} from "../components/transactions/TransactionDetail.tsx";


interface DashboardPageProps {
    isDark: boolean;
    onToggleTheme: () => void;
    onLogout: () => void;
}

// Dotted Background Component
const DottedBackground: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <div className="fixed inset-0 -z-10">
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: `radial-gradient(circle, ${
                    isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                } 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
            }}
        />
    </div>
);

export const DashboardPage: React.FC<DashboardPageProps> = ({
                                                                isDark
                                                            }) => {
    const {
        transactions,
        loading,
        error,
        total,
        currentPage,
        totalPages,
        filters,
        setFilters,
        setPage,
        refresh,
    } = useTransactions(20);

    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransactionId(transaction.id.value);
    };

    const handleDetailClose = () => {
        setSelectedTransactionId(null);
    };

    const handleActionSuccess = () => {
        refresh();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DottedBackground isDark={isDark} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title & Export */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Toutes les transactions
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Gérez et suivez vos paiements B2B
                        </p>
                    </div>

                    <ExportButton filters={filters} totalRecords={total} />
                </div>

                {/* Filters */}
                <TransactionFiltersComponent
                    filters={filters}
                    onFiltersChange={setFilters}
                    resultCount={total}
                />

                {/* Transactions Table */}
                <TransactionTable
                    transactions={transactions}
                    loading={loading}
                    error={error}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onTransactionClick={handleTransactionClick}
                    onRetry={refresh}
                />
            </main>

            {/* Transaction Detail Modal */}
            <TransactionDetail
                transactionId={selectedTransactionId}
                isOpen={selectedTransactionId !== null}
                onClose={handleDetailClose}
                onSuccess={handleActionSuccess}
            />
        </div>
    );
};
