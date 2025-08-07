import { Navigate, Outlet } from "react-router-dom"
import { getRoleBasedHomepageURL } from "../../utils/helper"
import { useCookies } from "react-cookie"
import { Cookie } from "../../utils/types"

import { RootState } from "../../store"
import { useSelector } from "react-redux"

export default function NonProtectLayout() {
  const [cookies] = useCookies([Cookie.jwt])
  const loggedInUser = useSelector((state: RootState) => state.user)
  const userIsLoggingIn = useSelector((state: RootState) => state.auth.login)
  if (cookies.jwt && loggedInUser.role && userIsLoggingIn) {
    // ensure that the user is exist and they are not trying to logout
    return <Navigate to={getRoleBasedHomepageURL(loggedInUser.role)} />
  }

  return <Outlet />
}
