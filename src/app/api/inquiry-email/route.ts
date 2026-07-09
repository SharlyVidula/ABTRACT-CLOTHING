import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email, username, inquiryId, status, reason } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS is not set in environment variables.');
      return NextResponse.json(
        { success: false, error: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    let subject = '';
    let htmlContent = '';

    if (status === 'accepted') {
      subject = `Good News! Your Custom Design Inquiry (${inquiryId}) is Accepted`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #0f0c29; color: #ffffff; border-radius: 16px;">
          <h2 style="color: #4ade80;">Inquiry Accepted</h2>
          <p>Dear ${username},</p>
          <p>We are thrilled to inform you that your custom design inquiry (<strong>${inquiryId}</strong>) has been <strong>accepted</strong> by our bespoke studio team.</p>
          <p>Our designers will be in touch shortly with the next steps regarding measurements, final quotes, and timeline.</p>
          <p>Thank you for choosing ABSTRACT.</p>
        </div>
      `;
    } else if (status === 'declined') {
      subject = `Update regarding your Custom Design Inquiry (${inquiryId})`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #0f0c29; color: #ffffff; border-radius: 16px;">
          <h2 style="color: #f87171;">Inquiry Update</h2>
          <p>Dear ${username},</p>
          <p>Thank you for your interest in ABSTRACT's bespoke studio. Unfortunately, we are unable to proceed with your custom design inquiry (<strong>${inquiryId}</strong>) at this time.</p>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border-left: 4px solid #f87171; margin-top: 20px; margin-bottom: 20px;">
            <p style="margin: 0; color: #fca5a5;"><strong>Reason:</strong><br/><br/>${reason}</p>
          </div>
          <p>We apologize for any inconvenience and hope to work with you in the future.</p>
        </div>
      `;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ABSTRACT Studio" <${process.env.EMAIL_USER}>`,
      to: [email],
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Inquiry Email] Sent to: ${email} for status ${status}`);

    return NextResponse.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Inquiry email error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send inquiry email' }, { status: 500 });
  }
}
