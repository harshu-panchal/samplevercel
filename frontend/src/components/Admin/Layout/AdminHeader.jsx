import { FiMenu, FiBell, FiLogOut } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../../store/adminAuthStore';
import toast from 'react-hot-toast';

const AdminHeader = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Get page name from pathname
  const getPageName = (pathname) => {
    const path = pathname.split('/').pop() || 'dashboard';
    const pageNames = {
      dashboard: 'Dashboard',
      products: 'Products',
      categories: 'Categories',
      brands: 'Brands',
      orders: 'Orders',
      customers: 'Customers',
      inventory: 'Inventory',
      campaigns: 'Campaigns',
      banners: 'Banners',
      reviews: 'Reviews',
      analytics: 'Analytics',
      content: 'Content',
      settings: 'Settings',
      more: 'More',
    };
    return pageNames[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const pageName = getPageName(location.pathname);

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 lg:left-64 right-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left: Menu Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMenu className="text-2xl text-gray-700" />
          </button>
          
          {/* Page Heading - Desktop Only */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{pageName}</h1>
            <p className="text-sm text-gray-600">Welcome back! Here's your business overview.</p>
          </div>
        </div>

        {/* Right: Notifications & Logout */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiBell className="text-xl text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-red-600 hover:text-white transition-all duration-300 border border-gray-300 hover:border-red-600"
          >
            <FiLogOut className="text-lg" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

