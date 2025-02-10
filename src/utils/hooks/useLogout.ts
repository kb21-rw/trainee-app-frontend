import { useDispatch } from "react-redux"
import { logout } from "../../features/user/userSlice"
import { useCookies } from "react-cookie"
import { Cookie } from "../types"
import { useNavigate } from "react-router-dom"
import { useCallback } from "react"
import { backendApi } from "../../features/user/backendApi"

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [, , removeCookie] = useCookies([Cookie.jwt])

  const handleLogout = useCallback(() => {
    removeCookie(Cookie.jwt)
    dispatch(logout())
    dispatch(backendApi.util.resetApiState())
    navigate("/auth")
  }, [dispatch, navigate, removeCookie])

  return handleLogout
}

export default useLogout
