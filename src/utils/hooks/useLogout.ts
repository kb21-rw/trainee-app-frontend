import { useDispatch } from "react-redux"
import { logout } from "../../features/user/userSlice"
import { useNavigate } from "react-router-dom"
import { useCallback } from "react"
import { backendApi } from "../../features/user/backendApi"
import { useAuth } from "./useAuth"

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { removeToken } = useAuth()

  const handleLogout = useCallback(async () => {
    removeToken()
    dispatch(logout())
    dispatch(backendApi.util.resetApiState())
    navigate("/auth")
  }, [dispatch, navigate])

  return handleLogout
}

export default useLogout
