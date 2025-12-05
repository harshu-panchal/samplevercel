import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

const defaultSettings = {
  general: {
    storeName: 'Appzeto E-commerce',
    storeLogo: '/images/logos/logo.png',
    favicon: '/images/logos/logo.png',
    contactEmail: 'contact@example.com',
    contactPhone: '+1234567890',
    address: '',
    businessHours: 'Mon-Fri 9AM-6PM',
    timezone: 'UTC',
    currency: 'INR',
    language: 'en',
  },
  payment: {
    paymentMethods: ['cod', 'card', 'wallet'],
    codEnabled: true,
    cardEnabled: true,
    walletEnabled: true,
    paymentGateway: 'stripe',
    stripePublicKey: '',
    stripeSecretKey: '',
  },
  shipping: {
    shippingZones: [],
    freeShippingThreshold: 100,
    defaultShippingRate: 5,
    shippingMethods: ['standard', 'express'],
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@example.com',
    fromName: 'Appzeto Store',
  },
  seo: {
    metaTitle: 'Appzeto E-commerce - Shop Online',
    metaDescription: 'Shop the latest trends and products',
    metaKeywords: 'ecommerce, shopping, online store',
    ogImage: '/images/logos/logo.png',
  },
  theme: {
    primaryColor: '#10B981',
    secondaryColor: '#3B82F6',
    fontFamily: 'Inter',
  },
};

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,

      // Initialize settings
      initialize: () => {
        const savedSettings = localStorage.getItem('admin-settings');
        if (savedSettings) {
          set({ settings: JSON.parse(savedSettings) });
        } else {
          set({ settings: defaultSettings });
          localStorage.setItem('admin-settings', JSON.stringify(defaultSettings));
        }
      },

      // Get settings
      getSettings: () => {
        const state = get();
        if (!state.settings) {
          state.initialize();
        }
        return get().settings;
      },

      // Update settings
      updateSettings: (category, settingsData) => {
        set({ isLoading: true });
        try {
          const currentSettings = get().settings;
          const updatedSettings = {
            ...currentSettings,
            [category]: {
              ...currentSettings[category],
              ...settingsData,
            },
          };
          set({ settings: updatedSettings, isLoading: false });
          localStorage.setItem('admin-settings', JSON.stringify(updatedSettings));
          toast.success('Settings updated successfully');
          return updatedSettings;
        } catch (error) {
          set({ isLoading: false });
          toast.error('Failed to update settings');
          throw error;
        }
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

