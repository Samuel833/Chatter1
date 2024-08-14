import { NextApiRequest, NextApiResponse } from "next";
import {NextRequest, NextResponse} from "next/server";
import { getServerSession } from 'next-auth';
// import { authOptions } from '../../../app/api/auth/[...nextauth]/route';
import { authOptions } from '@/utils/authOptions';
import connectToMongoDB from '../../../lib/db';
import User from '../../../models/user';
import serverAuth from '../../../lib/serverAuth';

export async function POST(req: NextRequest, res: NextApiResponse) {
    console.log('here')
    try {
        const session = await getServerSession(authOptions);
        const { userId } = await req.json();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    
        const currentUser = await User.findOne({ email: session.user?.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!userId || typeof userId !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const {client} = await connectToMongoDB();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userHasFollowed = currentUser.following.includes(userId);

        if (!userHasFollowed) {
            currentUser.following.push(userId);
            await currentUser.save();
            await User.findByIdAndUpdate(userId, { $push: { followers: currentUser._id } });
        } else {
            currentUser.following = currentUser.following.filter(
                (followingId: string) => followingId !== userId
            );
            await currentUser.save();
            await User.findByIdAndUpdate(userId, { $pull: { followers: currentUser._id } });
        }

        return NextResponse.json(currentUser, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(authOptions);
        const { userId } = await req.json();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    
        const currentUser = await User.findOne({ email: session.user?.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { client } = await connectToMongoDB();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        currentUser.following = currentUser.following.filter(
            (followingId: string) => followingId !== userId
        );
        await User.findByIdAndUpdate(userId, { $pull: { followers: currentUser._id } });
        await User.findByIdAndUpdate(currentUser._id, { $pull: { following: userId } });
        await currentUser.save();

        return NextResponse.json(currentUser, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 400 });
    }
}
