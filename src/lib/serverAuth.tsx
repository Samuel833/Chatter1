import { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from "./db"
import User from '../models/user';
// import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    // Connect to database
    const { client } = await connectToDB();
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        throw new Error('Not signed in');
    }

    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
        throw new Error('Not signed in');
    }

    return { currentUser };
};

export default serverAuth;