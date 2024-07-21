import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Video } from "../components/Video";
import { gql, useQuery } from "@apollo/client";


const QueryFirst = gql`
    query {
    lessons(first: 1) {
        slug
    }
}
`

interface QueryFirstResponse {
    lessons: {
        slug: string;
    }[]
}


export function Event() {
    const { slug } = useParams<{ slug: string }>()
    const  data  = useQuery<QueryFirstResponse>(QueryFirst)

    const first = data.data?.lessons[0].slug

    if(!first) {
        return (
            <p>carregando...</p>
        )
    }


    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-1">
                { slug
                    ? <Video lessonSlug={slug!} />
                    : <Video lessonSlug={first!} />
                }                
               
                <Sidebar />
            </main>
        </div>
    )
}