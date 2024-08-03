import { gql, useQuery } from "@apollo/client";
import { Lesson } from "./Lesson";
import { useEffect } from "react";

const getCourseId = () => localStorage.getItem('c');

const GET_COURSE_BY_ID = gql`
    query GetCourseById($id: ID!) {
        curso(where: {id: $id}) {
            id
            nome
            aula(orderBy: publishedAt_ASC) {
                id
                lessonType
                availableAt
                title
                slug
            }
        }
    }
`;


interface LessonType {
    id: string;
    title: string;
    slug: string;
    lessonType: 'live' | 'class'; 
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Sidebar({ completedLessons, updateCompletedLessons }: any) {
    const idCourse = getCourseId();

    const { data, loading, error, refetch } = useQuery(GET_COURSE_BY_ID, {
        variables: { id: idCourse },
        skip: !idCourse,
    });

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

    const aulas: LessonType[] = data?.curso?.aula || [];
    console.log(data);

    const handleLessonClick = (lessonId: string) => {
        updateCompletedLessons(lessonId);
    };

    return (
        <aside className="lg:max-w-[348px] bg-gray-700 p-6 border-l border-gray-600 mt-10 sm:mt-0">
            <span className="font-bold text-2xl pb-6 mb-6 border-b border-gray-500 block">
                Cronograma de aulas
            </span>
            <span>Aulas:</span>

            <div>
                {aulas?.map((lesson: LessonType) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                        <div 
                            key={lesson.id} 
                            className={`p-1 mb-2 rounded cursor-pointer ${isCompleted ?  'bg-green-500 text-white' : ' text-gray-200'}`}
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
