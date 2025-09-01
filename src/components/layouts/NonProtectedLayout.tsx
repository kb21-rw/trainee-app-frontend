import { Navigate, Outlet } from "react-router-dom"
import { getRoleBasedHomepageURL } from "../../utils/helper"

import { RootState } from "../../store"
import { useSelector } from "react-redux"
import { useAuth } from "../../utils/hooks/useAuth"

export default function NonProtectLayout() {
  const { isAuthenticated } = useAuth()
  const loggedInUser = useSelector((state: RootState) => state.user)
  if (isAuthenticated && loggedInUser.role) {
    return <Navigate to={getRoleBasedHomepageURL(loggedInUser.role)} />
  }

  return <Outlet />
}
