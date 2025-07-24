'use client';

import React from 'react';
import Link from 'next/link';
import { BackgroundWrapper } from '@/components/common/BackgroundWrapper';
import AppHeader from '@/components/common/AppHeader';

// Define pricing tiers
const pricingTiers = [
  {
    name: 'Free',
    description: 'Get started and explore Foresight\'s core capabilities.',
    price: '$0',
    period: '/month',
    features: [
      'Up to 100 predictions per month',
      'Full feature access (real-time quotes, charts, alerts)',
      'Community-only support'
    ],
    buttonText: 'Get Started Free',
    buttonLink: '/signup',
    isMostPopular: false,
    color: 'indigo'
  },
  {
    name: 'Developer',
    description: 'Perfect for individual developers and small projects.',
    price: '$9.99',
    period: '/month',
    features: [
      'Up to 750 predictions included',
      'Overage: $0.025 per additional prediction',
      'Full feature access',
      'Email support'
    ],
    buttonText: 'Choose Developer',
    buttonLink: '/signup?plan=developer',
    isMostPopular: false,
    color: 'indigo'
  },
  {
    name: 'Growth',
    description: 'Ideal for growing applications and teams needing more volume.',
    price: '$49.99',
    period: '/month',
    features: [
      'Up to 4,000 predictions included',
      'Overage: $0.02 per additional prediction',
      'Full feature access',
      'Higher API rate limits',
      'Priority email support'
    ],
    buttonText: 'Choose Growth',
    buttonLink: '/signup?plan=growth',
    isMostPopular: true,
    color: 'indigo'
  },
  {
    name: 'Scale',
    description: 'For high-volume applications and businesses requiring robust support.',
    price: '$99.99',
    period: '/month',
    features: [
      'Up to 10,000 predictions included',
      'Overage: $0.015 per additional prediction',
      'Full feature access',
      'Highest API rate limits',
      'Dedicated support channel (e.g., Slack)'
    ],
    buttonText: 'Choose Scale',
    buttonLink: '/signup?plan=scale',
    isMostPopular: false,
    color: 'indigo'
  }
];

// All plans include features
const allPlansInclude = [
  'Access to all our prediction models',
  'Real-time market data integration',
  'Advanced charting tools',
  'Customizable alert system',
  'Secure API access',
  'Easy integration with your existing workflows'
];

// FAQ items
const faqItems = [
  {
    question: 'What counts as a "prediction"?',
    answer: 'Each time our system generates a forecast based on your input parameters, it counts as one prediction.'
  },
  {
    question: 'What happens if I go over my monthly prediction limit?',
    answer: 'If you exceed the predictions included in your plan, additional predictions will be charged at the overage rate specified for your tier. You\'ll only pay for what you use beyond your allowance.'
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Upgrades are effective immediately (prorated), and downgrades take effect at the start of your next billing cycle.'
  },
  {
    question: 'Do you offer annual plans or discounts?',
    answer: 'Yes! We offer a 15% discount on all paid plans if you choose to pay annually. Contact us for details.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express).'
  },
  {
    question: 'How does the "Full feature access" in the Free tier work?',
    answer: 'The Free tier gives you access to the same core features and prediction capabilities as our paid plans, limited only by the number of predictions per month and support level. This way, you can fully evaluate Foresight before committing.'
  }
];

export default function PricingPage() {
  return (
    <BackgroundWrapper>
      <AppHeader />
      <main className="pt-24 px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Pricing Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Foresight Pricing</h2>
            <p className="text-2xl text-gray-300 mb-4">Flexible Plans for Every Forecasting Need.</p>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Start for free, then scale as you grow. All paid plans come with a generous bundle of predictions and transparent overage pricing.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`
                  relative bg-[#2a2a40] rounded-2xl p-6 flex flex-col shadow-lg
                  ${tier.isMostPopular ? 'ring-2 ring-indigo-500 transform lg:-translate-y-4' : ''}
                `}
              >
                {tier.isMostPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-gray-300 h-12">{tier.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400">{tier.period}</span>
                </div>
                <ul className="mb-8 flex-grow">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start mb-3">
                      <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href={tier.buttonLink}
                  className={`
                    w-full text-center py-3 px-4 rounded-lg text-white font-medium transition-colors
                    ${tier.isMostPopular 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-indigo-600/80 hover:bg-indigo-700'}
                  `}
                >
                  {tier.buttonText}
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise Section */}
          <div className="bg-[#2a2a40] rounded-2xl p-8 mb-20">
            <div className="md:flex items-start justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
                <p className="text-xl text-gray-300 mb-4">Tailored Solutions for Large-Scale Deployments.</p>
                <p className="text-gray-400 mb-4">Need more than 10,000 predictions, custom features, or dedicated infrastructure? Let&apos;s talk.</p>
                <ul className="mb-6">
                  <li className="flex items-start mb-3">
                    <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Custom prediction volumes (50,000+)</span>
                  </li>
                  <li className="flex items-start mb-3">
                    <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Negotiated pricing & volume discounts</span>
                  </li>
                  <li className="flex items-start mb-3">
                    <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Service Level Agreements (SLAs)</span>
                  </li>
                  <li className="flex items-start mb-3">
                    <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Dedicated Account Manager</span>
                  </li>
                  <li className="flex items-start mb-3">
                    <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Custom integrations & premium support options</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/3 flex justify-center md:justify-end">
                <Link 
                  href="mailto:cewsalerts@gmail.com?subject=Enterprise%20Plan%20Inquiry"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-lg text-lg font-medium transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          {/* All Plans Include Section */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-white text-center mb-8">All Our Plans Include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPlansInclude.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-300">No hidden fees. Cancel or change your plan anytime.</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions (FAQ)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-[#2a2a40] rounded-xl p-6">
                  <h4 className="text-white text-lg font-semibold mb-3">{item.question}</h4>
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center mb-12">
            <h3 className="text-xl font-semibold text-white mb-4">Still have questions?</h3>
            <Link 
              href="mailto:cewsalerts@gmail.com?subject=Support%20Inquiry"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Contact our support team
            </Link>
          </div>
        </div>
      </main>
    </BackgroundWrapper>
  );
} 