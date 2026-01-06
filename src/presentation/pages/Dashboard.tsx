import * as React from "react";
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Filter, LogOut, Moon, Search, Sun } from 'lucide-react';
import DottedBackground from "../components/ui/DottedBackground.tsx";
import type {Transaction, TransactionStatus} from "../../shared/types";
import TableSkeleton from "../components/ui/TableSkeleton.tsx";
import formatDate from "../../shared/utils/formatDate.ts";
import formatMoney from "../../shared/utils/formatMoney.ts";
import StatusBadge from "../components/ui/StatusBadge.tsx";
import maskIBAN from "../../shared/utils/maskIBAN.ts";
import generateMockTransactions from "../../scripts/generate-mock-data.ts";


const DashboardPage: React.FC<{ onLogout: () => void; isDark: boolean; toggleTheme: () => void }> = ({
                                                                                                         onLogout,
                                                                                                         isDark,
                                                                                                         toggleTheme,
                                                                                                     }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 20;

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setTransactions(generateMockTransactions());
            setLoading(false);
        }, 1500);
    }, []);

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch =
            t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DottedBackground isDark={isDark} />

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                SecurePay
                            </h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Dashboard</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par référence ou bénéficiaire..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filtres
                            {selectedStatus !== 'all' && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">1</span>
                            )}
                        </button>

                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Exporter
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedStatus('all')}
                                        className={`px-4 py-2 rounded-lg transition ${
                                            selectedStatus === 'all'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        Tous
                                    </button>
                                    {['pending', 'completed', 'failed', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setSelectedStatus(status as TransactionStatus)}
                                            className={`px-4 py-2 rounded-lg transition ${
                                                selectedStatus === status
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {status === 'pending' && 'En attente'}
                                            {status === 'completed' && 'Complété'}
                                            {status === 'failed' && 'Échoué'}
                                            {status === 'cancelled' && 'Annulé'}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''} trouvée{filteredTransactions.length > 1 ? 's' : ''}
                </div>

                {/* Transactions Table */}
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        {paginatedTransactions.map((transaction, index) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                                            <p className="text-sm font-medium">{formatDate(transaction.createdAt)}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Référence</p>
                                            <p className="text-sm font-mono font-medium">{transaction.reference}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Montant</p>
                                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                {formatMoney(transaction.amount, transaction.currency)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut</p>
                                            <StatusBadge status={transaction.status} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bénéficiaire</p>
                                            <p className="text-sm font-medium truncate">{transaction.beneficiary.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                {maskIBAN(transaction.beneficiary.iban)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {!loading && filteredTransactions.length > itemsPerPage && (
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
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;