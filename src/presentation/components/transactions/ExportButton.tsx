import React, { useState } from 'react';
import { Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExportTransactions } from '../../hooks/useExportTransactions';
import type { TransactionFilters } from '../../hooks/useTransactions';

interface ExportButtonProps {
    filters: TransactionFilters;
    totalRecords: number;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ filters, totalRecords }) => {
    const { exporting, error, exportToCSV } = useExportTransactions();
    const [showWarning, setShowWarning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const MAX_EXPORT_LIMIT = 10000;
    const isOverLimit = totalRecords > MAX_EXPORT_LIMIT;

    const handleExport = async () => {
        if (isOverLimit) {
            setShowWarning(true);
            return;
        }

        await exportToCSV(filters);

        if (!error) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    return (
        <>
            {/* Export Button */}
            <button
                onClick={handleExport}
                disabled={exporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2 whitespace-nowrap"
            >
                {exporting ? (
                    <>
                        <Download className="w-4 h-4 animate-bounce" />
                        Export en cours...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4" />
                        Exporter CSV
                    </>
                )}
            </button>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 z-50 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg flex items-center gap-3"
                    >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="font-semibold text-green-800 dark:text-green-300">
                                Export réussi !
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-400">
                                {totalRecords} transaction{totalRecords > 1 ? 's' : ''} exportée
                                {totalRecords > 1 ? 's' : ''}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 z-50 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-red-800 dark:text-red-300">Erreur d'export</p>
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Warning Modal */}
            <AnimatePresence>
                {showWarning && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowWarning(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <AlertTriangle className="w-8 h-8 text-orange-500 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            Limite d'export dépassée
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Vous essayez d'exporter{' '}
                                            <span className="font-semibold text-red-600">{totalRecords}</span>{' '}
                                            transactions, mais la limite maximale est de{' '}
                                            <span className="font-semibold">{MAX_EXPORT_LIMIT}</span>.
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                                            Veuillez affiner vos filtres pour réduire le nombre de résultats.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowWarning(false)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Compris
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};