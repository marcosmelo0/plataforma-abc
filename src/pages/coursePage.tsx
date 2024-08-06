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
            aula(orderBy: publishedAt_ASC) {
                id
                title
                slug
            }
        }
    }
`;

const CoursePage = () => {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useQuery(GET_COURSE_BY_ID, {
        variables: { id },
    });

    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    const updateCompletedLessons = (lessonId: string) => {
        setCompletedLessons(prev => {
            const updatedCompletedLessons = prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId];
                
            localStorage.setItem('completedLessons', JSON.stringify(updatedCompletedLessons));
            return updatedCompletedLessons;
        });
    };

    useEffect(() => {
        const userToken = localStorage.getItem('sb-zrzlksbelolsesmacfhs-auth-token');
        const userId = userToken ? JSON.parse(atob(userToken.split('.')[1])).sub : null;

        const fetchCompletedLessons = async () => {
            if (!userId || !id) return;

            const { data: completedLessonsData, error } = await supabase
                .from('aulasCompletas')
                .select('aulas_id')
                .eq('aluno_id', userId)
                .eq('curso_id', id);

            if (error) {
                console.error("Erro ao buscar aulas completas:", error);
                return;
            }

            const completedLessonIds = completedLessonsData.map((lesson: any) => lesson.aulas_id);
            setCompletedLessons(completedLessonIds);
            localStorage.setItem('completedLessons', JSON.stringify(completedLessonIds));
        };

        fetchCompletedLessons();
    }, [id]);

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
                    completedLessons={completedLessons}
                    updateCompletedLessons={updateCompletedLessons}
                />
            </div>
        </div>
    );
};

export default CoursePage;
