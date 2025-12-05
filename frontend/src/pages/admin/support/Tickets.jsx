import { useState } from 'react';
import { FiSearch, FiEye, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '../../../components/Admin/DataTable';
import Badge from '../../../components/Badge';
import { formatDateTime } from '../../../utils/adminHelpers';

const Tickets = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      customerName: 'John Doe',
      type: 'Technical Support',
      subject: 'Unable to place order',
      status: 'open',
      priority: 'high',
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
    },
    {
      id: 'TKT-002',
      customerName: 'Jane Smith',
      type: 'Billing Inquiry',
      subject: 'Payment not processed',
      status: 'in_progress',
      priority: 'medium',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      lastUpdate: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'TKT-003',
      customerName: 'Bob Johnson',
      type: 'Product Inquiry',
      subject: 'Product availability',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      lastUpdate: new Date(Date.now() - 43200000).toISOString(),
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      !searchQuery ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      open: 'error',
      in_progress: 'warning',
      resolved: 'success',
      closed: 'default',
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'id',
      label: 'Ticket ID',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-800">{value}</span>,
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: false,
      render: (value) => <p className="text-sm text-gray-800 max-w-xs truncate">{value}</p>,
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <Badge variant={getStatusColor(value)}>{value.replace('_', ' ')}</Badge>,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => formatDateTime(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => setSelectedTicket(row)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <FiEye />
        </button>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="lg:hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Support Tickets</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage customer support tickets</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={filteredTickets}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Ticket Details</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Ticket ID</p>
                <p className="font-semibold text-gray-800">{selectedTicket.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-gray-800">{selectedTicket.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold text-gray-800">{selectedTicket.subject}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold text-gray-800">{selectedTicket.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Tickets;

