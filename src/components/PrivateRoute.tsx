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
