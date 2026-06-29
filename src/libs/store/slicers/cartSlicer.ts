import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// ── Types ──

export interface CartItem {
  productId: string;
  name: string;
  price: number; // USD
  priceBs: number; // Bs calculado
  quantity: number; // 1-99
  image: string;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  loading: boolean; // true mientras hydrata desde localStorage
}

// ── Initial State ──

const initialState: CartState = {
  items: [],
  loading: true,
};

// ── Slice ──

export const cartSlicer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, 99);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity = Math.max(1, Math.min(99, action.payload.quantity));
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload ?? [];
      state.loading = false;
    },
  },
});

// ── Actions ──

export const { addItem, removeItem, updateQuantity, clearCart, hydrateCart } =
  cartSlicer.actions;

// ── Selectors ──

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
export const selectSubtotalBs = (state: RootState) =>
  state.cart.items.reduce(
    (sum, item) => sum + (item.priceBs || 0) * (item.quantity || 0),
    0
  );

// ── Reducer ──

export default cartSlicer.reducer;
