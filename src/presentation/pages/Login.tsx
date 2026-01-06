import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import DottedBackground from "../components/ui/DottedBackground.tsx";

interface LoginPageProps {
    isDark: boolean;
    onToggleTheme: () => void;
    onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
                                                        isDark,
                                                        onToggleTheme,
                                                        onLogin,
                                                    }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <DottedBackground isDark={isDark} />

            {/* Theme Toggle */}
            <button
                onClick={onToggleTheme}
                className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all z-10"
                aria-label="Changer le thème"
            >
                {isDark ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
            </button>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4">
                            <span className="text-white font-bold text-3xl">S</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            SecurePay
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Tableau de bord des transactions
                        </p>
                    </div>

                    {/* Login Form */}
                    <div onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="admin@securepay.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Se connecter
                        </button>
                    </div>

                    {/* Demo Note */}
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Mode démo - Utilisez n'importe quel email/mot de passe
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
