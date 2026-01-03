import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { HomePage } from "./components/HomePage";
import { BrowseBooksPage } from "./components/BrowseBooksPage";
import { MyLibraryPage } from "./components/MyLibraryPage";
import { CategoriesPage } from "./components/CategoriesPage";
import { navigate, getCurrentPath, subscribe } from "./router";

export default function App() {
    const [currentPath, setCurrentPath] = useState(getCurrentPath());

    useEffect(() => {
        // Subscribe to route changes
        const unsubscribe = subscribe(setCurrentPath);

        // Redirect root to /home
        if (currentPath === "/") {
            navigate("/home");
        }

        return unsubscribe;
    }, []);

    const handleNavigate = (page: string) => {
        navigate(`/${page}`);
    };

    const renderPage = () => {
        switch (currentPath) {
            case "/login":
                return <LoginPage onSwitchToRegister={() => navigate("/register")} />;
            case "/register":
                return <RegisterPage onSwitchToLogin={() => navigate("/login")} />;
            case "/browse":
                return <BrowseBooksPage onNavigate={handleNavigate} />;
            case "/library":
                return <MyLibraryPage onNavigate={handleNavigate} />;
            case "/categories":
                return <CategoriesPage onNavigate={handleNavigate} />;
            case "/home":
            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return <>{renderPage()}</>;
}
