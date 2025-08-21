import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Cookies from "js-cookie"
import { Cookie } from "../../utils/types"

export interface CookiesState {
  jwt: string | null
}

const initialState: CookiesState = {
  jwt: Cookies.get("jwt") || null,
}

export const cookiesSlice = createSlice({
  name: "cookies",
  initialState,
  reducers: {
    setToken: (state: CookiesState, action: PayloadAction<CookiesState>) => {
      state.jwt = action.payload.jwt
      Cookies.set(Cookie.jwt, action.payload.jwt!)
    },
    removeToken: (state: CookiesState) => {
      state.jwt = null
      Cookies.remove(Cookie.jwt)
    },
  },
})

export const { setToken, removeToken } = cookiesSlice.actions
export default cookiesSlice.reducer
