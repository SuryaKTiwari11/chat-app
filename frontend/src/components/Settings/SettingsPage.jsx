import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Loader from "../UI/Loader";

const SettingsPage = () => {
  const { authUser } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      messages: true,
      mentions: true,
      friendRequests: true,
      newFeaturesAnnouncements: false,
    },
    privacy: {
      showOnlineStatus: true,
      showReadReceipts: true,
      allowDirectMessages: "everyone", // everyone, friends, none
    },
    appearance: {
      theme: "dark", // dark, light, system
      fontSize: "medium", // small, medium, large
      messageLayout: "modern", // classic, modern, compact
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsLoaded(true);
    
    // Load user settings when available (could be expanded with an API call)
    if (authUser && authUser.settings) {
      setSettings(authUser.settings);
    }
  }, [authUser]);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    
    // Clear success message when settings are changed
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleRadioChange = (category, setting, event) => {
    handleSettingChange(category, setting, event.target.value);
  };

  const handleToggleChange = (category, setting) => {
    handleSettingChange(category, setting, !settings[category][setting]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
    
    // Actual implementation would update settings via API
    // await api.updateSettings(settings);
  };

  if (!authUser) {
    return <Loader fullScreen size="large" />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div 
          className={`max-w-4xl mx-auto transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-gradient">
            Settings
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Notifications Settings */}
            <div className="bg-[#1E293B] rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Notifications
              </h2>
              
              <div className="space-y-3">
                <ToggleOption 
                  label="Message Notifications" 
                  checked={settings.notifications.messages}
                  onChange={() => handleToggleChange('notifications', 'messages')}
                  description="Get notified when you receive new messages"
                />
                <ToggleOption 
                  label="Mentions" 
                  checked={settings.notifications.mentions}
                  onChange={() => handleToggleChange('notifications', 'mentions')}
                  description="Get notified when someone mentions you"
                />
                <ToggleOption 
                  label="Friend Requests" 
                  checked={settings.notifications.friendRequests}
                  onChange={() => handleToggleChange('notifications', 'friendRequests')}
                  description="Get notified when you receive friend requests"
                />
                <ToggleOption 
                  label="New Features & Announcements" 
                  checked={settings.notifications.newFeaturesAnnouncements}
                  onChange={() => handleToggleChange('notifications', 'newFeaturesAnnouncements')}
                  description="Get notified about new app features"
                />
              </div>
            </div>
            
            {/* Privacy Settings */}
            <div className="bg-[#1E293B] rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Privacy
              </h2>
              
              <div className="space-y-3">
                <ToggleOption 
                  label="Show Online Status" 
                  checked={settings.privacy.showOnlineStatus}
                  onChange={() => handleToggleChange('privacy', 'showOnlineStatus')}
                  description="Let others see when you're online"
                />
                <ToggleOption 
                  label="Show Read Receipts" 
                  checked={settings.privacy.showReadReceipts}
                  onChange={() => handleToggleChange('privacy', 'showReadReceipts')}
                  description="Let others see when you've read their messages"
                />
                
                <div className="mt-5">
                  <label className="block text-gray-300 mb-2">
                    Who can send you direct messages
                  </label>
                  <div className="space-y-2">
                    <RadioOption 
                      label="Everyone"
                      value="everyone"
                      checked={settings.privacy.allowDirectMessages === "everyone"}
                      onChange={(e) => handleRadioChange('privacy', 'allowDirectMessages', e)}
                      name="allowDirectMessages"
                    />
                    <RadioOption 
                      label="Friends only"
                      value="friends"
                      checked={settings.privacy.allowDirectMessages === "friends"}
                      onChange={(e) => handleRadioChange('privacy', 'allowDirectMessages', e)}
                      name="allowDirectMessages"
                    />
                    <RadioOption 
                      label="Nobody"
                      value="none"
                      checked={settings.privacy.allowDirectMessages === "none"}
                      onChange={(e) => handleRadioChange('privacy', 'allowDirectMessages', e)}
                      name="allowDirectMessages"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Appearance Settings */}
            <div className="bg-[#1E293B] rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
                Appearance
              </h2>
              
              <div className="space-y-5">
                {/* Theme selection */}
                <div>
                  <label className="block text-gray-300 mb-2">Theme</label>
                  <div className="space-y-2">
                    <RadioOption 
                      label="Dark"
                      value="dark"
                      checked={settings.appearance.theme === "dark"}
                      onChange={(e) => handleRadioChange('appearance', 'theme', e)}
                      name="theme"
                    />
                    <RadioOption 
                      label="Light"
                      value="light"
                      checked={settings.appearance.theme === "light"}
                      onChange={(e) => handleRadioChange('appearance', 'theme', e)}
                      name="theme"
                    />
                    <RadioOption 
                      label="System Default"
                      value="system"
                      checked={settings.appearance.theme === "system"}
                      onChange={(e) => handleRadioChange('appearance', 'theme', e)}
                      name="theme"
                    />
                  </div>
                </div>
                
                {/* Font size */}
                <div>
                  <label className="block text-gray-300 mb-2">Font Size</label>
                  <div className="space-y-2">
                    <RadioOption 
                      label="Small"
                      value="small"
                      checked={settings.appearance.fontSize === "small"}
                      onChange={(e) => handleRadioChange('appearance', 'fontSize', e)}
                      name="fontSize"
                    />
                    <RadioOption 
                      label="Medium"
                      value="medium"
                      checked={settings.appearance.fontSize === "medium"}
                      onChange={(e) => handleRadioChange('appearance', 'fontSize', e)}
                      name="fontSize"
                    />
                    <RadioOption 
                      label="Large"
                      value="large"
                      checked={settings.appearance.fontSize === "large"}
                      onChange={(e) => handleRadioChange('appearance', 'fontSize', e)}
                      name="fontSize"
                    />
                  </div>
                </div>
                
                {/* Message layout */}
                <div>
                  <label className="block text-gray-300 mb-2">Message Layout</label>
                  <div className="space-y-2">
                    <RadioOption 
                      label="Modern"
                      value="modern"
                      checked={settings.appearance.messageLayout === "modern"}
                      onChange={(e) => handleRadioChange('appearance', 'messageLayout', e)}
                      name="messageLayout"
                    />
                    <RadioOption 
                      label="Classic"
                      value="classic"
                      checked={settings.appearance.messageLayout === "classic"}
                      onChange={(e) => handleRadioChange('appearance', 'messageLayout', e)}
                      name="messageLayout"
                    />
                    <RadioOption 
                      label="Compact"
                      value="compact"
                      checked={settings.appearance.messageLayout === "compact"}
                      onChange={(e) => handleRadioChange('appearance', 'messageLayout', e)}
                      name="messageLayout"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
              
              {saveSuccess && (
                <div className="mt-4 sm:mt-0 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Changes saved successfully
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Toggle Option Component
const ToggleOption = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-white">{label}</h3>
        {description && <p className="text-gray-400 text-sm">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
          checked ? "bg-indigo-500" : "bg-gray-600"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
};

// Radio Option Component
const RadioOption = ({ label, value, checked, onChange, name }) => {
  return (
    <label className="flex items-center">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${
          checked 
            ? "border-indigo-500 bg-indigo-500" 
            : "border-gray-400"
        }`}
      >
        {checked && <span className="w-2 h-2 bg-white rounded-full"></span>}
      </span>
      {label}
    </label>
  );
};

export default SettingsPage;
