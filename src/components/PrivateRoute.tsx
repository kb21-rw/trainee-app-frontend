import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { RootState } from "../store"
import { UserRole } from "../utils/types"

interface PrivateRouteProps {
  allowedRoles: UserRole[]
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()

  if (user.role && allowedRoles.includes(user.role)) {
    return <Outlet />
  }

  return <Navigate to="/not-found" state={{ from: location }} replace />
}
