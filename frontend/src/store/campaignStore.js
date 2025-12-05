import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCampaignStore = create(
  persist(
    (set, get) => ({
      campaigns: [],
      isLoading: false,

      // Initialize campaigns
      initialize: () => {
        const savedCampaigns = localStorage.getItem('admin-campaigns');
        if (savedCampaigns) {
          set({ campaigns: JSON.parse(savedCampaigns) });
        } else {
          set({ campaigns: [] });
        }
      },

      // Get all campaigns
      getCampaigns: () => {
        const state = get();
        if (state.campaigns.length === 0) {
          state.initialize();
        }
        return get().campaigns;
      },

      // Get campaign by ID
      getCampaignById: (id) => {
        return get().campaigns.find((campaign) => campaign.id === parseInt(id));
      },

      // Get active campaigns
      getActiveCampaigns: () => {
        const now = new Date();
        return get().campaigns.filter(
          (campaign) =>
            campaign.isActive &&
            new Date(campaign.startDate) <= now &&
            new Date(campaign.endDate) >= now
        );
      },

      // Create campaign
      createCampaign: (campaignData) => {
        set({ isLoading: true });
        try {
          const campaigns = get().campaigns;
          const newId = campaigns.length > 0 
            ? Math.max(...campaigns.map((c) => c.id)) + 1 
            : 1;
          
          const newCampaign = {
            id: newId,
            name: campaignData.name,
            type: campaignData.type, // 'flash_sale', 'daily_deal', 'special_offer'
            description: campaignData.description || '',
            discountType: campaignData.discountType, // 'percentage', 'fixed', 'buy_x_get_y'
            discountValue: campaignData.discountValue,
            startDate: campaignData.startDate,
            endDate: campaignData.endDate,
            productIds: campaignData.productIds || [],
            isActive: campaignData.isActive !== undefined ? campaignData.isActive : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const updatedCampaigns = [...campaigns, newCampaign];
          set({ campaigns: updatedCampaigns, isLoading: false });
          localStorage.setItem('admin-campaigns', JSON.stringify(updatedCampaigns));
          toast.success('Campaign created successfully');
          return newCampaign;
        } catch (error) {
          set({ isLoading: false });
          toast.error('Failed to create campaign');
          throw error;
        }
      },

      // Update campaign
      updateCampaign: (id, campaignData) => {
        set({ isLoading: true });
        try {
          const campaigns = get().campaigns;
          const updatedCampaigns = campaigns.map((campaign) =>
            campaign.id === parseInt(id)
              ? { ...campaign, ...campaignData, updatedAt: new Date().toISOString() }
              : campaign
          );
          set({ campaigns: updatedCampaigns, isLoading: false });
          localStorage.setItem('admin-campaigns', JSON.stringify(updatedCampaigns));
          toast.success('Campaign updated successfully');
          return updatedCampaigns.find((campaign) => campaign.id === parseInt(id));
        } catch (error) {
          set({ isLoading: false });
          toast.error('Failed to update campaign');
          throw error;
        }
      },

      // Delete campaign
      deleteCampaign: (id) => {
        set({ isLoading: true });
        try {
          const campaigns = get().campaigns;
          const updatedCampaigns = campaigns.filter((campaign) => campaign.id !== parseInt(id));
          set({ campaigns: updatedCampaigns, isLoading: false });
          localStorage.setItem('admin-campaigns', JSON.stringify(updatedCampaigns));
          toast.success('Campaign deleted successfully');
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error('Failed to delete campaign');
          throw error;
        }
      },

      // Toggle campaign status
      toggleCampaignStatus: (id) => {
        const campaign = get().getCampaignById(id);
        if (campaign) {
          get().updateCampaign(id, { isActive: !campaign.isActive });
        }
      },
    }),
    {
      name: 'campaign-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

