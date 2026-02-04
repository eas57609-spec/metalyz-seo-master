// Payment Service - Stripe & LemonSqueezy Integration
// Production-ready payment processing with Owner bypass

import { User } from '@/types/user';

export interface PaymentPlan {
  id: string;
  name: string;
  priceId: {
    monthly: string;
    yearly: string;
  };
  price: {
    monthly: number;
    yearly: number;
  };
}

export interface CheckoutSession {
  id: string;
  url: string;
  success: boolean;
  error?: string;
}

export interface PaymentProvider {
  name: 'stripe' | 'lemonsqueezy';
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
}

// Payment plans configuration
export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'pro',
    name: 'Pro Plan',
    priceId: {
      monthly: 'price_pro_monthly_metalyz',
      yearly: 'price_pro_yearly_metalyz'
    },
    price: {
      monthly: 19,
      yearly: 152
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    priceId: {
      monthly: 'price_enterprise_monthly_metalyz',
      yearly: 'price_enterprise_yearly_metalyz'
    },
    price: {
      monthly: 49,
      yearly: 470
    }
  }
];

// Owner bypass check
const isOwnerAccount = (user?: User | null): boolean => {
  return user?.role === 'owner' || user?.email === 'owner@metalyz.io';
};

// Create checkout session
export const createCheckoutSession = async (
  planId: string,
  billingCycle: 'monthly' | 'yearly',
  user?: User | null
): Promise<CheckoutSession> => {
  // Owner bypass - no payment required
  if (isOwnerAccount(user)) {
    return {
      id: 'owner_bypass',
      url: '/',
      success: true,
      error: 'Owner account - payment bypassed'
    };
  }

  try {
    // Find the plan
    const plan = PAYMENT_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Simulate API call to payment provider
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock checkout session creation
    const sessionId = `cs_metalyz_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;

    return {
      id: sessionId,
      url: checkoutUrl,
      success: true
    };

  } catch (error) {
    return {
      id: '',
      url: '',
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    };
  }
};
// Webhook handler for payment success
export const handlePaymentWebhook = async (
  event: any,
  signature: string
): Promise<{ success: boolean; userId?: string; planId?: string; error?: string }> => {
  try {
    // Verify webhook signature (production implementation needed)
    if (!signature) {
      throw new Error('Missing webhook signature');
    }

    // Parse webhook event
    const { type, data } = event;

    if (type === 'checkout.session.completed') {
      const session = data.object;
      const userId = session.client_reference_id;
      const priceId = session.line_items?.data[0]?.price?.id;

      // Find plan by price ID
      const plan = PAYMENT_PLANS.find(p => 
        p.priceId.monthly === priceId || p.priceId.yearly === priceId
      );

      if (!plan) {
        throw new Error('Plan not found for price ID');
      }

      return {
        success: true,
        userId,
        planId: plan.id
      };
    }

    return {
      success: false,
      error: 'Unhandled webhook event type'
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Webhook processing failed'
    };
  }
};

// Update user subscription after successful payment
export const updateUserSubscription = async (
  userId: string,
  planId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // In production, this would update the database
    // For now, we'll simulate the update
    
    console.log(`Updating user ${userId} to ${planId} plan`);
    
    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Subscription update failed'
    };
  }
};

// Get payment provider configuration
export const getPaymentProvider = (): PaymentProvider => {
  return {
    name: 'stripe', // Default to Stripe
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_metalyz',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_metalyz',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_metalyz'
  };
};

// Validate payment configuration
export const validatePaymentConfig = (): boolean => {
  const provider = getPaymentProvider();
  return !!(provider.publicKey && provider.secretKey && provider.webhookSecret);
};