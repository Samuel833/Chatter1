import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

const usePosts = (userId?: string) => {
    const url = userId
        ? `/api/post/${userId}`
        : '/api/post';
    const { data, error, isLoading, mutate } = useSWR(url, fetcher);
    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default usePosts;