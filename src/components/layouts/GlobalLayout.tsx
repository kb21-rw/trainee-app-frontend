import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import Alert from "../ui/Alert"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useGetProfileQuery } from "../../features/user/backendApi"
import { login } from "../../features/user/userSlice"
import { getErrorInfo, getRoleBasedHomepageURL } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import Loader from "../ui/Loader"
import { AlertType, Cookie } from "../../utils/types"
import { useEffect, useState } from "react"

export default function GlobalLayout() {
  const alert = useSelector((state: RootState) => state.alert)
  const location = useLocation()
  const [isInitialized, setIsInitialized] = useState(false)

  const [cookies] = useCookies([Cookie.jwt])
  const {
    data: user,
    error: userError,
    isLoading,
  } = useGetProfileQuery(cookies.jwt, { skip: !cookies.jwt })

  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      dispatch(login(user))
    }

    if (userError) {
      const { message } = getErrorInfo(userError)
      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    }

    if (!isLoading) {
      setIsInitialized(true)
    }
  }, [user, userError, dispatch, isLoading])

  if (isLoading || !isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (cookies.jwt && user) {
    if (location.state?.redirect === "home") {
      return <Navigate to={getRoleBasedHomepageURL(user.role)} />
    }
  }

  if (location.pathname === "/") {
    return <Navigate to="/auth" />
  }

  return (
    <main className="max-h-screen font-lato max-w-[1920px] md:mx-auto overflow-x-hidden h-screen flex flex-col">
      {alert.isVisible && <Alert />}
      <Outlet />
    </main>
  )
}
