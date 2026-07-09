import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { AnalyticsEvent, User } from '@/lib/models';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { eventType, details, user, sessionToken, visitorToken } = body;

    // Check if the user is an Admin, if so, ignore to show organic traffic metrics only
    let isAdmin = false;
    if (user && user !== 'Guest') {
      const dbUser = await User.findOne({ username: { $regex: new RegExp(`^${user}$`, 'i') } });
      if (dbUser?.role === 'Admin') {
        isAdmin = true;
      }
    }

    const pathLower = details?.path?.toLowerCase() || '';
    const isAdminPath = eventType === 'page_view' && 
      (pathLower === '/admin' || pathLower === '/admin/' || pathLower.startsWith('/admin/') || pathLower.startsWith('/admin?'));

    if (eventType === 'clear_admin_telemetry' || isAdmin || isAdminPath) {
      // 15 seconds tolerance: delete all records for this visitor/session/user in the last 15 seconds
      const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);
      
      const filterConditions: any[] = [];
      if (sessionToken) filterConditions.push({ sessionToken });
      if (visitorToken) filterConditions.push({ visitorToken });
      if (user && user !== 'Guest') filterConditions.push({ user });

      if (filterConditions.length > 0) {
        await AnalyticsEvent.deleteMany({
          $or: filterConditions,
          createdAt: { $gte: fifteenSecondsAgo }
        });
      }
      
      return NextResponse.json({ success: true, ignored: true, message: 'Admin telemetry cleared within tolerance window.' });
    }

    if (!eventType) {
      return NextResponse.json({ success: false, error: 'eventType is required' }, { status: 400 });
    }

    const event = new AnalyticsEvent({
      eventType,
      details,
      user: user || 'Guest',
      sessionToken,
      visitorToken,
    });

    await event.save();
    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log event', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (role !== 'Admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized — admin status required' }, { status: 403 });
    }

    await connectToDatabase();

    // 1. Total Metrics
    const totalPageViews = await AnalyticsEvent.countDocuments({ eventType: 'page_view' });
    const uniqueVisitors = await AnalyticsEvent.distinct('visitorToken').then(arr => arr.length);
    const uniqueSessions = await AnalyticsEvent.distinct('sessionToken').then(arr => arr.length);
    const totalSignIns = await AnalyticsEvent.countDocuments({ eventType: 'sign_in' });
    const uniqueSignedUsers = await AnalyticsEvent.distinct('user', { user: { $ne: 'Guest' } }).then(arr => arr.length);

    // 2. Interaction Breakdown Counts
    const interactions = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: {
            $in: [
              'try_on',
              'add_to_cart',
              'checkout',
              'custom_inquiry',
              'submit_review',
              'assistant_query',
              'view_details',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    const interactionCounts = {
      try_on: 0,
      add_to_cart: 0,
      checkout: 0,
      custom_inquiry: 0,
      submit_review: 0,
      assistant_query: 0,
      view_details: 0,
    };

    interactions.forEach((item) => {
      const type = item._id as keyof typeof interactionCounts;
      if (interactionCounts[type] !== undefined) {
        interactionCounts[type] = item.count;
      }
    });

    // 3. Page Views by Path
    const pageViewsByPath = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: '$details.path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // 4. Popular Garments (aggregated by clicks & try-ons)
    const popularGarmentsRaw = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: { $in: ['try_on', 'view_details', 'add_to_cart'] },
          'details.garmentId': { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            id: '$details.garmentId',
            name: '$details.garmentName',
          },
          tryOns: {
            $sum: { $cond: [{ $eq: ['$eventType', 'try_on'] }, 1, 0] },
          },
          detailViews: {
            $sum: { $cond: [{ $eq: ['$eventType', 'view_details'] }, 1, 0] },
          },
          addCarts: {
            $sum: { $cond: [{ $eq: ['$eventType', 'add_to_cart'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          id: '$_id.id',
          name: '$_id.name',
          tryOns: 1,
          detailViews: 1,
          addCarts: 1,
          totalScore: { $add: ['$tryOns', '$detailViews', '$addCarts'] },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
    ]);

    // 5. Daily Traffic Trend (past 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trafficTrend = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'page_view',
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          pageViews: { $sum: 1 },
          visitors: { $addToSet: '$visitorToken' },
        },
      },
      {
        $project: {
          date: '$_id',
          pageViews: 1,
          visitors: { $size: '$visitors' },
        },
      },
      { $sort: { date: 1 } },
    ]);

    // 6. Recent Audit Log (last 50 events)
    const recentEvents = await AnalyticsEvent.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalPageViews,
          uniqueVisitors,
          uniqueSessions,
          totalSignIns,
          uniqueSignedUsers,
        },
        interactionCounts,
        pageViewsByPath: pageViewsByPath.map((item) => ({
          path: item._id || '/',
          count: item.count,
        })),
        popularGarments: popularGarmentsRaw.map((item) => ({
          id: item.id,
          name: item.name,
          tryOns: item.tryOns,
          detailViews: item.detailViews,
          addCarts: item.addCarts,
        })),
        trafficTrend,
        recentEvents,
      },
    });
  } catch (error: any) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve analytics data', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (role !== 'Admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized — admin status required' }, { status: 403 });
    }

    await connectToDatabase();
    const result = await AnalyticsEvent.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: 'Analytics database reset successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error: any) {
    console.error('Analytics DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset analytics database', details: error.message },
      { status: 500 }
    );
  }
}

