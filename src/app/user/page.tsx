"use client";
// app/user/posts/page.tsx
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUserPosts, deletePostByTitle } from "../../lib/fetchPost";
import markdownToHtml from "../../lib/markdownToHtml";
import { marked } from "marked";

export default function UserPosts() {
  const {
    data: posts,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: fetchUserPosts,
  });
  const mutation = useMutation({
    mutationFn: deletePostByTitle,
    onSuccess: async () => {
      refetch(); // Refetch posts after a successful deletion
    },
  });
  console.log(posts);
  // console.log(posts[])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // const htmlContent = markdownToHtml(posts?.[0]?.content ?? "");
  // console.log(htmlContent);

  return (
    <div>
      <h1>Your Posts</h1>
      {posts?.map((post) => {

        const htmlContent = marked.parse(post.content);
        return (
          <div key={post._id}>
            <h2>{post.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent as string }}
              style={{ lineHeight: "1.5" }}
            />{" "}
            <button onClick={() => mutation.mutate(post.title)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}
