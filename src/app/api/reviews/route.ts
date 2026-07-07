import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Review } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch reviews API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reviews', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, review, reviewId } = body;

    await connectToDatabase();

    if (action === 'add') {
      if (!review) {
        return NextResponse.json({ success: false, error: 'Review details required' }, { status: 400 });
      }

      const id = 'REV_' + Math.random().toString(36).substring(3, 9).toUpperCase();
      const date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newReview = new Review({
        id,
        orderId: review.orderId,
        username: review.username,
        rating: review.rating,
        comment: review.comment,
        date,
        published: false,
      });

      await newReview.save();

      return NextResponse.json({ success: true, review: newReview }, { status: 201 });
    }

    if (action === 'togglePublish') {
      if (!reviewId) {
        return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
      }

      const reviewDoc = await Review.findOne({ id: reviewId });
      if (!reviewDoc) {
        return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
      }

      reviewDoc.published = !reviewDoc.published;
      await reviewDoc.save();

      return NextResponse.json({ success: true, review: reviewDoc }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });

  } catch (error: any) {
    console.error('Review POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Operation failed', details: error.message },
      { status: 500 }
    );
  }
}
