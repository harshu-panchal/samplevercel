import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ConfirmModal from '../../../components/Admin/ConfirmModal';
import { formatCurrency } from '../../../utils/adminHelpers';
import toast from 'react-hot-toast';

const TaxPricing = () => {
  const [taxRules, setTaxRules] = useState([
    { id: 1, name: 'Standard Tax', rate: 18, type: 'percentage', applicableTo: 'all', status: 'active' },
    { id: 2, name: 'GST', rate: 5, type: 'percentage', applicableTo: 'electronics', status: 'active' },
    { id: 3, name: 'Service Tax', rate: 10, type: 'percentage', applicableTo: 'services', status: 'inactive' },
  ]);
  const [pricingRules, setPricingRules] = useState([
    { id: 1, name: 'Bulk Discount', type: 'discount', value: 10, minQuantity: 10, status: 'active' },
    { id: 2, name: 'VIP Pricing', type: 'markup', value: 5, applicableTo: 'vip', status: 'active' },
  ]);
  const [editingTax, setEditingTax] = useState(null);
  const [editingPricing, setEditingPricing] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null });

  const handleSaveTax = (taxData) => {
    if (editingTax) {
      setTaxRules(taxRules.map(t => t.id === editingTax.id ? { ...taxData, id: editingTax.id } : t));
      toast.success('Tax rule updated');
    } else {
      setTaxRules([...taxRules, { ...taxData, id: taxRules.length + 1 }]);
      toast.success('Tax rule added');
    }
    setEditingTax(null);
  };

  const handleSavePricing = (pricingData) => {
    if (editingPricing) {
      setPricingRules(pricingRules.map(p => p.id === editingPricing.id ? { ...pricingData, id: editingPricing.id } : p));
      toast.success('Pricing rule updated');
    } else {
      setPricingRules([...pricingRules, { ...pricingData, id: pricingRules.length + 1 }]);
      toast.success('Pricing rule added');
    }
    setEditingPricing(null);
  };

  const handleDelete = () => {
    if (deleteModal.type === 'tax') {
      setTaxRules(taxRules.filter(t => t.id !== deleteModal.id));
      toast.success('Tax rule deleted');
    } else {
      setPricingRules(pricingRules.filter(p => p.id !== deleteModal.id));
      toast.success('Pricing rule deleted');
    }
    setDeleteModal({ isOpen: false, id: null, type: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Tax & Pricing</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage tax rules and pricing strategies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Rules */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Tax Rules</h2>
            <button
              onClick={() => setEditingTax({})}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
            >
              <FiPlus />
              <span>Add Tax Rule</span>
            </button>
          </div>

          <div className="space-y-3">
            {taxRules.map((tax) => (
              <div key={tax.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{tax.name}</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>Rate: {tax.rate}%</p>
                      <p>Type: {tax.type}</p>
                      <p>Applicable To: {tax.applicableTo}</p>
                      <p className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        tax.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tax.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTax(tax)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: tax.id, type: 'tax' })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Rules */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pricing Rules</h2>
            <button
              onClick={() => setEditingPricing({})}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
            >
              <FiPlus />
              <span>Add Pricing Rule</span>
            </button>
          </div>

          <div className="space-y-3">
            {pricingRules.map((pricing) => (
              <div key={pricing.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{pricing.name}</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>Type: {pricing.type}</p>
                      <p>Value: {pricing.value}%</p>
                      {pricing.minQuantity && <p>Min Quantity: {pricing.minQuantity}</p>}
                      <p className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        pricing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pricing.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingPricing(pricing)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: pricing.id, type: 'pricing' })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Tax Modal */}
      {editingTax !== null && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditingTax(null)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingTax.id ? 'Edit Tax Rule' : 'Add Tax Rule'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSaveTax({
                name: formData.get('name'),
                rate: parseFloat(formData.get('rate')),
                type: formData.get('type'),
                applicableTo: formData.get('applicableTo'),
                status: formData.get('status'),
              });
            }} className="space-y-4">
              <input
                type="text"
                name="name"
                defaultValue={editingTax.name || ''}
                placeholder="Tax Name"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                name="rate"
                defaultValue={editingTax.rate || ''}
                placeholder="Tax Rate (%)"
                required
                step="0.01"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                name="type"
                defaultValue={editingTax.type || 'percentage'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <select
                name="applicableTo"
                defaultValue={editingTax.applicableTo || 'all'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Products</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="services">Services</option>
              </select>
              <select
                name="status"
                defaultValue={editingTax.status || 'active'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTax(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pricing Modal */}
      {editingPricing !== null && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditingPricing(null)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingPricing.id ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSavePricing({
                name: formData.get('name'),
                type: formData.get('type'),
                value: parseFloat(formData.get('value')),
                minQuantity: formData.get('minQuantity') ? parseInt(formData.get('minQuantity')) : null,
                applicableTo: formData.get('applicableTo') || null,
                status: formData.get('status'),
              });
            }} className="space-y-4">
              <input
                type="text"
                name="name"
                defaultValue={editingPricing.name || ''}
                placeholder="Rule Name"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                name="type"
                defaultValue={editingPricing.type || 'discount'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="discount">Discount</option>
                <option value="markup">Markup</option>
              </select>
              <input
                type="number"
                name="value"
                defaultValue={editingPricing.value || ''}
                placeholder="Value (%)"
                required
                step="0.01"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                name="minQuantity"
                defaultValue={editingPricing.minQuantity || ''}
                placeholder="Min Quantity (optional)"
                min="1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                name="applicableTo"
                defaultValue={editingPricing.applicableTo || ''}
                placeholder="Applicable To (optional, e.g., vip, category)"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                name="status"
                defaultValue={editingPricing.status || 'active'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPricing(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, type: null })}
        onConfirm={handleDelete}
        title="Delete Rule?"
        message="Are you sure you want to delete this rule? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default TaxPricing;

