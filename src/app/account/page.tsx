"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AccountPageSkeleton } from '@/components/ui/Skeletons';
import AccountPageClient from './AccountPageClient';
import { fetchQuickStatsData, fetchPersonalInfoData } from '@/lib/api';
import { QuickStatsData, PersonalInfoData } from '@/types/seller';
import { User } from '@/types/user';
import { toast } from 'react-toastify';

function AccountContent() {
  const [user, setUser] = useState<User | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStatsData | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        // First get user data to check if they're a seller
        const userResponse = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        setUser(userData.user);

        // Load personal info for all users
        const personalData = await fetchPersonalInfoData();
        setPersonalInfo(personalData);

        // Only load seller stats if user is a seller
        if (userData.user.isSeller) {
          const statsData = await fetchQuickStatsData();
          setQuickStats(statsData);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
        toast.error('Failed to load account data');
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, []);

  if (loading || !user || !personalInfo) {
    return <AccountPageSkeleton />;
  }

  return (
    <AccountPageClient 
      user={user}
      initialQuickStats={quickStats} 
      initialPersonalInfo={personalInfo}
    />
  );
}

export default function AccountPage() {
  const { loading } = useAuth();

  if (loading) {
    return <AccountPageSkeleton />;
  }

  // If we get here, user is authenticated
  return <AccountContent />;
}
