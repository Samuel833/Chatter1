// pages/api/auth/forgot-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sendEmail from '@/lib/sendEmail'; // Your function to send emails
import connectToMongoDB from '@/lib/db';
import User from '@/models/user';

export async function POST(req: NextRequest, res: NextApiResponse) {
 
    
    const { client } = await connectToMongoDB();
    
    try {
        const formData = await req.formData();

        // Extract fields directly from formData
        const email = formData.get('email') as string;

        console.log("email:", email);
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: 'User with this email does not exist.' });
      }

      // Generate a unique reset token
      const resetToken = uuidv4();
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1); // Token expires in 1 hour

        // Save the reset token in the database
        user.resetToken = resetToken;
        user.resetTokenExpires = expiration;
        await user.save()

      // Send reset email
      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        text: `To reset your password, click the following link: <a href= "${resetLink}">Link</a>`,
      });

      return NextResponse.json({ message: 'Reset link sent to your email address.' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Something went wrong.' });
    }
}
