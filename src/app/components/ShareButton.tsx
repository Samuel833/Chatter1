import React from 'react';
import { useRouter } from "next/navigation"
import { ShareIcon } from '@heroicons/react/24/outline';


const ShareButton = ({ titleURL, title }: { titleURL: string, title: string }) => {
  const router = useRouter();
  const titleLink =  `${window.location.origin}/allposts/${title}` ||`${titleURL}`
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Chatter',
        text: title,
        url: titleLink,
      })
        .then(() => console.log(titleLink, 'Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(titleLink);
        alert('Link copied to clipboard!');
      }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center space-x-1 focus:outline-none"
    >
      <ShareIcon className="h-6 w-6 text-black" />
    </button>
  );
};

export default ShareButton;