import { useState } from 'react';
import { FiX, FiMail, FiPhone, FiMapPin, FiShoppingBag, FiDollarSign, FiClock, FiEdit } from 'react-icons/fi';
import { useCustomerStore } from '../../../store/customerStore';
import Badge from '../../Badge';
import { formatCurrency, formatDateTime } from '../../../utils/adminHelpers';
import toast from 'react-hot-toast';

const CustomerDetail = ({ customer, onClose, onUpdate }) => {
  const { updateCustomer, toggleCustomerStatus, addActivity } = useCustomerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    status: customer.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    updateCustomer(customer.id, formData);
    addActivity(customer.id, {
      type: 'update',
      description: 'Customer information updated',
    });
    setIsEditing(false);
    onUpdate?.();
  };

  const handleStatusToggle = () => {
    const newStatus = customer.status === 'active' ? 'blocked' : 'active';
    toggleCustomerStatus(customer.id);
    addActivity(customer.id, {
      type: 'status_change',
      description: `Customer status changed to ${newStatus}`,
    });
    onUpdate?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="text-xl text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-2xl font-bold text-gray-800 mb-2 px-3 py-1 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{customer.name}</h3>
                )}
                <Badge variant={customer.status === 'active' ? 'success' : 'error'}>
                  {customer.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: customer.name,
                          email: customer.email,
                          phone: customer.phone || '',
                          status: customer.status,
                        });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleStatusToggle}
                      className={`px-4 py-2 rounded-lg transition-colors font-semibold text-sm ${
                        customer.status === 'active'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {customer.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm flex items-center gap-2"
                    >
                      <FiEdit />
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FiMail className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <span className="text-gray-700">{customer.email}</span>
                )}
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <FiPhone className="text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-700">{customer.phone}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FiShoppingBag />
                <span className="text-sm font-semibold">Total Orders</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{customer.orders || 0}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FiDollarSign />
                <span className="text-sm font-semibold">Total Spent</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(customer.totalSpent || 0)}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FiClock />
                <span className="text-sm font-semibold">Last Order</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {customer.lastOrderDate
                  ? formatDateTime(customer.lastOrderDate)
                  : 'No orders yet'}
              </p>
            </div>
          </div>

          {/* Activity History */}
          {customer.activityHistory && customer.activityHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Activity History</h3>
              <div className="space-y-2">
                {customer.activityHistory.slice(0, 10).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(activity.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;

