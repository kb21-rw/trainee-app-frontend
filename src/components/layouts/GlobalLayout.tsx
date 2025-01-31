import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import Alert from "../ui/Alert"
import { Outlet, useNavigate } from "react-router-dom"
import { useGetProfileQuery } from "../../features/user/backendApi"
import { getErrorInfo, getRoleBasedHomepageURL } from "../../utils/helper"
import { login } from "../../features/user/userSlice"
import Loader from "../ui/Loader"
import { useCookies } from "react-cookie"
import { Cookie } from "../../utils/types"
import useLogout from "../../utils/hooks/useLogout"

export default function GlobalLayout() {
  const alert = useSelector((state: RootState) => state.alert)
  const [cookies] = useCookies([Cookie.jwt])
  const loggedInUser = useSelector((state: RootState) => state.user)
  const {
    data: user,
    error: userError,
    isLoading,
  } = useGetProfileQuery(cookies.jwt, { skip: cookies.jwt ? false : true })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = useLogout()

  if (userError) {
    getErrorInfo(userError)
    handleLogout()
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (cookies.jwt && user && !loggedInUser._id) {
    setTimeout(() => {
      dispatch(login(user))
      navigate(getRoleBasedHomepageURL(user.role))
    }, 0)
  }

  return (
    <main className="max-h-screen font-lato max-w-[1920px] md:mx-auto overflow-x-hidden h-screen flex flex-col">
      {alert.isVisible && <Alert />}
      <Outlet />
    </main>
  )
}
