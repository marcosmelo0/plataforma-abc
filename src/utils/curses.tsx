import { gql, useQuery } from "@apollo/client";

export interface Teacher {
    id: string;
    name: string;
}

export interface Lesson {
    id: string;
    title: string;
    slug: string;
    teacher: Teacher;
}

export interface Course {
    id: string;
    name: string;
    lesson: Lesson[];
}

export interface CoursesData {
    curses: Course[];
}

const GET_COURSES = gql`
    query Curso {
        curses {
            id
            name
            lesson {
                id
                title
                slug
                teacher {
                    id
                    name
                }
            }
        }
    }
`;

const Courses: React.FC = () => {
    const { loading, error, data } = useQuery<CoursesData>(GET_COURSES);
    console.log(data)

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error.message}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Cursos Disponíveis</h1>
            <ul>
                {data?.curses.map((course) => (
                    <li key={course.id} className="mb-4 border p-4 rounded">
                        <h2 className="text-xl font-semibold">{course.name}</h2>
                        <h3 className="text-lg">Aulas:</h3>
                        <ul>
                            {course.lesson.map((lesson) => (
                                <li key={lesson.id} className="ml-4">
                                    <p className="font-medium">{lesson.title}</p>
                                    <p className="text-sm text-gray-600">Slug: {lesson.slug}</p>
                                    <p className="text-sm text-gray-600">Professor: {lesson.teacher.name}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Courses;