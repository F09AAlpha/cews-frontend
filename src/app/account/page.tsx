'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundWrapper } from '@/components/common/BackgroundWrapper';
import AppHeader from '@/components/common/AppHeader';
import { useAuth } from '@/components/Auth/AuthContext';

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
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
          <div className="max-w-4xl mx-auto">
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

  return (
    <BackgroundWrapper>
      <AppHeader />
      <main className="pt-24 px-8 pb-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#2a2a40] rounded-2xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Name</label>
                    <div className="bg-[#3a3a50] p-3 rounded-lg text-white">
                      {user?.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <div className="bg-[#3a3a50] p-3 rounded-lg text-white">
                      {user?.email}
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Subscription</h2>
                <div className="bg-[#3a3a50] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Current Plan</span>
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Free Trial
                    </span>
                  </div>
                  <div className="text-white font-medium text-xl mb-4">Basic Plan</div>
                  <p className="text-gray-400 text-sm mb-4">
                    Your free trial ends in 14 days. Upgrade to continue accessing premium features.
                  </p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white font-medium transition-colors">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-12 border-t border-[#4a4a70] pt-8">
              <h2 className="text-lg font-semibold text-white mb-4">API Access</h2>
              <div className="bg-[#3a3a50] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">API Key</span>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                    Generate New Key
                  </button>
                </div>
                <div className="bg-[#2a2a40] p-3 rounded-lg text-gray-400 font-mono text-sm mb-4">
                  sk_test_demo123456789abcdefghijklmnopqrstuvwxyz
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </BackgroundWrapper>
  );
} 