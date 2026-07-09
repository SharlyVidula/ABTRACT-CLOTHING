import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email, username, gender } = await req.json();

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

    const title = gender === 'Male' ? 'Mr.' : 'Ms.';

    // Send the checkout email via Nodemailer
    const mailOptions = {
      from: `"ABSTRACT Orders" <${process.env.EMAIL_USER}>`,
      to: [email],
      subject: `Order Confirmation - Thank you ${title} ${username}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: linear-gradient(145deg, #0f0c29, #302b63, #24243e); color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 36px; font-weight: 800; letter-spacing: 4px; margin: 0; background: -webkit-linear-gradient(#fff, #a8a8a8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ABSTRACT</h1>
            <p style="color: #4ade80; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Order Confirmed</p>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <h2 style="color: #fff; margin-top: 0;">Transmission Received.</h2>
            <p style="line-height: 1.6; color: #d1d5db;">Dear ${title} ${username},</p>
            <p style="line-height: 1.6; color: #d1d5db;">Thank you for securing your items with ABSTRACT. Your transaction has been verified, and your order is currently routing through our automated fulfillment matrix.</p>
            <p style="line-height: 1.6; color: #d1d5db;">We are thrilled to equip you with the absolute best in cyber-couture.</p>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
              <h3 style="color: #4ade80; font-size: 14px; font-weight: 600; margin-top: 0; margin-bottom: 10px; font-family: monospace; letter-spacing: 1px;">► ORDER TRACKING TELEMETRY</h3>
              <ol style="margin: 0; padding-left: 20px; color: #d1d5db; font-size: 13px; line-height: 1.6;">
                <li>Log in to your profile at the storefront.</li>
                <li>Access the <strong>My Account</strong> control console (profile icon on the top right).</li>
                <li>Go to the <strong>Orders</strong> tab to monitor your live order status and fulfillment updates.</li>
              </ol>
            </div>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #9ca3af; line-height: 1.6;">
              <strong>Need assistance? Our secure helpline is standing by:</strong><br/>
              • Support Hotline: <span style="color: #fff; font-family: monospace;">0782485460</span><br/>
              • Support Email: <a href="mailto:abstract.ltd.info@gmail.com" style="color: #4ade80; text-decoration: none;">abstract.ltd.info@gmail.com</a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px;">Stay stylish,<br/><strong>The ABSTRACT Team</strong></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`[Checkout Email] Sent to: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Checkout email sent successfully.'
    });
  } catch (error) {
    console.error('Checkout email error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send checkout email' }, { status: 500 });
  }
}
