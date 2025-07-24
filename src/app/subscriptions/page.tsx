'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundWrapper } from '@/components/common/BackgroundWrapper';
import AppHeader from '@/components/common/AppHeader';
import { useAuth } from '@/components/Auth/AuthContext';

export default function SubscriptionsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <BackgroundWrapper>
        <AppHeader />
        <main className="pt-24 px-8 pb-8 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center pt-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          </div>
        </main>
      </BackgroundWrapper>
    );
  }

  if (!isAuthenticated) {
    return null; // This will be redirected in the useEffect
  }

  // Subscription plans data
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      isCurrent: true,
      features: [
        'Real-time currency conversion',
        'Basic currency alerts',
        'Market news access',
        'Standard API access (100 requests/day)',
        '7-day historical data',
      ],
      limitations: [
        'No currency predictions',
        'Limited API endpoints',
      ],
      buttonText: 'Current Plan',
      buttonDisabled: true,
    },
    {
      name: 'Pro',
      price: '$29.99',
      period: 'per month',
      highlighted: true,
      features: [
        'Everything in Basic, plus:',
        'Currency predictions (7 days)',
        'Advanced analytics',
        'Custom alerts',
        'Premium API access (1,000 requests/day)',
        '30-day historical data',
        'Email support',
      ],
      buttonText: 'Upgrade Now',
      buttonDisabled: false,
    },
    {
      name: 'Enterprise',
      price: '$99.99',
      period: 'per month',
      features: [
        'Everything in Pro, plus:',
        'Currency predictions (30 days)',
        'Anomaly detection',
        'Volatility analysis',
        'Unlimited API access',
        'Up to 1 year historical data',
        'Custom integrations',
        'Priority support',
      ],
      buttonText: 'Contact Sales',
      buttonDisabled: false,
    },
  ];

  return (
    <BackgroundWrapper>
      <AppHeader />
      <main className="pt-24 px-8 pb-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
            <p className="text-gray-400">Manage your subscription plan and billing information</p>
          </div>

          {/* Current Plan Banner */}
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-6 mb-8 border border-indigo-500/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="text-gray-300 mb-1">Current Plan</div>
                <div className="text-white text-2xl font-bold">Basic (Free Trial)</div>
                <div className="text-indigo-300 mt-2">Your trial ends in 14 days</div>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white font-medium transition-colors">
                  Upgrade Your Plan
                </button>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`
                  rounded-2xl overflow-hidden
                  ${plan.highlighted 
                    ? 'bg-gradient-to-b from-indigo-600/20 to-purple-600/20 border border-indigo-500/30' 
                    : 'bg-[#2a2a40]'
                  }
                `}
              >
                <div className="p-6">
                  <div className="text-xl font-bold text-white mb-2">{plan.name}</div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    )}
                  </div>
                  
                  {plan.isCurrent && (
                    <div className="mt-2 inline-block bg-indigo-600/40 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
                      Current Plan
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                      
                      {plan.limitations && plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-400 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="px-6 pb-6 pt-2">
                  <button
                    disabled={plan.buttonDisabled}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      plan.buttonDisabled
                        ? 'bg-indigo-900/30 text-indigo-300/70 cursor-not-allowed'
                        : plan.highlighted
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </BackgroundWrapper>
  );
} 