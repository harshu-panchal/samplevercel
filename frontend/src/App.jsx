import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import Wishlist from "./pages/Wishlist";
import Offers from "./pages/Offers";
import DailyDeals from "./pages/DailyDeals";
import FlashSale from "./pages/FlashSale";
import Category from "./pages/Category";
import CartDrawer from "./components/Cart/CartDrawer";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import AdminLogin from "./pages/admin/Login";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import AdminOrders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import Categories from "./pages/admin/Categories";
import Brands from "./pages/admin/Brands";
import Customers from "./pages/admin/Customers";
import Inventory from "./pages/admin/Inventory";
import Campaigns from "./pages/admin/Campaigns";
import Banners from "./pages/admin/Banners";
import Reviews from "./pages/admin/Reviews";
import Analytics from "./pages/admin/Analytics";
import Content from "./pages/admin/Content";
import Settings from "./pages/admin/Settings";
import More from "./pages/admin/More";
import PromoCodes from "./pages/admin/PromoCodes";
// Orders child pages
import AllOrders from "./pages/admin/orders/AllOrders";
import OrderTracking from "./pages/admin/orders/OrderTracking";
import OrderNotifications from "./pages/admin/orders/OrderNotifications";
// Products child pages
import ManageProducts from "./pages/admin/products/ManageProducts";
import AddProduct from "./pages/admin/products/AddProduct";
import BulkUpload from "./pages/admin/products/BulkUpload";
import TaxPricing from "./pages/admin/products/TaxPricing";
import ProductRatings from "./pages/admin/products/ProductRatings";
import ProductFAQs from "./pages/admin/products/ProductFAQs";
// Attribute Management child pages
import AttributeSets from "./pages/admin/attributes/AttributeSets";
import Attributes from "./pages/admin/attributes/Attributes";
import AttributeValues from "./pages/admin/attributes/AttributeValues";
// Categories child pages
import ManageCategories from "./pages/admin/categories/ManageCategories";
import CategoryOrder from "./pages/admin/categories/CategoryOrder";
// Brands child pages
import ManageBrands from "./pages/admin/brands/ManageBrands";
// Customers child pages
import ViewCustomers from "./pages/admin/customers/ViewCustomers";
import CustomerAddresses from "./pages/admin/customers/Addresses";
import Transactions from "./pages/admin/customers/Transactions";
// Delivery Management child pages
import DeliveryBoys from "./pages/admin/delivery/DeliveryBoys";
import CashCollection from "./pages/admin/delivery/CashCollection";
// Locations child pages
import Cities from "./pages/admin/locations/Cities";
import Zipcodes from "./pages/admin/locations/Zipcodes";
// Offers & Sliders child pages
import HomeSliders from "./pages/admin/offers/HomeSliders";
import FestivalOffers from "./pages/admin/offers/FestivalOffers";
// Notifications child pages
import PushNotifications from "./pages/admin/notifications/PushNotifications";
import CustomMessages from "./pages/admin/notifications/CustomMessages";
// Support Desk child pages
import LiveChat from "./pages/admin/support/LiveChat";
import TicketTypes from "./pages/admin/support/TicketTypes";
import Tickets from "./pages/admin/support/Tickets";
// Reports child pages
import SalesReport from "./pages/admin/reports/SalesReport";
import InventoryReport from "./pages/admin/reports/InventoryReport";
// Analytics & Finance child pages
import RevenueOverview from "./pages/admin/finance/RevenueOverview";
import ProfitLoss from "./pages/admin/finance/ProfitLoss";
import OrderTrends from "./pages/admin/finance/OrderTrends";
import PaymentBreakdown from "./pages/admin/finance/PaymentBreakdown";
import TaxReports from "./pages/admin/finance/TaxReports";
import RefundReports from "./pages/admin/finance/RefundReports";
// Store Settings child pages
import StoreProfile from "./pages/admin/settings/store/StoreProfile";
import PaymentMethods from "./pages/admin/settings/store/PaymentMethods";
import ShippingMethods from "./pages/admin/settings/store/ShippingMethods";
// Web Settings child pages
import Themes from "./pages/admin/settings/web/Themes";
import Languages from "./pages/admin/settings/web/Languages";
import SEOSettings from "./pages/admin/settings/web/SEOSettings";
// Policies child pages
import PrivacyPolicy from "./pages/admin/policies/PrivacyPolicy";
import RefundPolicy from "./pages/admin/policies/RefundPolicy";
import TermsConditions from "./pages/admin/policies/TermsConditions";
// Firebase child pages
import PushConfig from "./pages/admin/firebase/PushConfig";
import Authentication from "./pages/admin/firebase/Authentication";
import RouteWrapper from "./components/RouteWrapper";
import ScrollToTop from "./components/ScrollToTop";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetailPage from "./pages/OrderDetail";
import TrackOrder from "./pages/TrackOrder";
// Mobile App Routes
import MobileHome from "./pages/App/Home";
import MobileProductDetail from "./pages/App/ProductDetail";
import MobileCategory from "./pages/App/Category";
import MobileCategories from "./pages/App/categories";
import MobileCheckout from "./pages/App/Checkout";
import MobileSearch from "./pages/App/Search";
import MobileLogin from "./pages/App/Login";
import MobileRegister from "./pages/App/Register";
import MobileProfile from "./pages/App/Profile";
import MobileOrders from "./pages/App/Orders";
import MobileOrderDetail from "./pages/App/OrderDetail";
import MobileAddresses from "./pages/App/Addresses";
import MobileWishlist from "./pages/App/Wishlist";
import MobileOffers from "./pages/App/Offers";
import MobileDailyDeals from "./pages/App/DailyDeals";
import MobileFlashSale from "./pages/App/FlashSale";
import MobileTrackOrder from "./pages/App/TrackOrder";
import MobileOrderConfirmation from "./pages/App/OrderConfirmation";
// Delivery Routes
import DeliveryLogin from "./pages/delivery/Login";
import DeliveryProtectedRoute from "./components/Delivery/DeliveryProtectedRoute";
import DeliveryLayout from "./components/Delivery/Layout/DeliveryLayout";
import DeliveryDashboard from "./pages/delivery/Dashboard";
import DeliveryOrders from "./pages/delivery/Orders";
import DeliveryOrderDetail from "./pages/delivery/OrderDetail";
import DeliveryProfile from "./pages/delivery/Profile";

