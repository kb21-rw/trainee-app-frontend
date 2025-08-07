import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AuthState {
  login: boolean
}

const initialState: AuthState = {
  login: false,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggingIn: (state: AuthState, action: PayloadAction<AuthState>) => {
      state.login = action.payload.login
    },
    loggingOut: () => {
      return initialState
    },
  },
})

export const { loggingIn, loggingOut } = authSlice.actions
export default authSlice.reducer
