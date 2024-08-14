import Comment from "../../../../../models/comment"
import connectToMongoDB from "../../../../../lib/db"
import { getServerSession } from "next-auth";
// import POST from "../CreatePost/route";
// import { authOptions } from "../../../auth/[...nextauth]/route";
import { authOptions } from '@/utils/authOptions';
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../../models/post";
import User from "../../../../../models/user";


export async function POST(req: NextRequest, { params }: { params: { title: string } }) {
  const session = await getServerSession({ req, ...authOptions });
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const { title: postTitle } = params;
  const { content } = await req.json();
  console.log(content, postTitle)
  // return NextResponse.json({ message: "here"})

  try {
    await connectToMongoDB();

    const user = await User.findOne({ email: session.user?.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const post = await Post.findOne({ title: postTitle });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const comment = new Comment({
      content,
      author: user._id,
      postId: post._id,
    });

    await comment.save();

    await Post.findByIdAndUpdate(post._id, { $push: { comments: comment._id } });

    await User.findByIdAndUpdate(user._id, { $push: { comments: comment._id } });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding comment', error }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { title: string } }) {
  const { title } = params;
console.log('here')
  if (!title) {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  const { client } = await connectToMongoDB();

  try {
    const post = await Post.findOne({ title }).populate('comments');

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

     // Fetch comments related to the post
     const comments = await Comment.aggregate([
      { $match: { postId: post._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ]);
    console.log(comments)

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving post', error }, { status: 500 });
  }
}