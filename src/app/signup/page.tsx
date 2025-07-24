import React from 'react';
import { SignupForm } from '@/components/Auth/SignupForm';
import { BackgroundWrapper } from '@/components/common/BackgroundWrapper';
import AppHeader from '@/components/common/AppHeader';

export default function SignupPage() {
  return (
    <BackgroundWrapper>
      <AppHeader />
      <main className="flex min-h-screen items-center justify-center px-4 py-24">
        <SignupForm />
      </main>
    </BackgroundWrapper>
  );
} 