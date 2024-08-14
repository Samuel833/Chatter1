import Post from "../../../../models/post";
import connectToMongoDB from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/route";
import { authOptions } from '@/utils/authOptions';
import User from "@/models/user";
import Tag from "@/models/tag";

// GET /posts/:title

export async function GET(
  req: NextRequest,
  { params }: { params: { title: string } }
) {
  // Check if the user is authenticated
  const session = await getServerSession(authOptions);

  const { title } = params;

  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  const { client } = await connectToMongoDB();

  try {
    // Fetch the post based on the title
    const post = await Post.findOne({ title }).populate("author").populate("tags");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // If the user is authenticated, update the views
    if (session) {
      const user = await User.findOne({ email: session.user?.email });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const userId = user._id;
      const userHasViewed = post.views.includes(userId);

      if (!userHasViewed) {
        post.views.push(userId);
        await post.save();
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving post", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { title: string } }
) {
  const session = await getServerSession(authOptions);
  // console.log(session)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToMongoDB();

  try {
    const { title } = params;

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const post = await Post.findOneAndDelete({ title, author: user._id });
    await User.findByIdAndDelete(user._id, { $pull: { posts: post._id } });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
    // return console.log(post)
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting post", error },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: { title: string } }
  ) {
  // console.log("PUT request");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToMongoDB();

  const { title } = params;

  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const post = await Post.findOne({ title });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "Unauthorized to update post" },
        { status: 401 }
      );
    }
    const formData = await req.formData();
    
    const newTitle = formData.get("title") as string;
    const markdown = formData.get("content") as string;
    const tagsString = formData.get("tags") as string;
    const file = formData.get("image") as string;

    post.title = newTitle;
    post.content = markdown;
    post.imageURL = file;
    const tagsArray = tagsString.split(',').map(tag => tag.trim().toLowerCase());

    const tagIds = [];
    for (const tagName of tagsArray) {
      // Find or create the tag
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = new Tag({ name: tagName });
        await tag.save();
      }

      // Add tag ID to list
      tagIds.push(tag._id);

      // Ensure the post is associated with the tag
      if (!tag.posts.includes(post._id)) {
        tag.posts.push(post._id);
        await tag.save();
      }
    }

    // Update the post's tags
    post.tags = tagIds;

    await post.save();

    return NextResponse.json(post);
    
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating post", error },
      { status: 500 }
    );
  }
}

// export default { GET, DELETE, PUT };