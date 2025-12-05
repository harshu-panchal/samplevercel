import { useState, useEffect } from 'react';
import { FiSettings, FiCreditCard, FiTruck, FiMail, FiSearch, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';
import GeneralSettings from '../../components/Admin/Settings/GeneralSettings';
import PaymentSettings from '../../components/Admin/Settings/PaymentSettings';
import ShippingSettings from '../../components/Admin/Settings/ShippingSettings';
import SEOSettings from '../../components/Admin/Settings/SEOSettings';

const Settings = () => {
  const { initialize } = useSettingsStore();
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    initialize();
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings, component: GeneralSettings },
    { id: 'payment', label: 'Payment', icon: FiCreditCard, component: PaymentSettings },
    { id: 'shipping', label: 'Shipping', icon: FiTruck, component: ShippingSettings },
    { id: 'email', label: 'Email', icon: FiMail, component: GeneralSettings }, // Placeholder
    { id: 'seo', label: 'SEO', icon: FiSearch, component: SEOSettings },
    { id: 'theme', label: 'Theme', icon: FiImage, component: GeneralSettings }, // Placeholder
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || GeneralSettings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Configure your store settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          <ActiveComponent />
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;

