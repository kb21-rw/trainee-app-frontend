import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserRole } from "../../utils/types"

export interface UserState {
  _id?: string
  userId?: string
  name?: string
  email?: string
  role?: UserRole
}

const initialState: UserState = {}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state: UserState, action: PayloadAction<UserState>) => {
      const { _id, userId, name, email, role } = action.payload
      state._id = _id
      state.userId = userId
      state.name = name
      state.email = email
      state.role = role
    },
    logout: () => initialState,
  },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
