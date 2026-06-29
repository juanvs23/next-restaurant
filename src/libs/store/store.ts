import { configureStore } from "@reduxjs/toolkit";
import modalSlicer from "./slicers/modalSlicer";
import bookingSlicer from "./slicers/bookingSlicer";
import cartSlicer from "./slicers/cartSlicer";

export const store = configureStore({
  reducer: {
    modal: modalSlicer,
    booking: bookingSlicer,
    cart: cartSlicer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
