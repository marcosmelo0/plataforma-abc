import { DefaultUi, Player, Youtube } from "@vime/react";
import { CaretRight, CheckCircle, CircleNotch, FileArrowDown, Lightning } from "phosphor-react";
import { gql, useQuery } from "@apollo/client";
import '@vime/core/themes/default.css';
import { supabase } from "../utils/supabase";

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

interface GetLessonBySlugResponse {
    aula: {
        id: string;
        title: string;
        videoId: string;
        description: string;
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

interface VideoProps {
    lessonSlug: string;
}

export function Video(props: VideoProps) {
    const { data, loading } = useQuery<GetLessonBySlugResponse>(GET_LESSON_BY_SLUG_QUERY, {
        variables: {
            slug: props.lessonSlug,
        }
    });

    const token = localStorage.getItem("sb-zrzlksbelolsesmacfhs-auth-token");
    const userData = token ? JSON.parse(token) : null;
    const aulunoId = userData ? userData.user.id : null;

    const handleMarkAsCompleted = async () => {
        if (data?.aula && aulunoId) {
            try {
                const { data: existingRecords, error: fetchError } = await supabase
                    .from('aulasCompletas')
                    .select('aulas_id')
                    .eq('aluno_id', aulunoId)
                    .eq('curso_id', data.aula.curse.id);
    
                if (fetchError) throw fetchError;
    
                if (existingRecords.length > 0) {
                    const updatedAulasId = [...existingRecords[0].aulas_id, data.aula.id];
    
                    const { error: updateError } = await supabase
                        .from('aulasCompletas')
                        .update({ aulas_id: updatedAulasId })
                        .eq('aluno_id', aulunoId)
                        .eq('curso_id', data.aula.curse.id);
    
                    if (updateError) throw updateError;
    
                    alert("Aula adicionada à lista de concluídas!");
                } else {
                    const { error: insertError } = await supabase
                        .from('aulasCompletas')
                        .insert([
                            {
                                aulas_id: [data.aula.id],
                                curso_id: data.aula.curse.id,
                                aluno_id: aulunoId,
                            }
                        ]);
    
                    if (insertError) throw insertError;
    
                    alert("Aula marcada como concluída!");
                }
            } catch (error) {
                console.error("Erro ao marcar aula como concluída:", error);
                alert("Ocorreu um erro ao marcar a aula como concluída.");
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

    return (
        <div className="flex-1 mt-4 mx-2">
            <div className="bg-black flex justify-center">
                <div className="h-full w-full max-w-[1100px] max-h-[60vh] aspect-video">
                    <Player>
                        <Youtube videoId={data!.aula.videoId} />
                        <DefaultUi />
                    </Player>
                </div>
            </div>
            
            <div className="flex ml-5 sm:max-w-[1100px] mt-6">
                <div className="flex items-start gap-16">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{data!.aula.title}</h1>
                        <p className="mt-4 text-gray-200 leading-relaxed">{data!.aula.description}</p>
                        <div className="flex flex-row gap-2">
                            <button 
                                onClick={handleMarkAsCompleted}
                                className="p-2 text-sm bg-green-500 flex items-center rounded font-bold uppercase gap-2 justify-center hover:bg-green-700 transition-colors"
                            >
                                <CheckCircle size={31} />
                                Marcar como Concluído
                            </button>

                            <a href="" className="p-4 text-sm border border-blue-500 text-blue-500 flex items-center rounded font-bold uppercase gap-2 justify-center hover:bg-blue-500 hover:text-gray-900">
                                <Lightning size={24} />
                                Ver Desafio
                            </a>
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                            <img
                                className="h-16 w-16 rounded-full border-2 border-blue-500"
                                src={data!.aula.teacher.avatarURL}
                                alt={`Imagem do professor ${data!.aula.teacher.name}`}
                            />
                            <div className="leading-relaxed">
                                <strong className="font-bold text-2xl block">{data!.aula.teacher.name}</strong>
                                <span className="text-gray-200 text-sm block">{data!.aula.teacher.bio}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid mt-16 grid-cols-1 max-w-96 mb-20 sm:mx-5">
                <a href="#" className="bg-gray-700 rounded flex items-stretch gap-6 hover:bg-gray-600 transition-colors">
                    <div className="bg-green-700 h-full p-6 flex items-center">
                        <FileArrowDown size={40} />
                    </div>
                    <div className="flex gap-2 py-6">
                        <strong className="flex flex-col gap-4 text-2xl">
                            <p className="text-sm text-gray-200 mt-2 leading-relaxed">
                                Acesse o material complementar para baixar os arquivos da aula.
                            </p>
                            Material Complementar
                        </strong>
                        <div className="flex items-center">
                            <CaretRight size={24} />
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}
