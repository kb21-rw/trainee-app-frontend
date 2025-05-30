import { Navigate, Outlet } from "react-router-dom"
import { getRoleBasedHomepageURL } from "../../utils/helper"
import { useCookies } from "react-cookie"
import { useGetProfileQuery } from "../../features/user/backendApi"
import { Cookie } from "../../utils/types"
import Loader from "../ui/Loader"

export default function NonProtectLayout() {
  const [cookies] = useCookies([Cookie.jwt])
  const hasToken = !!cookies.jwt

  const { data: user, isLoading } = useGetProfileQuery(cookies.jwt, {
    skip: !hasToken,
  })

  console.log("User logged in", user)

  if (hasToken && user) {
    return <Navigate to={getRoleBasedHomepageURL(user.role)} />
  }

  if (hasToken && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  return <Outlet />
}
