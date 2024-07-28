import { gql, useQuery } from "@apollo/client";
import { Lesson } from "./Lesson";


const GET_LESSSONS_QUERY = gql`
    query {
        aulas(orderBy: publishedAt_ASC, stage: PUBLISHED) {
            id
            lessonType
            availableAt
            title
            slug
        }
    }
`;

interface GetLessonsQueryResponse {
    aulas: {
        id: string;
        title: string;
        slug: string;
        availableAt: string;
        lessonType: 'live' | 'class';
    }[];
}

interface SidebarProps {
    completedLessons: string[];
    updateCompletedLessons: (lessonId: string) => void;
}

export function Sidebar({ completedLessons, updateCompletedLessons }: SidebarProps) {
    const { data } = useQuery<GetLessonsQueryResponse>(GET_LESSSONS_QUERY);

    const handleLessonClick = (lessonId: string) => {
        updateCompletedLessons(lessonId);
    };

    return (
        <aside className="lg:max-w-[348px] bg-gray-700 p-6 border-l border-gray-600 mt-10 sm:mt-0">
            <span className="font-bold text-2xl pb-6 mb-6 border-b border-gray-500 block">
                Cronograma de aulas
            </span>

            <div>
                {data?.aulas.map(lesson => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                        <div 
                            key={lesson.id} 
                            className={`p-4 mb-4 rounded ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-200'}`}
                            onClick={() => handleLessonClick(lesson.id)} // Chama a função ao clicar
                        >
                            <Lesson
                                title={lesson.title}
                                slug={lesson.slug}
                                availableAt={new Date(lesson.availableAt)}
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
