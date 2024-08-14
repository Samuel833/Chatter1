// app/posts/[id]/page.tsx
"use client";

import { fetchPost } from "@/lib/fetchPost";
import React, { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import CommentForm from "@/app/components/CommentForm";
import Avatar from "@/app/components/Avatar";
import LikeButton from "@/app/components/LikeButton";
import BookmarkButton from "@/app/components/BookmarkButton";
import { marked } from "marked";
// import useCurrentUser from "@/app/hook/useCurrentUser";
import { AuthorInfo } from "@/app/components/AuthorInfo/AuthorInfo";
import Image from "next/image";
import { deletePostByTitle } from "@/lib/fetchPost";
import { PostTags } from "@/app/components/PostTags/PostTags";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/hook/useToast";
import Header from "@/app/components/Header";
import ShareButton from "@/app/components/ShareButton";

interface PostPageProps {
  params: { title: string };
}

interface Comment {
  user: {
    _id: string | undefined;
    avatar: string | undefined;
    username: string;
  };
  content: ReactNode;
  _id: string;
}

const fetchComments = async (title: string): Promise<Comment[]> => {
  const response = await fetch(`/api/post/${title}/comments`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
};

const formatDate = (date: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const today = new Date(date);

  return today.toLocaleDateString("en-US", options);
};

export default function PostPage({ params }: PostPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: deletePostByTitle,
    onSuccess: async () => {
      toast.success("Post deleted successfully");
      // Refetch posts after a successful deletion
      router.push("/allposts");
    },
  });
  const { title } = params;
  const { data: session } = useSession();
  // const { data: currentUser } = useCurrentUser();

  const userId = session?.user as { _id?: string }

  // const userId = currentUser?._id;

  // console.log(currentUser);

  
  // Fetch post data
  const {
    data: post,
    error: postError,
    isLoading: postLoading,
  } = useQuery({
    queryKey: ["post", title],
    queryFn: () => fetchPost(title),
  });
  
  console.log(post);
  
  // Fetch comments data
  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
    refetch,
  } = useQuery({
    queryKey: ["comments", title],
    queryFn: () => fetchComments(title),
  });

  // Handle comment submission
  const handleCommentSubmit = async (content: string) => {
    try {
      const res = await fetch(`/api/post/${title}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      
      if (!res.ok) {
        throw new Error("Error posting comment");
      }
      
      await res.json();
      refetch(); // Optionally, refetch comments if needed
    } catch (err: any) {
      console.error("Error posting comment:", err.message);
    }
  };
  
  const formattedDate = formatDate(post?.date);
  if (postLoading || commentsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (postError || commentsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {(postError || commentsError)?.message}
      </div>
    );
  }

  const htmlContent = marked.parse(post?.content);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Image
          src={post.imageURL}
          alt={post.title}
          className="w-full h-auto object-cover mb-8 rounded-md shadow-md"
          width={800}
          height={400}
        />
        <div className="flex items-start gap-x-4 p-4 bg-white shadow rounded-md">
          <Avatar seed={post.author._id} size="small" />
          <AuthorInfo
            status="preview"
            author={post.author}
            date={formattedDate}
          />
          <span className="text-xs">{post.views.length || 0} View(s)</span>
          <div className="ml-auto relative">
            {userId === post.author._id && (
              <div className="relative right-0">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-x-2 text-gray-700"
                >
                  {isOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      href={`/allposts/${title}/edit`}
                      className="block text-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => mutation.mutate(title)}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <h1 className="text-3xl font-bold my-4">{post.title}</h1>
        </div>
        <PostTags tags={post.tags} />
        <div
          className="prose max-w-none mb-8 markdown-preview"
          dangerouslySetInnerHTML={{ __html: htmlContent as string }}
        />
        <div className="flex  justify-between mt-2 items-center space-x-4 mb-8">
          <LikeButton initialTitle={post.title} />
          <BookmarkButton initialTitle={post.title} />
          <ShareButton titleURL={post.titleURL} title={post.title} />
        </div>

        {session && (
          <div className="mb-8">
            <CommentForm
              postTitle={post.title}
              onCommentPosted={handleCommentSubmit}
            />
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <div>
          {comments?.length === 0 ? (
            <p>No comments available</p>
          ) : (
            comments?.map((comment) => (
              <div key={comment._id} className="mb-6 border-b pb-4">
                <div className="flex items-center mb-2">
                  <Avatar seed={comment.user._id} size="small" />
                  <h4 className="ml-2 font-semibold">
                    {comment.user.username}
                  </h4>
                </div>
                <p>{comment.content}</p>
              </div>
            )) ?? null
          )}
        </div>
      </div>
    </>
  );
}
