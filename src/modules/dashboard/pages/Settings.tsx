// src/modules/dashboard/pages/Settings.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSave, FiGlobe, FiMoon, FiSun, FiLock, FiTrash2, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import DashboardHeader from '../components/DashboardHeader';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { useTheme } from '../../../shared/hooks/useTheme';
import { changeLanguage } from '../../../shared/utils/i18n';
import { Language, Theme } from '../../../shared/types/types';
import { useCurrentUserProfile,  /* useUpdateUser */ } from '../services/userService';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, updateTheme } = useTheme();
  const [language, setLanguage] = useState<Language>(i18n.language as Language);
  const [showLanguageSuccess, setShowLanguageSuccess] = useState(false);
  const [showThemeSuccess, setShowThemeSuccess] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // User profile data
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();
  // const updateUserMutation = useUpdateUser();
  
  // Database export state
  const [exportLoading, setExportLoading] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  // Handle language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    changeLanguage(newLanguage);
    setShowLanguageSuccess(true);
    setTimeout(() => setShowLanguageSuccess(false), 3000);
  };
  
  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    updateTheme(newTheme);
    setShowThemeSuccess(true);
    setTimeout(() => setShowThemeSuccess(false), 3000);
  };
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    
    if (!currentPassword) {
      setPasswordError(t('settings.currentPasswordRequired'));
      return;
    }
    
    if (!newPassword) {
      setPasswordError(t('settings.newPasswordRequired'));
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError(t('settings.passwordLength'));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.passwordMismatch'));
      return;
    }
    
    try {
      // In a real app, you would connect to Supabase auth to change password
      // Here we're just simulating success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.message || t('settings.passwordChangeError'));
    }
  };
  
  // Handle database export
  const handleExportDatabase = async () => {
    setExportLoading(true);
    setExportSuccess(false);
    
    try {
      // In a real app, you would generate a database export
      // Here we're just simulating the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a dummy JSON file to download
      const dummyData = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        tables: ['users', 'services', 'team_members', 'projects', 'reviews', 'blog_posts', 'contact_messages'],
        message: 'This is a simulated database export',
      };
      
      const dataStr = JSON.stringify(dummyData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `hilal-tech-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setExportSuccess(true);
    } catch (error) {
      console.error('Error exporting database:', error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Language Settings */}
          <Card title={t('settings.language')}>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{t('settings.languageDescription')}</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant={language === 'en' ? 'indigo' : 'outline'}
                  onClick={() => handleLanguageChange('en')}
                  icon={<FiGlobe className="mr-2" />}
                >
                  English
                </Button>
                
                <Button
                  variant={language === 'ar' ? 'indigo' : 'outline'}
                  onClick={() => handleLanguageChange('ar')}
                  icon={<FiGlobe className="mr-2" />}
                >
                  العربية
                </Button>
              </div>
              
              {showLanguageSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                  {t('settings.languageChanged')}
                </div>
              )}
            </div>
          </Card>
          
          {/* Theme Settings */}
          <Card title={t('settings.theme')}>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{t('settings.themeDescription')}</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant={theme === 'light' ? 'indigo' : 'outline'}
                  onClick={() => handleThemeChange('light')}
                  icon={<FiSun className="mr-2" />}
                >
                  {t('settings.lightTheme')}
                </Button>
                
                <Button
                  variant={theme === 'dark' ? 'indigo' : 'outline'}
                  onClick={() => handleThemeChange('dark')}
                  icon={<FiMoon className="mr-2" />}
                >
                  {t('settings.darkTheme')}
                </Button>
              </div>
              
              {showThemeSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                  {t('settings.themeChanged')}
                </div>
              )}
            </div>
          </Card>
          
          {/* Password Settings */}
          <Card title={t('settings.changePassword')}>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{t('settings.passwordDescription')}</p>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  type="password"
                  label={t('settings.currentPassword')}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  icon={<FiLock />}
                />
                
                <Input
                  type="password"
                  label={t('settings.newPassword')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={<FiLock />}
                />
                
                <Input
                  type="password"
                  label={t('settings.confirmPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<FiLock />}
                />
                
                {passwordError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
                    {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                    {t('settings.passwordChanged')}
                  </div>
                )}
                
                <Button
                  type="submit"
                  icon={<FiSave className="mr-2" />}
                >
                  {t('settings.savePassword')}
                </Button>
              </form>
            </div>
          </Card>
        </div>
        
        <div className="space-y-8">
          {/* User Profile Summary */}
          <Card title={t('settings.profileSummary')}>
            <div className="space-y-4">
              {profileLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ) : profile ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.name || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=User';
                          }}
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-2xl font-medium">
                          {profile.name?.charAt(0) || profile.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {profile.name || 'Unnamed User'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                        profile.role === 'admin'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                          : profile.role === 'editor'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                      }`}>
                        {t(`users.roles.${profile.role}`)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('settings.memberSince', { date: new Date(profile.created_at).toLocaleDateString() })}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {t('settings.profileNotFound')}
                </p>
              )}
            </div>
          </Card>
          
          {/* Database Export */}
          <Card title={t('settings.dataExport')}>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{t('settings.exportDescription')}</p>
              
              <Button
                onClick={handleExportDatabase}
                isLoading={exportLoading}
                icon={<FiSave className="mr-2" />}
                fullWidth
              >
                {t('settings.exportData')}
              </Button>
              
              {exportSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                  {t('settings.exportSuccess')}
                </div>
              )}
            </div>
          </Card>
          
          {/* Danger Zone */}
          <Card title={t('settings.dangerZone')} className="border border-red-300 dark:border-red-700">
            <div className="space-y-4">
              <div className="flex items-start">
                <FiAlertTriangle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('settings.dangerZoneDescription')}
                </p>
              </div>
              
              <Button
                variant="danger"
                icon={<FiTrash2 className="mr-2" />}
                fullWidth
              >
                {t('settings.deleteAccount')}
              </Button>
              
              <div className="flex items-start mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <FiInfo className="text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {t('settings.deleteAccountWarning')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;