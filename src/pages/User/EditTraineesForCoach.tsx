import React, { useState } from "react";
import { useGetTraineesForCoachQuery } from "../../features/user/backendApi";
import UserTable from "../../components/ui/UserTable";
import UserTableHeader from "../../components/ui/UserTableHeader";
import { getTraineesForCoach } from "../../utils/helper";
import {
  usersPerPageValues,
  traineeTableSortingValues,
  editTraineeTableHeaders,
  editTraineeTableItems,
} from "../../utils/data";
import { Cookie } from "../../utils/types";
import { useCookies } from "react-cookie";

const EditTraineesForCoaches = () => {
  const [cookies] = useCookies([Cookie.jwt]);
  const [query, setQuery] = useState("");
  const { data, isFetching: isGetMyTraineesLoading } =
    useGetTraineesForCoachQuery({
      jwt: cookies.jwt,
      query,
    });
  const myTraineesList = getTraineesForCoach(data, editTraineeTableItems);

  return (
    <div className="py-8">
      <UserTableHeader
        setQuery={setQuery}
        sortingValues={traineeTableSortingValues}
        usersPerPageValues={usersPerPageValues}
        userType="Trainee"
      />
      <UserTable
        headers={editTraineeTableHeaders}
        data={myTraineesList}
        isLoading={isGetMyTraineesLoading}
      />
    </div>
  );
};

export default EditTraineesForCoaches;
