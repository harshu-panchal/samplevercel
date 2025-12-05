import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Badge from '../../components/Badge';
import { formatCurrency, formatDateTime } from '../../utils/adminHelpers';
import { mockOrders } from '../../data/adminMockData';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const savedOrders = localStorage.getItem('admin-orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : mockOrders;
    const foundOrder = orders.find((o) => o.id === id);
    
    if (foundOrder) {
      setOrder(foundOrder);
      setStatus(foundOrder.status);
    } else {
      toast.error('Order not found');
      navigate('/admin/orders');
    }
  }, [id, navigate]);

  const handleStatusUpdate = () => {
    const savedOrders = localStorage.getItem('admin-orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : mockOrders;
    
    const updatedOrders = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    
    localStorage.setItem('admin-orders', JSON.stringify(updatedOrders));
    setOrder({ ...order, status });
    setIsEditing(false);
    toast.success('Order status updated successfully');
  };

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
            <p className="text-gray-600">{order.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Order Information</h2>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleStatusUpdate}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiCheck />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setStatus(order.status);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiX />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <Badge variant={order.status}>{order.status}</Badge>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <FiEdit />
                      Update Status
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="font-semibold text-gray-800">{formatDateTime(order.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Total</p>
                  <p className="font-bold text-gray-800 text-xl">{formatCurrency(order.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Items</p>
                  <p className="font-semibold text-gray-800">{order.items} items</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <Badge variant={order.status}>{order.status}</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-semibold text-gray-800">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-800">{order.customer.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(order.total * 0.95)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">{formatCurrency(order.total * 0.05)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-xl text-gray-800">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetail;

