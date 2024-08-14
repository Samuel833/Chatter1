// src/app/api/posts/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToMongoDB from "@/lib/db";
import Post from "@/models/post";
import User from "@/models/user";
import { authOptions } from "@/utils/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { client, bucket } = await connectToMongoDB();

  try {
    const posts = await Post.find({ author: user._id }).populate('tags');
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching posts", error },
      { status: 500 }
    );
  }
}
