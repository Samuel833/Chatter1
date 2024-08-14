import Post from "@/models/post";
import User from "@/models/user";
import Tag from "@/models/tag";
import { getServerSession } from "next-auth";
import connectToMongoDB from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

// POST /api/post
// Required fields in body: title
// Required fields in body: content

// POST function to handle the request
export async function POST(req: NextRequest, res: NextApiResponse) {
  const { client, bucket } = await connectToMongoDB();

  const session = await getServerSession({
    req: Request,
    res: NextResponse,
    ...authOptions,
  });
  console.log(session);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Handle file upload
    const formData = await req.formData();

    // Extract fields directly from formData
    const title = formData.get("title") as string;
    const file = formData.get("image") as File;
    const tags = formData.get("tags") as string;
    const content = formData.get("content") as string;
    console.log("my tags:", tags);

    if (!title || !file) {
      return NextResponse.json(
        { message: "Title or image file is missing" },
        { status: 400 }
      );
    }

    const imageName = `${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    const uploadStream = bucket.openUploadStream(imageName, {
      metadata: {
        contentType: file.type,
        title,
        content,
        author: user._id,
        createdAt: new Date(),
      },
    });

    stream.pipe(uploadStream);

    uploadStream.on("error", () => {
      return NextResponse.json(
        { message: "Error uploading file" },
        { status: 500 }
      );
    });

    uploadStream.on("finish", async () => {
      const imageURL = `${process.env.NEXTAUTH_URL}/api/images/${uploadStream.id}`;

      const newItem = new Post({
        title,
        content,
        author: user._id,
        imageURL: imageURL,
        titleURL: `${process.env.NEXTAUTH_URL}/allposts/${title}`,
      });
      await newItem.save();
      await User.findByIdAndUpdate(user._id, { $push: { posts: newItem._id } });

      // Handle tags
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      for (let i = 0; i < tagsArray.length; i++) {
        const tag = tagsArray[i];
        const postTag = await Tag.findOneAndUpdate(
          { name: tag.toLowerCase().trim() },
          { $addToSet: { posts: newItem._id } },
          { upsert: true, new: true }
        );

        await Post.updateOne(
          { _id: newItem._id },
          { $addToSet: { tags: postTag._id } }
        );
        console.log(tag);
      }

      await newItem.save();
      console.log(newItem);
      return NextResponse.json({ message: "ok" });
    });
    return NextResponse.json({ message: "ok" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating post" },
      { status: 500 }
    );
  }
}

// export default POST;

export async function GET(req: NextRequest) {
  try {
    const { client, bucket } = await connectToMongoDB();

    // Retrieve all posts from the database
    const posts = await Post.find()
      .sort({ date: "desc" })
      .populate("author")
      .populate("tags");

    if (!posts || posts.length === 0) {
      return NextResponse.json({ message: "No posts found" }, { status: 404 });
    }

    // Prepare the posts data to include all fields
    const postsData = posts.map((post) => ({
      id: post._id,
      title: post.title,
      content: post.content,
      imageURL: post.imageURL,
      author: {
        id: post.author?._id,
        name: post.author?.username,
        email: post.author?.email,
        avatar: post.author?.avatar,
      },
      date: post.date,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likes: post.likes,
      tags: post.tags,
      views: post.views,
      comments: post.comments,
      bookmarks: post.bookmarks,
    }));

    return NextResponse.json(
      {
        status: "success",
        data: postsData,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving posts:", error); // Improved logging
    return NextResponse.json(
      { message: "Error retrieving posts", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // console.log(session)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { title } = await req.json();

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }

  await connectToMongoDB();

  try {
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const post = await Post.findOneAndDelete({ title, author: user._id });
    await User.findByIdAndUpdate(user._id, { $pull: { posts: post._id } });

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
  } catch {
    return NextResponse.json(
      { message: "Error deleting post" },
      { status: 500 }
    );
  }
}
