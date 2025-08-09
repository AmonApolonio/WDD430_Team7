import React, { Suspense } from 'react';
import { fetchQuickStatsData, fetchPersonalInfoData } from "@/lib/api";
import { AccountPageSkeleton } from '@/components/ui/Skeletons';
import AccountPageClient from './AccountPageClient';

// Server Component that fetches data
async function AccountContent() {
  const quickStatsData = await fetchQuickStatsData();
  const personalInfoData = await fetchPersonalInfoData();

  return (
    <AccountPageClient 
      initialQuickStats={quickStatsData} 
      initialPersonalInfo={personalInfoData}
    />
  );
}

// Main page component with Suspense wrapper
export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountContent />
    </Suspense>
  );
}
