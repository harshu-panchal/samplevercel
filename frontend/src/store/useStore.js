import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getProductById } from '../data/products';
import toast from 'react-hot-toast';

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const product = getProductById(item.id);
        if (!product) {
          toast.error('Product not found');
          return;
        }

        if (product.stock === 'out_of_stock') {
          toast.error('Product is out of stock');
          return;
        }

        const existingItem = get().items.find((i) => i.id === item.id);
        const quantityToAdd = item.quantity || 1;
        const newQuantity = existingItem 
          ? existingItem.quantity + quantityToAdd
          : quantityToAdd;

        // Check stock limit
        if (newQuantity > product.stockQuantity) {
          toast.error(`Only ${product.stockQuantity} items available in stock`);
          return;
        }

        if (newQuantity <= 0) {
          return;
        }

        set((state) => {
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(newQuantity, product.stockQuantity) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantityToAdd, product.stockQuantity) }],
          };
        });

        if (product.stock === 'low_stock' && newQuantity >= product.stockQuantity * 0.8) {
          toast.warning(`Only ${product.stockQuantity} left in stock!`);
        }
        
        // Trigger cart animation
        const { triggerCartAnimation } = useUIStore.getState();
        triggerCartAnimation();
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const product = getProductById(id);
        if (product && quantity > product.stockQuantity) {
          toast.error(`Only ${product.stockQuantity} items available in stock`);
          quantity = product.stockQuantity;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const state = useCartStore.getState();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        const state = useCartStore.getState();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// UI Store (for modals, loading states, etc.)
export const useUIStore = create((set) => ({
  isMenuOpen: false,
  isCartOpen: false,
  isLoading: false,
  cartAnimationTrigger: 0,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setLoading: (loading) => set({ isLoading: loading }),
  triggerCartAnimation: () => set((state) => ({ cartAnimationTrigger: state.cartAnimationTrigger + 1 })),
}));