// Inner component that has access to useLocation
const AppRoutes = () => {
  return (
      <Routes>
      <Route path="/" element={<RouteWrapper><Home /></RouteWrapper>} />
      <Route path="/product/:id" element={<RouteWrapper><ProductDetail /></RouteWrapper>} />
      <Route path="/category/:id" element={<RouteWrapper><Category /></RouteWrapper>} />
      <Route path="/checkout" element={<RouteWrapper><Checkout /></RouteWrapper>} />
      <Route path="/search" element={<RouteWrapper><Search /></RouteWrapper>} />
      <Route path="/login" element={<RouteWrapper><Login /></RouteWrapper>} />
      <Route path="/register" element={<RouteWrapper><Register /></RouteWrapper>} />
      <Route path="/wishlist" element={<RouteWrapper><Wishlist /></RouteWrapper>} />
      <Route path="/offers" element={<RouteWrapper><Offers /></RouteWrapper>} />
      <Route path="/daily-deals" element={<RouteWrapper><DailyDeals /></RouteWrapper>} />
      <Route path="/flash-sale" element={<RouteWrapper><FlashSale /></RouteWrapper>} />
      <Route path="/order-confirmation/:orderId" element={<RouteWrapper><OrderConfirmation /></RouteWrapper>} />
      <Route path="/orders/:orderId" element={<RouteWrapper><OrderDetailPage /></RouteWrapper>} />
      <Route path="/track-order/:orderId" element={<RouteWrapper><TrackOrder /></RouteWrapper>} />
        <Route
          path="/profile"
          element={
          <RouteWrapper>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </RouteWrapper>
          }
        />
        <Route
          path="/orders"
          element={
          <RouteWrapper>
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          </RouteWrapper>
          }
        />
        <Route
          path="/addresses"
          element={
          <RouteWrapper>
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          </RouteWrapper>
          }
        />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="products/manage-products" element={<ManageProducts />} />
          <Route path="products/add-product" element={<AddProduct />} />
          <Route path="products/bulk-upload" element={<BulkUpload />} />
          <Route path="products/tax-pricing" element={<TaxPricing />} />
          <Route path="products/product-ratings" element={<ProductRatings />} />
          <Route path="products/product-faqs" element={<ProductFAQs />} />
          <Route path="more" element={<More />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/manage-categories" element={<ManageCategories />} />
          <Route path="categories/category-order" element={<CategoryOrder />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/manage-brands" element={<ManageBrands />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="orders/all-orders" element={<AllOrders />} />
          <Route path="orders/order-tracking" element={<OrderTracking />} />
          <Route path="orders/order-notifications" element={<OrderNotifications />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/view-customers" element={<ViewCustomers />} />
          <Route path="customers/addresses" element={<CustomerAddresses />} />
          <Route path="customers/transactions" element={<Transactions />} />
          <Route path="attributes" element={<AttributeSets />} />
          <Route path="attributes/attribute-sets" element={<AttributeSets />} />
          <Route path="attributes/attributes" element={<Attributes />} />
          <Route path="attributes/attribute-values" element={<AttributeValues />} />
          <Route path="stock" element={<Inventory />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="delivery" element={<DeliveryBoys />} />
          <Route path="delivery/delivery-boys" element={<DeliveryBoys />} />
          <Route path="delivery/cash-collection" element={<CashCollection />} />
          <Route path="locations" element={<Cities />} />
          <Route path="locations/cities" element={<Cities />} />
          <Route path="locations/zipcodes" element={<Zipcodes />} />
          <Route path="offers" element={<HomeSliders />} />
          <Route path="offers/home-sliders" element={<HomeSliders />} />
          <Route path="offers/festival-offers" element={<FestivalOffers />} />
          <Route path="promocodes" element={<PromoCodes />} />
          <Route path="notifications" element={<PushNotifications />} />
          <Route path="notifications/push-notifications" element={<PushNotifications />} />
          <Route path="notifications/custom-messages" element={<CustomMessages />} />
          <Route path="support" element={<Tickets />} />
          <Route path="support/live-chat" element={<LiveChat />} />
          <Route path="support/ticket-types" element={<TicketTypes />} />
          <Route path="support/tickets" element={<Tickets />} />
          <Route path="reports" element={<SalesReport />} />
          <Route path="reports/sales-report" element={<SalesReport />} />
          <Route path="reports/inventory-report" element={<InventoryReport />} />
          <Route path="finance" element={<RevenueOverview />} />
          <Route path="finance/revenue-overview" element={<RevenueOverview />} />
          <Route path="finance/profit-loss" element={<ProfitLoss />} />
          <Route path="finance/order-trends" element={<OrderTrends />} />
          <Route path="finance/payment-breakdown" element={<PaymentBreakdown />} />
          <Route path="finance/tax-reports" element={<TaxReports />} />
          <Route path="finance/refund-reports" element={<RefundReports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/store" element={<StoreProfile />} />
          <Route path="settings/store/store-profile" element={<StoreProfile />} />
          <Route path="settings/store/payment-methods" element={<PaymentMethods />} />
          <Route path="settings/store/shipping-methods" element={<ShippingMethods />} />
          <Route path="settings/web" element={<Themes />} />
          <Route path="settings/web/themes" element={<Themes />} />
          <Route path="settings/web/languages" element={<Languages />} />
          <Route path="settings/web/seo-settings" element={<SEOSettings />} />
          <Route path="policies" element={<PrivacyPolicy />} />
          <Route path="policies/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="policies/refund-policy" element={<RefundPolicy />} />
          <Route path="policies/terms-conditions" element={<TermsConditions />} />
          <Route path="firebase" element={<PushConfig />} />
          <Route path="firebase/push-config" element={<PushConfig />} />
          <Route path="firebase/authentication" element={<Authentication />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="banners" element={<Banners />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="content" element={<Content />} />
        </Route>
        {/* Delivery Routes */}
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route
          path="/delivery"
          element={
            <DeliveryProtectedRoute>
              <DeliveryLayout />
            </DeliveryProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/delivery/dashboard" replace />} />
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="orders" element={<DeliveryOrders />} />
          <Route path="orders/:id" element={<DeliveryOrderDetail />} />
          <Route path="profile" element={<DeliveryProfile />} />
        </Route>
        {/* Mobile App Routes */}
        <Route path="/app" element={<RouteWrapper><MobileHome /></RouteWrapper>} />
        <Route path="/app/product/:id" element={<RouteWrapper><MobileProductDetail /></RouteWrapper>} />
        <Route path="/app/category/:id" element={<RouteWrapper><MobileCategory /></RouteWrapper>} />
        <Route path="/app/categories" element={<RouteWrapper><MobileCategories /></RouteWrapper>} />
        <Route path="/app/checkout" element={<RouteWrapper><MobileCheckout /></RouteWrapper>} />
        <Route path="/app/search" element={<RouteWrapper><MobileSearch /></RouteWrapper>} />
        <Route path="/app/login" element={<RouteWrapper><MobileLogin /></RouteWrapper>} />
        <Route path="/app/register" element={<RouteWrapper><MobileRegister /></RouteWrapper>} />
        <Route path="/app/wishlist" element={<RouteWrapper><MobileWishlist /></RouteWrapper>} />
        <Route path="/app/offers" element={<RouteWrapper><MobileOffers /></RouteWrapper>} />
        <Route path="/app/daily-deals" element={<RouteWrapper><MobileDailyDeals /></RouteWrapper>} />
        <Route path="/app/flash-sale" element={<RouteWrapper><MobileFlashSale /></RouteWrapper>} />
        <Route path="/app/order-confirmation/:orderId" element={<RouteWrapper><MobileOrderConfirmation /></RouteWrapper>} />
        <Route path="/app/orders/:orderId" element={<RouteWrapper><MobileOrderDetail /></RouteWrapper>} />
        <Route path="/app/track-order/:orderId" element={<RouteWrapper><MobileTrackOrder /></RouteWrapper>} />
        <Route
          path="/app/profile"
          element={
            <RouteWrapper>
              <ProtectedRoute>
                <MobileProfile />
              </ProtectedRoute>
            </RouteWrapper>
          }
        />
        <Route
          path="/app/orders"
          element={
            <RouteWrapper>
              <ProtectedRoute>
                <MobileOrders />
              </ProtectedRoute>
            </RouteWrapper>
          }
        />
        <Route
          path="/app/addresses"
          element={
            <RouteWrapper>
              <ProtectedRoute>
                <MobileAddresses />
              </ProtectedRoute>
            </RouteWrapper>
          }
        />
      </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <AppRoutes />
      <CartDrawer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#212121",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#388E3C",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#FF6161",
              secondary: "#fff",
            },
          },
        }}
      />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
