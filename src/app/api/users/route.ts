import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    // Exclude password for security
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch users API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve users', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, username } = body;

    await connectToDatabase();

    if (action === 'delete') {
      if (!username) {
        return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
      }

      if (username.toLowerCase() === 'admin') {
        return NextResponse.json({ success: false, error: 'Cannot remove the default system administrator' }, { status: 400 });
      }

      const deleted = await User.findOneAndDelete({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
      if (!deleted) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });

  } catch (error: any) {
    console.error('User POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Operation failed', details: error.message },
      { status: 500 }
    );
  }
}
