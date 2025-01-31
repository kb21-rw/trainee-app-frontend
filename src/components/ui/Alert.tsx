import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { hideAlert } from "../../features/user/alertSlice"
import { AlertType } from "../../utils/types"
import classNames from "classnames"

const Alert = () => {
  const alert = useSelector((stage: RootState) => stage.alert)
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hideAlert())
    }, alert.displayDuration)
    return () => clearTimeout(timer)
  }, [alert.displayDuration, dispatch])

  return (
    alert.isVisible && (
      <div
        className={classNames(
          `w-alert-width py-2 flex justify-center items-center rounded-lg absolute top-14 left-1/2 -translate-x-1/2 z-[9999] border-green-600`,
          { "bg-error-light text-error-dark": alert.type === AlertType.Error },
          { "bg-green-300 text-white": alert.type === AlertType.Success },
        )}
      >
        {alert.message}
      </div>
    )
  )
}

export default Alert
