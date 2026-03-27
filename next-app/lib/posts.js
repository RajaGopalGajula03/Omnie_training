export async function getPosts() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    return res.json();
}

export async function getPost(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return res.json();
}