<<<<<<< HEAD
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
=======
import React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { RootState } from "../store"
import { UserRole } from "../utils/types"

export default function PrivateRoute({
  allowedRoles,
}: {
  allowedRoles: UserRole[]
}) {
  const userRole = useSelector((state: RootState) => state.user.role)

  if (userRole && allowedRoles.includes(userRole)) {
    return <Outlet />
  }

  return <Navigate to="/not-found" />
}
>>>>>>> origin/dev
