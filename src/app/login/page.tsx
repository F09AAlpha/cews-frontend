import React from 'react';
import { LoginForm } from '@/components/Auth/LoginForm';
import { BackgroundWrapper } from '@/components/common/BackgroundWrapper';
import AppHeader from '@/components/common/AppHeader';

export default function LoginPage() {
  return (
    <BackgroundWrapper>
      <AppHeader />
      <main className="flex min-h-screen items-center justify-center px-4 py-24">
        <LoginForm />
      </main>
    </BackgroundWrapper>
  );
} 