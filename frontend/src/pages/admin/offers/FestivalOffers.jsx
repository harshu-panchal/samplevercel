import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '../../../components/Admin/DataTable';
import Badge from '../../../components/Badge';
import ConfirmModal from '../../../components/Admin/ConfirmModal';
import { formatDateTime } from '../../../utils/adminHelpers';
import toast from 'react-hot-toast';

const FestivalOffers = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Diwali Sale',
      discount: 30,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
    {
      id: 2,
      title: 'Christmas Special',
      discount: 25,
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
    },
  ]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const handleSave = (offerData) => {
    if (editingOffer && editingOffer.id) {
      setOffers(offers.map((o) => (o.id === editingOffer.id ? { ...offerData, id: editingOffer.id } : o)));
      toast.success('Offer updated');
    } else {
      setOffers([...offers, { ...offerData, id: offers.length + 1 }]);
      toast.success('Offer added');
    }
    setEditingOffer(null);
  };

  const handleDelete = () => {
    setOffers(offers.filter((o) => o.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: null });
    toast.success('Offer deleted');
  };

  const columns = [
    {
      key: 'title',
      label: 'Offer Title',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <FiTag className="text-primary-600" />
          <span className="font-semibold text-gray-800">{value}</span>
        </div>
      ),
    },
    {
      key: 'discount',
      label: 'Discount',
      sortable: true,
      render: (value) => (
        <span className="font-bold text-green-600">{value}%</span>
      ),
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (value) => formatDateTime(value),
    },
    {
      key: 'endDate',
      label: 'End Date',
      sortable: true,
      render: (value) => formatDateTime(value),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : value === 'upcoming' ? 'warning' : 'error'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingOffer(row)}
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
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Festival Offers</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage seasonal and festival offers</p>
        </div>
        <button
          onClick={() => setEditingOffer({})}
          className="flex items-center gap-2 px-4 py-2 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold text-sm"
        >
          <FiPlus />
          <span>Add Offer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={offers}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {editingOffer !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingOffer.id ? 'Edit Offer' : 'Add Offer'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSave({
                  title: formData.get('title'),
                  discount: parseInt(formData.get('discount')),
                  startDate: formData.get('startDate'),
                  endDate: formData.get('endDate'),
                  status: formData.get('status'),
                });
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="title"
                defaultValue={editingOffer.title || ''}
                placeholder="Offer Title"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                name="discount"
                defaultValue={editingOffer.discount || ''}
                placeholder="Discount (%)"
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  defaultValue={editingOffer.startDate ? new Date(editingOffer.startDate).toISOString().slice(0, 16) : ''}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  defaultValue={editingOffer.endDate ? new Date(editingOffer.endDate).toISOString().slice(0, 16) : ''}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                name="status"
                defaultValue={editingOffer.status || 'active'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
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
                  onClick={() => setEditingOffer(null)}
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
        title="Delete Offer?"
        message="Are you sure you want to delete this offer? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default FestivalOffers;

