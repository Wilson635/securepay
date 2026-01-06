import React, { useState } from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';
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
                                                                isDark,
                                                                onToggleTheme,
                                                                onLogout,
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

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    SecurePay
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Tableau de bord des transactions
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onToggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                aria-label="Changer le thème"
                            >
                                {isDark ? (
                                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                )}
                            </button>

                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

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
