'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard, Shield, Lock, Crown, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { createCheckoutSession, PAYMENT_PLANS } from '@/lib/payment-service';
import { SubscriptionType } from '@/types/user';

interface PaymentGatewayProps {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PaymentGateway({ 
  planId, 
  billingCycle, 
  onSuccess, 
  onError 
}: PaymentGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, updateProfile } = useAuthStore();
  const router = useRouter();

  const plan = PAYMENT_PLANS.find(p => p.id === planId);
  const isOwner = user?.role === 'owner' || user?.email === 'owner@metalyz.io';

  const handlePayment = async () => {
    if (!plan) {
      onError?.('Plan not found');
      return;
    }

    setIsProcessing(true);

    try {
      // Owner bypass
      if (isOwner) {
        // Owner already has lifetime access
        onSuccess?.();
        router.push('/');
        return;
      }

      // Create checkout session
      const session = await createCheckoutSession(planId, billingCycle, user);

      if (session.success) {
        // In production, redirect to actual payment URL
        // For demo, simulate successful payment
        setTimeout(() => {
          // Update user subscription
          updateProfile({ 
            subscription: planId as SubscriptionType
          });
          
          onSuccess?.();
          setIsProcessing(false);
          router.push('/?payment=success');
        }, 2000);
      } else {
        throw new Error(session.error || 'Payment failed');
      }

    } catch (error) {
      setIsProcessing(false);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError?.(errorMessage);
    }
  };

  if (!plan) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 dark:text-red-400">Plan not found</p>
      </div>
    );
  }

  const price = billingCycle === 'yearly' 
    ? Math.round(plan.price.yearly / 12) 
    : plan.price.monthly;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isOwner ? '👑 Owner Access' : 'Secure Checkout'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isOwner 
            ? 'You have lifetime access to all features' 
            : 'Complete your subscription to unlock premium features'
          }
        </p>
      </div>

      {/* Plan Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {plan.name}
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${price}/mo
          </span>
        </div>
        
        {billingCycle === 'yearly' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Billed annually
            </span>
            <span className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded text-xs font-medium">
              Save {Math.round(((plan.price.monthly * 12 - plan.price.yearly) / (plan.price.monthly * 12)) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Owner Special Treatment */}
      {isOwner && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
                Owner Privileges Active
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                You have lifetime access to all premium features. No payment required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Features */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-4 h-4 text-green-500" />
          <span>256-bit SSL encryption</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
          <Lock className="w-4 h-4 text-green-500" />
          <span>PCI DSS compliant</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          isOwner
            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
        } ${
          isProcessing 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-lg'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{isOwner ? 'Activating Owner Access...' : 'Processing Payment...'}</span>
          </>
        ) : (
          <>
            {isOwner ? <Crown className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
            <span>
              {isOwner 
                ? 'Continue as Owner' 
                : `Subscribe for $${price}/month`
              }
            </span>
          </>
        )}
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        By subscribing, you agree to our{' '}
        <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}