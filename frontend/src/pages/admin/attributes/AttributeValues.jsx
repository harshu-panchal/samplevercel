import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '../../../components/Admin/DataTable';
import ConfirmModal from '../../../components/Admin/ConfirmModal';
import toast from 'react-hot-toast';

const AttributeValues = () => {
  const [attributeValues, setAttributeValues] = useState([
    { id: 1, attributeId: 1, attributeName: 'Color', value: 'Red', displayOrder: 1, status: 'active' },
    { id: 2, attributeId: 1, attributeName: 'Color', value: 'Blue', displayOrder: 2, status: 'active' },
    { id: 3, attributeId: 1, attributeName: 'Color', value: 'Green', displayOrder: 3, status: 'active' },
    { id: 4, attributeId: 2, attributeName: 'Size', value: 'S', displayOrder: 1, status: 'active' },
    { id: 5, attributeId: 2, attributeName: 'Size', value: 'M', displayOrder: 2, status: 'active' },
    { id: 6, attributeId: 2, attributeName: 'Size', value: 'L', displayOrder: 3, status: 'active' },
  ]);
  const [editingValue, setEditingValue] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [attributeFilter, setAttributeFilter] = useState('all');

  const filteredValues = attributeValues.filter((val) => {
    const matchesSearch = !searchQuery || val.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAttribute = attributeFilter === 'all' || val.attributeId.toString() === attributeFilter;
    return matchesSearch && matchesAttribute;
  });

  const uniqueAttributes = [...new Set(attributeValues.map((v) => ({ id: v.attributeId, name: v.attributeName })))];

  const handleSave = (valueData) => {
    if (editingValue && editingValue.id) {
      setAttributeValues(attributeValues.map((v) => (v.id === editingValue.id ? { ...valueData, id: editingValue.id } : v)));
      toast.success('Attribute value updated');
    } else {
      setAttributeValues([...attributeValues, { ...valueData, id: attributeValues.length + 1 }]);
      toast.success('Attribute value added');
    }
    setEditingValue(null);
  };

  const handleDelete = () => {
    setAttributeValues(attributeValues.filter((v) => v.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: null });
    toast.success('Attribute value deleted');
  };

  const columns = [
    {
      key: 'attributeName',
      label: 'Attribute',
      sortable: true,
      render: (value) => <span className="font-medium text-gray-800">{value}</span>,
    },
    {
      key: 'value',
      label: 'Value',
      sortable: true,
      render: (value) => <span className="text-gray-700">{value}</span>,
    },
    {
      key: 'displayOrder',
      label: 'Order',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingValue(row)}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Attribute Values</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage values for product attributes</p>
        </div>
        <button
          onClick={() => setEditingValue({})}
          className="flex items-center gap-2 px-4 py-2 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold text-sm"
        >
          <FiPlus />
          <span>Add Value</span>
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
              placeholder="Search values..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={attributeFilter}
            onChange={(e) => setAttributeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Attributes</option>
            {uniqueAttributes.map((attr) => (
              <option key={attr.id} value={attr.id.toString()}>
                {attr.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={filteredValues}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {editingValue !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingValue.id ? 'Edit Attribute Value' : 'Add Attribute Value'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSave({
                  attributeId: parseInt(formData.get('attributeId')),
                  attributeName: formData.get('attributeName'),
                  value: formData.get('value'),
                  displayOrder: parseInt(formData.get('displayOrder')),
                  status: formData.get('status'),
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attribute ID</label>
                <input
                  type="number"
                  name="attributeId"
                  defaultValue={editingValue.attributeId || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attribute Name</label>
                <input
                  type="text"
                  name="attributeName"
                  defaultValue={editingValue.attributeName || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  name="value"
                  defaultValue={editingValue.value || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    defaultValue={editingValue.displayOrder || 1}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingValue.status || 'active'}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingValue(null)}
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
        title="Delete Attribute Value?"
        message="Are you sure you want to delete this attribute value? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default AttributeValues;

