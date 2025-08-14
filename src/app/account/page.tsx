"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AccountPageSkeleton } from '@/components/ui/Skeletons';
import AccountPageClient from './AccountPageClient';
import { mockQuickStatsData, mockPersonalInfoData } from '@/lib/mockData';

export default function AccountPage() {
  const { loading } = useAuth();

  if (loading) {
    return <AccountPageSkeleton />;
  }

  // If we get here, user is authenticated
  return (
    <AccountPageClient 
      initialQuickStats={mockQuickStatsData} 
      initialPersonalInfo={mockPersonalInfoData}
    />
  );
}
