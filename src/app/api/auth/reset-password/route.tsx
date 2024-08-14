// pages/api/auth/reset-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import connectToMongoDB from "@/lib/db";
import { ObjectId } from "mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  try {
    const { token, password } = await req.json();
    // const { token } = data;
    console.log("token:", token);

    if (!token) {
      return NextResponse.json({ message: "Token is required." });
    }

    // const resetToken = token

    const { client } = await connectToMongoDB();

    // const formData = await req.formData();

    // Extract fields directly from formData
    // const newPassword = formData.get('password') as string;
    // Find the user by the reset token and check if the token is still valid
    const user = await User.findOne({ resetToken: token });
    console.log(user);

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and clear the reset token and expiration
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();
    return NextResponse.json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong." });
  }
}
