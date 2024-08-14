import React, { useState } from 'react';
import Image from 'next/image';
import Avatar from '../Avatar'
import { AuthorInfo } from '../AuthorInfo/AuthorInfo';
import useCurrentUser from '../../hook/useCurrentUser';

const formatDate = (date: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const today = new Date(date);

  return today.toLocaleDateString('en-US', options);
};

const PostPreview = (props: any) => {
  const [showModal, setShowModal] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser && currentUser.userId;

  const { title, id, image, author, date, titleURL, tags, cover } = props;
  const createdAt = formatDate(date);
  console.log(props);
  return (
    <div className='preview flow-content'>
      {cover && (
        <>
          <Image
            src={image}
            alt={`Cover image for ${title}`}
            width={800}
            height={400}
          />
        </>
      )}
       <>
          <Image
            src={image}
            alt={`Cover image for ${title}`}
            width={800}
            height={400}
          />
        </>
      <div className='preview__author'>
        <Avatar size='large' />
        <AuthorInfo status='preview' author={author} date={createdAt} />
      </div>
      <div className='preview__details flow-content'>
        <a href={`/posts/${titleURL}/${id}`} className='title-link'>
          <h2>{title}</h2>
        </a>
        {/* <PostTags tags={tags} /> */}
        {/* <PreviewReactions
          userId={userId}
          post={props}
          showModal={showModal}
          setShowModal={setShowModal}
        /> */}
      </div>
    </div>
  );
};

export default PostPreview;