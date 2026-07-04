import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acronyms' as any,
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured' }, { status: 500 });
    }

    let paymentIntent;
    try {
      // Try processing in LKR cents
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'lkr',
        automatic_payment_methods: { enabled: true },
      });
    } catch (lkrError: any) {
      console.warn('LKR payment intent failed, falling back to USD:', lkrError.message);
      // Fallback to USD (approx. 1 USD = 300 LKR, min $1 / 100 cents)
      const amountInUsdCents = Math.max(100, Math.round((amount / 300) * 100));
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInUsdCents,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      currency: paymentIntent.currency,
      amount: paymentIntent.amount,
    });
  } catch (error: any) {
    console.error('Stripe payment intent error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create payment intent' }, { status: 500 });
  }
}
