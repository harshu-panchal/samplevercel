import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DataTable from '../../../components/Admin/DataTable';
import ConfirmModal from '../../../components/Admin/ConfirmModal';
import toast from 'react-hot-toast';

const Attributes = () => {
  const [attributes, setAttributes] = useState([
    { id: 1, name: 'Color', type: 'select', required: true, status: 'active' },
    { id: 2, name: 'Size', type: 'select', required: true, status: 'active' },
    { id: 3, name: 'Material', type: 'select', required: false, status: 'active' },
    { id: 4, name: 'Weight', type: 'text', required: false, status: 'active' },
  ]);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const handleSave = (attrData) => {
    if (editingAttribute && editingAttribute.id) {
      setAttributes(attributes.map((a) => (a.id === editingAttribute.id ? { ...attrData, id: editingAttribute.id } : a)));
      toast.success('Attribute updated');
    } else {
      setAttributes([...attributes, { ...attrData, id: attributes.length + 1 }]);
      toast.success('Attribute added');
    }
    setEditingAttribute(null);
  };

  const handleDelete = () => {
    setAttributes(attributes.filter((a) => a.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: null });
    toast.success('Attribute deleted');
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-800">{value}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      key: 'required',
      label: 'Required',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
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
            onClick={() => setEditingAttribute(row)}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Attributes</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage product attributes</p>
        </div>
        <button
          onClick={() => setEditingAttribute({})}
          className="flex items-center gap-2 px-4 py-2 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold text-sm"
        >
          <FiPlus />
          <span>Add Attribute</span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={attributes}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {editingAttribute !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingAttribute.id ? 'Edit Attribute' : 'Add Attribute'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSave({
                  name: formData.get('name'),
                  type: formData.get('type'),
                  required: formData.get('required') === 'true',
                  status: formData.get('status'),
                });
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                defaultValue={editingAttribute.name || ''}
                placeholder="Attribute Name"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                name="type"
                defaultValue={editingAttribute.type || 'select'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="select">Select</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <select
                name="required"
                defaultValue={editingAttribute.required ? 'true' : 'false'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="false">Optional</option>
                <option value="true">Required</option>
              </select>
              <select
                name="status"
                defaultValue={editingAttribute.status || 'active'}
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
                  onClick={() => setEditingAttribute(null)}
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
        title="Delete Attribute?"
        message="Are you sure you want to delete this attribute? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default Attributes;

