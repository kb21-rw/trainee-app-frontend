import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { Modal } from "@mui/material";
import { AlertType, Cookie, User, UserRole } from "../../utils/types";
import Select from "../ui/Select";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import {
  useAddCoachMutation,
  useGetUsersQuery,
} from "../../features/user/backendApi";

export default function AddCoach({
  isOpen,
  onClose,
  cohortCoachIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  cohortCoachIds: string[];
}) {
  const [cookies] = useCookies([Cookie.jwt]);
  const dispatch = useDispatch();
  const [
    addCoach,
    {
      error: coachError,
      isLoading: isCoachLoading,
      isSuccess: isCoachSuccess,
      reset: resetAddCoach,
    },
  ] = useAddCoachMutation();

  const { data: coaches, error: coachesError } = useGetUsersQuery({
    jwt: cookies.jwt,
    search: `role=${UserRole.Coach}`,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<{ coachId: string }>();

  const onSubmit = async ({ coachId }: { coachId: string }) => {
    await addCoach({ jwt: cookies.jwt, coachId });
  };

  if (coachError || coachesError) {
    const { message } = getErrorInfo(coachError ?? coachesError);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
    resetAddCoach();
  }

  if (isCoachSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Coach was added successfully",
    });

    resetForm();
    resetAddCoach();
    onClose();
  }

  const availableCoaches =
    coaches
      ?.filter((coach: User) => !cohortCoachIds.includes(coach._id))
      .map((coach: User) => ({ value: coach._id, label: coach.name })) ?? [];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-describedby="Add coach"
      component="div"
      className="max-w-md mx-auto flex items-center "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl"
      >
        <h1 className="text-center text-3xl font-semibold">Add coach</h1>
        <Select
          options={[
            { value: "", label: "Select a coach" },
            ...availableCoaches,
          ]}
          register={register("coachId", { required: "Please select a coach" })}
          defaultValue={""}
          error={errors.coachId?.message}
        />

        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">{isCoachLoading ? "..." : "Add coach"}</Button>
        </div>
      </form>
    </Modal>
  );
}
