import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import alertReducer from "./features/user/alertSlice";
import { backendApi } from "./features/user/backendApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    [backendApi.reducerPath]: backendApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
