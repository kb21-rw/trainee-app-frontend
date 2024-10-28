import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AlertState {
  isVisible: boolean;
  message: string;
  type: "success" | "error" | null;
  displayDuration?: number;
}

const initialState: AlertState = {
  isVisible: false,
  message: "",
  type: null,
  displayDuration: 3000,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<Omit<AlertState, "isVisible">>
    ) => {
      const { message, type, displayDuration } = action.payload;
      state.isVisible = true;
      state.message = message;
      state.type = type;
      state.displayDuration = displayDuration ?? 3000;
    },
    hideAlert: (state) => {
      state.isVisible = false;
      state.message = "";
      state.type = null;
      state.displayDuration = 3000;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
