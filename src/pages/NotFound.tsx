import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { ButtonSize } from "../utils/types";
import { useGetProfileQuery } from "../features/user/apiSlice";
import { getJWT } from "../utils/helper";

const NotFound = () => {
  const navigate = useNavigate();
  const jwt = getJWT();
  const {data: profile} = useGetProfileQuery(jwt);
  const role = profile?.role;

  
  const navigateBasedOnRole = (role: string) => { 
    switch (role) {
      case "Admin":
        navigate("/forms");
        break;
      case "Coach":
        navigate("/overview");
        break;
      case "Applicant" || "Prospect":
        navigate("/home");
        break;
      default:
        navigate("/login");
        break;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full md:w-2/5 flex flex-col items-center space-y-3">
        <img
          src="https://media.istockphoto.com/id/1302333331/photo/error-404-3d-rendering-page-concept.jpg?s=612x612&w=0&k=20&c=jWX7N2URkaB-DGpbcnoclXRFdwsG0C78EmWW_v_cZCE="
          alt="Not found page"
          className="w-full"
        />
       <div className="md:w-1/2">
       <Button size={ButtonSize.Large} onClick={() => navigateBasedOnRole(role)}>
          <span>Go Back</span>
       </Button>
       </div>
      </div>
    </div>
  );
};

export default NotFound;
