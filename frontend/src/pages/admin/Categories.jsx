import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiTrash2, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCategoryStore } from '../../store/categoryStore';
import CategoryForm from '../../components/Admin/Categories/CategoryForm';
import CategoryTree from '../../components/Admin/Categories/CategoryTree';
import ExportButton from '../../components/Admin/ExportButton';
import { formatCurrency } from '../../utils/adminHelpers';
import toast from 'react-hot-toast';

const Categories = () => {
  const {
    categories,
    initialize,
    deleteCategory,
    bulkDeleteCategories,
    getCategories,
  } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  // Filtered categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      !searchQuery ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && category.isActive) ||
      (selectedStatus === 'inactive' && !category.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select categories to delete');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedCategories.length} categories?`
      )
    ) {
      bulkDeleteCategories(selectedCategories);
      setSelectedCategories([]);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormSave = () => {
    // Categories will be refreshed automatically
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-3 sm:space-y-0">
        {/* Title and Button Row */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 lg:hidden">Categories</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold text-sm sm:text-base flex-shrink-0"
          >
            <FiPlus className="text-base sm:text-lg" />
            <span className="hidden xs:inline sm:inline">Add Category</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 lg:hidden">Manage your product categories</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-3 sm:hidden">
          <span className="text-sm font-semibold text-gray-700">Filters</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            <FiFilter className="text-base" />
            <span>{showFilters ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        {/* Filter Content */}
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block space-y-3 sm:space-y-0`}>
          {/* Search */}
          <div className="relative w-full sm:flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filters Row - Desktop */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Tree View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                List View
              </button>
            </div>

            {/* Export Button */}
            <ExportButton
              data={filteredCategories}
              headers={[
                { label: 'ID', accessor: (row) => row.id },
                { label: 'Name', accessor: (row) => row.name },
                { label: 'Description', accessor: (row) => row.description || '' },
                { label: 'Status', accessor: (row) => (row.isActive ? 'Active' : 'Inactive') },
                { label: 'Parent ID', accessor: (row) => row.parentId || 'None' },
              ]}
              filename="categories"
            />
          </div>

          {/* Filters Stack - Mobile */}
          <div className="sm:hidden space-y-2 mt-3">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Tree View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                List View
              </button>
            </div>

            {/* Export Button */}
            <div className="pt-1">
              <ExportButton
                data={filteredCategories}
                headers={[
                  { label: 'ID', accessor: (row) => row.id },
                  { label: 'Name', accessor: (row) => row.name },
                  { label: 'Description', accessor: (row) => row.description || '' },
                  { label: 'Status', accessor: (row) => (row.isActive ? 'Active' : 'Inactive') },
                  { label: 'Parent ID', accessor: (row) => row.parentId || 'None' },
                ]}
                filename="categories"
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCategories.length > 0 && (
          <div className="mt-3 sm:mt-4 p-3 bg-primary-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-semibold text-primary-700">
              {selectedCategories.length} category(ies) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-xs sm:text-sm"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Categories Display */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : viewMode === 'tree' ? (
          <CategoryTree
            categories={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="space-y-2">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category.id]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((id) => id !== category.id)
                      );
                    }
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-10 h-10 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{category.name}</p>
                  {category.description && (
                    <p className="text-xs text-gray-500">{category.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiSearch className="text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </motion.div>
  );
};

export default Categories;

