import React from 'react';
import { useBookmark } from '@/app/hook/useBookmark'; // Update the path according to your project structure
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import { useLoginModal } from '../hook/useModal';


const BookmarkButton = ({ initialTitle }: { initialTitle: string }) => {
  const { bookmarked, bookmarkCount, loading, toggleBookmark } = useBookmark(initialTitle);
  const { data: session } = useSession();
  const loginModal = useLoginModal()

  const handleBookmarkClick = () => {
    if(!session) {
      console.log('outside')
      loginModal.onOpen()
    } else{
      console.log('inside')
      toggleBookmark();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleBookmarkClick}
        disabled={loading}
        className="flex items-center space-x-1 focus:outline-none"
      >
        {bookmarked ? (
          <BookmarkIconSolid className="h-6 w-6 text-black" />
        ) : (
          <BookmarkIconOutline className="h-6 w-6 text-neutral-800" />
        )}
      </button>
      <p className="text-black">{bookmarkCount}</p>
    </div>
  );
};

export default BookmarkButton;


