"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useUsers from "@/app/hook/useUsers";
import Head from "next/head";
import UserBio from "../../components/User/UserBio";
import Avatar from "@/app/components/Avatar";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import TabSwitcher from "@/app/components/tabs";
import { fetchUserPosts } from "@/lib/fetchPost";
import PostList from "@/app/components/PostList/PostList";
import axios from "axios";
import Header from "@/app/components/Header";


const getAllPosts = async () => {
  try {
    const response = await axios.get("/api/post");
    console.log(response.data.data)
    return response.data.data || [];
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message };
  }
};
export default function UserId({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { userId } = params;

  const { isLoading, isError, data, error } = useQuery<any[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const posts = data?.filter((post) => post.author.id === userId);
  const bookmarks = data?.filter((post) => post.bookmarks.includes(userId));
  const { data: user } = useUsers(userId as string);

  const tabs = [
    { label: "Posts", content: <PostList items={posts} /> },
    { label: "Bookmarks", content: <PostList items={bookmarks} /> },
    { label: "Replies", content: <div>Content for Tab 3</div> },
  ];
  // console.log(user);

  return (
    <>
      <Head>
        <title>{user?.userId}</title>
      </Head>
      <Header />
      <div className="relative pb-5">
        <div className=" w-full h-40">
          <Image
            alt="Banner"
            src={
              user?.coverphoto ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
            }
            width={1000}
            height={300}
            className="object-cover w-full h-48"
          />
        </div>
        <div className="absolute top-40 left-5">
          <Avatar seed={userId} size="large" />
        </div>
        <UserBio params={{ userId }} />
      </div>

      <TabSwitcher tabs={tabs} />
    </>
  );
}
