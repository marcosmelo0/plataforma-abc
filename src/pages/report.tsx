/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useQuery } from "@apollo/client";
import { Header } from "../components/Header";
import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2'; // Importando SweetAlert2
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

const GET_ALL_COURSES = gql`
    query MyQuery {
        cursos {
            id
            nome
            aula {
                id
            }
        }
    }
`;

interface GetAllCoursesResponse {
    cursos: {
        id: string;
        nome: string;
        aula: {
            id: string;
        }[];
    }[];
}

interface UserProfile {
    id: string;
    name: string; 
    is_super_admin: boolean; // Adicionando is_super_admin
}

interface CompletedLessons {
    id: string;
    aluno_id: string;
    aulas_id: string[]; 
}

export function Report() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [completedLessons, setCompletedLessons] = useState<CompletedLessons[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>("todos");
    const [percentageWatched, setPercentageWatched] = useState<number | null>(null);
    const [totalAulas, setTotalAulas] = useState<number>(0);
    const [aulasAssistidas, setAulasAssistidas] = useState<number>(0);
    const { data, loading, error } = useQuery<GetAllCoursesResponse>(GET_ALL_COURSES);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate(); 

    const handleUsers = async () => {
        const { data } = await supabase.from('user_profiles').select('*');
        if (data) { 
            setUsers(data);
        }
    };

    const handleCompletedLessons = async () => {
        const { data } = await supabase.from('aulasCompletas').select('*');
        if (data) { 
            setCompletedLessons(data);
            console.log("Completed Lessons:", data); 
        }
    };

    const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = event.target.value;
        setSelectedUserId(userId);

        if (userId === "todos") {
            // Calcular para todos os usuários
            const total = data?.cursos.reduce((acc, curso) => acc + curso.aula.length, 0) || 0;
            const assistidas = completedLessons.reduce((acc, lesson) => acc + lesson.aulas_id.length, 0);

            const percentage = total > 0 ? (assistidas / total) * 100 : 0;

            setTotalAulas(total);
            setAulasAssistidas(assistidas);
            setPercentageWatched(percentage);
        } else {
            const userLessons = completedLessons.filter(lesson => lesson.aluno_id === userId);

            if (data?.cursos.length) {
                const total = data.cursos.reduce((acc, curso) => acc + curso.aula.length, 0);
                const assistidas = userLessons.reduce((acc, lesson) => acc + lesson.aulas_id.length, 0);
                const percentage = total > 0 ? (assistidas / total) * 100 : 0;

                setTotalAulas(total);
                setAulasAssistidas(assistidas);
                setPercentageWatched(percentage);
            } else {
                setTotalAulas(0);
                setAulasAssistidas(0);
                setPercentageWatched(0);
            }
        }
    };

    useEffect(() => {
        const verifyAuthenticated = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = localStorage.getItem("sb-zrzlksbelolsesmacfhs-auth-token");
            const tokenData = token ? JSON.parse(token) : null;
            
            if (!tokenData || tokenData.access_token !== session?.access_token) {
                window.location.replace("/login");
            } else {
                setIsAuthenticated(true);

                const { data: { user } } = await supabase.auth.getUser();
                if (user && user.id) {
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('name, is_super_admin') 
                        .eq('id', user.id)
                        .single();

                    if (!profile!.is_super_admin) {
                        Swal.fire({
                            title: 'Acesso Negado',
                            text: 'Você não tem permissão para acessar esta página.',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: 'blue',
                            timerProgressBar: true,
                            timer: 3000,
                        }).then(() => {
                            navigate('/');
                        });
                    }
                }
            }
        };

        verifyAuthenticated();
        handleUsers();
        handleCompletedLessons();
    }, [navigate]);

    if (!isAuthenticated) {
        return null;
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const selectedUser = users.find(user => user.id === selectedUserId);

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                <select className="bg-gray-800 text-white rounded m-4 p-2" onChange={handleUserSelect}>
                    <option value="todos">Todos</option>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>No users available</option>
                    )}
                </select>
                
                {selectedUserId === "todos" ? (
                    <div className="bg-gray-700 rounded p-4 mt-4">
                        <h2 className="text-lg font-semibold text-white">Resultados para todos os usuários:</h2>
                        {users.map((user) => {
                            const userLessons = completedLessons.filter(lesson => lesson.aluno_id === user.id);
                            const total = data?.cursos.reduce((acc, curso) => acc + curso.aula.length, 0) || 0;
                            const assistidas = userLessons.reduce((acc, lesson) => acc + lesson.aulas_id.length, 0);
                            const percentage = total > 0 ? (assistidas / total) * 100 : 0;

                            return (
                                <div key={user.id} className="mt-4 bg-gray-600 rounded p-4">
                                    <h3 className="text-white font-semibold">{user.name}</h3>
                                    <p className="text-white">Total de aulas: <span className="font-bold">{total}</span></p>
                                    <p className="text-white">Aulas assistidas: <span className="font-bold">{assistidas}</span></p>
                                    <p className="text-white">Porcentagem de aulas assistidas: <span className="font-bold">{percentage.toFixed(2)}%</span></p>
                                    
                                    <div className="mt-2">
                                        <div className="bg-gray-500 rounded-full h-4">
                                            <div
                                                className="bg-green-500 h-full rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    percentageWatched !== null && (
                        <div className="bg-gray-700 rounded p-4 mt-4">
                            <h2 className="text-lg font-semibold text-white">
                                Resultados para: <span className="font-bold">{selectedUser?.name}</span>
                            </h2>
                            <p className="text-white">Total de aulas: <span className="font-bold">{totalAulas}</span></p>
                            <p className="text-white">Aulas assistidas: <span className="font-bold">{aulasAssistidas}</span></p>
                            <p className="text-white">Porcentagem de aulas assistidas: <span className="font-bold">{percentageWatched.toFixed(2)}%</span></p>
                            
                            <div className="mt-2">
                                <div className="bg-gray-600 rounded-full h-4">
                                    <div
                                        className="bg-green-500 h-full rounded-full"
                                        style={{ width: `${percentageWatched}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
}
