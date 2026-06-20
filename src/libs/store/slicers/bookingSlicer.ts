import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BookingFormData, TurnTime } from "@/types/booking";

export const asyncHandler = createAsyncThunk(
  "booking/response",
  async (data: BookingFormData) => {
    const form = data.form!;
    const payload = {
      firstName: form.profileInfo.firstName,
      lastName: form.profileInfo.lastName,
      email: form.profileInfo.email,
      phoneNumber: form.profileInfo.phoneNumber,
      dateTime: form.bookingDate.dateTime,
      turnTime: form.bookingDate.turnTime,
      numberPersons: form.bookingInfo.numberPersons,
      comments: form.bookingInfo.comments,
    };
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return { ...result, status: response.status };
  },
);

const initialState: BookingFormData = {
  response: null,
  form: {
    profileInfo: {
      step: 0,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      completed: false,
    },
    bookingDate: {
      step: 1,
      dateTime: "",
      turnTime: TurnTime.Morning,
      completed: false,
    },
    bookingInfo: {
      step: 2,
      numberPersons: "",
      comments: "",
      completed: false,
    },
  },
  loading: false,
  success: null,
};

const bookingSlicer = createSlice({
  name: "booking",
  initialState,
  reducers: {
    getProfileInfo: (state, action) => {
      state.form!.profileInfo = action.payload;
    },
    getBookingDate: (state, action) => {
      state.form!.bookingDate = action.payload;
    },
    getBookingInfo: (state, action) => {
      state.form!.bookingInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(asyncHandler.fulfilled, (state, action) => {
      state.loading = false;
      state.response = action.payload;
    });
  },
});

export const { getProfileInfo, getBookingDate, getBookingInfo } =
  bookingSlicer.actions;

export default bookingSlicer.reducer;
