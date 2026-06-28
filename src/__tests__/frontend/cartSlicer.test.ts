import { configureStore } from "@reduxjs/toolkit";
import cartSlicer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  hydrateCart,
  selectCartItems,
  selectCartCount,
  selectSubtotal,
  selectSubtotalBs,
  CartItem,
} from "@/libs/store/slicers/cartSlicer";

// ── Helpers ──

function createTestStore() {
  return configureStore({
    reducer: { cart: cartSlicer },
  });
}

function getState(store: ReturnType<typeof createTestStore>) {
  return store.getState();
}

const sampleItem: CartItem = {
  productId: "prod-1",
  name: "Café Espresso",
  price: 5,
  priceBs: 175,
  quantity: 1,
  image: "/uploads/food/food-1.jpg",
  slug: "cafe-espresso",
};

const sampleItem2: CartItem = {
  productId: "prod-2",
  name: "Té Verde",
  price: 3,
  priceBs: 105,
  quantity: 1,
  image: "/uploads/food/food-2.jpg",
  slug: "te-verde",
};

// ── Tests: addItem ──

describe("cartSlicer.addItem", () => {
  it("adds a new item to an empty cart", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe("prod-1");
    expect(items[0].name).toBe("Café Espresso");
    expect(items[0].price).toBe(5);
    expect(items[0].priceBs).toBe(175);
    expect(items[0].quantity).toBe(1);
  });

  it("increments quantity when adding an existing item", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));
    store.dispatch(addItem({ ...sampleItem }));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("adds multiple different items", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));
    store.dispatch(addItem(sampleItem2));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(2);
    expect(items[0].productId).toBe("prod-1");
    expect(items[1].productId).toBe("prod-2");
  });

  it("clamps quantity at 99 when adding to an item already at 99", () => {
    const store = createTestStore();
    // Set qty to 99 via updateQuantity (the correct API for setting exact qty)
    store.dispatch(addItem(sampleItem)); // qty = 1
    store.dispatch(updateQuantity({ productId: "prod-1", quantity: 99 }));
    // Adding again should clamp at 99
    store.dispatch(addItem(sampleItem));

    const items = selectCartItems(getState(store));
    expect(items[0].quantity).toBe(99);
  });
});

// ── Tests: removeItem ──

describe("cartSlicer.removeItem", () => {
  it("removes an existing item", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));
    store.dispatch(addItem(sampleItem2));
    store.dispatch(removeItem("prod-1"));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe("prod-2");
  });

  it("does nothing when removing a non-existent item", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));
    store.dispatch(removeItem("prod-999"));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(1);
  });
});

// ── Tests: updateQuantity ──

describe("cartSlicer.updateQuantity", () => {
  it("updates quantity of an existing item", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));
    store.dispatch(updateQuantity({ productId: "prod-1", quantity: 5 }));

    const items = selectCartItems(getState(store));
    expect(items[0].quantity).toBe(5);
  });

  it("clamps quantity to 1 when given 0", () => {
    const store = createTestStore();
    store.dispatch(addItem({ ...sampleItem, quantity: 5 }));
    store.dispatch(updateQuantity({ productId: "prod-1", quantity: 0 }));

    const items = selectCartItems(getState(store));
    expect(items[0].quantity).toBe(1);
  });

  it("clamps quantity to 99 when given 100", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));
    store.dispatch(updateQuantity({ productId: "prod-1", quantity: 100 }));

    const items = selectCartItems(getState(store));
    expect(items[0].quantity).toBe(99);
  });

  it("does nothing for a non-existent productId", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));
    store.dispatch(updateQuantity({ productId: "prod-999", quantity: 5 }));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
  });
});

// ── Tests: clearCart ──

describe("cartSlicer.clearCart", () => {
  it("empties all items", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem));
    store.dispatch(addItem(sampleItem2));
    store.dispatch(clearCart());

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(0);
  });

  it("works on an already empty cart", () => {
    const store = createTestStore();
    store.dispatch(clearCart());

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(0);
  });
});

// ── Tests: hydrateCart ──

describe("cartSlicer.hydrateCart", () => {
  it("restores items from localStorage data", () => {
    const store = createTestStore();
    store.dispatch(hydrateCart([sampleItem, sampleItem2]));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(2);
    expect(store.getState().cart.loading).toBe(false);
  });

  it("sets empty array and loading=false with null input", () => {
    const store = createTestStore();
    store.dispatch(hydrateCart(null as unknown as CartItem[]));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(0);
    expect(store.getState().cart.loading).toBe(false);
  });

  it("sets empty array and loading=false with undefined input", () => {
    const store = createTestStore();
    store.dispatch(hydrateCart(undefined as unknown as CartItem[]));

    const items = selectCartItems(getState(store));
    expect(items).toHaveLength(0);
    expect(store.getState().cart.loading).toBe(false);
  });
});

// ── Tests: Selectors ──

describe("cartSlicer selectors", () => {
  it("selectCartCount sums quantities", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem)); // qty 1
    store.dispatch(addItem(sampleItem)); // qty 2
    store.dispatch(addItem(sampleItem2)); // qty 1

    const count = selectCartCount(getState(store));
    expect(count).toBe(3);
  });

  it("selectCartCount returns 0 for empty cart", () => {
    const store = createTestStore();
    expect(selectCartCount(getState(store))).toBe(0);
  });

  it("selectSubtotal calculates USD total", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem)); // $5 × 1
    store.dispatch(addItem(sampleItem)); // $5 × 1 = qty 2 total $10
    store.dispatch(addItem(sampleItem2)); // $3 × 1

    const subtotal = selectSubtotal(getState(store));
    expect(subtotal).toBe(13); // 10 + 3
  });

  it("selectSubtotalBs calculates Bs total", () => {
    const store = createTestStore();
    store.dispatch(addItem(sampleItem)); // 175 × 1 + 175 × 1 = 350
    store.dispatch(addItem(sampleItem));
    store.dispatch(addItem(sampleItem2)); // 105 × 1

    const subtotalBs = selectSubtotalBs(getState(store));
    expect(subtotalBs).toBe(455); // 350 + 105
  });

  it("selectSubtotal returns 0 for empty cart", () => {
    const store = createTestStore();
    expect(selectSubtotal(getState(store))).toBe(0);
    expect(selectSubtotalBs(getState(store))).toBe(0);
  });
});
