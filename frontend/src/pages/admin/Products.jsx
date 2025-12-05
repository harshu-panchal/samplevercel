import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiFilter,
  FiX,
  FiUpload,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import DataTable from "../../components/Admin/DataTable";
import ExportButton from "../../components/Admin/ExportButton";
import Badge from "../../components/Badge";
import ConfirmModal from "../../components/Admin/ConfirmModal";
import { formatCurrency, generateCSV } from "../../utils/adminHelpers";
import { formatPrice } from "../../utils/helpers";
import { products as initialProducts } from "../../data/products";
import { useCategoryStore } from "../../store/categoryStore";
import { useBrandStore } from "../../store/brandStore";
import toast from "react-hot-toast";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { categories, initialize: initCategories } = useCategoryStore();
  const { brands, initialize: initBrands } = useBrandStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    isBulk: false,
  });
  const itemsPerPage = 10;

  // Load products from localStorage or use initial products
  useEffect(() => {
    initCategories();
    initBrands();
    const savedProducts = localStorage.getItem("admin-products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem("admin-products", JSON.stringify(initialProducts));
    }
  }, []);

  // Save products to localStorage when they change
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem("admin-products", JSON.stringify(newProducts));
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((product) => product.stock === selectedStatus);
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryId === parseInt(selectedCategory)
      );
    }

    // Brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter(
        (product) => product.brandId === parseInt(selectedBrand)
      );
    }

    return filtered;
  }, [products, searchQuery, selectedStatus, selectedCategory, selectedBrand]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedCategory, selectedBrand]);

  // Pagination for mobile cards
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Table columns
  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt={value}
            className="w-10 h-10 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50x50?text=Product";
            }}
          />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value) => formatPrice(value),
    },
    {
      key: "stockQuantity",
      label: "Stock",
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: "stock",
      label: "Status",
      sortable: true,
      render: (value) => (
        <Badge
          variant={
            value === "in_stock"
              ? "success"
              : value === "low_stock"
              ? "warning"
              : "error"
          }>
          {value.replace("_", " ").toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/${row.id}`);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <FiEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, productId: id, isBulk: false });
  };

  const confirmDelete = () => {
    if (deleteModal.isBulk) {
      if (selectedProducts.length === 0) {
        toast.error("Please select products to delete");
        return;
      }
      const newProducts = products.filter(
        (p) => !selectedProducts.includes(p.id)
      );
      saveProducts(newProducts);
      setSelectedProducts([]);
      toast.success("Products deleted successfully");
    } else {
      const newProducts = products.filter(
        (p) => p.id !== deleteModal.productId
      );
      saveProducts(newProducts);
      toast.success("Product deleted successfully");
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products to delete");
      return;
    }
    setDeleteModal({ isOpen: true, productId: null, isBulk: true });
  };

  const handleBulkImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csv = event.target.result;
          const lines = csv.split("\n");
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));

          // Simple CSV parser - in production, use a proper CSV library
          const importedProducts = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i]
              .split(",")
              .map((v) => v.trim().replace(/"/g, ""));
            if (values.length < headers.length) continue;

            const product = {};
            headers.forEach((header, index) => {
              product[header] = values[index];
            });

            if (product.name && product.price) {
              importedProducts.push({
                ...product,
                id:
                  Math.max(...products.map((p) => p.id), 0) +
                  importedProducts.length +
                  1,
                price: parseFloat(product.price) || 0,
                stockQuantity: parseInt(product.stockQuantity) || 0,
                rating: 0,
                reviewCount: 0,
              });
            }
          }

          if (importedProducts.length > 0) {
            const newProducts = [...products, ...importedProducts];
            saveProducts(newProducts);
            toast.success(
              `${importedProducts.length} products imported successfully`
            );
          } else {
            toast.error("No valid products found in CSV");
          }
        } catch (error) {
          toast.error("Failed to import products: " + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = () => {
    const headers = [
      { label: "ID", accessor: (row) => row.id },
      { label: "Name", accessor: (row) => row.name },
      { label: "Price", accessor: (row) => formatCurrency(row.price) },
      { label: "Stock", accessor: (row) => row.stockQuantity },
      { label: "Status", accessor: (row) => row.stock },
    ];
    // Export handled by ExportButton component
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Products
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-2 sm:mt-0">
          <button
            onClick={handleBulkImport}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-xs sm:text-sm flex-1 sm:flex-initial"
            title="Import Products (CSV)">
            <FiUpload className="text-sm sm:text-base" />
            <span>Import</span>
          </button>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold text-xs sm:text-sm flex-1 sm:flex-initial">
            <FiPlus className="text-sm sm:text-base" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-3 sm:hidden">
          <span className="text-sm font-semibold text-gray-700">Filters</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
            <FiFilter className="text-base" />
            <span>{showFilters ? "Hide" : "Show"}</span>
          </button>
        </div>

        {/* Filter Content */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } sm:block space-y-3 sm:space-y-0`}>
          {/* Search */}
          <div className="relative w-full sm:flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filters Row - Desktop */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0">
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0">
              <option value="all">All Categories</option>
              {categories
                .filter((cat) => cat.isActive !== false)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0">
              <option value="all">All Brands</option>
              {brands
                .filter((brand) => brand.isActive !== false)
                .map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
            </select>

            {/* Export Button */}
            <ExportButton
              data={filteredProducts}
              headers={[
                { label: "ID", accessor: (row) => row.id },
                { label: "Name", accessor: (row) => row.name },
                {
                  label: "Price",
                  accessor: (row) => formatCurrency(row.price),
                },
                { label: "Stock", accessor: (row) => row.stockQuantity },
                { label: "Status", accessor: (row) => row.stock },
              ]}
              filename="products"
            />
          </div>

          {/* Filters Stack - Mobile */}
          <div className="sm:hidden space-y-2 mt-3">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">All Categories</option>
              {categories
                .filter((cat) => cat.isActive !== false)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">All Brands</option>
              {brands
                .filter((brand) => brand.isActive !== false)
                .map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
            </select>

            {/* Export Button */}
            <div className="pt-1">
              <ExportButton
                data={filteredProducts}
                headers={[
                  { label: "ID", accessor: (row) => row.id },
                  { label: "Name", accessor: (row) => row.name },
                  {
                    label: "Price",
                    accessor: (row) => formatCurrency(row.price),
                  },
                  { label: "Stock", accessor: (row) => row.stockQuantity },
                  { label: "Status", accessor: (row) => row.stock },
                ]}
                filename="products"
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-3 sm:mt-4 p-3 bg-primary-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-semibold text-primary-700">
              {selectedProducts.length} product(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-xs sm:text-sm">
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden lg:block">
        <DataTable
          data={filteredProducts}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
          onRowClick={(row) => navigate(`/admin/products/${row.id}`)}
        />
      </div>

      {/* Products Cards - Mobile */}
      <div className="lg:hidden">
        {paginatedProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100x100?text=Product";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {product.id}
                          </p>
                        </div>
                        <Badge
                          variant={
                            product.stock === "in_stock"
                              ? "success"
                              : product.stock === "low_stock"
                              ? "warning"
                              : "error"
                          }>
                          {product.stock.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <p className="text-lg font-bold text-gray-800">
                            {formatPrice(product.price)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Stock: {product.stockQuantity.toLocaleString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/products/${product.id}`);
                            }}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="Edit product">
                            <FiEdit className="text-lg" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product.id);
                            }}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete product">
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination - Mobile */}
            {totalPages > 1 && (
              <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredProducts.length
                    )}{" "}
                    of {filteredProducts.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <FiChevronLeft />
                    </button>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                        let page;
                        if (totalPages <= 5) {
                          page = index + 1;
                        } else if (currentPage <= 3) {
                          page = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + index;
                        } else {
                          page = currentPage - 2 + index;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              currentPage === page
                                ? "bg-primary-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}>
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, productId: null, isBulk: false })
        }
        onConfirm={confirmDelete}
        title={
          deleteModal.isBulk ? "Delete Multiple Products?" : "Delete Product?"
        }
        message={
          deleteModal.isBulk
            ? `Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`
            : "Are you sure you want to delete this product? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
};

export default Products;
