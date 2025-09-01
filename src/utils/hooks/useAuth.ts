import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { removeToken, setToken } from "../../features/user/authSlice"

export const useAuth = () => {
  const { token } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  return {
    token,
    isAuthenticated: !!token,
    setToken: (newToken: string) => {
      dispatch(setToken({ token: newToken }))
    },
    removeToken: () => {
      dispatch(removeToken())
    },
  }
}
