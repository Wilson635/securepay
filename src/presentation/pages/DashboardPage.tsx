import React, {useState, useEffect, useMemo} from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Activity,
    ArrowUpRight,
    Moon,
    Sun,
    LogOut,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import {mockTransactions} from "../../scripts/generate-mock-data.ts";
import DottedBackground from "../components/ui/DottedBackground.tsx";
import {TransactionTab} from "./Transaction-tab.tsx";


// Stat Card Component
const StatCard = ({
                      icon: Icon,
                      label,
                      value,
                      change,
                      changeType,
                      color
                  }: {
    icon: any;
    label: string;
    value: string;
    change: string;
    changeType: 'up' | 'down';
    color: string;
}) => (
    <div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white"/>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                changeType === 'up'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
                {changeType === 'up' ? (
                    <TrendingUp className="w-3 h-3"/>
                ) : (
                    <TrendingDown className="w-3 h-3"/>
                )}
                {change}
            </div>
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

// Custom Tooltip
const CustomTooltip = ({active, payload}: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {payload[0].payload.date}
                </p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                        <span style={{color: entry.color}}>●</span> {entry.name}: {
                        entry.name.includes('Montant')
                            ? `${entry.value.toLocaleString('fr-FR')} FCFA`
                            : entry.value.toLocaleString('fr-FR')
                    }
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardPage: React.FC<{ onLogout: () => void; isDark: boolean; toggleTheme: () => void }> = ({
                                                                                                         onLogout,
                                                                                                         isDark,
                                                                                                         toggleTheme,
                                                                                                     }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'transactions' | 'users' | 'reports'>('dashboard');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    // Simuler une déconnexion
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Déconnecté</h1>
                    <button
                        onClick={() => setIsAuthenticated(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Se reconnecter
                    </button>
                </div>
            </div>
        );
    }

    // Calculate statistics from real data
    const stats = useMemo(() => {
        const total = mockTransactions.length;
        const completed = mockTransactions.filter(t => t.status === 'completed').length;
        const pending = mockTransactions.filter(t => t.status === 'pending').length;
        const failed = mockTransactions.filter(t => t.status === 'failed').length;
        const cancelled = mockTransactions.filter(t => t.status === 'cancelled').length;

        // Calculate total revenue (only completed transactions in XOF)
        const totalRevenue = mockTransactions
            .filter(t => t.status === 'completed' && t.currency === 'XOF')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate average transaction amount
        const avgAmount = mockTransactions
            .filter(t => t.currency === 'XOF')
            .reduce((sum, t) => sum + t.amount, 0) / mockTransactions.filter(t => t.currency === 'XOF').length;

        // Success rate
        const successRate = ((completed / total) * 100).toFixed(1);

        return {
            total,
            completed,
            pending,
            failed,
            cancelled,
            totalRevenue,
            avgAmount,
            successRate,
        };
    }, []);

    // Prepare chart data - Group by week
    const chartData = useMemo(() => {
        // Sort transactions by date
        const sorted = [...mockTransactions].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        // Group by week
        const weeks: Record<string, any> = {};

        sorted.forEach(t => {
            const date = new Date(t.createdAt);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'});

            if (!weeks[weekKey]) {
                weeks[weekKey] = {
                    date: weekKey,
                    totalAmount: 0,
                    transactions: 0,
                    pending: 0,
                    completed: 0,
                    failed: 0,
                    cancelled: 0,
                };
            }

            weeks[weekKey].transactions++;
            weeks[weekKey][t.status]++;

            if (t.currency === 'XOF') {
                weeks[weekKey].totalAmount += t.amount;
            }
        });

        return Object.values(weeks).slice(-12); // Last 12 weeks
    }, []);

    // Status distribution by month
    const statusByMonth = useMemo(() => {
        const months: Record<string, any> = {};

        mockTransactions.forEach(t => {
            const date = new Date(t.createdAt);
            const monthKey = date.toLocaleDateString('fr-FR', {month: 'short'});

            if (!months[monthKey]) {
                months[monthKey] = {
                    month: monthKey,
                    pending: 0,
                    completed: 0,
                    failed: 0,
                    cancelled: 0,
                };
            }

            months[monthKey][t.status]++;
        });

        return Object.values(months);
    }, []);


    const today = new Date();


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DottedBackground isDark={isDark}/>

            {/* Top Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition"
                            >
                                SecurePay
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                {isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                            </button>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                            >
                                <LogOut className="w-4 h-4"/>
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Conditional Rendering based on current page */}
            {currentPage === 'dashboard' && (
                <>
                    {/* Hero Header */}
                    <div
                        className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"/>
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        }}/>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-blue-100 mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"/>
                                        {today.toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <h1 className="text-4xl font-bold text-white mb-3">
                                        Bienvenue, Administrateur
                                    </h1>
                                    <p className="text-blue-100 text-lg max-w-2xl">
                                        Gérez votre contenu et suivez l'activité de votre plateforme de paiement depuis
                                        votre tableau de bord
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats in Header */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Activity className="w-8 h-8 text-white/80"/>
                                        <span className="text-2xl font-bold text-white">{stats.total}</span>
                                    </div>
                                    <p className="text-white/80 text-sm">Transactions total</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Clock className="w-8 h-8 text-white/80"/>
                                        <span className="text-2xl font-bold text-white">{stats.pending}</span>
                                    </div>
                                    <p className="text-white/80 text-sm">En attente</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <CheckCircle className="w-8 h-8 text-white/80"/>
                                        <span className="text-2xl font-bold text-white">{stats.completed}</span>
                                    </div>
                                    <p className="text-white/80 text-sm">Complétées</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <XCircle className="w-8 h-8 text-white/80"/>
                                        <span className="text-2xl font-bold text-white">{stats.failed}</span>
                                    </div>
                                    <p className="text-white/80 text-sm">Échouées</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                icon={DollarSign}
                                label="Revenu Total (XOF)"
                                value={`${(stats.totalRevenue / 1000000).toFixed(1)}M FCFA`}
                                change="+15.3%"
                                changeType="up"
                                color="bg-gradient-to-br from-blue-500 to-blue-600"
                            />
                            <StatCard
                                icon={Activity}
                                label="Transactions"
                                value={stats.total.toLocaleString('fr-FR')}
                                change="+12.5%"
                                changeType="up"
                                color="bg-gradient-to-br from-purple-500 to-purple-600"
                            />
                            <StatCard
                                icon={CheckCircle}
                                label="Taux de Réussite"
                                value={`${stats.successRate}%`}
                                change="+2.3%"
                                changeType="up"
                                color="bg-gradient-to-br from-green-500 to-green-600"
                            />
                            <StatCard
                                icon={TrendingUp}
                                label="Montant Moyen (XOF)"
                                value={`${(stats.avgAmount / 1000).toFixed(0)}K FCFA`}
                                change="-1.2%"
                                changeType="down"
                                color="bg-gradient-to-br from-orange-500 to-orange-600"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Revenue Chart */}
                            <div
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            Évolution du Revenu (XOF)
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            12 dernières semaines
                                        </p>
                                    </div>
                                    <div
                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                                        <TrendingUp className="w-4 h-4"/>
                                        <span className="text-sm font-medium">+15.3%</span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"
                                                       className="dark:stroke-gray-700"/>
                                        <XAxis dataKey="date" stroke="#9ca3af" style={{fontSize: '12px'}}/>
                                        <YAxis stroke="#9ca3af" style={{fontSize: '12px'}}/>
                                        <Tooltip content={<CustomTooltip/>}/>
                                        <Area
                                            type="monotone"
                                            dataKey="totalAmount"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fill="url(#colorRevenue)"
                                            name="Montant Total"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Transaction Volume Chart */}
                            <div
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            Volume des Transactions
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Activité hebdomadaire
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-purple-500 rounded-full"/>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Transactions</span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"
                                                       className="dark:stroke-gray-700"/>
                                        <XAxis dataKey="date" stroke="#9ca3af" style={{fontSize: '12px'}}/>
                                        <YAxis stroke="#9ca3af" style={{fontSize: '12px'}}/>
                                        <Tooltip content={<CustomTooltip/>}/>
                                        <Line
                                            type="monotone"
                                            dataKey="transactions"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            dot={{fill: '#8b5cf6', r: 4}}
                                            activeDot={{r: 6}}
                                            name="Nombre"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Status Distribution Chart */}
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        Distribution par Statut
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Suivi des états de transactions par mois
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-orange-500 rounded-full"/>
                                        <span
                                            className="text-xs text-gray-600 dark:text-gray-400">En attente ({stats.pending})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-green-500 rounded-full"/>
                                        <span
                                            className="text-xs text-gray-600 dark:text-gray-400">Complété ({stats.completed})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-red-500 rounded-full"/>
                                        <span
                                            className="text-xs text-gray-600 dark:text-gray-400">Échoué ({stats.failed})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-gray-500 rounded-full"/>
                                        <span
                                            className="text-xs text-gray-600 dark:text-gray-400">Annulé ({stats.cancelled})</span>
                                    </div>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={statusByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"
                                                   className="dark:stroke-gray-700"/>
                                    <XAxis dataKey="month" stroke="#9ca3af" style={{fontSize: '12px'}}/>
                                    <YAxis stroke="#9ca3af" style={{fontSize: '12px'}}/>
                                    <Tooltip content={<CustomTooltip/>}/>
                                    <Legend wrapperStyle={{fontSize: '12px'}}/>
                                    <Line
                                        type="monotone"
                                        dataKey="pending"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        name="En attente"
                                        dot={{fill: '#f97316', r: 4}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        name="Complété"
                                        dot={{fill: '#10b981', r: 4}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="failed"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        name="Échoué"
                                        dot={{fill: '#ef4444', r: 4}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="cancelled"
                                        stroke="#6b7280"
                                        strokeWidth={3}
                                        name="Annulé"
                                        dot={{fill: '#6b7280', r: 4}}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => setCurrentPage('transactions')}
                                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Activity className="w-8 h-8"/>
                                    <ArrowUpRight
                                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </div>
                                <h3 className="text-lg font-bold mb-2">Voir toutes les transactions</h3>
                                <p className="text-blue-100 text-sm">
                                    Accédez au tableau complet des {stats.total} transactions
                                </p>
                            </button>

                            <button
                                onClick={() => setCurrentPage('users')}
                                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Users className="w-8 h-8"/>
                                    <ArrowUpRight
                                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </div>
                                <h3 className="text-lg font-bold mb-2">Gérer les bénéficiaires</h3>
                                <p className="text-purple-100 text-sm">Administration des comptes clients</p>
                            </button>

                            <button
                                onClick={() => setCurrentPage('reports')}
                                className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-6 hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <DollarSign className="w-8 h-8"/>
                                    <ArrowUpRight
                                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </div>
                                <h3 className="text-lg font-bold mb-2">Rapports financiers</h3>
                                <p className="text-pink-100 text-sm">Exportez vos données comptables</p>
                            </button>
                        </div>
                    </main>
                </>
            )}

            {/* Transactions Page */}
            {currentPage === 'transactions' && (
                <TransactionTab
                    isDark={isDark}
                    onToggleTheme={() => toggleTheme()}
                    onLogout={() => setCurrentPage('dashboard')}
                />
            )}

            {/* Users Page */}
            {currentPage === 'users' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Gestion des Bénéficiaires
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Administrez les comptes clients
                        </p>
                    </div>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Page en construction
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            La gestion des utilisateurs sera bientôt disponible
                        </p>
                        <button
                            onClick={() => setCurrentPage('dashboard')}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            )}

            {/* Reports Page */}
            {currentPage === 'reports' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Rapports Financiers
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Exportez et analysez vos données comptables
                        </p>
                    </div>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                        <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Page en construction
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Les rapports financiers seront bientôt disponibles
                        </p>
                        <button
                            onClick={() => setCurrentPage('dashboard')}
                            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                        >
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;