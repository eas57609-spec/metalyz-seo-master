/**
 * Lemon Squeezy Integration - Merchant of Record (MoR)
 * Handles all tax calculations, invoicing, and payment processing
 */

// Lemon Squeezy Product IDs (replace with actual IDs from your dashboard)
const LEMON_SQUEEZY_PRODUCTS = {
  pro: {
    monthly: 'prod_pro_monthly_123',
    yearly: 'prod_pro_yearly_456'
  },
  'pro-plus': {
    monthly: 'prod_proplus_monthly_789',
    yearly: 'prod_proplus_yearly_012'
  },
  enterprise: {
    monthly: 'prod_enterprise_monthly_345',
    yearly: 'prod_enterprise_yearly_678'
  }
};

const LEMON_SQUEEZY_STORE_ID = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID || 'your-store-id';
const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY || 'your-api-key';

/**
 * Generate Lemon Squeezy checkout URL
 * Lemon Squeezy acts as Merchant of Record, handling all tax and compliance
 */
export function generateCheckoutUrl(
  planId: string, 
  billingCycle: 'monthly' | 'yearly',
  userId?: string,
  userEmail?: string
): string {
  const productId = LEMON_SQUEEZY_PRODUCTS[planId as keyof typeof LEMON_SQUEEZY_PRODUCTS]?.[billingCycle];
  
  if (!productId) {
    throw new Error(`Product not found for plan: ${planId} (${billingCycle})`);
  }

  // Lemon Squeezy checkout URL with MoR benefits
  const checkoutUrl = new URL(`https://${LEMON_SQUEEZY_STORE_ID}.lemonsqueezy.com/checkout/buy/${productId}`);
  
  // Add customer data for seamless experience
  if (userEmail) {
    checkoutUrl.searchParams.set('checkout[email]', userEmail);
  }
  
  if (userId) {
    checkoutUrl.searchParams.set('checkout[custom][user_id]', userId);
  }

  // Add success/cancel URLs
  checkoutUrl.searchParams.set('checkout[success_url]', `https://seo-meta-master.vercel.app/account?success=true`);
  checkoutUrl.searchParams.set('checkout[cancel_url]', `https://seo-meta-master.vercel.app/pricing?cancelled=true`);

  return checkoutUrl.toString();
}

/**
 * Calculate savings for yearly billing
 */
export function calculateSavings(planId: string): number {
  const savings = {
    pro: (29 - 19) * 12, // $120/year savings
    'pro-plus': (99 - 49) * 12, // $600/year savings  
    enterprise: (199 - 149) * 12 // $600/year savings
  };
  
  return savings[planId as keyof typeof savings] || 0;
}

/**
 * Verify webhook signature from Lemon Squeezy
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require('crypto');
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error('LEMON_SQUEEZY_WEBHOOK_SECRET not configured');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Process Lemon Squeezy webhook events
 */
export async function processWebhookEvent(event: any) {
  const { meta, data } = event;
  
  switch (meta.event_name) {
    case 'subscription_created':
      await handleSubscriptionCreated(data);
      break;
    case 'subscription_updated':
      await handleSubscriptionUpdated(data);
      break;
    case 'subscription_cancelled':
      await handleSubscriptionCancelled(data);
      break;
    case 'subscription_resumed':
      await handleSubscriptionResumed(data);
      break;
    case 'subscription_expired':
      await handleSubscriptionExpired(data);
      break;
    case 'subscription_paused':
      await handleSubscriptionPaused(data);
      break;
    case 'subscription_unpaused':
      await handleSubscriptionUnpaused(data);
      break;
    case 'subscription_payment_failed':
      await handlePaymentFailed(data);
      break;
    case 'subscription_payment_success':
      await handlePaymentSuccess(data);
      break;
    case 'subscription_payment_recovered':
      await handlePaymentRecovered(data);
      break;
    default:
      console.log(`Unhandled webhook event: ${meta.event_name}`);
  }
}

async function handleSubscriptionCreated(data: any) {
  const { supabase } = await import('./supabase');
  const customData = data.attributes.custom_data;
  
  if (customData?.user_id) {
    await supabase
      .from('users')
      .update({
        subscription: mapProductToSubscription(data.attributes.product_id),
        subscription_status: 'active',
        lemon_squeezy_subscription_id: data.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', customData.user_id);
  }
}

async function handleSubscriptionUpdated(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription_status: data.attributes.status,
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

async function handleSubscriptionCancelled(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

async function handleSubscriptionResumed(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

async function handleSubscriptionExpired(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription: 'free',
      subscription_status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

async function handleSubscriptionPaused(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'paused',
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

async function handleSubscriptionUnpaused(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

async function handlePaymentFailed(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

async function handlePaymentSuccess(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

async function handlePaymentRecovered(data: any) {
  const { supabase } = await import('./supabase');
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('lemon_squeezy_subscription_id', data.id);
}

function mapProductToSubscription(productId: string): string {
  // Map Lemon Squeezy product IDs to subscription types
  const productMap: { [key: string]: string } = {
    'prod_pro_monthly_123': 'pro',
    'prod_pro_yearly_456': 'pro',
    'prod_proplus_monthly_789': 'pro-plus',
    'prod_proplus_yearly_012': 'pro-plus',
    'prod_enterprise_monthly_345': 'enterprise',
    'prod_enterprise_yearly_678': 'enterprise'
  };
  
  return productMap[productId] || 'free';
}

/**
 * Get subscription details from Lemon Squeezy API
 */
export async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Lemon Squeezy API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return null;
  }
}

/**
 * Cancel subscription via Lemon Squeezy API
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      },
      body: JSON.stringify({
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          attributes: {
            cancelled: true
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Lemon Squeezy API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}