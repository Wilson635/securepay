import {useEffect, useState} from "react";
import DashboardPage from "./presentation/pages/Dashboard.tsx";
import LoginPage from "./presentation/pages/Login.tsx";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className={`${isDark ? 'dark' : ''}`}>
            {isAuthenticated ? (
                <DashboardPage
                    onLogout={() => setIsAuthenticated(false)}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />
            ) : (
                <LoginPage
                    onLogin={() => setIsAuthenticated(true)}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />
            )}
        </div>
    );
}