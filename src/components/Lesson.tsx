import { CheckCircle, Lock } from "phosphor-react";
import { isPast, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LessonProps {
    title: string;
    slug: string;
    availableAt: Date;
    type: 'live' | 'class';
    isCompleted: boolean; // Nova prop para indicar se a aula foi concluída
}

export function Lesson(props: LessonProps) {
    const isLessonAvailable = isPast(props.availableAt);
    const availableDateFormatted = format(props.availableAt, "EEEE' • 'd' de 'MMMM' • 'k'h'mm", {
        locale: ptBR
    });

    return (
        <a href={`/lesson/${props.slug}`} className="group">
            <span className="text-white">
                {availableDateFormatted}
            </span>

            <div className={`rounded border border-gray-500 p-4 my-5 group-hover:border-white ${props.isCompleted ? 'bg-green-500 text-white border-white' : 'bg-gray-800 text-white'}`}>
                <header className="flex gap-2 items-center justify-between">
                    {isLessonAvailable ? (
                        <span className={`text-sm text-nowrap ${props.isCompleted ? 'text-white' : 'text-blue-500'} font-medium flex items-center gap-2`}>
                            <CheckCircle size={20} className="text-white" />
                            Conteúdo liberado
                        </span>
                    ) : (
                        <span className="text-sm text-orange-500 font-medium flex items-center gap-2">
                            <Lock size={20} className="text-orange-500" />
                            Em breve
                        </span>
                    )}
                    <span className={`text-xs text-nowrap rounded py-[0.125rem] px-2 text-white border ${props.isCompleted ? 'border-white' : 'border-blue-500'} font-bold`}>
                        {props.type === 'live' ? 'AO VIVO' : 'Aula Gravada'}
                    </span>
                </header>

                <strong className="mt-5 block">
                    {props.title}
                </strong>
            </div>
        </a>
    );
}
