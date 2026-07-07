import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Incorrect username or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Incorrect username or password' }, { status: 401 });
    }

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
        credits: user.credits || 0
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
