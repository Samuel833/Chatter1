import axios from 'axios';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useCurrentUser from './useCurrentUser';
import useUsers from './useUsers';
import { useToast } from './useToast';

const useFollow = (userId: string) => {
    const router = useRouter();
    const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
    const { mutate: mutateFetchedUser } = useUsers(userId);

    const toast = useToast();

    const isFollowing = currentUser?.following?.includes(userId) ?? false;

    const toggleFollow = useCallback(async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }

        try {
            const request = isFollowing
                ? () => axios.delete('/api/follow', { data: { userId } })
                : () => axios.post('/api/follow', { userId });

            await request();
            mutateCurrentUser();
            mutateFetchedUser();

            toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
        } catch (error) {
            toast.error('Something went wrong');
        }
    }, [currentUser, router, isFollowing, mutateCurrentUser, mutateFetchedUser, toast, userId]);

    return {
        isFollowing,
        toggleFollow,
    };
}
export default useFollow;
