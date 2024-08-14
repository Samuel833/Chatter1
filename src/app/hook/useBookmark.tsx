import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./useToast"; // Assuming you have a toast hook for notifications


export const useBookmark = (initialTitle: any) => {
  const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (!title) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    const checkIfbookmarked = async () => {
      try {
        const response = await fetch("/api/post/checkbookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setBookmarked(data.bookmarked);
        setBookmarkCount(data.bookmarkCount);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkIfbookmarked();
  }, [title]);

  const toggleBookmark = useCallback(async () => {
    if (!title) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/post/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setBookmarked((prevBookmarked) => !prevBookmarked);
      setBookmarkCount(data.bookmarks.length);

    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [title]);

  return { bookmarked, bookmarkCount, loading, error, toggleBookmark, setTitle };
};
