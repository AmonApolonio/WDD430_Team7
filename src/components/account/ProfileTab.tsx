import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { PersonalInfoData, BusinessInfoData } from '@/types/seller';
import {  fetchBusinessInfoData, updatePersonalInfoData, updateBusinessInfoData } from '@/lib/api';


interface ProfileTabProps {
  personalInfo: PersonalInfoData | null;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ personalInfo }) => {
  const [personalInfoState, setPersonalInfoState] = useState<PersonalInfoData | null>(personalInfo);
  const [businessInfoState, setBusinessInfoState] = useState<BusinessInfoData | null>(null);
  const [isPersonalInfoChanged, setIsPersonalInfoChanged] = useState(false);
  const [isBusinessInfoChanged, setIsBusinessInfoChanged] = useState(false);

  useEffect(() => {
    setBusinessInfoState(fetchBusinessInfoData());
  }, []);

  useEffect(() => {
    setPersonalInfoState(personalInfo);
  }, [personalInfo]);


  // Handle input changes for personal info
  const handlePersonalInfoChange = (field: keyof PersonalInfoData, value: string) => {
    if (!personalInfoState) return;
    setPersonalInfoState({ ...personalInfoState, [field]: value });
    setIsPersonalInfoChanged(true);
  };

  // Handle input changes for business info
  const handleBusinessInfoChange = (field: keyof BusinessInfoData, value: string) => {
    if (!businessInfoState) return;
    setBusinessInfoState({ ...businessInfoState, [field]: value });
    setIsBusinessInfoChanged(true);
  };

  // Save personal info changes
  const handleSavePersonalInfo = () => {
    if (personalInfoState) {
      updatePersonalInfoData(personalInfoState);
      setIsPersonalInfoChanged(false);
    }
  };

  // Save business info changes
  const handleSaveBusinessInfo = () => {
    if (businessInfoState) {
      updateBusinessInfoData(businessInfoState);
      setIsBusinessInfoChanged(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        {personalInfoState && (
          <div className="border-2 border-orange-300/50 border-dashed p-6 w-full lg:w-full lg:min-w-[450px] relative h-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  value={personalInfoState.fullName}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handlePersonalInfoChange('fullName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  value={personalInfoState.email}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handlePersonalInfoChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={personalInfoState.phone}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handlePersonalInfoChange('phone', e.target.value)}
                />
              </div>
            </div>
            {isPersonalInfoChanged && (
              <Button variant="filled" className="absolute top-4 right-4 px-4 py-2 text-sm" onClick={handleSavePersonalInfo}>
                Save changes
              </Button>
            )}
          </div>
        )}

        {/* Business Information */}
        {businessInfoState && (
          <div className="border-2 border-orange-300/50 border-dashed p-6 w-full lg:w-full lg:min-w-[450px] relative h-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <Input
                  value={businessInfoState.businessName}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handleBusinessInfoChange('businessName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                <Input
                  value={businessInfoState.businessEmail}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handleBusinessInfoChange('businessEmail', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                <Input
                  value={businessInfoState.businessPhone}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handleBusinessInfoChange('businessPhone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <TextArea
                  value={businessInfoState.businessAddress}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handleBusinessInfoChange('businessAddress', e.target.value)}
                />
              </div>
            </div>
            {isBusinessInfoChanged && (
              <Button variant="filled" className="absolute top-4 right-4 px-4 py-2 text-sm" onClick={handleSaveBusinessInfo}>
                Save changes
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
