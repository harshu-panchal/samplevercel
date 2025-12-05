import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDate, filterByDateRange, getDateRange } from '../../../utils/adminHelpers';
import { motion } from 'framer-motion';

const CustomerGrowthAreaChart = ({ data, period = 'month' }) => {
  // Generate mock customer growth data based on revenue data
  const customerData = useMemo(() => {
    const range = getDateRange(period);
    const filtered = filterByDateRange(data, range.start, range.end);
    let cumulativeCustomers = 1000; // Starting point
    
    return filtered.map((item, index) => {
      // Simulate customer growth (new customers per day)
      const newCustomers = Math.floor(Math.random() * 20) + 5;
      cumulativeCustomers += newCustomers;
      
      return {
        date: item.date,
        dateLabel: formatDate(item.date, { month: 'short', day: 'numeric' }),
        customers: cumulativeCustomers,
        newCustomers: newCustomers,
      };
    });
  }, [data, period]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span>{' '}
              {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Customer Growth</h3>
          <p className="text-sm text-gray-500 mt-1">Total customer base over time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
          <span className="text-xs text-gray-600">Customers</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={customerData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="dateLabel"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="customers"
            stroke="#ec4899"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCustomers)"
            name="Total Customers"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CustomerGrowthAreaChart;

