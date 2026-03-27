import Link from "next/link";

export function Post({post}){
    return(
        <div>
            <Link href={`/blog/${post.id}`}>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
            </Link>
        </div>
    )
}