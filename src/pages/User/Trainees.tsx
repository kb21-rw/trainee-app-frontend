import { useCookies } from "react-cookie"
import { useGetAllTraineesQuery } from "../../features/user/backendApi"
import { AlertType, Cookie } from "../../utils/types"
import { useDispatch } from "react-redux"
import { handleShowAlert } from "../../utils/handleShowAlert"
import { getErrorInfo } from "../../utils/helper"

export default function Trainees() {
  const dispatch = useDispatch()
  const [cookies] = useCookies([Cookie.jwt])
  const { data, error, isFetching } = useGetAllTraineesQuery({
    jwt: cookies.jwt,
  })

  if (error) {
    const { message } = getErrorInfo(error)
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    })
  }

  if (isFetching) {
    return <p>loading ...</p>
  }

  return <div>Trainees overview</div>
}
