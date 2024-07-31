import { gql, useQuery } from "@apollo/client";
import { Lesson } from "./Lesson";
import React, { useEffect } from 'react';

// Função para obter o ID do curso
const getCourseId = () => localStorage.getItem('c');

const GET_COURSE_BY_ID = gql`
    query GetCourseById($id: ID!) {
        curso(where: { id: $id }) {
            id
            nome
            aula {
                id
                title
                slug
                lessonType
            }
        }
    }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Sidebar({ completedLessons, updateCompletedLessons }: any) {
    const idCourse = getCourseId(); // Obtém o ID do curso

    const { data, loading, error, refetch } = useQuery(GET_COURSE_BY_ID, {
        variables: { id: idCourse }, // Passa o ID do curso
        skip: !idCourse, // Não executa a consulta se 'idCourse' não estiver definido
    });

    // Atualiza as aulas quando o componente for montado ou quando idCourse mudar
    useEffect(() => {
        if (idCourse) {
            refetch();
        }
    }, [idCourse, refetch]);

    if (loading) return <p>Carregando...</p>;
    if (error) {
        console.error("Erro ao buscar dados:", error);
        return <p>Erro: {error.message}</p>;
    }

    const aulas = data?.curso?.aula || [];
    console.log(data);

    const handleLessonClick = (lessonId: string) => {
        updateCompletedLessons(lessonId);
    };

    return (
        <aside className="lg:max-w-[348px] bg-gray-700 p-6 border-l border-gray-600 mt-10 sm:mt-0">
            <span className="font-bold text-2xl pb-6 mb-6 border-b border-gray-500 block">
                Cronograma de aulas
            </span>

            <div>
                {aulas?.map(lesson => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                        <div 
                            key={lesson.id} 
                            className={`p-4 mb-4 rounded cursor-pointer ${isCompleted ?  'bg-green-500 text-white' : 'bg-gray-800 text-gray-200'}`}
                            onClick={() => handleLessonClick(lesson.id)}
                        >
                            <Lesson
                                title={lesson.title}
                                slug={lesson.slug}
                                type={lesson.lessonType}
                                isCompleted={isCompleted}
                            />
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
