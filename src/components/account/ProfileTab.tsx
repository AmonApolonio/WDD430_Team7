import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PersonalInfoData } from '@/types/seller';
import { updatePersonalInfoData } from '@/lib/api';
import { toast } from 'react-toastify';

interface ProfileTabProps {
  personalInfo: PersonalInfoData | null;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ personalInfo }) => {
  const [personalInfoState, setPersonalInfoState] = useState<PersonalInfoData | null>(personalInfo);
  const [isPersonalInfoChanged, setIsPersonalInfoChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPersonalInfoState(personalInfo);
  }, [personalInfo]);

  // Handle input changes for personal info
  const handlePersonalInfoChange = (field: keyof PersonalInfoData, value: string) => {
    if (!personalInfoState) return;
    setPersonalInfoState({ ...personalInfoState, [field]: value });
    setIsPersonalInfoChanged(true);
  };

  // Save personal info changes
  const handleSavePersonalInfo = async () => {
    if (personalInfoState) {
      setIsLoading(true);
      try {
        const updatedInfo = await updatePersonalInfoData(personalInfoState);
        setPersonalInfoState(updatedInfo);
        setIsPersonalInfoChanged(false);
        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        {/* Personal Information */}
        {personalInfoState && (
          <div className="border-2 border-orange-300/50 border-dashed p-6 w-full max-w-[600px] relative h-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  value={personalInfoState.fullName}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handlePersonalInfoChange('fullName', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  value={personalInfoState.email}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handlePersonalInfoChange('email', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={personalInfoState.phone}
                  className="border-2 border-orange-300/50 rounded px-3 py-2 w-full"
                  onChange={e => handlePersonalInfoChange('phone', e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            {isPersonalInfoChanged && (
              <Button 
                variant="filled" 
                className="absolute top-4 right-4 px-4 py-2 text-sm" 
                onClick={handleSavePersonalInfo}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;