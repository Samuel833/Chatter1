import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectToMongoDB from '../../../../lib/db';
import { Readable } from 'stream';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const { bucket } = await connectToMongoDB();

    try {
        const _id = new ObjectId(id);
        const files = await bucket.find({ _id }).toArray();

        if (!files || files.length === 0) {
            return NextResponse.json({ message: 'File not found' }, { status: 404 });
        }

        const file = files[0];
        const downloadStream = bucket.openDownloadStream(_id);

        const headers = new Headers();
        headers.set('Content-Type', file.metadata?.contentType || 'application/octet-stream');

        const readableStream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => {
                    controller.enqueue(chunk);
                });

                downloadStream.on('end', () => {
                    controller.close();
                });

                downloadStream.on('error', (err) => {
                    controller.error(err);
                });
            },
        });

        return new NextResponse(readableStream, { headers });

    } catch (error) {
        return NextResponse.json({ message: 'Error retrieving file', error }, { status: 500 });
    }
}


