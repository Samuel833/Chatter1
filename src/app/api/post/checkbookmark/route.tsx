import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../../auth/[...nextauth]/route';
import { authOptions } from '@/utils/authOptions';
import connectToMongoDB from '../../../../lib/db';
import Post from '../../../../models/post';
import User from '../../../../models/user';


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    const { title } = await req.json();

    if (!title || typeof title !== 'string') {
        return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    await connectToMongoDB();

    try {
        const post = await Post.findOne({ title }).populate('author');

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (!session) {
            return NextResponse.json({ bookmarked: false, bookmarkCount: post.bookmarks.length }, { status: 200 });
        }

        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = user._id;
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 404 });
        }

        const userHasBookmarked = post.bookmarks.includes(userId);

        return NextResponse.json({ bookmarked: userHasBookmarked, bookmarkCount: post.bookmarks.length }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
