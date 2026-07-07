import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Order, User } from '@/lib/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const role = searchParams.get('role');

    await connectToDatabase();

    let orders;
    if (role === 'Admin') {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else if (username) {
      orders = await Order.find({ user: { $regex: new RegExp(`^${username}$`, 'i') } }).sort({ createdAt: -1 });
    } else {
      orders = [];
    }

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch orders API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve orders', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, order, orderId, status, declineReason } = body;

    await connectToDatabase();

    if (action === 'create') {
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order details required' }, { status: 400 });
      }

      // Check payment and handle credits if applicable
      let userDoc = null;
      if (order.paymentMethod === 'Cyber-Credits' && order.user !== 'Guest') {
        userDoc = await User.findOne({ username: { $regex: new RegExp(`^${order.user}$`, 'i') } });
        if (userDoc) {
          if (userDoc.credits < order.total) {
            return NextResponse.json({ success: false, error: 'INSUFFICIENT CYBER-CREDITS BALANCE' }, { status: 400 });
          }
          userDoc.credits -= order.total;
          await userDoc.save();
        }
      }

      const newOrder = new Order({
        id: order.id,
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod,
        date: order.date,
        user: order.user,
        email: order.email,
        status: order.status || 'Pending Approval',
        deliveryDetails: order.deliveryDetails,
      });

      await newOrder.save();

      return NextResponse.json({
        success: true,
        order: newOrder,
        newBalance: userDoc ? userDoc.credits : undefined
      }, { status: 201 });
    }

    if (action === 'updateStatus') {
      if (!orderId || !status) {
        return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
      }

      const updated = await Order.findOneAndUpdate(
        { id: orderId },
        { $set: { status, declineReason } },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, order: updated }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });

  } catch (error: any) {
    console.error('Order POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Operation failed', details: error.message },
      { status: 500 }
    );
  }
}
