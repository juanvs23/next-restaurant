import { configureStore } from "@reduxjs/toolkit";
import modalSlicer from "./slicers/modalSlicer";
import bookingSlicer from "./slicers/bookingSlicer";

export const store = configureStore({
  reducer: {
    modal: modalSlicer,
    booking: bookingSlicer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
