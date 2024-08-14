"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

const getAllPosts = async () => {
  const response = await axios.get("/api/getposts");
  return response.data.data;
};
console.log()

export default function ShowAllPosts() {
  const { isPending, isError, data, error } = useQuery<any[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
  console.log(data);
  if (isPending) return <div> Loading...</div>;
  if (isError) return <div> Error: {error.message}</div>;
  if (!data) return <div> No data</div>;
  return (
    <div>
      <ul>
        {data.map(
          (post: {
            imageURL: string | undefined;
            title: React.ReactNode;
            content: React.ReactNode;
            id: React.Key | null | undefined;
          }) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              {/* <img src={post.imageURL} alt="" /> */}
              <Image
                src={post?.imageURL || ""}
                alt={post.title?.toString() ?? ""}
                width={100}
                height={100}
              />
              <Link href={`/posts/${post.title}`}>View More</Link>
              <p>{post.content}</p>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
