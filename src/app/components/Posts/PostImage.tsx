import React from 'react';
import Image from 'next/image';

export const PostImage = (props: any) => {
  if (props.link) {
    return (
      <div className={`preview__image ${props.className} p-8`}>
        <a href={props.link}>
          <Image className='max-h-96 object-cover' width={768} height={300} src={props.src} alt={props.alt} />
        </a>
      </div>
    );
  }
  return (
    <div className={`post__image ${props.className}`}>
      <Image className='max-h-96 object-cover' width={768} height={300} src={props.src} alt={props.alt} />
    </div>
  );
};