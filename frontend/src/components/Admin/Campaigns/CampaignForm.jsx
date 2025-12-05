import { useState, useEffect } from 'react';
import { FiX, FiSave, FiCalendar } from 'react-icons/fi';
import { useCampaignStore } from '../../../store/campaignStore';
import { products as initialProducts } from '../../../data/products';
import { formatPrice } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const CampaignForm = ({ campaign, onClose, onSave }) => {
  const { createCampaign, updateCampaign } = useCampaignStore();
  const isEdit = !!campaign;

  const [formData, setFormData] = useState({
    name: '',
    type: 'flash_sale',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    productIds: [],
    isActive: true,
  });

  const [products] = useState(() => {
    const savedProducts = localStorage.getItem('admin-products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        type: campaign.type || 'flash_sale',
        description: campaign.description || '',
        discountType: campaign.discountType || 'percentage',
        discountValue: campaign.discountValue || '',
        startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
        endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
        productIds: campaign.productIds || [],
        isActive: campaign.isActive !== undefined ? campaign.isActive : true,
      });
    } else {
      // Set default dates
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData((prev) => ({
        ...prev,
        startDate: today.toISOString().split('T')[0],
        endDate: tomorrow.toISOString().split('T')[0],
      }));
    }
  }, [campaign]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleProductToggle = (productId) => {
    setFormData({
      ...formData,
      productIds: formData.productIds.includes(productId)
        ? formData.productIds.filter((id) => id !== productId)
        : [...formData.productIds, productId],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Campaign name is required');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error('Start and end dates are required');
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }
    if (formData.productIds.length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    try {
      const campaignData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        discountValue: parseFloat(formData.discountValue),
      };

      if (isEdit) {
        updateCampaign(campaign.id, campaignData);
      } else {
        createCampaign(campaignData);
      }
      onSave?.();
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Campaign' : 'Create Campaign'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="text-xl text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Summer Sale 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="flash_sale">Flash Sale</option>
                  <option value="daily_deal">Daily Deal</option>
                  <option value="special_offer">Special Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Campaign description..."
                />
              </div>
            </div>
          </div>

          {/* Discount Settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Discount Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  required
                  min="0"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 10.00'}
                />
                {formData.discountType === 'percentage' && (
                  <p className="text-xs text-gray-500 mt-1">Enter percentage (e.g., 20 for 20%)</p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={formData.startDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Select Products</h3>
            <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products available</p>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.productIds.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {formData.productIds.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {formData.productIds.length} product(s) selected
              </p>
            )}
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Settings</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-semibold text-gray-700">Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold"
            >
              <FiSave />
              {isEdit ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;

