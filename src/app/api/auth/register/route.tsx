
import { NextResponse } from 'next/server';
import User from "@/models/user"
import connectToMongoDB from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    
    const { username, email, password } = await request.json();
    console.log(username, email, password);
    if ( !username )  return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    if( !email ) return NextResponse.json({ message: 'Email is required' }, { status: 400 });

    if (!password || password.length < 6) return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });

    try {
        
        await connectToMongoDB();
        const userFound = await User.findOne({ email });

        if (userFound) return NextResponse.json({ message: 'Email already exists' }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({ username, email, password: hashedPassword });

        const savedUser = await user.save();
        console.log(savedUser);

        return NextResponse.json({
            id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 400,
                }
            );
        }
    }
}