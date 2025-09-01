import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Cookies from "js-cookie"
import { Cookie } from "../../utils/types"

export interface AuthState {
  token: string | null
}

const initialState: AuthState = {
  token: Cookies.get("token") || null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state: AuthState, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token
      Cookies.set(Cookie.token, action.payload.token!)
    },
    removeToken: (state: AuthState) => {
      state.token = null
      Cookies.remove(Cookie.token)
    },
  },
})

export const { setToken, removeToken } = authSlice.actions
export default authSlice.reducer
