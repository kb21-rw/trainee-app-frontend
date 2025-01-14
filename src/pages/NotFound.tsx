import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/ui/Button"
import { ButtonSize } from "../utils/types"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full md:w-2/5 flex flex-col items-center space-y-3">
        <img
          src="https://media.istockphoto.com/id/1302333331/photo/error-404-3d-rendering-page-concept.jpg?s=612x612&w=0&k=20&c=jWX7N2URkaB-DGpbcnoclXRFdwsG0C78EmWW_v_cZCE="
          alt="Not found page"
          className="w-full"
        />
        <div className="md:w-1/2">
          <Button size={ButtonSize.Large} onClick={() => navigate(-1)}>
            <span>Go Back</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
