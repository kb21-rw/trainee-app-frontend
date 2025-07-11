import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserRole, UserStatus } from "../../utils/types"

export interface UserState {
  _id?: string
  userId?: string
  name?: string
  email?: string
  role?: UserRole
  status?: UserStatus
}

const initialState: UserState = {}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state: UserState, action: PayloadAction<UserState>) => {
      const { _id, userId, name, email, role, status } = action.payload
      state._id = _id
      state.userId = userId
      state.name = name
      state.email = email
      state.role = role
      state.status = status
    },
    logout: () => initialState,
  },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
