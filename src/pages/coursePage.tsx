import React, { useEffect } from 'react';
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

    const [completedLessons, setCompletedLessons] = React.useState<string[]>([]);

    const updateCompletedLessons = (lessonId: string) => {
        setCompletedLessons(prev => {
            if (prev.includes(lessonId)) {
                return prev.filter(id => id !== lessonId);
            } else {
                return [...prev, lessonId];
            }
        });
    };

    useEffect(() => {
        const fetchCompletedLessons = async () => {
            const userId = (await supabase.auth.getSession()).data.session?.user?.id;
            if (!userId) return; 

            const { data: completedData, error: fetchError } = await supabase
                .from('aulasCompletas')
                .select('curso_id, aulas_id')
                .eq('aluno_id', userId);

            if (fetchError) {
                console.error("Erro ao buscar aulas completas:", fetchError);
                return; 
            }
            

            localStorage.setItem("completedLessons", JSON.stringify(completedData.map(ele => ele.aulas_id)));

            if (completedData.length > 0) {
                const courseData = completedData.find(course => course.curso_id === id);
                if (courseData && courseData.aulas_id) {
                    const storageData = {
                        curso_id: courseData.curso_id,
                        aulas_id: courseData.aulas_id,
                    };
                    localStorage.setItem('curso_info', JSON.stringify(storageData));
                    setCompletedLessons(courseData.aulas_id);
                }
            }
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
                    aulas={aulas} 
                />
            </div>
        </div>
    );
};

export default CoursePage;
