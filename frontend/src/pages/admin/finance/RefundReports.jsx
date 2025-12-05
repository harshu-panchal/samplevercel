import { useState, useMemo } from 'react';
import { FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '../../../components/Admin/DataTable';
import Badge from '../../../components/Badge';
import ExportButton from '../../../components/Admin/ExportButton';
import { formatCurrency, formatDateTime } from '../../../utils/adminHelpers';

const RefundReports = () => {
  const [refunds] = useState([
    {
      id: 'REF-001',
      orderId: 'ORD-001',
      customerName: 'John Doe',
      amount: 99.99,
      reason: 'Product defect',
      status: 'completed',
      requestedDate: new Date(Date.now() - 86400000).toISOString(),
      processedDate: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: 'REF-002',
      orderId: 'ORD-002',
      customerName: 'Jane Smith',
      amount: 149.99,
      reason: 'Wrong item received',
      status: 'pending',
      requestedDate: new Date(Date.now() - 3600000).toISOString(),
      processedDate: null,
    },
    {
      id: 'REF-003',
      orderId: 'ORD-003',
      customerName: 'Bob Johnson',
      amount: 79.99,
      reason: 'Customer request',
      status: 'completed',
      requestedDate: new Date(Date.now() - 172800000).toISOString(),
      processedDate: new Date(Date.now() - 129600000).toISOString(),
    },
  ]);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRefunds = refunds.filter((refund) =>
    statusFilter === 'all' || refund.status === statusFilter
  );

  const totalRefunds = filteredRefunds.reduce((sum, refund) => sum + refund.amount, 0);
  const completedRefunds = filteredRefunds.filter((r) => r.status === 'completed').length;
  const pendingRefunds = filteredRefunds.filter((r) => r.status === 'pending').length;

  const columns = [
    {
      key: 'id',
      label: 'Refund ID',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-800">{value}</span>,
    },
    {
      key: 'orderId',
      label: 'Order ID',
      sortable: true,
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => (
        <span className="font-bold text-red-600">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      sortable: false,
      render: (value) => <p className="text-sm text-gray-600 max-w-xs truncate">{value}</p>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'completed' ? 'success' : 'warning'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'requestedDate',
      label: 'Requested',
      sortable: true,
      render: (value) => formatDateTime(value),
    },
    {
      key: 'processedDate',
      label: 'Processed',
      sortable: true,
      render: (value) => value ? formatDateTime(value) : <span className="text-gray-400">Pending</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Refund Reports</h1>
        <p className="text-sm sm:text-base text-gray-600">Track refund requests and processing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Refunds</p>
            <FiDollarSign className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalRefunds)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completed</p>
            <FiRefreshCw className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{completedRefunds}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <FiRefreshCw className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingRefunds}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <ExportButton
            data={filteredRefunds}
            headers={[
              { label: 'Refund ID', accessor: (row) => row.id },
              { label: 'Order ID', accessor: (row) => row.orderId },
              { label: 'Customer', accessor: (row) => row.customerName },
              { label: 'Amount', accessor: (row) => formatCurrency(row.amount) },
              { label: 'Reason', accessor: (row) => row.reason },
              { label: 'Status', accessor: (row) => row.status },
            ]}
            filename="refund-report"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={filteredRefunds}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>
    </motion.div>
  );
};

export default RefundReports;

