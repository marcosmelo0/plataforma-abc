import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Video } from "../components/Video";
import { gql, useQuery } from "@apollo/client";
import { supabase } from "../utils/supabase";

const QueryFirst = gql`
    query {
        lessons(first: 1) {
            slug
        }
    }
`;

interface QueryFirstResponse {
    lessons: {
        slug: string;
    }[]
}

export function Event() {
    const { slug } = useParams<{ slug: string }>();
    const { data, loading } = useQuery<QueryFirstResponse>(QueryFirst);
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
        return;
    }

    if (loading) {
        return <p>Carregando...</p>;
    }
    

    const first = data?.lessons[0]?.slug;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-1">
                {slug ? <Video lessonSlug={slug!} /> : <Video lessonSlug={first!} />}
                <Sidebar />
            </main>
        </div>
    );
}
