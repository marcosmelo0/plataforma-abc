import { gql, useQuery } from "@apollo/client";
import { Link } from 'react-router-dom';

const GET_COURSES = gql`
    query MyQuery {
        cursos {
            id
            nome
            capa
            alunos  
        }
    }
`;

interface GetCoursesQueryResponse {
    cursos: {
        id: string;
        nome: string;
        capa: string;
        alunos: string;
    }[];
}

const CourseCard = () => {
    const { data: coursesData, loading, error } = useQuery<GetCoursesQueryResponse>(GET_COURSES);

    if (loading) return <p className="text-center text-gray-500">Carregando...</p>;
    if (error) return <p className="text-center text-red-500">Erro: {error.message}</p>;

    const saveCurse = (id: string) => {
        localStorage.setItem('c', id);
    }

    const typeUser = localStorage.getItem('typeUser');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {coursesData?.cursos
                    .filter(course => course.alunos === typeUser) 
                    .map(course => (
                        <Link 
                            key={course.id} 
                            to={`/curso/${course.id}`} 
                            className="bg-white shadow-lg rounded-lg overflow-hidden" 
                            onClick={() => saveCurse(course.id)}
                        >
                            <img
                                src={course.capa}
                                alt={course.nome}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800">{course.nome}</h2>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
}

export default CourseCard;
