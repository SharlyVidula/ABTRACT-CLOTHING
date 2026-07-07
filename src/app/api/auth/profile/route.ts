import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/lib/models';

export async function POST(req: Request) {
  try {
    const { username, email, phone, address, city, gender, profilePicture, credits } = await req.json();

    if (!username) {
      return NextResponse.json({ success: false, error: 'Username is required to update profile' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Update user details
    if (email !== undefined) user.email = email.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (address !== undefined) user.address = address.trim();
    if (city !== undefined) user.city = city.trim();
    if (gender !== undefined) user.gender = gender;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (credits !== undefined) user.credits = credits;

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        role: user.role,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        profilePicture: user.profilePicture,
        credits: user.credits
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Profile Update API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
