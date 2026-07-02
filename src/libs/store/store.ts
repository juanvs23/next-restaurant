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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // The modal slice intentionally stores React elements (non-serializable)
        // as modalContent and ModalFooter. This is by design.
        ignoredPaths: ["modal.modal.modalContent", "modal.modal.ModalFooter"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
