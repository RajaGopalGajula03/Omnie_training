
import { getPosts } from '../../lib/posts';
import { Post } from '../../ui/post';

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div>
            <h1>All Blog Posts</h1>
            <p>Select a post below:</p>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Post post={post}></Post>
                    </li>
                ))}
            </ul>
        </div>
    )
}