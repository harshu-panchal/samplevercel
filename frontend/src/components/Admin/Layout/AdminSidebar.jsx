import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiLayout, 
  FiPackage, 
  FiShoppingBag, 
  FiX,
  FiGrid,
  FiTag,
  FiUsers,
  FiImage,
  FiSettings,
  FiBarChart2,
  FiMessageSquare,
  FiFileText,
  FiChevronDown,
  FiChevronRight,
  FiTruck,
  FiMapPin,
  FiBell,
  FiGlobe,
  FiDatabase
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import adminMenuConfig from '../../../config/adminMenu.json';

// Icon mapping function
const getIcon = (title) => {
  const iconMap = {
    'Dashboard': FiLayout,
    'Orders': FiShoppingBag,
    'Products': FiPackage,
    'Categories': FiGrid,
    'Brands': FiTag,
    'Customers': FiUsers,
    'Stock Management': FiPackage,
    'Delivery Management': FiTruck,
    'Locations': FiMapPin,
    'Offers & Sliders': FiImage,
    'Promo Codes': FiTag,
    'Notifications': FiBell,
    'Support Desk': FiMessageSquare,
    'Reports': FiFileText,
    'Analytics & Finance': FiBarChart2,
    'Store Settings': FiSettings,
    'Web Settings': FiGlobe,
    'Policies': FiFileText,
    'Firebase': FiDatabase,
    'Attribute Management': FiGrid,
  };
  return iconMap[title] || FiLayout; // Default icon
};

// Convert text to kebab-case for routes
const toKebabCase = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Generate child route
const getChildRoute = (parentRoute, childTitle) => {
  const childSlug = toKebabCase(childTitle);
  return `${parentRoute}/${childSlug}`;
};

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState(new Set());

  // Check if menu has active child
  const hasActiveChild = (item) => {
    if (!item.children || item.children.length === 0) return false;
    return item.children.some(child => {
      const childRoute = getChildRoute(item.route, child);
      return location.pathname === childRoute || location.pathname.startsWith(childRoute + '/');
    });
  };

  // Toggle dropdown - closes other menus when opening a new one
  const toggleMenu = (title, item) => {
    setOpenMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        // If already open, only close it if it doesn't have an active child
        if (!hasActiveChild(item)) {
          newSet.delete(title);
        }
      } else {
        // If closed, close all others and open this one
        newSet.clear();
        newSet.add(title);
      }
      return newSet;
    });
  };

  // Check if a route is active (parent or any child)
  const isRouteActive = (route, children) => {
    if (location.pathname === route) return true;
    if (children && children.length > 0) {
      return children.some(child => {
        const childRoute = getChildRoute(route, child);
        return location.pathname === childRoute || location.pathname.startsWith(childRoute + '/');
      });
    }
    return location.pathname.startsWith(route + '/');
  };

  // Check if a child route is active
  const isChildRouteActive = (parentRoute, childTitle) => {
    const childRoute = getChildRoute(parentRoute, childTitle);
    return location.pathname === childRoute || location.pathname.startsWith(childRoute + '/');
  };

  // Auto-open menu if any child is active
  useEffect(() => {
    const activeMenus = new Set();
    adminMenuConfig.forEach(item => {
      if (item.children && item.children.length > 0) {
        const hasActiveChild = item.children.some(child => {
          const childRoute = getChildRoute(item.route, child);
          return location.pathname === childRoute || location.pathname.startsWith(childRoute + '/');
        });
        if (hasActiveChild || location.pathname.startsWith(item.route + '/')) {
          activeMenus.add(item.title);
        }
      }
    });
    setOpenMenus(activeMenus);
  }, [location.pathname]);


  const handleMenuClick = (item, e) => {
    if (item.children && item.children.length > 0) {
      e.preventDefault();
      toggleMenu(item.title, item);
    } else {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="px-3 py-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gradient-green rounded-lg flex items-center justify-center">
                  <FiLayout className="text-white text-sm" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">Admin Panel</h2>
                  <p className="text-gray-400 text-xs">E-commerce</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {adminMenuConfig.map((item) => {
              const Icon = getIcon(item.title);
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openMenus.has(item.title);
              const isActive = isRouteActive(item.route, item.children);

              return (
                <div key={item.title}>
                  {/* Parent Menu Item */}
                  {hasChildren ? (
                    <div
                      onClick={(e) => handleMenuClick(item, e)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                        isActive && hasChildren
                          ? 'bg-primary-600/50 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="text-lg flex-shrink-0" />
                      <span className="font-medium flex-1 text-sm">{item.title}</span>
                      <span className="transition-transform duration-300" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                        <FiChevronDown className="text-sm" />
                      </span>
                    </div>
                  ) : (
                    <NavLink
                      to={item.route}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="text-lg flex-shrink-0" />
                      <span className="font-medium flex-1 text-sm">{item.title}</span>
                    </NavLink>
                  )}

                  {/* Children Dropdown */}
                  {hasChildren && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pl-3 pr-2 py-1 space-y-0.5">
                        {item.children.map((child) => {
                          const childRoute = getChildRoute(item.route, child);
                          const isChildActive = isChildRouteActive(item.route, child);

                          return (
                            <NavLink
                              key={child}
                              to={childRoute}
                              onClick={() => {
                                // Only close sidebar on mobile, keep dropdown open
                                onClose();
                              }}
                              className={({ isActive }) =>
                                `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 text-xs ${
                                  isActive || isChildActive
                                    ? 'bg-primary-600/70 text-white shadow-md'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                }`
                              }
                            >
                              <FiChevronRight className="text-xs flex-shrink-0" />
                              <span className="font-medium">{child}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
