import { DashboardPage } from "./presentation/pages/Dashboard.tsx";
import { LoginPage } from "./presentation/pages/Login.tsx";
import { useEffect, useState } from "react";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        // Check system preference only (no localStorage)
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Apply theme to document
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <div className={isDark ? 'dark' : ''}>
            {isAuthenticated ? (
                <DashboardPage
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                    onLogout={handleLogout}
                />
            ) : (
                <LoginPage
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                    onLogin={handleLogin}
                />
            )}
        </div>
    );
}