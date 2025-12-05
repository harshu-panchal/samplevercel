import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiAlertTriangle, FiEdit, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { products as initialProducts } from '../../data/products';
import DataTable from '../../components/Admin/DataTable';
import ExportButton from '../../components/Admin/ExportButton';
import Badge from '../../components/Badge';
import { formatCurrency } from '../../utils/adminHelpers';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkUpdateValue, setBulkUpdateValue] = useState('');

  useEffect(() => {
    const savedProducts = localStorage.getItem('admin-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('admin-products', JSON.stringify(initialProducts));
    }
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Stock filter
    if (stockFilter === 'low_stock') {
      filtered = filtered.filter(
        (product) => product.stockQuantity <= lowStockThreshold
      );
    } else if (stockFilter === 'out_of_stock') {
      filtered = filtered.filter((product) => product.stockQuantity === 0);
    } else if (stockFilter === 'in_stock') {
      filtered = filtered.filter((product) => product.stockQuantity > lowStockThreshold);
    }

    return filtered;
  }, [products, searchQuery, stockFilter, lowStockThreshold]);

  // Low stock products count
  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stockQuantity <= lowStockThreshold && p.stockQuantity > 0)
      .length;
  }, [products, lowStockThreshold]);

  // Out of stock products count
  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stockQuantity === 0).length;
  }, [products]);

  const handleStockUpdate = (productId, newQuantity) => {
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        const oldQuantity = p.stockQuantity;
        const newStockStatus =
          newQuantity === 0
            ? 'out_of_stock'
            : newQuantity <= lowStockThreshold
            ? 'low_stock'
            : 'in_stock';
        return {
          ...p,
          stockQuantity: parseInt(newQuantity),
          stock: newStockStatus,
          stockHistory: [
            ...(p.stockHistory || []),
            {
              date: new Date().toISOString(),
              oldQuantity,
              newQuantity: parseInt(newQuantity),
              change: parseInt(newQuantity) - oldQuantity,
            },
          ].slice(-50), // Keep last 50 entries
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('admin-products', JSON.stringify(updatedProducts));
    toast.success('Stock updated successfully');
  };

  const handleBulkUpdate = () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to update');
      return;
    }
    if (!bulkUpdateValue || isNaN(bulkUpdateValue)) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const updatedProducts = products.map((p) => {
      if (selectedProducts.includes(p.id)) {
        const oldQuantity = p.stockQuantity;
        const newQuantity = parseInt(bulkUpdateValue);
        const newStockStatus =
          newQuantity === 0
            ? 'out_of_stock'
            : newQuantity <= lowStockThreshold
            ? 'low_stock'
            : 'in_stock';
        return {
          ...p,
          stockQuantity: newQuantity,
          stock: newStockStatus,
          stockHistory: [
            ...(p.stockHistory || []),
            {
              date: new Date().toISOString(),
              oldQuantity,
              newQuantity,
              change: newQuantity - oldQuantity,
            },
          ].slice(-50),
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('admin-products', JSON.stringify(updatedProducts));
    toast.success(`${selectedProducts.length} products updated successfully`);
    setSelectedProducts([]);
    setBulkUpdateValue('');
  };

  // Table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt={value}
            className="w-10 h-10 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/50x50?text=Product';
            }}
          />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'stockQuantity',
      label: 'Current Stock',
      sortable: true,
      render: (value, row) => {
        const isLow = value <= lowStockThreshold;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isLow ? 'text-orange-600' : 'text-gray-800'}`}>
              {value}
            </span>
            {isLow && <FiAlertTriangle className="text-orange-600" />}
          </div>
        );
      },
    },
    {
      key: 'stock',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge
          variant={
            value === 'in_stock'
              ? 'success'
              : value === 'low_stock'
              ? 'warning'
              : 'error'
          }
        >
          {value.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => formatCurrency(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => {
            const newQuantity = prompt(`Update stock for ${row.name}:`, row.stockQuantity);
            if (newQuantity !== null && !isNaN(newQuantity)) {
              handleStockUpdate(row.id, newQuantity);
            }
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Update Stock"
        >
          <FiEdit />
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Monitor and manage product stock levels</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiRefreshCw className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="text-red-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Low Stock Threshold */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Low Stock Threshold:
            </label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
              min="1"
              className="w-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Export Button */}
          <ExportButton
            data={filteredProducts}
            headers={[
              { label: 'ID', accessor: (row) => row.id },
              { label: 'Name', accessor: (row) => row.name },
              { label: 'Stock', accessor: (row) => row.stockQuantity },
              { label: 'Status', accessor: (row) => row.stock },
              { label: 'Price', accessor: (row) => formatCurrency(row.price) },
            ]}
            filename="inventory"
          />
        </div>

        {/* Bulk Update */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-primary-700">
                {selectedProducts.length} product(s) selected
              </span>
              <input
                type="number"
                value={bulkUpdateValue}
                onChange={(e) => setBulkUpdateValue(e.target.value)}
                placeholder="New stock quantity"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleBulkUpdate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm"
              >
                Update Stock
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <DataTable
          data={filteredProducts}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>
    </motion.div>
  );
};

export default Inventory;

