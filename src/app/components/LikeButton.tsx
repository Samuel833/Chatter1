import React from 'react';
import { useLike } from '../hook/useLike'; // Update the path according to your project structure
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { useLoginModal } from '../hook/useModal';

const LikeButton = ({ initialTitle }: { initialTitle: string }) => {
  const { liked, likeCount, loading, toggleLike } = useLike(initialTitle);
  const { data: session } = useSession();
  const loginModal = useLoginModal()

  const handleLikeClick = () => {
    if(!session) {
      console.log('outside')
      loginModal.onOpen()
    } else{
      console.log('inside')
      toggleLike();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLikeClick}
        disabled={loading}
        className="flex items-center space-x-1 focus:outline-none"
      >
        {liked ? (
          <HeartIconSolid className="h-6 w-6 text-red-500" />
        ) : (
          <HeartIconOutline className="h-6 w-6 text-neutral-800" />
        )}
      </button>
      <p className="text-neutral-800 dark:text-black">{likeCount}</p>
    </div>
  );
};

export default LikeButton;
