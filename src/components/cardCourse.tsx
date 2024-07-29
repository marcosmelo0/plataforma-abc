import { gql, useQuery } from "@apollo/client";

const GET_COURSES = gql`
    query MyQuery {
        cursos {
            id
            nome
            capa
        }
    }
`;

interface GetCoursesQueryResponse {
    cursos: {
        id: string;
        nome: string;
        capa: string;
    }[];
}

const CourseCard = () => {
    const { data: coursesData, loading, error } = useQuery<GetCoursesQueryResponse>(GET_COURSES);

    if (loading) return <p className="text-center text-gray-500">Carregando...</p>;
    if (error) return <p className="text-center text-red-500">Erro: {error.message}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {coursesData?.cursos.map(course => (
                    <a key={course.id} href={`/curso/${course.id}`} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img
                            src={course.capa}
                            alt={course.nome}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800">{course.nome}</h2>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default CourseCard;
