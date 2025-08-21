import { Navigate, Outlet } from "react-router-dom"
import { getRoleBasedHomepageURL } from "../../utils/helper"

import { RootState } from "../../store"
import { useSelector } from "react-redux"

export default function NonProtectLayout() {
  const cookies = useSelector((state: RootState) => state.cookies)
  const loggedInUser = useSelector((state: RootState) => state.user)
  if (cookies.jwt && loggedInUser.role) {
    return <Navigate to={getRoleBasedHomepageURL(loggedInUser.role)} />
  }

  return <Outlet />
}
