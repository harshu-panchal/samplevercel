import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiEyeOff, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useBrandStore } from '../../store/brandStore';
import BrandForm from '../../components/Admin/Brands/BrandForm';
import ExportButton from '../../components/Admin/ExportButton';
import Badge from '../../components/Badge';
import toast from 'react-hot-toast';

const Brands = () => {
  const {
    brands,
    initialize,
    deleteBrand,
    bulkDeleteBrands,
    toggleBrandStatus,
  } = useBrandStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  // Filtered brands
  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      !searchQuery ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (brand.description &&
        brand.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && brand.isActive) ||
      (selectedStatus === 'inactive' && !brand.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      deleteBrand(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedBrands.length === 0) {
      toast.error('Please select brands to delete');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedBrands.length} brands?`
      )
    ) {
      bulkDeleteBrands(selectedBrands);
      setSelectedBrands([]);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  const handleFormSave = () => {
    // Brands will be refreshed automatically
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 lg:hidden">Brands</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold text-sm sm:text-base flex-shrink-0"
          >
            <FiPlus className="text-base sm:text-lg" />
            <span className="hidden xs:inline sm:inline">Add Brand</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 lg:hidden">Manage your product brands</p>
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
              placeholder="Search brands..."
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

            {/* Export Button */}
            <ExportButton
              data={filteredBrands}
              headers={[
                { label: 'ID', accessor: (row) => row.id },
                { label: 'Name', accessor: (row) => row.name },
                { label: 'Description', accessor: (row) => row.description || '' },
                { label: 'Website', accessor: (row) => row.website || '' },
                { label: 'Status', accessor: (row) => (row.isActive ? 'Active' : 'Inactive') },
              ]}
              filename="brands"
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

            {/* Export Button */}
            <div className="pt-1">
              <ExportButton
                data={filteredBrands}
                headers={[
                  { label: 'ID', accessor: (row) => row.id },
                  { label: 'Name', accessor: (row) => row.name },
                  { label: 'Description', accessor: (row) => row.description || '' },
                  { label: 'Website', accessor: (row) => row.website || '' },
                  { label: 'Status', accessor: (row) => (row.isActive ? 'Active' : 'Inactive') },
                ]}
                filename="brands"
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBrands.length > 0 && (
          <div className="mt-3 sm:mt-4 p-3 bg-primary-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-semibold text-primary-700">
              {selectedBrands.length} brand(s) selected
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

      {/* Brands Grid */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
        {filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand.id]);
                      } else {
                        setSelectedBrands(
                          selectedBrands.filter((id) => id !== brand.id)
                        );
                      }
                    }}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <Badge variant={brand.isActive ? 'success' : 'error'}>
                    <span className="text-[10px] sm:text-xs">{brand.isActive ? 'Active' : 'Inactive'}</span>
                  </Badge>
                </div>

                {brand.logo && (
                  <div className="mb-3 sm:mb-4 flex justify-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-12 sm:h-20 w-auto object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">{brand.name}</h3>
                {brand.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                    {brand.description}
                  </p>
                )}
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] sm:text-xs text-primary-600 hover:underline mb-2 sm:mb-3 block truncate"
                  >
                    {brand.website}
                  </a>
                )}

                <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toggleBrandStatus(brand.id)}
                    className="flex-1 p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm"
                    title={brand.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {brand.isActive ? <FiEyeOff className="text-sm sm:text-base" /> : <FiEye className="text-sm sm:text-base" />}
                  </button>
                  <button
                    onClick={() => handleEdit(brand)}
                    className="flex-1 p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    <FiEdit className="text-sm sm:text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="flex-1 p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    <FiTrash2 className="text-sm sm:text-base" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand Form Modal */}
      {showForm && (
        <BrandForm
          brand={editingBrand}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </motion.div>
  );
};

export default Brands;

