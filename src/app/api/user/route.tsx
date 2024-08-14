
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDB from '@/lib/db';
import User from '@/models/user'; // Adjust the path to your User model
import { authOptions } from '@/utils/authOptions';

// Force the route to be treated as dynamic
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        const { client } = await connectToDB();

        // Get session
        const session = await getServerSession({ req, ...authOptions });

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { status: "error", message: "Session not found or expired" },
                { status: 401 }
            );
        }

        // Fetch user data based on session email
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { status: "error", message: "User not found" },
                { status: 404 }
            );
        }

        // Return success response with user data
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { status: "error", message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        // Connect to the database
        const { client } = await connectToDB();

        // Get session
        const session = await getServerSession({ req, ...authOptions });

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { status: "error", message: "Session not found or expired" },
                { status: 401 }
            );
        }

        // Fetch user data based on session email
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { status: "error", message: "User not found" },
                { status: 404 }
            );
        }

        // Update user data
        const { profileImage, username, bio, location, work, skills, links, coverImage } = await req.json();
        user.avatar = profileImage || user.profileImage;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.location = location || user.location;
        user.work = work || user.work;
        user.skills = skills || user.skills;
        user.links = links || user.links;
        user.coverphoto = coverImage || user.coverImage;

        await user.save();

        // Return success response with updated user data
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error updating user data:", error);
        return NextResponse.json(
            { status: "error", message: "Internal server error" },
            { status: 500 }
        );
    }
}
