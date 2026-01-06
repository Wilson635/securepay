import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Transaction } from '../../../core/domain/entities/transaction';
import { StatusBadge } from '../ui/StatusBadge';
import { TableSkeleton } from '../ui/Skeleton';

interface TransactionTableProps {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onTransactionClick: (transaction: Transaction) => void;
    onRetry?: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
                                                                      transactions,
                                                                      loading,
                                                                      error,
                                                                      currentPage,
                                                                      totalPages,
                                                                      onPageChange,
                                                                      onTransactionClick,
                                                                      onRetry,
                                                                  }) => {
    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Loading State
    if (loading) {
        return <TableSkeleton />;
    }

    // Error State
    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                    Erreur de chargement
                </h3>
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Réessayer
                    </button>
                )}
            </div>
        );
    }

    // Empty State
    if (transactions.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
                <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Aucune transaction trouvée
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Essayez de modifier vos filtres de recherche
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Transactions List */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {transactions.map((transaction, index) => (
                    <motion.div
                        key={transaction.id.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onTransactionClick(transaction)}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* Date */}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                                <p className="text-sm font-medium">{formatDate(transaction.createdAt)}</p>
                            </div>

                            {/* Reference */}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Référence</p>
                                <p className="text-sm font-mono font-medium">{transaction.reference}</p>
                            </div>

                            {/* Amount */}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Montant</p>
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {transaction.amount.format()}
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut</p>
                                <StatusBadge status={transaction.status} />
                            </div>

                            {/* Beneficiary */}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bénéficiaire</p>
                                <p className="text-sm font-medium truncate">{transaction.beneficiary.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                    {transaction.beneficiary.iban.mask()}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 flex items-center justify-between"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage} sur {totalPages}
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </>
    );
};