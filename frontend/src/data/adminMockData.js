// Mock analytics data for admin dashboard
const generateDateRange = (days) => {
  const dates = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Generate revenue data for last 30 days
export const generateRevenueData = (days = 30) => {
  const dates = generateDateRange(days);
  return dates.map((date) => ({
    date,
    revenue: Math.floor(Math.random() * 5000) + 1000,
    orders: Math.floor(Math.random() * 50) + 10,
  }));
};

// Mock orders
export const mockOrders = [
  {
    id: 'ORD-001',
    customer: { name: 'John Doe', email: 'john@example.com' },
    date: '2024-01-15T10:30:00',
    status: 'delivered',
    total: 1250.50,
    items: 5,
  },
  {
    id: 'ORD-002',
    customer: { name: 'Jane Smith', email: 'jane@example.com' },
    date: '2024-01-20T14:22:00',
    status: 'shipped',
    total: 890.25,
    items: 3,
  },
  {
    id: 'ORD-003',
    customer: { name: 'Bob Johnson', email: 'bob@example.com' },
    date: '2024-01-22T09:15:00',
    status: 'processing',
    total: 450.00,
    items: 2,
  },
  {
    id: 'ORD-004',
    customer: { name: 'Alice Brown', email: 'alice@example.com' },
    date: '2024-01-10T16:45:00',
    status: 'cancelled',
    total: 320.50,
    items: 1,
  },
  {
    id: 'ORD-005',
    customer: { name: 'Charlie Wilson', email: 'charlie@example.com' },
    date: '2024-01-18T11:20:00',
    status: 'delivered',
    total: 1750.75,
    items: 7,
  },
  {
    id: 'ORD-006',
    customer: { name: 'Diana Prince', email: 'diana@example.com' },
    date: '2024-01-21T13:10:00',
    status: 'pending',
    total: 650.00,
    items: 4,
  },
];

// Top products
export const topProducts = [
  { id: 1, name: 'Classic White T-Shirt', sales: 245, revenue: 6122.55, stock: 45 },
  { id: 2, name: 'Slim Fit Blue Jeans', sales: 189, revenue: 15118.11, stock: 120 },
  { id: 3, name: 'Floral Summer Dress', sales: 156, revenue: 9358.44, stock: 8 },
  { id: 4, name: 'Leather Crossbody Bag', sales: 142, revenue: 12778.58, stock: 65 },
  { id: 5, name: 'Casual Canvas Sneakers', sales: 128, revenue: 6398.72, stock: 30 },
];

// Customers data
export const mockCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, totalSpent: 5600.50 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, totalSpent: 3200.25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', orders: 15, totalSpent: 7800.00 },
];

// Analytics summary
export const getAnalyticsSummary = () => {
  const revenueData = generateRevenueData(30);
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = revenueData.reduce((sum, d) => sum + d.orders, 0);
  const previousPeriodRevenue = generateRevenueData(30).reduce((sum, d) => sum + d.revenue, 0);
  const revenueChange = ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;

  return {
    totalRevenue,
    totalOrders,
    totalProducts: 298, // from products.js
    totalCustomers: mockCustomers.length,
    revenueChange: revenueChange.toFixed(2),
    ordersChange: 12.5, // Mock
    productsChange: 5.2, // Mock
    customersChange: 8.3, // Mock
  };
};

export default {
  generateRevenueData,
  mockOrders,
  topProducts,
  mockCustomers,
  getAnalyticsSummary,
};

