"use client";

import React, { useState, Suspense } from 'react';
import Layout from '@/components/common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBox, faPen} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';
import { QuickStatsData, PersonalInfoData } from "@/types/seller";
import ProfilePicture from '@/components/ui/ProfilePicture';
import ProfileTab from '@/components/account/ProfileTab';
import InventoryTab from '@/components/account/InventoryTab';

// Client component for account functionality
export default function AccountPageClient({ 
  initialQuickStats, 
  initialPersonalInfo 
}: { 
  initialQuickStats: QuickStatsData;
  initialPersonalInfo: PersonalInfoData;
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [quickStats] = useState<QuickStatsData | null>(initialQuickStats);
  const [personalInfo] = useState<PersonalInfoData | null>(initialPersonalInfo);

  return (
    <Layout>
      <main className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <ProfilePicture
                imageUrl={personalInfo?.profilePictureUrl}
                fallbackText={personalInfo?.fullName?.[0] || ''}
                size="w-16 h-16"
              />
              <Button
                className="absolute top-0 right-0 px-1 bg-orange-300 text-white rounded-lg hover:bg-orange-400"
                onClick={() => alert('Edit profile picture functionality triggered!')}
              >
                <FontAwesomeIcon icon={faPen} className="text-white text-xs" />
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {personalInfo?.fullName}!</h1>
              <p className="text-gray-600">Seller Dashboard</p>
            </div>
          </div>

          {/* Quick Stats */}
          {quickStats && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-32 bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:bg-orange-300 hover:text-gray-800 cursor-pointer group">
                  <span className="text-2xl font-bold text-orange-400 group-hover:text-gray-700">{quickStats.activeProducts}</span>
                  <span className="text-sm text-gray-600">Active Products</span>
                </div>
                <div className="h-32 bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:bg-orange-300 hover:text-gray-800 cursor-pointer group">
                  <span className="text-2xl font-bold text-orange-400 group-hover:text-gray-700">{quickStats.avgRating}</span>
                  <span className="text-sm text-gray-600">Avg Rating</span>
                </div>
                <div className="h-32 bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:bg-orange-300 hover:text-gray-800 cursor-pointer group">
                  <span className="text-2xl font-bold text-orange-400 group-hover:text-gray-700">{quickStats.totalReviews}</span>
                  <span className="text-sm text-gray-600">Total Reviews</span>
                </div>
                <div className="h-32 bg-orange-50 border-2 border-orange-300/50 border-dashed rounded-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:bg-orange-300 hover:text-gray-800 cursor-pointer group">
                  <span className="text-2xl font-bold text-orange-400 group-hover:text-gray-700">{quickStats.totalSales}</span>
                  <span className="text-sm text-gray-600">Total Sales</span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="w-full mb-6">
          <div className="flex w-full mb-6 relative max-w-full">
            <div
              className={`absolute top-0 h-full w-1/2 bg-orange-300 transition-transform duration-300 ease-in-out ${activeTab === 'profile' ? 'translate-x-0 rounded-l-lg' : 'translate-x-full rounded-r-lg'}`}
            ></div>
            <Button
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-l-lg transition-colors relative z-10 flex-1 ${activeTab === 'profile' ? 'text-white' : 'bg-orange-50 text-orange-400 hover:bg-orange-100'}`}
              onClick={() => setActiveTab('profile')}
            >
              <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              Profile
            </Button>
            <Button
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-r-lg transition-colors relative z-10 flex-1 ${activeTab === 'inventory' ? 'text-white' : 'bg-orange-50 text-orange-400 hover:bg-orange-100'}`}
              onClick={() => setActiveTab('inventory')}
            >
              <FontAwesomeIcon icon={faBox} className="h-4 w-4" />
              Inventory
            </Button>
          </div>
        </div>

        {/* Tabs Content */}

        {activeTab === 'profile' && (
          <ProfileTab personalInfo={personalInfo} />
        )}

        {activeTab === 'inventory' && (
          <Suspense fallback={<div className="flex justify-center items-center py-10 text-orange-400 text-lg font-semibold">Loading inventory...</div>}>
            <InventoryTab />
          </Suspense>
        )}
      </main>
    </Layout>
  );
}
