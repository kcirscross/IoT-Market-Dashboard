import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  currentOrder: null,
  error: false,
};

export const orderDetailSlice = createSlice({
  name: 'orderDetail',
  initialState,
  reducers: {
    ORDER_DETAIL_REQUEST: (state) => {
      state.loading = true;
      state.currentOrder = null;
    },
    ORDER_DETAIL_SUCCESS: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    },
    ORDER_DETAIL_FAIL: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { ORDER_DETAIL_REQUEST, ORDER_DETAIL_SUCCESS, ORDER_DETAIL_FAIL } =
  orderDetailSlice.actions;
export default orderDetailSlice.reducer;
