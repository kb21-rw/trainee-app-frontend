import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import Alert from "../ui/Alert"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useGetProfileQuery } from "../../features/user/backendApi"
import { login } from "../../features/user/userSlice"
import { getErrorInfo, getRoleBasedHomepageURL } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import Loader from "../ui/Loader"
import { AlertType, Cookie } from "../../utils/types"
import { useEffect, useMemo, useState } from "react"

export default function GlobalLayout() {
  const alert = useSelector((state: RootState) => state.alert)
  const location = useLocation()
  const navigate = useNavigate()
  const [isInitialized, setIsInitialized] = useState(false)
  const dispatch = useDispatch()

  const isSigningUp =
    location.pathname.includes("/signup/thank-you") ||
    location.pathname.includes("/verify") ||
    location.pathname.includes("/auth")

  const [cookies] = useCookies([Cookie.jwt])

  const {
    data: user,
    error: userError,
    isLoading,
  } = useGetProfileQuery(cookies.jwt, { skip: !cookies.jwt || isSigningUp })

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )
  const alertData = searchParams.get("alertData")

  useEffect(() => {
    if (user) {
      dispatch(login(user))
    }

    if (userError) {
      const { message } = getErrorInfo(userError)

      if (!userError) {
        return
      }

      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    }

    if (!isLoading) {
      setIsInitialized(true)
    }

    if (alertData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(alertData))
        if (decodedData.children && decodedData.type === "success") {
          handleShowAlert(dispatch, {
            type: AlertType.Success,
            message: decodedData.children,
          })

          searchParams.delete("alertData")
          navigate(
            { pathname: location.pathname, search: searchParams.toString() },
            { replace: true },
          )
        }
      } catch (error) {
        handleShowAlert(dispatch, {
          type: AlertType.Error,
          message:
            "An error occurred while processing the verification data. Please try again later.",
        })
      }
    }
  }, [
    user,
    userError,
    dispatch,
    isLoading,
    alertData,
    navigate,
    location.pathname,
    searchParams,
  ])

  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
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
