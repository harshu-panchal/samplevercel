import { useState, useMemo } from 'react';
import { FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import RevenueChart from '../../../components/Admin/Analytics/RevenueChart';
import { generateRevenueData } from '../../../data/adminMockData';
import { formatCurrency } from '../../../utils/adminHelpers';

const RevenueOverview = () => {
  const [period, setPeriod] = useState('month');
  const revenueData = useMemo(() => generateRevenueData(30), []);

  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = revenueData.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Revenue Overview</h1>
        <p className="text-sm sm:text-base text-gray-600">Track revenue and sales performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <FiDollarSign className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Orders</p>
            <FiCalendar className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Average Order Value</p>
            <FiTrendingUp className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(averageOrderValue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Revenue Chart</h3>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <RevenueChart data={revenueData} period={period} />
      </div>
    </motion.div>
  );
};

export default RevenueOverview;

