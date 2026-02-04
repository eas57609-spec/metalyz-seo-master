'use client';

import { useState } from 'react';
import { Check, Crown, Zap, Users, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuthStore();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      subtitle: 'Starter',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started with SEO optimization',
      features: [
        '3 AI Meta Tag generations per day',
        'Basic SEO analysis',
        'Google search preview',
        'Community support',
        'Export to HTML',
        'Mobile & desktop preview'
      ],
      limitations: [
        'Limited daily generations',
        'Basic analytics only',
        'Community support only'
      ],
      cta: 'Get Started Free',
      popular: false,
      icon: Sparkles,
      color: 'from-gray-500 to-gray-600',
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    {
      id: 'pro',
      name: 'Pro',
      subtitle: 'Growth',
      price: { monthly: 29, yearly: 19 }, // Updated pricing
      description: 'Ideal for growing businesses and SEO professionals',
      features: [
        'Unlimited AI Meta Tag generations',
        '95/100 SEO score optimization',
        'Advanced SEO analysis & insights',
        'Priority customer support',
        'Bulk export capabilities',
        'Custom tone & style options',
        'Performance tracking',
        'A/B testing suggestions',
        'Keyword research integration'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true,
      icon: Crown,
      color: 'from-blue-500 to-purple-600',
      borderColor: 'border-blue-500 dark:border-blue-400',
      badge: 'Best Value'
    },
    {
      id: 'pro-plus',
      name: 'Pro+',
      subtitle: 'Advanced',
      price: { monthly: 99, yearly: 49 }, // Updated pricing
      description: 'Advanced features for serious SEO professionals',
      features: [
        'Everything in Pro',
        'Advanced competitor analysis',
        'Custom AI model training',
        'White-label branding options',
        'Advanced analytics dashboard',
        'Priority phone support',
        'Custom integrations',
        'Team collaboration tools',
        'Advanced reporting'
      ],
      limitations: [],
      cta: 'Upgrade to Pro+',
      popular: false,
      icon: Zap,
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500 dark:border-purple-400'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      subtitle: 'Scale',
      price: { monthly: 199, yearly: 149 }, // Updated pricing
      description: 'Built for teams and large-scale SEO operations',
      features: [
        'Everything in Pro+',
        'Bulk generation (10,000+ at once)',
        'Private API access',
        'Team management & collaboration',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee (99.9% uptime)',
        'Custom AI model training',
        'Advanced analytics dashboard',
        'Priority enterprise support'
      ],
      limitations: [],
      cta: 'Buy Enterprise',
      popular: false,
      icon: Users,
      color: 'from-orange-500 to-red-600',
      borderColor: 'border-orange-500 dark:border-orange-400'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    // Master Owner bypass
    if (user?.email === 'owner@metalyz.io') {
      alert('👑 Master Owner detected - All features unlocked permanently!');
      return;
    }

    if (planId === 'free') {
      // Already free, redirect to dashboard
      window.location.href = '/';
    } else {
      // Generate Lemon Squeezy MoR checkout URL
      try {
        const { generateCheckoutUrl } = require('@/lib/lemon-squeezy');
        const checkoutUrl = generateCheckoutUrl(planId, billingCycle, user?.id, user?.email);
        
        // Redirect to Lemon Squeezy Checkout (MoR)
        window.location.href = checkoutUrl;
      } catch (error) {
        console.error('Lemon Squeezy checkout error:', error);
        
        // Fallback to internal checkout
        const checkoutUrl = `/checkout?plan=${planId}&billing=${billingCycle}`;
        window.location.href = checkoutUrl;
      }
    }
  };

  const getSavingsAmount = (planId: string): number => {
    const { calculateSavings } = require('@/lib/lemon-squeezy');
    return calculateSavings(planId);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
          <Star className="w-4 h-4" />
          <span>Trusted by 10,000+ SEO professionals</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white perfect-plan-title">
          Choose the perfect plan for your{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SEO growth
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start free and scale as you grow. All plans include our core AI-powered meta tag generation.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Yearly
          </span>
          
          {/* Savings Badge - Positioned right next to toggle */}
          {billingCycle === 'yearly' && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse ml-4">
              💰 Save up to 33%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto px-4 sm:px-6">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const currentPrice = plan.price[billingCycle];
          const savingsAmount = getSavingsAmount(plan.id);
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 ${plan.borderColor} p-4 sm:p-6 lg:p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50 sm:scale-105' : ''
              } transition-all duration-200 hover:shadow-xl w-full`}
            >
              {/* Popular/Best Value Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1 shadow-lg">
                    <Crown className="w-4 h-4" />
                    <span>{billingCycle === 'yearly' ? 'Best Value' : 'Most Popular'}</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 lg:mb-8">
                <div className={`inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${plan.color} rounded-xl mb-3 lg:mb-4`}>
                  <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 lg:mb-4">
                  {plan.subtitle}
                </p>
                
                <div className="mb-3 lg:mb-4">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                      ${currentPrice}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
                      /mo
                    </span>
                  </div>
                  
                  {billingCycle === 'yearly' && plan.price.monthly > 0 && savingsAmount > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 mt-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${plan.price.monthly}/mo
                      </span>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg animate-pulse">
                        💰 Save ${savingsAmount}/year!
                      </div>
                    </div>
                  )}
                  
                  {billingCycle === 'yearly' && currentPrice > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Billed annually (${currentPrice * 12}/year)
                    </p>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">What's included:</h4>
                <ul className="space-y-2 lg:space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 lg:space-x-3">
                      <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-2.5 lg:py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : plan.id === 'free'
                    ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>

              {/* Current Plan Indicator */}
              {user?.subscription === plan.id && (
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    <Check className="w-4 h-4" />
                    <span>Current Plan</span>
                  </span>
                </div>
              )}
              
              {/* Owner/Lifetime Badge */}
              {user?.role === 'owner' && (
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text px-3 py-1 rounded-full text-sm font-bold border border-yellow-200 dark:border-yellow-800">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-600 dark:text-yellow-400">Owner - Lifetime Access</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 faq-title">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 faq-question">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 faq-question">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 faq-question">
                Is there a free trial for Pro?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes! All Pro plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 faq-question">
                How does the API access work?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enterprise plans include full REST API access with comprehensive documentation and SDKs.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 faq-question">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 faq-question">
                Need a custom solution?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Contact our sales team for custom pricing and features tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Ready to supercharge your SEO?
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of businesses already using Metalyz to boost their search rankings and drive more organic traffic.
        </p>
        <button
          onClick={() => handlePlanSelect('pro')}
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
        >
          <span>Start Your Free Trial</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}