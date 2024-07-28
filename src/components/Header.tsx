import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { supabase } from "../utils/supabase";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userInitials, setUserInitials] = useState("");
    const [userName, setUserName] = useState("");


    const fetchUserProfile = async () => {
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
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/'; 
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <header className="w-full py-5 flex items-center justify-between bg-blue-700 border-b border-blue-600 px-6">
            <Logo />

            <div className="relative">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-blue-700 font-bold text-lg hover:bg-blue-100 focus:outline-none"
                >
                    {userInitials || "?"}
                </button>

                
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
                        <div className="p-2 border-b border-gray-200">
                            <p className="text-gray-700 text-base text-nowrap">Bem-vindo, {userName}</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                        >
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
