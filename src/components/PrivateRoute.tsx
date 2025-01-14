import React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { RootState } from "../store"
import { UserRole } from "../utils/types"

interface PrivateRouteProps {
  allowedRoles: UserRole[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const userRole = useSelector((state: RootState) => state.user.role)

  if (!userRole) {
    return <Navigate to="/auth" />
  }

  return allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/not-found" />
  )
}

export default PrivateRoute
