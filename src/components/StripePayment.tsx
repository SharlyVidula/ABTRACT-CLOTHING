'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Sparkles } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ amount, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    onError('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'An error occurred during payment.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      } else {
        onError('Payment processing failed. Please try again.');
      }
    } catch (err: any) {
      onError(err.message || 'An error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative">
      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full py-4 rounded-xl font-mono text-sm tracking-wider font-semibold bg-white text-black hover:bg-white/90 active:scale-98 transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            PROCESSING SECURE PAYMENT...
          </>
        ) : (
          <>
            PAY & PLACE ORDER ({amount} LKR)
          </>
        )}
      </button>

      {/* Transaction status overlay during Stripe confirm */}
      {isProcessing && (
        <div className="absolute inset-0 bg-[#0a0a0c]/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-50 rounded-2xl p-6">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-t-[#ff8da1] border-white/5 animate-spin" />
            <Sparkles className="w-5 h-5 text-[#ff8da1] animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <span className="font-mono text-[10px] tracking-widest text-[#ff8da1] font-semibold uppercase animate-pulse">
              STRIPE SECURE GATEWAY ROUTING...
            </span>
            <p className="font-mono text-[8px] text-white/30 tracking-widest uppercase">
              CONFIRMING PAYMENT INTENT WITH ACQUIRED NODE
            </p>
          </div>
        </div>
      )}
    </form>
  );
}

export default function StripePayment({ amount, onSuccess, onError }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setIsLoading(true);
        onError('');
        const res = await fetch('/api/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          onError(data.error || 'Failed to initialize payment gateway.');
        }
      } catch (err: any) {
        onError('Stripe endpoint connection lost.');
      } finally {
        setIsLoading(false);
      }
    };

    if (amount > 0) {
      fetchPaymentIntent();
    }
  }, [amount]);

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#ff8da1',
      colorBackground: '#0a0a0c',
      colorText: '#ffffff',
      colorDanger: '#f87171',
      fontFamily: 'JetBrains Mono, Courier New, monospace',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
    rules: {
      '.Input': {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        outline: 'none',
      },
      '.Input:focus': {
        borderColor: '#ff8da1',
        boxShadow: '0 0 10px rgba(255, 141, 161, 0.25)',
      },
      '.Label': {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '10px',
        fontFamily: 'JetBrains Mono, Courier New, monospace',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        marginBottom: '6px',
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] gap-3">
        <div className="w-5 h-5 border-2 border-[#ff8da1] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-[9px] text-[#ff8da1] font-semibold tracking-wider uppercase animate-pulse">
          INITIALIZING STRIPE MODULE...
        </span>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-4 border border-dashed border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col gap-2 text-center">
        <span className="font-mono text-[10px] text-red-400 font-bold">GATEWAY CONNECTION ERROR</span>
        <p className="text-[11px] text-white/40">Verify STRIPE_SECRET_KEY is configured in your environment variables.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
