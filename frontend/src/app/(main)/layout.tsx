"use client";

import { ReactNode } from 'react';
import SideNav from '@/components/ui/SideNav';
import CacheStatus from '@/components/ui/CacheStatus';

export default function MainLayout({ children }: { children: ReactNode }) {

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto animate-fade-in">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
   
    </div>
  );
}