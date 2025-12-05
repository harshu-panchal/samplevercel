import { useState, useEffect } from 'react';
import { FiStar, FiSearch, FiEye, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '../../../components/Admin/DataTable';
import Badge from '../../../components/Badge';
import { formatDateTime } from '../../../utils/adminHelpers';

const ProductRatings = () => {
  const [ratings, setRatings] = useState([
    {
      id: 1,
      productId: 1,
      productName: 'Sample Product',
      customerName: 'John Doe',
      rating: 5,
      review: 'Great product! Highly recommended.',
      date: new Date().toISOString(),
      status: 'approved',
    },
    {
      id: 2,
      productId: 2,
      productName: 'Another Product',
      customerName: 'Jane Smith',
      rating: 4,
      review: 'Good quality, fast shipping.',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'pending',
    },
    {
      id: 3,
      productId: 3,
      productName: 'Third Product',
      customerName: 'Bob Johnson',
      rating: 3,
      review: 'Average product, could be better.',
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'approved',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRating, setSelectedRating] = useState(null);

  const filteredRatings = ratings.filter((rating) => {
    const matchesSearch =
      !searchQuery ||
      rating.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.review.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || rating.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setRatings(ratings.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const columns = [
    {
      key: 'productName',
      label: 'Product',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">ID: {row.productId}</p>
        </div>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => renderStars(value),
    },
    {
      key: 'review',
      label: 'Review',
      sortable: false,
      render: (value) => (
        <p className="max-w-xs truncate text-sm text-gray-600">{value}</p>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => formatDateTime(value),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, row) => (
        <select
          value={value}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
            value === 'approved'
              ? 'bg-green-100 text-green-800 border-green-200'
              : value === 'pending'
              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
              : 'bg-red-100 text-red-800 border-red-200'
          }`}
        >
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRating(row);
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Product Ratings</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage customer reviews and ratings</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, customer, or review..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={filteredRatings}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {/* Rating Detail Modal */}
      {selectedRating && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRating(null)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Rating Details</h3>
              <button
                onClick={() => setSelectedRating(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-xl text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Product</label>
                <p className="text-base text-gray-800 mt-1">{selectedRating.productName}</p>
                <p className="text-sm text-gray-500">ID: {selectedRating.productId}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Customer</label>
                <p className="text-base text-gray-800 mt-1">{selectedRating.customerName}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Rating</label>
                <div className="mt-1">
                  {renderStars(selectedRating.rating)}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Review</label>
                <p className="text-base text-gray-800 mt-1 whitespace-pre-wrap">
                  {selectedRating.review}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Date</label>
                <p className="text-base text-gray-800 mt-1">
                  {formatDateTime(selectedRating.date)}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <div className="mt-1">
                  <select
                    value={selectedRating.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      handleStatusChange(selectedRating.id, newStatus);
                      setSelectedRating({ ...selectedRating, status: newStatus });
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      selectedRating.status === 'approved'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : selectedRating.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedRating(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductRatings;

