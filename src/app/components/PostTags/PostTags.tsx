import React from 'react';
import Link from 'next/link';
import { getRandomColor } from '@/lib/getRandomColor';

export const PostTags = ({ tags }: { tags: Array<{ name: string }> }) => {
  return (
    <ul className='flex gap-2 list-none'>
      {tags &&
        tags.map((tag, i) => (
          <li key={i} className=''>
            <Link href={`/tags/${tag.name}`}>
              <span style={{ color: getRandomColor() }}>#</span>
              {tag.name}
            </Link>
          </li>
        ))}
    </ul>
  );
};