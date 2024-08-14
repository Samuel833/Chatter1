// CommentForm.tsx
import React, { useState } from 'react';

interface CommentFormProps {
  postTitle: string;
  onCommentPosted: (content: string) => Promise<void>; // Ensure onCommentPosted accepts a string argument
}

const CommentForm: React.FC<CommentFormProps> = ({ postTitle, onCommentPosted }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.trim() !== '') {
      await onCommentPosted(content); // Invoke onCommentPosted with content as argument
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment"
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
      ></textarea>
      <button
        type="submit"
        className="self-end px-4 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black transition-colors duration-200"
      >
        Post Comment
      </button>
    </form>
  );
  
};

export default CommentForm;
