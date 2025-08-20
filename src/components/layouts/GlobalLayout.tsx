import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import Alert from "../ui/Alert"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useGetProfileQuery } from "../../features/user/backendApi"
import { login } from "../../features/user/userSlice"
import { getErrorInfo, getRoleBasedHomepageURL } from "../../utils/helper"
import { handleShowAlert } from "../../utils/handleShowAlert"
import Loader from "../ui/Loader"
import { AlertType, User } from "../../utils/types"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useUserIdFromJwt } from "../../utils/hooks/useGetCoachIdFromJwt"

export default function GlobalLayout() {
  const alert = useSelector((state: RootState) => state.alert)
  const location = useLocation()
  const navigate = useNavigate()
  const [isInitialized, setIsInitialized] = useState(false)
  const dispatch = useDispatch()
  const tokenUserId = useUserIdFromJwt()

  const isSigningUp =
    location.pathname.includes("/signup/thank-you") ||
    location.pathname.includes("/verify")

  const cookies = useSelector((state: RootState) => state.cookies)

  const {
    data: user,
    error: userError,
    isLoading,
  } = useGetProfileQuery(cookies.jwt, {
    skip: !cookies.jwt || isSigningUp,
    selectFromResult: ({ data, ...rest }: { data: User; rest: unknown }) => {
      return {
        data: data?._id === tokenUserId ? data : null,
        ...rest,
      }
    },
  })

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )
  const alertData = searchParams.get("alertData")

  const handleAlertData = useCallback(() => {
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
  }, [alertData, dispatch, location.pathname, navigate, searchParams])

  const displayErrors = useCallback(() => {
    if (userError) {
      const { message } = getErrorInfo(userError)

      handleShowAlert(dispatch, {
        type: AlertType.Error,
        message,
      })
    }
  }, [userError, dispatch])

  useEffect(() => {
    if (cookies.jwt && user) {
      dispatch(login(user))
    }

    if (!isLoading) {
      setIsInitialized(true)
    }

    displayErrors()
    handleAlertData()
  }, [user, displayErrors, dispatch, isLoading, handleAlertData])

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
