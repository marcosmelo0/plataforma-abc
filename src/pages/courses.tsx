import { useEffect, useState } from "react";
import CourseCard from "../components/cardCourse";
import { Header } from "../components/Header";
import { supabase } from "../utils/supabase";


export function Courses () {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAuthenticated = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = localStorage.getItem("sb-zrzlksbelolsesmacfhs-auth-token");
            const tokenData = token ? JSON.parse(token) : null;
          
            if (!tokenData || tokenData.access_token !== session?.access_token) {
                window.location.replace("/login");
            } else {
                setIsAuthenticated(true);
            }
        };

        verifyAuthenticated();
    }, []); 

        if (!isAuthenticated) {
            return null;
        }

    return (
        <main className="bg-gray-800 h-screen w-full">
            <Header />
            <p className="container mx-auto px-4 py-8">Meus cursos</p>
            <div className="flex gap-3">
                <CourseCard />
            </div>
        </main>
       
    )
}