import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '../../auth/[...nextauth]/route';
import { authOptions } from '@/utils/authOptions';
import connectToMongoDB from '../../../../lib/db';
import Post from '../../../../models/post';
import User from '../../../../models/user';

// Handler for POST /api/posts/[title]/like (Like a post)
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = user._id;
        if (!userId) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userHasBookmarked = post.bookmarks.includes(userId);

        if (!userHasBookmarked) {
            post.bookmarks.push(userId);
            await post.save();
            await User.findByIdAndUpdate(userId, { $push: { bookmarks: post._id } });
        } else {
            post.bookmarks = post.bookmarks.filter((id: { equals: (arg0: any) => any; }) => !id.equals(userId));
            await Post.findByIdAndUpdate(post._id, { $pull: { bookmarks: userId } });
            await post.save();
            await User.findByIdAndUpdate(userId, { $pull: { bookmarks: post._id } });
        }

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}


