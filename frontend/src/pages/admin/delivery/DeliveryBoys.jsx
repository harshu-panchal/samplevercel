import { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiMapPin, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '../../../components/Admin/DataTable';
import Badge from '../../../components/Badge';
import ConfirmModal from '../../../components/Admin/ConfirmModal';
import toast from 'react-hot-toast';

const DeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      vehicleType: 'Bike',
      vehicleNumber: 'BIKE-123',
      status: 'active',
      totalDeliveries: 150,
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '+1234567891',
      email: 'jane@example.com',
      vehicleType: 'Car',
      vehicleNumber: 'CAR-456',
      status: 'active',
      totalDeliveries: 200,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      phone: '+1234567892',
      email: 'bob@example.com',
      vehicleType: 'Bike',
      vehicleNumber: 'BIKE-789',
      status: 'inactive',
      totalDeliveries: 75,
      rating: 4.2,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBoy, setEditingBoy] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const filteredBoys = deliveryBoys.filter((boy) => {
    const matchesSearch =
      !searchQuery ||
      boy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boy.phone.includes(searchQuery) ||
      boy.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || boy.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSave = (boyData) => {
    if (editingBoy && editingBoy.id) {
      setDeliveryBoys(deliveryBoys.map((b) => (b.id === editingBoy.id ? { ...boyData, id: editingBoy.id } : b)));
      toast.success('Delivery boy updated');
    } else {
      setDeliveryBoys([...deliveryBoys, { ...boyData, id: deliveryBoys.length + 1 }]);
      toast.success('Delivery boy added');
    }
    setEditingBoy(null);
  };

  const handleDelete = () => {
    setDeliveryBoys(deliveryBoys.filter((b) => b.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: null });
    toast.success('Delivery boy deleted');
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-semibold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FiPhone className="text-xs" />
            {row.phone}
          </p>
        </div>
      ),
    },
    {
      key: 'vehicleType',
      label: 'Vehicle',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{row.vehicleNumber}</p>
        </div>
      ),
    },
    {
      key: 'totalDeliveries',
      label: 'Deliveries',
      sortable: true,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-800">{value} ⭐</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <Badge variant={value === 'active' ? 'success' : 'error'}>{value}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingBoy(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, id: row.id })}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Delivery Boys</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage delivery personnel</p>
        </div>
        <button
          onClick={() => setEditingBoy({})}
          className="flex items-center gap-2 px-4 py-2 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold text-sm"
        >
          <FiPlus />
          <span>Add Delivery Boy</span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={filteredBoys}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {editingBoy !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingBoy.id ? 'Edit Delivery Boy' : 'Add Delivery Boy'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSave({
                  name: formData.get('name'),
                  phone: formData.get('phone'),
                  email: formData.get('email'),
                  vehicleType: formData.get('vehicleType'),
                  vehicleNumber: formData.get('vehicleNumber'),
                  status: formData.get('status'),
                  totalDeliveries: parseInt(formData.get('totalDeliveries') || '0'),
                  rating: parseFloat(formData.get('rating') || '0'),
                });
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                defaultValue={editingBoy.name || ''}
                placeholder="Name"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="tel"
                name="phone"
                defaultValue={editingBoy.phone || ''}
                placeholder="Phone"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="email"
                name="email"
                defaultValue={editingBoy.email || ''}
                placeholder="Email"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                name="vehicleType"
                defaultValue={editingBoy.vehicleType || 'Bike'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Scooter">Scooter</option>
              </select>
              <input
                type="text"
                name="vehicleNumber"
                defaultValue={editingBoy.vehicleNumber || ''}
                placeholder="Vehicle Number"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                name="status"
                defaultValue={editingBoy.status || 'active'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBoy(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Delivery Boy?"
        message="Are you sure you want to delete this delivery boy? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default DeliveryBoys;

