import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Plus from "../../assets/Plus";
import Cookies from "universal-cookie";
import { useGetAllCoachesQuery } from "../../features/user/apiSlice";
import { useDeleteCoachMutation } from "../../features/user/apiSlice";
import AddingCoachModal from "../../components/modals/AddingCoach";
import UserTable from "../../components/ui/UserTable";
import EditCoach from "../../components/modals/EditCoach";
import UserTableHeader from "../../components/ui/UserTableHeader";
import { getCoaches } from "../../utils/helper";

const CoachesInfo = () => {
  const cookies = new Cookies();
  const jwt = cookies.get("jwt");
  const [query, setQuery] = useState("");
  const { data, isFetching: isGetAllCoachesLoading } = useGetAllCoachesQuery({
    jwt,
    query,
  });
  const [isAddingCoach, setIsAddingCoach] = useState(false);
  const [editCoachData, setEditCoachData] = useState<string[] | null>(null);
  const [deleteCoach, { isFetching: isDeleteCoachLoading }] =
    useDeleteCoachMutation();
  const handleDeleteCoach = async (id: string) => {
    await deleteCoach({ jwt, id });
  };
  const headers = ["No", "Name", "Email", "Role", "Action"];
  const dataItems = ["_id", "name", "email", "role"];
  const coachesList = getCoaches(data, dataItems);

  return (
    <div>
      <div className="py-8">
        <div className="flex justify-end items-center my-6">
          <Button clickHandler={() => setIsAddingCoach(true)} variant="small">
            <Plus />
            <span>Add coach</span>
          </Button>
        </div>
        <UserTableHeader setQuery={setQuery} />
        <UserTable
          headers={headers}
          data={coachesList}
          actions={[
            { type: "edit", actionCaller: setEditCoachData },
            { type: "delete", actionCaller: handleDeleteCoach },
          ]}
          isLoading={isDeleteCoachLoading || isGetAllCoachesLoading}
        />
      </div>
      {isAddingCoach && (
        <AddingCoachModal
          jwt={jwt}
          closePopup={() => setIsAddingCoach(false)}
        />
      )}
      {editCoachData && (
        <EditCoach
          jwt={jwt}
          closePopup={() => setEditCoachData(null)}
          coachData={editCoachData}
        />
      )}
    </div>
  );
};

export default CoachesInfo;
