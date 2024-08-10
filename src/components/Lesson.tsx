import { useNavigate } from 'react-router-dom';

export interface LessonProps {
    title: string;
    slug: string;
    type: 'live' | 'class';
    isCompleted: boolean;
}

export function Lesson({ title, slug, type, isCompleted }: LessonProps) {
    const navigate = useNavigate(); // Importa o hook useNavigate

    const handleClick = () => {
        navigate(`/lesson/${slug}`); // Atualiza a URL com o slug da aula
    };

    return (
        <div
            className={`rounded border border-gray-500 p-4 my-5 group-hover:border-white ${isCompleted ? 'bg-green-500 text-white border-white' : 'bg-gray-800 text-white'}`}
            onClick={handleClick} // Atualiza a URL quando a aula é clicada
        >
            <header className="flex gap-2 items-center justify-between">
                <span className={`text-xs rounded py-[0.125rem] px-2 text-white border ${isCompleted ? 'border-white' : 'border-blue-500'} font-bold`}>
                    {type === 'live' ? 'AO VIVO' : 'Aula Gravada'}
                </span>
            </header>
            <strong className="mt-5 block">
                {title}
            </strong>
        </div>
    );
}
