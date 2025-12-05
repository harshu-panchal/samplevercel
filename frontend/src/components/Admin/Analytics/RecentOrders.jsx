import { formatCurrency, formatDateTime, getStatusColor } from '../../../utils/adminHelpers';
import Badge from '../../Badge';
import { FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RecentOrders = ({ orders, onViewOrder }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Orders</h3>
      <div className="max-h-96 overflow-y-auto scrollbar-responsive md:pr-2">
        <div className="space-y-4">
          {orders.slice(0, 5).map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-800 truncate">{order.id}</h4>
                  <Badge variant={order.status}>{order.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 truncate">{order.customer.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(order.date)} • {order.items} items
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatCurrency(order.total)}</p>
                </div>
                {onViewOrder && (
                  <button
                    onClick={() => onViewOrder(order)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FiEye className="text-gray-600" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;

