import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../../auth/[...nextauth]/route';
import { authOptions } from '@/utils/authOptions';
import connectToMongoDB from '../../../../lib/db';
import Post from '../../../../models/post';
import User from '../../../../models/user';


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId || typeof userId !== 'string') {
        return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    await connectToMongoDB();

    try {
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'user not found' }, { status: 404 });
        }

        const currentUser = await User.findOne({ email: session.user?.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }


        const userHasFollowed = currentUser.following.includes(userId);

        return NextResponse.json({ followed: userHasFollowed, followCount: currentUser.following.length }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
