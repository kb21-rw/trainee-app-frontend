import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { Modal } from "@mui/material";
import { useCookies } from "react-cookie";
import { AlertType, Cookie, User, UserRow } from "../../utils/types";
import { useUpdateParticipantMutation } from "../../features/user/backendApi";
import { useDispatch } from "react-redux";
import { getErrorInfo } from "../../utils/helper";
import { handleShowAlert } from "../../utils/handleShowAlert";
import Input from "../ui/Input";
import SmartSelect from "../ui/SmartSelect";
import Loader from "../ui/Loader";

export default function EditParticipantModal({
  row,
  coaches,
  onClose,
}: {
  row: UserRow;
  coaches: User[];
  onClose: () => void;
}) {
  const [cookies] = useCookies([Cookie.jwt]);
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
  } = useForm<{ name: string; coach: string }>({
    defaultValues: { name: row.name ?? "", coach: row.coach ?? "" },
  });
  const [updateParticipant, { error, isSuccess, isLoading }] =
    useUpdateParticipantMutation();
  const dispatch = useDispatch();

  const coachOptions = [
    { value: "", label: "No coach" },
    ...coaches.map((coach) => ({
      value: coach._id,
      label: coach.name,
    })),
  ];

  const selectedCoach = coachOptions.find(
    (coach) => coach.value === row?.coach,
  );

  const onSubmit = async (formData: { name: string; coach: string }) => {
    await updateParticipant({
      jwt: cookies.jwt,
      body: formData,
      participantId: row.id,
    });
  };

  if (error) {
    const { message } = getErrorInfo(error);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });
    onClose();
  }

  if (isSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Participant was updated successfully",
    });
    onClose();
  }

  return (
    <Modal
      open={Boolean(row.id)}
      onClose={onClose}
      aria-labelledby="Edit Participant"
      aria-describedby=""
      component="div"
      className="max-w-md mx-auto flex items-center "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl"
      >
        <h1 className="text-center text-3xl font-semibold">Edit participant</h1>
        <Input
          type="text"
          label="Name"
          register={{ ...register("name", { required: "Name is required" }) }}
          error={errors.name?.message}
        />
        <SmartSelect
          defaultValue={selectedCoach}
          options={coachOptions}
          register={{ ...register("coach") }}
        />
        <div className="flex justify-around gap-2">
          <Button outlined onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={!isDirty}>
            <span className="flex items-center gap-1">
              {isLoading && <Loader borderColor="#fff" size="xs" />}
              <span>Confirm</span>
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
