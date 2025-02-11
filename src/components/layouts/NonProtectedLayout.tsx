import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Navigate, Outlet } from "react-router-dom"
import { getRoleBasedHomepageURL } from "../../utils/helper"
import { useCookies } from "react-cookie"
import { Cookie } from "../../utils/types"

export default function NonProtectLayout() {
  const [cookies] = useCookies([Cookie.jwt])
  const loggedInUser = useSelector((state: RootState) => state.user)

  if (cookies.jwt && loggedInUser.role) {
    return <Navigate to={getRoleBasedHomepageURL(loggedInUser.role)} />
  }

  return <Outlet />
}
