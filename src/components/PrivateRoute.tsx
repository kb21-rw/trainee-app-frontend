import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { RootState } from "../store"
import { UserRole } from "../utils/types"

interface PrivateRouteProps {
  allowedRoles: UserRole[]
  authOnly?: boolean
}

export default function PrivateRoute({
  allowedRoles,
  authOnly = false,
}: PrivateRouteProps) {
  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()

  const isAuthenticated = Boolean(user && user.role)

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (authOnly) {
    return <Outlet />
  }

  if (user.role && allowedRoles.includes(user.role)) {
    return <Outlet />
  }

  return <Navigate to="/unauthorized" state={{ from: location }} replace />
}
