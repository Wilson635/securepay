import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
import type { TransactionFilters } from '../../hooks/useTransactions';
import type {TransactionStatus} from "../../../core/domain/entities/transaction.ts";

interface TransactionFiltersProps {
    filters: TransactionFilters;
    onFiltersChange: (filters: TransactionFilters) => void;
    resultCount: number;
}

export const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
                                                                                   filters,
                                                                                   onFiltersChange,
                                                                                   resultCount,
                                                                               }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const debouncedSearch = useDebounce(searchInput, 300);

    useEffect(() => {
        onFiltersChange({ ...filters, search: debouncedSearch });
    }, [debouncedSearch]);

    const toggleStatus = (status: TransactionStatus) => {
        const currentStatuses = filters.statuses || [];
        const newStatuses = currentStatuses.includes(status)
            ? currentStatuses.filter((s) => s !== status)
            : [...currentStatuses, status];

        onFiltersChange({
            ...filters,
            statuses: newStatuses.length > 0 ? newStatuses : undefined,
        });
    };

    const resetFilters = () => {
        setSearchInput('');
        onFiltersChange({});
    };

    const activeFiltersCount = [
        filters.search,
        filters.statuses?.length,
        filters.dateFrom,
        filters.dateTo,
        filters.amountMin,
        filters.amountMax,
    ].filter(Boolean).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6"
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par référence ou bénéficiaire..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2 whitespace-nowrap"
                >
                    <Filter className="w-4 h-4" />
                    Filtres
                    {activeFiltersCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
                    )}
                </button>

                {/* Reset Button */}
                {activeFiltersCount > 0 && (
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Réinitialiser
                    </button>
                )}
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="space-y-4">
                            {/* Status Filters */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Statut
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {(['pending', 'completed', 'failed', 'cancelled'] as TransactionStatus[]).map(
                                        (status) => {
                                            const isActive = filters.statuses?.includes(status);
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => toggleStatus(status)}
                                                    className={`px-4 py-2 rounded-lg transition ${
                                                        isActive
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {status === 'pending' && 'En attente'}
                                                    {status === 'completed' && 'Complété'}
                                                    {status === 'failed' && 'Échoué'}
                                                    {status === 'cancelled' && 'Annulé'}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            {/* Date Range Filters (TODO) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={(e) =>
                                            onFiltersChange({
                                                ...filters,
                                                dateFrom: e.target.value ? new Date(e.target.value) : undefined,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={(e) =>
                                            onFiltersChange({
                                                ...filters,
                                                dateTo: e.target.value ? new Date(e.target.value) : undefined,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Amount Range Filters (TODO) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Montant minimum
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={(e) =>
                                            onFiltersChange({
                                                ...filters,
                                                amountMin: e.target.value ? parseFloat(e.target.value) : undefined,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Montant maximum
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="∞"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={(e) =>
                                            onFiltersChange({
                                                ...filters,
                                                amountMax: e.target.value ? parseFloat(e.target.value) : undefined,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {resultCount} transaction{resultCount > 1 ? 's' : ''} trouvée
                {resultCount > 1 ? 's' : ''}
            </div>
        </motion.div>
    );
};