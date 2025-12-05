import { motion } from 'framer-motion';
import { formatCurrency, getStatusColor } from '../../../utils/adminHelpers';
import Badge from '../../Badge';

const TopProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Products</h3>
      <div className="max-h-96 overflow-y-auto scrollbar-responsive md:pr-2">
        <div className="space-y-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {product.sales} sales
                    </span>
                    <Badge
                      variant={product.stock === 'low_stock' ? 'warning' : 'success'}
                    >
                      {product.stock === 'low_stock' ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-bold text-gray-800">{formatCurrency(product.revenue)}</p>
                <p className="text-xs text-gray-500">Stock: {product.stock}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;

