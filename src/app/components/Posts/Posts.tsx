"use client";

import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostList from "../PostList/PostList";

const getAllPosts = async () => {
  const response = await axios.get("/api/post");
  return response.data.data || [];
};

export default function ShowAllPosts() {
  const { isLoading, isError, data, error } = useQuery<any[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Filter posts based on the search query
  const filteredPosts = data?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {!data || data.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          No posts available
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col p-4">
          <input
            type="text"
            placeholder="Search posts by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
            style={{ width: "100%", maxWidth: "600px" }}
          />
          {!filteredPosts?.length ? (
            <div>No posts match your search.</div>
          ) : (
            <PostList items={filteredPosts} />
          )}
        </div>
      )}
    </>
  );
}
