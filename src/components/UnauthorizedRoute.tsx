import { useLocation, useNavigate } from "react-router-dom"
import Button from "./ui/Button"
import { ButtonSize, ButtonVariant } from "../utils/types"
import DangerIcon from "../assets/DangerIcon"

export default function Unauthorized() {
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from?.pathname || "/"

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-lg rounded-xl">
        {/* Red accent bar at top */}
        <div className="h-2 bg-red-500"></div>

        <div className="p-8">
          {/* Icon and title */}
          <div className="flex flex-col items-center mb-6">
            <DangerIcon />
            <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
          </div>

          {/* Message */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-gray-600">
              You don&apos;t have permission to access:
            </p>
            <p className="p-2 mb-4 font-medium text-gray-800 bg-gray-100 rounded">
              {from}
            </p>
            <p className="text-sm text-gray-500">
              Please contact an administrator if you believe this is an error.
            </p>
          </div>

          {/* Divider */}
          {/* <div className="my-6 border-t border-gray-200"></div> */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {/* <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg sm:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go Back
            </button> */}
            <Button
              variant={ButtonVariant.Danger}
              size={ButtonSize.Medium}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
