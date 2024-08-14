'use client';

import React,{ ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


interface PostPageProps {
    params: { title: string };
}
const CommentsPage = ({ params }: PostPageProps) => {
  const [comments, setComments] = useState<{
      user: any;
      content: ReactNode; _id: string 
}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { title } = params;

  useEffect(() => {
    if (!title) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/post/${title}/comments`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setComments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [title]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;
  if (comments.length === 0) return <p>No comments available</p>;

  return (
    <div>
      {comments.map(comment => (
        <div key={comment._id}>
          <h4>{comment.user.username}</h4>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentsPage;
