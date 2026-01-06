import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, XCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTransactionDetail } from '../../hooks/useTransactionDetail';
import { StatusBadge } from '../ui/StatusBadge';
import { Skeleton } from '../ui/Skeleton';

interface TransactionDetailProps {
    transactionId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const TransactionDetail: React.FC<TransactionDetailProps> = ({
                                                                        transactionId,
                                                                        isOpen,
                                                                        onClose,
                                                                        onSuccess,
                                                                    }) => {
    const { transaction, loading, error, retrying, cancelling, retry, cancel } =
        useTransactionDetail(transactionId, () => {
            onSuccess?.();
            setTimeout(() => onClose(), 1500);
        });

    // Focus trap and escape key handler
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-orange-500" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-gray-500" />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="transaction-detail-title"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2
                                    id="transaction-detail-title"
                                    className="text-2xl font-bold text-gray-900 dark:text-white"
                                >
                                    Détail de la transaction
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    aria-label="Fermer"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                                {loading && (
                                    <div className="space-y-4">
                                        <Skeleton className="h-8 w-48" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-32 w-full" />
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <p className="text-red-800 dark:text-red-300">{error}</p>
                                    </div>
                                )}

                                {transaction && (
                                    <div className="space-y-6">
                                        {/* Transaction Reference & Status */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Référence
                                                </p>
                                                <p className="text-xl font-mono font-bold">{transaction.reference}</p>
                                            </div>
                                            <StatusBadge status={transaction.status} />
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Montant</p>
                                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                {transaction.amount.format()}
                                            </p>
                                        </div>

                                        {/* Beneficiary */}
                                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                Bénéficiaire
                                            </h3>
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
                                                    <p className="font-medium">{transaction.beneficiary.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">IBAN</p>
                                                    <p className="font-mono font-medium">
                                                        {transaction.beneficiary.iban.mask()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Banque</p>
                                                    <p className="font-medium">{transaction.beneficiary.bankName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Failure Reason (if failed) */}
                                        {transaction.status === 'failed' && transaction.failureReason && (
                                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-red-800 dark:text-red-300 mb-1">
                                                            Raison de l'échec
                                                        </p>
                                                        <p className="text-red-700 dark:text-red-400">
                                                            {transaction.failureReason}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Dates */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Date de création
                                                </p>
                                                <p className="text-sm font-medium">{formatDate(transaction.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Dernière mise à jour
                                                </p>
                                                <p className="text-sm font-medium">{formatDate(transaction.updatedAt)}</p>
                                            </div>
                                        </div>

                                        {/* Status History Timeline */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                                Historique
                                            </h3>
                                            <div className="space-y-3">
                                                {transaction.statusHistory.map((entry, index) => (
                                                    <div key={index} className="flex gap-3">
                                                        {/* Timeline Line */}
                                                        <div className="flex flex-col items-center">
                                                            <div className="p-1 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-300 dark:border-gray-600">
                                                                {getStatusIcon(entry.status)}
                                                            </div>
                                                            {index < transaction.statusHistory.length - 1 && (
                                                                <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-1" />
                                                            )}
                                                        </div>

                                                        {/* Timeline Content */}
                                                        <div className="flex-1 pb-4">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <StatusBadge status={entry.status} />
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(entry.timestamp)}
                                </span>
                                                            </div>
                                                            {entry.reason && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                    {entry.reason}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer with Actions */}
                            {transaction && (
                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                                    {transaction.canRetry() && (
                                        <button
                                            onClick={retry}
                                            disabled={retrying}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                        >
                                            {retrying ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                    Réessai en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-4 h-4" />
                                                    Réessayer
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {transaction.canCancel() && (
                                        <button
                                            onClick={cancel}
                                            disabled={cancelling}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                        >
                                            {cancelling ? (
                                                <>
                                                    <XCircle className="w-4 h-4 animate-spin" />
                                                    Annulation en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4" />
                                                    Annuler
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
