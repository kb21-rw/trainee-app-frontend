import { useDispatch } from "react-redux"
import { logout } from "../../features/user/userSlice"
import { useCookies } from "react-cookie"
import { Cookie } from "../types"
import { useNavigate } from "react-router-dom"
import { useCallback } from "react"

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [, , removeCookie] = useCookies([Cookie.jwt])

  const handleLogout = useCallback(() => {
    dispatch(logout())
    removeCookie(Cookie.jwt)
    navigate("/auth")
  }, [dispatch, navigate, removeCookie])

  return handleLogout
}

export default useLogout
