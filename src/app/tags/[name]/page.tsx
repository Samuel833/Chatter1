"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostList from "@/app/components/PostList/PostList";

interface GetPageProps {
  params: { name: string };
}

const getPostsByTagName = async ({ params }: GetPageProps) => {
  try {
    const response = await axios.get(`/api/tag/${params.name}`);
    return response.data || [];
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
};

export default function TagPage({ params }: GetPageProps) {
  const { name } = params;
  const { isLoading, isError, data, error } = useQuery<{ posts: any[] }>({
    queryKey: ["posts", name],
    queryFn: () => getPostsByTagName({ params: { name } }),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;
  console.log(data);
  console.log(data?.posts);

  return (
    <>
      <div className="flex justify-center items-center flex-col p-4">
        <PostList items={data?.posts} />
        {/* <h1>Tag:</h1> */}
      </div>
    </>
  );
}
