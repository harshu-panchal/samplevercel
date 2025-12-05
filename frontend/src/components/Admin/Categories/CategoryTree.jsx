import { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { useCategoryStore } from '../../../store/categoryStore';
import Badge from '../../Badge';
import toast from 'react-hot-toast';

const CategoryTree = ({ categories, onEdit, onDelete, level = 0 }) => {
  const { toggleCategoryStatus } = useCategoryStore();
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getChildren = (parentId) => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  const renderCategory = (category) => {
    const children = getChildren(category.id);
    const hasChildren = children.length > 0;
    const isExpanded = expanded[category.id];

    return (
      <div key={category.id} className="select-none">
        {/* Mobile Card Design */}
        <div className="sm:hidden">
          <div
            className={`bg-white border border-gray-200 rounded-2xl p-3.5 mb-2.5 shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${
              level > 0 ? 'ml-3' : ''
            }`}
          >
            {/* Header Section - Image, Name, Badge, Expand */}
            <div className="flex items-start gap-3 mb-3">
              {/* Expand Button */}
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="flex-shrink-0 p-1.5 -ml-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isExpanded ? (
                    <FiChevronDown className="text-gray-500 text-base" />
                  ) : (
                    <FiChevronRight className="text-gray-500 text-base" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-6" />}

              {/* Category Image */}
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-gray-100"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 border border-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-semibold">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1">
                    {category.name}
                  </h3>
                  <Badge 
                    variant={category.isActive ? 'success' : 'error'} 
                    className="flex-shrink-0 text-[10px] px-2 py-0.5"
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {category.description && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons - Horizontal Layout */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => toggleCategoryStatus(category.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                title={category.isActive ? 'Deactivate' : 'Activate'}
              >
                {category.isActive ? <FiEye className="text-sm" /> : <FiEyeOff className="text-sm" />}
                <span>{category.isActive ? 'Hide' : 'Show'}</span>
              </button>
              <button
                onClick={() => onEdit(category)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors active:scale-95"
                title="Edit"
              >
                <FiEdit className="text-sm" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(category.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors active:scale-95"
                title="Delete"
              >
                <FiTrash2 className="text-sm" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Design */}
        <div
          className={`hidden sm:flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
            level > 0 ? 'ml-6' : ''
          }`}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <FiChevronDown className="text-gray-600" />
              ) : (
                <FiChevronRight className="text-gray-600" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          <div className="flex-1 flex items-center gap-3">
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
            <Badge variant={category.isActive ? 'success' : 'error'}>
              {category.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleCategoryStatus(category.id)}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title={category.isActive ? 'Deactivate' : 'Activate'}
              >
                {category.isActive ? <FiEye /> : <FiEyeOff />}
              </button>
              <button
                onClick={() => onEdit(category)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => onDelete(category.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>

        {/* Children - Mobile */}
        {hasChildren && isExpanded && (
          <div className={`sm:hidden ${level > 0 ? 'ml-4' : 'ml-0'} mt-2`}>
            {children.map((child) => renderCategory(child))}
          </div>
        )}

        {/* Children - Desktop */}
        {hasChildren && isExpanded && (
          <div className="hidden sm:block ml-4 border-l-2 border-gray-200">
            {children.map((child) => renderCategory(child))}
          </div>
        )}
      </div>
    );
  };

  const rootCategories = categories
    .filter((cat) => !cat.parentId)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-2 sm:space-y-1">
      {rootCategories.map((category) => renderCategory(category))}
    </div>
  );
};

export default CategoryTree;

