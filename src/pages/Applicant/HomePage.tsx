import React from "react";
import { Link } from "react-router-dom";
import {
  ApplicationFormStatus,
  ButtonSize,
  ButtonVariant,
  UserRole,
} from "../../utils/types";
import Button from "../../components/ui/Button";
import CohortInfo from "../../components/ui/CohortInfo";
import ApplicationStatus from "../../components/ui/ApplicationStatus";
import { deadLineExceededInfo, noOpenApplicationInfo, userAppliedInfo } from "../../utils/data";
import { useGetMyApplicationQuery, useGetProfileQuery } from "../../features/user/apiSlice";
import { applicationStatusHandler, getJWT } from "../../utils/helper";
import Loader from "../../components/ui/Loader";

const HomePage = () => {
  const jwt: string = getJWT();
  const { data: applicationForm, isLoading } = useGetMyApplicationQuery(jwt);
  const {data: profile } = useGetProfileQuery(jwt);

  const { status } = applicationStatusHandler(applicationForm);
  const role = profile.role

  return (
    <div className="flex flex-col items-center justify-center mt-5 md:mt-20 space-y-10 p-5">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
        {"Welcome to The GYM's Application Portal"}
      </h1>
      {isLoading && (
        <div className="flex items-center justify-center w-full h-screen">
          <Loader />
        </div>
      )}
      {status === ApplicationFormStatus.OPEN && (
        <div className="md:container md:mx-auto px-6 flex flex-col items-center justify-center">
          <CohortInfo
            cohortTitle="The Gym Cohort 5 2025"
            applicationDeadline="4th October 2024"
            trainingStartDate="22nd November 2024"
            programBenefits={[
              {
                title: "Hands-On Projects",
                description:
                  "Work on real-world projects to build your portfolio.",
              },
              {
                title: "Expert Instructors",
                description:
                  "Learn from industry professionals with years of experience.",
              },
              {
                title: "Career Support",
                description:
                  "Get assistance with job placement, resume building, and interview preparation.",
              },
            ]}
          />
          <div className="my-10 flex items-center justify-center">
            <div>
              <Button variant={ButtonVariant.Primary} size={ButtonSize.Large}>
                <Link to="/apply">Apply now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      {status === ApplicationFormStatus.DEADLINE_PASSED && (
        <ApplicationStatus
          heading={deadLineExceededInfo.heading}
          description={deadLineExceededInfo.description}
          buttonLink={deadLineExceededInfo.buttonLink}
          buttonText={deadLineExceededInfo.buttonText}
        />
      )}
      {(status === ApplicationFormStatus.NO_APPLICATION && role === UserRole.Prospect) && (
        <ApplicationStatus
          heading={noOpenApplicationInfo.heading}
          description={noOpenApplicationInfo.description}
          buttonLink={noOpenApplicationInfo.buttonLink}
          buttonText={noOpenApplicationInfo.buttonText}
        />
      )}
       {role === UserRole.Applicant && (
        <ApplicationStatus
          heading={userAppliedInfo.heading}
          description={userAppliedInfo.description}
          buttonLink={userAppliedInfo.buttonLink}
          buttonText={userAppliedInfo.buttonText}
        />
      )}
    </div>
  );
};

export default HomePage;
