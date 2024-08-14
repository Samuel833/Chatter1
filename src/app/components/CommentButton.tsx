import React from "react";
// import usePosts from "@/app/hook/usePosts";
// import { useQuery } from "@tanstack/react-query";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


export default function CommentButton({ initialTitle, comments }: { initialTitle: string; comments: any }) {
  // const { data: posts = [] } = usePosts();
  // console.log(posts)
  return (
    <div className="flex items-center space-x-2">
      <Link href={`/allposts/${initialTitle}`}>
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
      </Link>
      <span>{comments?.length}</span>
    </div>
  );
}