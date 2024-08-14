import React from "react";
import PostPreview from "../PostPreview/PostPreview";
import PostCard from "../Posts/PostCard";
// import SkeletonPostList from '../Skeleton/SkeletonPostList';
import "./PostList.css";

const PostList = (props: any) => {
  return (
    <div className="container container-posts">
      {/* {props.isLoading && <SkeletonPostList type={!props.cover && 'mini'} />} */}
      {!props.isLoading && (
        <ul>
          {props.items &&
            props.items.map((post: any, i: any) => {
              return (
                <PostCard
                  key={post.id}
                  id={post._id}
                  title={post.title}
                  body={post.content}
                  image={post.imageURL}
                  date={post.date}
                  author={props.author || post.author}
                  tags={post.tags}
                  views={post.views}
                  titleURL={post.titleURL}
                  likes={post.likes}
                  bookmarks={post.bookmarks}
                  comments={post.comments}
                />
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default PostList;
