import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import { Video } from '../components/Video'; 
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

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
                        />
                    )}
                </div>
                <Sidebar completedLessons={completedLessons} updateCompletedLessons={updateCompletedLessons} aulas={aulas} />
            </div>
        </div>
    );
};

export default CoursePage;
