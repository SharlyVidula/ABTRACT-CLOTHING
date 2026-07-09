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
    const { email, username, orderId, action, reason } = await req.json();

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

    let subject = '';
    let htmlContent = '';

    if (action === 'accept') {
      subject = `Order Approved - ${orderId}`;
      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: linear-gradient(145deg, #130c10, #2a151f, #23151c); color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 36px; font-weight: 800; letter-spacing: 4px; margin: 0; color: #ff8da1; text-shadow: 0 0 10px rgba(255, 141, 161, 0.3);">ABSTRACT</h1>
            <p style="color: #4ade80; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Order Approved</p>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
            <h2 style="color: #fff; margin-top: 0; font-size: 18px; font-weight: 600;">Your Order is Approved</h2>
            <p style="line-height: 1.6; color: #d1d5db;">Dear ${username},</p>
            <p style="line-height: 1.6; color: #d1d5db;">We are pleased to inform you that your order <strong>${orderId}</strong> has been accepted by our design team.</p>
            <p style="line-height: 1.6; color: #d1d5db;">Your items have entered the preparation stage. You will receive another update once the package is dispatched to our courier team.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px;">Thank you for choosing<br/><strong>ABSTRACT Premium Couture</strong></p>
          </div>
        </div>
      `;
    } else if (action === 'decline') {
      subject = `Order Cancellation Notice - ${orderId}`;
      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: linear-gradient(145deg, #130c10, #2a151f, #23151c); color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 36px; font-weight: 800; letter-spacing: 4px; margin: 0; color: #ff8da1; text-shadow: 0 0 10px rgba(255, 141, 161, 0.3);">ABSTRACT</h1>
            <p style="color: #ef4444; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Order Update</p>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
            <h2 style="color: #fff; margin-top: 0; font-size: 18px; font-weight: 600;">Order Decline Notice</h2>
            <p style="line-height: 1.6; color: #d1d5db;">Dear ${username},</p>
            <p style="line-height: 1.6; color: #d1d5db;">We regret to inform you that your order <strong>${orderId}</strong> could not be processed at this time.</p>
            <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 15px; border-radius: 6px; margin: 20px 0; color: #fca5a5;">
              <strong>Reason for Decline:</strong><br/>
              ${reason || 'No specific reason provided.'}
            </div>
            <p style="line-height: 1.6; color: #d1d5db;">If you have any questions or would like to place another order, please feel free to reach out to our team.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px;">Warm regards,<br/><strong>The ABSTRACT Team</strong></p>
          </div>
        </div>
      `;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action type' }, { status: 400 });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ABSTRACT Boutique" <${process.env.EMAIL_USER}>`,
      to: [email],
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Order Email] Sent to ${email} for action: ${action}`);

    return NextResponse.json({
      success: true,
      message: 'Order status email sent successfully.'
    });
  } catch (error) {
    console.error('Order email error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send order status email' }, { status: 500 });
  }
}
