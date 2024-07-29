/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultUi, Player, Youtube } from "@vime/react";
import { CheckCircle, CircleNotch } from "phosphor-react";
import { gql, useQuery } from "@apollo/client";
import '@vime/core/themes/default.css';
import { supabase } from "../utils/supabase";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom"; // Importando useParams para pegar parâmetros da URL

// Consulta GraphQL para obter a aula pelo slug
const GET_LESSON_BY_SLUG_QUERY = gql`
    query GetLessonSlug($slug: String) {
        aula(where: {slug: $slug}) {
            id
            title
            videoId
            description
            teacher {
                name
                bio
                avatarURL
            }
            curse {
                id
            }
        }
    }
`;

// Consulta GraphQL para obter todas as aulas de um curso
const GET_LESSONS_BY_COURSE_ID = gql`
    query GetLessonsByCourseId($courseId: ID!) {
        aulas(where: { curse: { id: $courseId } }) {
            id
            title
            videoId
            description
            teacher {
                name
                bio
                avatarURL
            }
            curse {
                id
            }
        }
    }
`;

// Interface para a resposta da consulta
interface GetLessonBySlugResponse {
    aula: {
        id: string;
        title: string;
        videoId: string;
        description: string | null;
        teacher: {
            bio: string;
            avatarURL: string;
            name: string;
        }
        curse: {
            id: string;
        }
    }
}

// Interface para a resposta da consulta de aulas
interface GetLessonsByCourseIdResponse {
    aulas: {
        id: string;
        title: string;
        videoId: string;
        description: string | null;
        teacher: {
            bio: string;
            avatarURL: string;
            name: string;
        }
        curse: {
            id: string;
        }
    }[];
}

// Propriedades do componente Video
interface VideoProps {
    lessonSlug?: string; // slug pode ser opcional
    updateCompletedLessons: (lessonId: string) => void;
}

export function Video(props: VideoProps) {
    const { lessonSlug } = props;
    const { id } = useParams<{ id: string }>(); // Pega o ID do curso da URL

    // Busca a aula pelo slug ou todas as aulas do curso se o slug não for passado
    const { data: lessonData, loading: loadingLesson } = useQuery<GetLessonBySlugResponse>(GET_LESSON_BY_SLUG_QUERY, {
        variables: { slug: lessonSlug },
        skip: !lessonSlug, // Ignora a consulta se o slug não for passado
    });

    const { data: allLessonsData, loading: loadingAllLessons } = useQuery<GetLessonsByCourseIdResponse>(GET_LESSONS_BY_COURSE_ID, {
        variables: { courseId: id }, // Usando o ID da URL
        skip: !!lessonSlug, // Ignora a consulta se o slug for passado
    });

    const loading = loadingLesson || loadingAllLessons;

    const token = localStorage.getItem("sb-zrzlksbelolsesmacfhs-auth-token");
    const userData = token ? JSON.parse(token) : null;
    const alunoId = userData ? userData.user.id : null;

    const handleMarkAsCompleted = async () => {
        const lesson = lessonData?.aula || allLessonsData?.aulas[0]; // Pega a aula atual ou a primeira aula
        if (lesson && alunoId) {
            try {
                const { data: existingRecords, error: fetchError } = await supabase
                    .from('aulasCompletas')
                    .select('aulas_id')
                    .eq('aluno_id', alunoId)
                    .eq('curso_id', lesson.curse.id);
    
                if (fetchError) throw fetchError;

                if (existingRecords.length > 0) {
                    const aulasIdArray = existingRecords[0].aulas_id;

                    if (aulasIdArray.includes(lesson.id)) {
                        const updatedAulasId = aulasIdArray.filter((id: string) => id !== lesson.id);

                        await supabase
                            .from('aulasCompletas')
                            .update({ aulas_id: updatedAulasId })
                            .eq('aluno_id', alunoId)
                            .eq('curso_id', lesson.curse.id);

                        props.updateCompletedLessons(lesson.id);
                        Swal.fire({
                            position: "top",
                            icon: "success",
                            title: "Aula removida da lista de concluídas!",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                    } else {
                        const updatedAulasId = [...aulasIdArray, lesson.id];

                        await supabase
                            .from('aulasCompletas')
                            .update({ aulas_id: updatedAulasId })
                            .eq('aluno_id', alunoId)
                            .eq('curso_id', lesson.curse.id);

                        props.updateCompletedLessons(lesson.id); 
                        Swal.fire({
                            position: "top",
                            icon: "success",
                            title: "Aula marcada como concluída!",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                    }
                } else {
                    await supabase
                        .from('aulasCompletas')
                        .insert([
                            {
                                aulas_id: [lesson.id],
                                curso_id: lesson.curse.id,
                                aluno_id: alunoId,
                            }
                        ]);

                    props.updateCompletedLessons(lesson.id);
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: "Aula marcada como concluída!",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                }
            } catch (error) {
                console.error("Erro ao marcar aula como concluída:", error);
                Swal.fire({
                    title: 'Ops, algo errado',
                    text: 'Ocorreu um erro ao tentar marcar a aula como concluída.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex-1 items-center justify-center">
                <div className="flex justify-center pt-[25vh] items-center w-full">
                    <span className="mr-1">Carregando</span>
                    <CircleNotch size={26} className="animate-spin text-blue-500" />
                </div>
            </div>
        );
    }

    const lesson = lessonData?.aula || allLessonsData?.aulas[0]; // Pega a aula atual ou a primeira aula

    if (!lesson) {
        window.location.replace('/')
    }

    const renderDescriptionWithLinks = () => {
        const description = lesson?.description || '';
        const descriptionWithLinks = description.replace(
            /(\b(https?|ftp):\/\/[^\s()]+\b)/gi,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        return { __html: descriptionWithLinks };
    };

    return (
        <div className="flex-1 mt-4 mx-2">
            <div className="bg-black flex justify-center">
                <div className="h-full w-full max-w-[1100px] max-h-[60vh] aspect-video">
                    <Player>
                        <Youtube videoId={lesson!.videoId} />
                        <DefaultUi />
                    </Player>
                </div>
            </div>
            
            <div className="flex ml-5 sm:max-w-[1100px] mt-6 mb-16">
                <div className="flex items-start gap-16">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{lesson!.title}</h1>
                        <p
                            className="mt-4 text-gray-200 leading-relaxed"
                            dangerouslySetInnerHTML={renderDescriptionWithLinks()}
                        />
                        <div className="flex flex-row gap-2">
                            <button 
                                onClick={handleMarkAsCompleted}
                                className="p-2 text-sm bg-green-500 flex items-center rounded font-bold uppercase gap-2 justify-center hover:bg-green-700 transition-colors"
                            >
                                <CheckCircle size={31} />
                                Marcar como Concluído
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                            <img
                                className="h-16 w-16 rounded-full border-2 border-blue-500"
                                src={lesson!.teacher.avatarURL}
                                alt={`Imagem do professor ${lesson!.teacher.name}`}
                            />
                            <div className="leading-relaxed">
                                <p className="text-xs">Professor</p>
                                <strong className="font-bold text-2xl block">{lesson!.teacher.name}</strong>
                                <span className="text-gray-200 text-sm block">{lesson!.teacher.bio}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
