import React from 'react';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: 'url(/Homepage.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="min-h-screen w-full bg-black/70">
        {children}
      </div>
    </div>
  );
} 