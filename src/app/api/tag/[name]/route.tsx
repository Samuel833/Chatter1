import Tag from "@/models/tag";
import connectToMongoDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET( req: NextRequest,
    { params }: { params: { name: string } }) {
    const { name } = params;

    if (!name) {
        return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const { client } = await connectToMongoDB();

    try {
        const tag = await Tag.findOne({ name }).populate({
            path: 'posts',
            populate: {
              path: 'tags',
            },
          })
          .populate({
            path: 'posts',
            populate: {
              path: 'author',
            },
          });

        if(!tag) {
            return NextResponse.json({ message: "Tag not found" }, { status: 404 });
        }

        console.log(tag)
        return NextResponse.json(tag);
    } catch (error) {
        return NextResponse.json(
            { message: "Error retrieving tag", error },
            { status: 500 }
        );
    }

}