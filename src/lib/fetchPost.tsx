interface Post {
    _id: string;
    title: string;
    content: string;
}
export async function fetchPost(title: string) {
    const res = await fetch(`/api/post/${title}`);
    if (!res.ok) {
      throw new Error('Post not found');
    }
    return res.json();
}

export async function fetchComments(title: string) {
    const res = await fetch(`/api/post/${title}/comments`);
    if (!res.ok) {
      throw new Error('Error fetching comments');
    }
    return res.json() || [];
}
  
  export const fetchUserPosts = async (): Promise<Post[]> => {
    const res = await fetch('/api/getuserposts');
    if (!res.ok) {
      throw new Error('Error fetching user posts');
    }
    return res.json();
  };

  // src/lib/deletePostByTitle.ts
export const deletePostByTitle = async (title: string): Promise<void> => {
    const url = title ? `/api/post/${title}` : '/api/post';
    const res = await fetch(url, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      throw new Error('Error deleting post');
    }
    console.log('Post deleted');
  };
  