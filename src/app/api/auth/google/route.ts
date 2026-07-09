import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ success: false, error: 'ID Token is required' }, { status: 400 });
    }

    // 1. Verify ID Token with Google's API
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!googleRes.ok) {
      return NextResponse.json({ success: false, error: 'Invalid Google credential token' }, { status: 401 });
    }

    const payload = await googleRes.json();
    const { email, name, picture, sub } = payload;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Google account email not verified or missing' }, { status: 400 });
    }

    await connectToDatabase();

    // 2. Check if user already exists by email
    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // 3. Register new user since email doesn't exist
      
      // Generate clean, unique username
      let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      if (baseUsername.length < 3) baseUsername = 'user' + baseUsername;
      
      let username = baseUsername;
      let usernameExists = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
      
      // If username exists, append random suffix
      while (usernameExists) {
        username = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
        usernameExists = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
      }

      // Generate random hashed password
      const salt = await bcrypt.genSalt(10);
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        username,
        password: hashedPassword,
        gender: 'Female', // Default, customizable in account profile settings
        email: email.toLowerCase().trim(),
        role: 'Customer',
        profilePicture: picture || '',
        credits: 15000,
      });

      await user.save();
    }

    // 4. Return successful auth response
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
        credits: user.credits || 0,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Google Auth API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
