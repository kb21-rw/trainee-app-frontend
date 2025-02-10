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

export default function GlobalLayout() {
  const alert = useSelector((state: RootState) => state.alert)
  const location = useLocation()

  const [cookies] = useCookies([Cookie.jwt])
  const {
    data: user,
    error: userError,
    isLoading,
  } = useGetProfileQuery(cookies.jwt, { skip: !cookies.jwt })

  const dispatch = useDispatch()

  if (userError) {
    const { message } = getErrorInfo(userError)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (cookies.jwt && user) {
    dispatch(login(user))

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
