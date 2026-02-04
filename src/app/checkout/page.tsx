'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import PaymentGateway from '@/components/PaymentGateway';
import { PAYMENT_PLANS } from '@/lib/payment-service';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const planId = searchParams.get('plan') || 'pro';
  const billingCycle = (searchParams.get('billing') as 'monthly' | 'yearly') || 'monthly';
  
  const plan = PAYMENT_PLANS.find(p => p.id === planId);

  useEffect(() => {
    // Check if payment was successful (from URL params)
    if (searchParams.get('success') === 'true') {
      setPaymentSuccess(true);
    }
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Redirect to dashboard after 3 seconds
    setTimeout(() => {
      router.push('/?welcome=true');
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Handle payment error (show notification, etc.)
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Welcome to Metalyz {plan?.name}! Your subscription is now active and you have access to all premium features.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                🚀 You'll be redirected to your dashboard in a few seconds...
              </p>
            </div>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Plan Not Found
          </h1>
          <button
            onClick={() => router.push('/pricing')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Your Subscription
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Subscribe to {plan.name} - {billingCycle} billing
            </p>
          </div>
        </div>

        {/* Payment Gateway */}
        <PaymentGateway
          planId={planId}
          billingCycle={billingCycle}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />

        {/* Plan Features Reminder */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What you'll get with {plan.name}:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {planId === 'pro' ? [
              'Unlimited AI Meta Tag generations',
              '95/100 SEO score optimization',
              'Advanced SEO analysis & insights',
              'Priority customer support',
              'Bulk export capabilities',
              'Custom tone & style options'
            ] : [
              'Everything in Pro',
              'Bulk generation (1000+ at once)',
              'Private API access',
              'Team management & collaboration',
              'Custom integrations',
              'Dedicated account manager'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}