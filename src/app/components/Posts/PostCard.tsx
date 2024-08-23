import React, { useState } from "react";
import { AuthorInfo } from "../AuthorInfo/AuthorInfo";
import { PostImage } from "./PostImage";
import Avatar from "../Avatar";
import LikeButton from "../LikeButton";
import BookmarkButton from "../BookmarkButton";
import { PostTags } from "../PostTags/PostTags";
import CommentButton from "../CommentButton";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { deletePostByTitle } from "@/lib/fetchPost";
import { useToast } from "@/app/hook/useToast";
import ShareButton from "../ShareButton";
import { useSession } from "next-auth/react";

const formatDate = (date: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const today = new Date(date);

  return today.toLocaleDateString("en-US", options);
};

const PostCard = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient(); 
  const toast = useToast();
  const { data: session } = useSession()
  const mutation = useMutation({
    mutationFn: deletePostByTitle,
    onSuccess: async () => {
      toast.success("Post deleted successfully");
      // Refetch posts after a successful deletion
      queryClient.invalidateQueries({ queryKey: ['posts']});
    },
  });
  
  const userId = session?.user as { _id?: string }
  const userEmail = session?.user?.email
  
  const { title, views, image, tags, author, date, titleURL, comments } =
    props;
  // console.log(tags)
  const formattedDate = formatDate(date);
  return (
    <>
      <div className="bg-white rounded-b-lg">
        <PostImage
          link={titleURL}
          src={image}
          alt={title}
          className="post__image"
        />
        <div className="flex gap-x-8 p-8">
          <Avatar seed={author.id} size="small" />
          <AuthorInfo status="preview" author={author} date={formattedDate} />
          <span className="text-xs">{views?.length || 0} View(s)</span>
         <div className="ml-auto relative">
         {userEmail === author.email && (
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
        <div className="px-8 mt-4">
          <Link href={`/allposts/${title}`} className="title-link">
            <h2 className="hover:text-blue-500 cursor-pointer">{title}</h2>
          </Link>
          <PostTags tags={tags} />
          <div className="flex justify-between mt-2 pb-4">
            <CommentButton comments={comments} initialTitle={title} />
            <LikeButton initialTitle={title} />
            <BookmarkButton initialTitle={title} />
            <ShareButton titleURL={titleURL} title={title} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
