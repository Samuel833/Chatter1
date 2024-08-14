// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import connectToMongoDB from "../../../lib/db";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { ObjectId } from 'mongodb';

// export async function POST(req: NextRequest): Promise<NextResponse> {
//     const { client, bucket } = await connectToMongoDB();

//     // Get session information
//     const session = await getServerSession(authOptions);
//     if (!session) {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         // Read raw image data
//         const arrayBuffer = await req.arrayBuffer();
//         if (!arrayBuffer) {
//             return NextResponse.json({ message: 'No image data received' }, { status: 400 });
//         }
//         const buffer = Buffer.from(arrayBuffer);

//         // Generate a unique filename
//         const imageName = `${Date.now()}-${new ObjectId()}`;
//         const stream = Readable.from(buffer);

//         // Create a writable stream to GridFS
//         const uploadStream = bucket.openUploadStream(imageName, {
//             metadata: {
//                 contentType: req.headers.get('Content-Type') || 'application/octet-stream',
//                 uploadedBy: session.user?.email || 'unknown',
//                 createdAt: new Date(),
//             },
//         });

//         return new Promise<NextResponse>((resolve, reject) => {
//             uploadStream.on('error', (err) => {
//                 console.error('Error uploading file:', err);
//                 reject(NextResponse.json({ message: 'Error uploading file' }, { status: 500 }));
//             });

//             uploadStream.on('finish', () => {
//                 const imageURL = `${process.env.NEXTAUTH_URL}/api/images/${uploadStream.id}`;
//                 resolve(NextResponse.json({ imageURL }));
//             });

//             stream.pipe(uploadStream);
//         });

//     } catch (error) {
//         console.error('Error creating post:', error);
//         return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
//     }
// }


export async function POST(req: NextRequest): Promise<NextResponse> {
    const { client, bucket } = await connectToMongoDB();

    // Get session information
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Read raw image/video data
        const arrayBuffer = await req.arrayBuffer();
        if (!arrayBuffer) {
            return NextResponse.json({ message: 'No data received' }, { status: 400 });
        }
        const buffer = Buffer.from(arrayBuffer);

        // Generate a unique filename
        const fileName = `${Date.now()}-${new ObjectId()}`;
        const stream = Readable.from(buffer);

        // Determine the content type
        const contentType = req.headers.get('Content-Type') || 'application/octet-stream';
        
        // Create a writable stream to GridFS
        const uploadStream = bucket.openUploadStream(fileName, {
            metadata: {
                contentType: contentType,
                uploadedBy: session.user?.email || 'unknown',
                createdAt: new Date(),
            },
        });

        return new Promise<NextResponse>((resolve, reject) => {
            uploadStream.on('error', (err) => {
                console.error('Error uploading file:', err);
                reject(NextResponse.json({ message: 'Error uploading file' }, { status: 500 }));
            });

            uploadStream.on('finish', () => {
                const fileURL = `${process.env.NEXTAUTH_URL}/api/images/${uploadStream.id}`;
                resolve(NextResponse.json({ fileURL }));
            });

            stream.pipe(uploadStream);
        });

    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
    }
}
