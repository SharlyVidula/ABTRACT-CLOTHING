import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId, currency = 'LKR' } = await req.json();

    if (!amount || amount <= 0 || !orderId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID || '1221567';
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '8M4A123456789012345678901234567890';

    // Format amount to exactly 2 decimal places (e.g. 1000.00)
    const formattedAmount = Number(amount).toFixed(2);

    // md5(merchant_secret) uppercase
    const secretHash = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();

    // merchant_id + order_id + formatted_amount + currency + secretHash
    const rawString = merchantId + orderId + formattedAmount + currency + secretHash;

    // md5 of the rawString, uppercase
    const hash = crypto.createHash('md5').update(rawString).digest('hex').toUpperCase();

    return NextResponse.json({
      merchantId,
      hash,
      formattedAmount,
      sandbox: process.env.PAYHERE_SANDBOX === 'true',
    });
  } catch (error: any) {
    console.error('PayHere hash error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate PayHere payment hash' }, { status: 500 });
  }
}
