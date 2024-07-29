import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Video } from "../components/Video";
import { gql, useQuery } from "@apollo/client";
import { supabase } from "../utils/supabase";

const QueryFirst = gql`
    query {
        aulas(first: 1) {
            slug
        }
    }
`;

interface QueryFirstResponse {
    aulas: {
        slug: string;
    }[]
}

export function Event() {
    const { slug } = useParams<{ slug: string }>();
    const { data, loading } = useQuery<QueryFirstResponse>(QueryFirst);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

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

    useEffect(() => {
        const fetchCompletedLessons = async () => {
            const token = localStorage.getItem("sb-zrzlksbelolsesmacfhs-auth-token");
            const userData = token ? JSON.parse(token) : null;
            const alunoId = userData ? userData.user.id : null;
          
            if (alunoId) {
                const { data: records, error } = await supabase
                    .from('aulasCompletas')
                    .select('aulas_id')
                    .eq('aluno_id', alunoId);

                if (error) {
                    console.error("Erro ao buscar aulas concluídas:", error);
                } else if (records.length > 0) {
                    setCompletedLessons(records[0].aulas_id); 
                }
            }
        };

        fetchCompletedLessons();
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return <p>Carregando...</p>;
    }
    
    const first = data?.aulas[0]?.slug;

    const updateCompletedLessons = (lessonId: string) => {
        setCompletedLessons(prev => {
            if (prev.includes(lessonId)) {
                return prev.filter(id => id !== lessonId);
            } else {
                return [...prev, lessonId];
            }
        });
    };

    return (
        <div className="flex flex-col">
            <Header />
            <main className="flex flex-1 flex-col lg:flex-row">
                {slug ? (
                    <Video lessonSlug={slug} updateCompletedLessons={updateCompletedLessons} />
                ) : (
                    <Video lessonSlug={first!} updateCompletedLessons={updateCompletedLessons} />
                )}
                <Sidebar completedLessons={completedLessons} updateCompletedLessons={updateCompletedLessons} />
            </main>
        </div>
    );
}
