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

        // Handle the case where the user is not logged in
        if (!session) {
            // Return only the like count if the user is not logged in
            return NextResponse.json({ liked: false, likeCount: post.likes.length }, { status: 200 });
        }

        // If the user is logged in, check if they liked the post
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = user._id;
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 404 });
        }

        const userHasLiked = post.likes.includes(userId);

        return NextResponse.json({ liked: userHasLiked, likeCount: post.likes.length }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
