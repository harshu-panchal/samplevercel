import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      // Create a new order
      createOrder: (orderData) => {
        const orderId = `ORD-${Date.now()}`;
        const trackingNumber = `TRK${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
        
        // Calculate estimated delivery (5-7 days from now)
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 5);
        
        const newOrder = {
          id: orderId,
          userId: orderData.userId || null,
          date: new Date().toISOString(),
          status: 'pending',
          items: orderData.items || [],
          shippingAddress: orderData.shippingAddress || {},
          paymentMethod: orderData.paymentMethod || 'card',
          subtotal: orderData.subtotal || 0,
          shipping: orderData.shipping || 0,
          tax: orderData.tax || 0,
          discount: orderData.discount || 0,
          total: orderData.total || 0,
          couponCode: orderData.couponCode || null,
          trackingNumber: trackingNumber,
          estimatedDelivery: estimatedDelivery.toISOString(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      // Get a single order by ID
      getOrder: (orderId) => {
        const state = get();
        return state.orders.find((order) => order.id === orderId);
      },

      // Get all orders for a user (or guest orders if userId is null)
      getAllOrders: (userId = null) => {
        const state = get();
        if (userId === null) {
          // Return guest orders (where userId is null)
          return state.orders.filter((order) => order.userId === null);
        }
        return state.orders.filter((order) => order.userId === userId);
      },

      // Update order status
      updateOrderStatus: (orderId, newStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          ),
        }));
      },

      // Cancel an order
      cancelOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          ),
        }));
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

