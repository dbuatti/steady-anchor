
import React from 'react';
import { useTabProgress } from '@/hooks/useTabProgress';
import { FloatingTimer } from './FloatingTimer';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Activate browser tab progress update
  useTabProgress();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Main content area - Enabled vertical scrolling for standard pages */}
      <main className="flex-1 overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>
      <FloatingTimer />
      <BottomNav />
    </div>
  );
};

export default Layout;