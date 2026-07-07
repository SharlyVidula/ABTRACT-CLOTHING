import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { CustomInquiry } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const inquiries = await CustomInquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, inquiries }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch inquiries API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve inquiries', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, inquiry, inquiryId, status, declineReason } = body;

    await connectToDatabase();

    if (action === 'add') {
      if (!inquiry) {
        return NextResponse.json({ success: false, error: 'Inquiry details required' }, { status: 400 });
      }

      const newInquiry = new CustomInquiry({
        id: inquiry.id || 'CDR_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        name: inquiry.name,
        contact: inquiry.contact,
        garmentType: inquiry.garmentType,
        description: inquiry.description,
        budget: inquiry.budget,
        colorPreference: inquiry.colorPreference,
        referenceImage: inquiry.referenceImage,
        referenceImageName: inquiry.referenceImageName,
        submittedAt: inquiry.submittedAt || new Date().toLocaleString(),
        status: 'pending',
      });

      await newInquiry.save();

      return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
    }

    if (action === 'updateStatus') {
      if (!inquiryId || !status) {
        return NextResponse.json({ success: false, error: 'Inquiry ID and status are required' }, { status: 400 });
      }

      const updated = await CustomInquiry.findOneAndUpdate(
        { id: inquiryId },
        { $set: { status, declineReason } },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, inquiry: updated }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });

  } catch (error: any) {
    console.error('Inquiry POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Operation failed', details: error.message },
      { status: 500 }
    );
  }
}
