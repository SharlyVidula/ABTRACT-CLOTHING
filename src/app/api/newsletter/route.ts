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
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS is not set in environment variables.');
      return NextResponse.json(
        { success: false, error: 'Email service is not configured (missing credentials).' },
        { status: 500 }
      );
    }

    // Send the welcome email via Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ABSTRACT" <${process.env.EMAIL_USER}>`,
      to: [email],
      subject: 'Welcome to ABSTRACT - You are subscribed!',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: linear-gradient(145deg, #0f0c29, #302b63, #24243e); color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 36px; font-weight: 800; letter-spacing: 4px; margin: 0; background: -webkit-linear-gradient(#fff, #a8a8a8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ABSTRACT</h1>
            <p style="color: #4ade80; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Cyber-Couture Unlocked</p>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <h2 style="color: #fff; margin-top: 0;">Access Granted.</h2>
            <p style="line-height: 1.6; color: #d1d5db;">Thank you for registering your profile and connecting to the ABSTRACT network. Your terminal is now fully active.</p>
            <p style="line-height: 1.6; color: #d1d5db;">You are now subscribed to receive exclusive drop coordinates, bespoke design updates, and priority access to our latest collections.</p>
            
            <div style="margin: 40px 0; text-align: center;">
              <a href="#" style="background: #ffffff; color: #000000; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; letter-spacing: 1px; display: inline-block;">ENTER THE STORE</a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px;">Stay stylish,<br/><strong>The ABSTRACT Team</strong></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`[Newsletter/Welcome] Email sent to: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully.'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process subscription' }, { status: 500 });
  }
}
