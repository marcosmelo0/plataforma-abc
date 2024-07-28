import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { supabase } from "../utils/supabase";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userInitials, setUserInitials] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // New loading state
    const location = useLocation();

    const fetchUserProfile = async () => {
        setLoading(true); // Start loading
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user && user.id) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('name')
                    .eq('id', user.id)
                    .single();

                if (profile && profile.name) {
                    const names = profile.name.split(' ');
                    const initials = names
                        .slice(0, 2)
                        .map((name: string) => name.charAt(0).toUpperCase())
                        .join('');
                    setUserInitials(initials);
                    setUserName(profile.name);
                } else {
                    setUserInitials("?");
                    setUserName("Usuário");
                }
            } else {
                setUserInitials("?");
                setUserName("Usuário");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setUserInitials("?");
            setUserName("Usuário");
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleLogout = async () => {
        try {
            console.log("Logout button clicked"); // Ensure this is printed
            await supabase.auth.signOut();
            window.location.href = '/';
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        if (location.pathname !== '/login' && location.pathname !== '/register-student') {
            fetchUserProfile();
        } else {
            setUserInitials(null);
            setUserName(null);
        }
    }, [location]);

    const showProfileButton = location.pathname !== '/login' && location.pathname !== '/register-student';

    return (
        <header className="w-full py-4 px-6 flex items-center justify-between bg-blue-700 border-b border-blue-600">
            <Logo />

            {showProfileButton && (
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-blue-700 font-bold text-sm md:text-lg hover:bg-blue-100 focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                        disabled={loading}
                        style={{ zIndex: 1000 }} // Ensure the button is clickable
                    >
                        {loading ? "..." : (userInitials || "?")}
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 md:w-56" style={{ zIndex: 2000 }}>
                            <div className="p-2 border-b border-gray-200">
                                <p className="text-gray-700 text-base text-nowrap">Bem-vindo, {userName || "Usuário"}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                                style={{ zIndex: 2000 }} // Ensure the button is clickable
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
