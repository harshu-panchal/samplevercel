import { useState, useMemo } from 'react';
import { FiFileText, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '../../../components/Admin/DataTable';
import ExportButton from '../../../components/Admin/ExportButton';
import { formatCurrency, formatDateTime } from '../../../utils/adminHelpers';
import { mockOrders } from '../../../data/adminMockData';

const TaxReports = () => {
  const [orders] = useState(mockOrders);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const taxData = useMemo(() => {
    return orders.map((order) => {
      const taxRate = 0.18; // 18% tax
      const taxAmount = order.total * taxRate;
      const subtotal = order.total - taxAmount;
      return {
        orderId: order.id,
        date: order.date,
        customer: order.customer.name,
        subtotal,
        taxRate: taxRate * 100,
        taxAmount,
        total: order.total,
      };
    });
  }, [orders]);

  const filteredTaxData = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return taxData;
    return taxData.filter((item) => {
      const itemDate = new Date(item.date);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;
      return (!start || itemDate >= start) && (!end || itemDate <= end);
    });
  }, [taxData, dateRange]);

  const totalTax = filteredTaxData.reduce((sum, item) => sum + item.taxAmount, 0);
  const totalRevenue = filteredTaxData.reduce((sum, item) => sum + item.total, 0);

  const columns = [
    {
      key: 'orderId',
      label: 'Order ID',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-800">{value}</span>,
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => formatDateTime(value),
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'subtotal',
      label: 'Subtotal',
      sortable: true,
      render: (value) => formatCurrency(value),
    },
    {
      key: 'taxRate',
      label: 'Tax Rate',
      sortable: true,
      render: (value) => `${value}%`,
    },
    {
      key: 'taxAmount',
      label: 'Tax Amount',
      sortable: true,
      render: (value) => (
        <span className="font-bold text-gray-800">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (value) => formatCurrency(value),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Tax Reports</h1>
        <p className="text-sm sm:text-base text-gray-600">View tax collection and reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Tax Collected</p>
            <FiFileText className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalTax)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <FiFileText className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-end">
            <ExportButton
              data={filteredTaxData}
              headers={[
                { label: 'Order ID', accessor: (row) => row.orderId },
                { label: 'Date', accessor: (row) => formatDateTime(row.date) },
                { label: 'Customer', accessor: (row) => row.customer },
                { label: 'Subtotal', accessor: (row) => formatCurrency(row.subtotal) },
                { label: 'Tax Rate', accessor: (row) => `${row.taxRate}%` },
                { label: 'Tax Amount', accessor: (row) => formatCurrency(row.taxAmount) },
                { label: 'Total', accessor: (row) => formatCurrency(row.total) },
              ]}
              filename="tax-report"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={filteredTaxData}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>
    </motion.div>
  );
};

export default TaxReports;

