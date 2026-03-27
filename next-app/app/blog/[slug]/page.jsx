// function generateStaticParams(){}

import { getPost } from "../../../lib/posts";

export default async function SlugPage({params}){
    console.log("params : ", await params);
    const {slug} = await params;
    const post = await getPost(slug);
    return(
        <div>
            <h1>{post.title}</h1>
            <h2>{post.body}</h2>
        </div>
    )
}