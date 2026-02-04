import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, processWebhookEvent } from '@/lib/lemon-squeezy';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body and signature for Lemon Squeezy MoR
    const body = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // Parse the webhook event
    const payload = JSON.parse(body);
    const eventType = payload.meta?.event_name;
    
    console.log('Lemon Squeezy MoR Webhook received:', eventType);

    // Handle Master Owner bypass
    const customerEmail = payload.data?.attributes?.user_email;
    if (customerEmail === 'owner@metalyz.io') {
      console.log('Master Owner payment bypassed:', customerEmail);
      return NextResponse.json({ 
        success: true, 
        message: 'Master Owner - Payment bypassed' 
      });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process webhook with MoR handling
    await processWebhookEvent(payload);

    console.log(`MoR webhook processed successfully: ${eventType}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('MoR Webhook error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'MoR Webhook processing failed' 
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ 
    message: 'Metalyz Lemon Squeezy MoR Webhook Endpoint',
    status: 'active',
    features: [
      'Merchant of Record (MoR) support',
      'Global tax compliance',
      'Automatic invoicing',
      'Master Owner bypass',
      'Real-time subscription updates'
    ],
    timestamp: new Date().toISOString()
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-signature',
    },
  });
}