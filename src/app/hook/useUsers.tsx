import connectToDB from '../../lib/db';
import useSWR from 'swr';
import fetcher from '../../lib/fetcher';

const useUsers = (userId?: string) => {
    const url = userId ? `/api/user/${userId}` : '/api/user';
    const { data, error, isLoading, mutate } = useSWR(url, fetcher);
    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useUsers;