/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import { Video } from '../components/Video';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { supabase } from '../utils/supabase';

const GET_COURSE_BY_ID = gql`
    query GetCourseById($id: ID!) {
        curso(where: { id: $id }) {
            id
            nome
            aula {
                id
                title
                slug
            }
        }
    }
`;

export const useAuth = () => {
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

    return isAuthenticated;
};

export const useCompletedLessons = (courseId: string) => {
    const [completedLessons, setCompletedLessons] = useState<any[]>(() => {
        const storedLessons = localStorage.getItem('completedLessons');
        try {
            // Tenta recuperar e parsear o valor do localStorage
            const parsed = storedLessons ? JSON.parse(storedLessons) : [];
            
            // Se o valor não for um array ou for um array dentro de outro array, flatten
            if (Array.isArray(parsed)) {
                return parsed.flat().filter(item => typeof item === 'string');
            }
            return [];
        } catch {
            return [];
        }
    });

    const updateCompletedLessons = (lessonId: string) => {
        setCompletedLessons(prev => {
            const updatedCompletedLessons = prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId];

            // Armazena o valor no localStorage sempre como um array de strings simples
            localStorage.setItem('completedLessons', JSON.stringify(updatedCompletedLessons));
            return updatedCompletedLessons;
        });
    };

    useEffect(() => {
        const fetchCompletedLessons = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id || !courseId) return;

            const { data: completedLessonsData, error } = await supabase
                .from('aulasCompletas')
                .select('aulas_id')
                .eq('aluno_id', session.user.id)
                .eq('curso_id', courseId);

            if (error) {
                console.error("Error fetching completed lessons:", error);
                return;
            }

            const completedLessonIds = completedLessonsData.map(lesson => lesson.aulas_id);

            setCompletedLessons(prev => {
                const newCompletedLessons = Array.from(new Set([...prev, ...completedLessonIds]));
                
                // Armazena o valor no localStorage sempre como um array de strings simples
                localStorage.setItem('completedLessons', JSON.stringify(newCompletedLessons));
                return newCompletedLessons;
            });
        };

        fetchCompletedLessons();
    }, [courseId]);

    console.log(completedLessons);

    return { completedLessons, updateCompletedLessons };
};


const CoursePage = () => {
    const { id } = useParams<{ id: string }>();
    const course = localStorage.getItem("c")
    const isAuthenticated = useAuth();
    const { completedLessons, updateCompletedLessons } = useCompletedLessons(course || '');
    


    const { data, loading, error } = useQuery(GET_COURSE_BY_ID, {
        variables: { id },
    });

    if (!isAuthenticated) {
        return null;
    }
    
    if (loading) return <p>Carregando...</p>;
    if (error) {
        console.error("Erro ao buscar dados:", error);
        return <p>Erro: {error.message}</p>;
    }

    const aulas = data?.curso?.aula || [];

    return (
        <div className="flex flex-col">
            <Header />
            <div className="flex flex-1 flex-col lg:flex-row">
                <div className="flex-1">
                    {aulas.length > 0 && (
                        <Video
                            key={aulas[0].id}
                            lessonSlug={aulas[0].slug}
                            updateCompletedLessons={updateCompletedLessons}
                        />
                    )}
                </div>
                <Sidebar
                    completedLessons={completedLessons[0]}
                    updateCompletedLessons={updateCompletedLessons}
                />
            </div>
        </div>
    );
};

export default CoursePage;
