import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import Button from "../ui/Button";
import { Modal } from "@mui/material";
import { FormEvent, useState } from "react";
import DropDownIcon from "../../assets/DropDownIcon";
import classNames from "classnames";
import {
  useAddApplicantsMutation,
  useGetUsersQuery,
} from "../../features/user/backendApi";
import { useCookies } from "react-cookie";
import { AlertType, Cookie, User } from "../../utils/types";
import { getErrorInfo } from "../../utils/helper";
import { useDispatch } from "react-redux";
import { handleShowAlert } from "../../utils/handleShowAlert";
import Loader from "../ui/Loader";
import TickIcon from "../../assets/TickIcon";

interface Option {
  id: string;
  label: string;
}

export default function AddApplicantsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [cookies] = useCookies([Cookie.jwt]);
  const dispatch = useDispatch();
  const [selectedProspects, setSelectedProspects] = useState<Option[]>([]);
  const [query, setQuery] = useState("");
  const {
    data: prospects,
    error: prospectsError,
    isFetching: prospectsIsFetching,
  } = useGetUsersQuery({
    jwt: cookies.jwt,
    search: "role=Prospect",
  });
  const [
    addApplicants,
    {
      error: applicantsError,
      isLoading: isAddApplicantsLoading,
      isSuccess: isAddApplicantsSuccess,
      reset: resetAddApplicants,
    },
  ] = useAddApplicantsMutation();

  const formattedProspects: Option[] =
    prospects?.map((prospect: User) => ({
      id: prospect._id,
      label: prospect.name,
    })) ?? [];

  const filteredPeople =
    query === ""
      ? formattedProspects
      : formattedProspects.filter((prospect) => {
          return prospect.label.toLowerCase().includes(query.toLowerCase());
        });

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const prospectIds: string[] = selectedProspects.map(
      (prospect: Option) => prospect.id,
    );

    await addApplicants({ jwt: cookies.jwt, body: { prospectIds } });
  };

  const removeProspect = (prospectId: string) => {
    setSelectedProspects((prevProspects) =>
      prevProspects.filter((prospect) => prospect.id !== prospectId),
    );
  };

  if (prospectsError ?? applicantsError) {
    const { message } = getErrorInfo(prospectsError ?? applicantsError);
    handleShowAlert(dispatch, {
      type: AlertType.Error,
      message,
    });

    resetAddApplicants();
  }

  if (isAddApplicantsSuccess) {
    handleShowAlert(dispatch, {
      type: AlertType.Success,
      message: "Applicants were added successfully",
    });

    resetAddApplicants();
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-describedby="Add applicants"
      component="div"
      className="max-w-md mx-auto flex items-center "
    >
      <form
        className="flex flex-col gap-6 w-full bg-white p-5 rounded-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-3xl font-semibold">Add applicants</h1>
        {prospectsIsFetching && (
          <div className="grid place-content-center">
            <Loader />
          </div>
        )}
        {!prospectsIsFetching && (
          <>
            <Combobox
              multiple
              value={selectedProspects}
              onChange={setSelectedProspects}
              onClose={() => setQuery("")}
            >
              <div className="space-y-4">
                <h3 className="text-center text-primary-dark text-lg">
                  Selected applicants
                </h3>
                {selectedProspects.length === 0 && (
                  <p className="text-center text-slate-600 text-xs">
                    No applicants selected
                  </p>
                )}
                {selectedProspects.length > 0 && (
                  <ul className="flex gap-2 flex-wrap">
                    {selectedProspects.map((prospect) => (
                      <li
                        key={prospect.id}
                        className="group relative py-2 px-4 border border-neutral-200 rounded-md text-xs overflow-hidden hover:cursor-pointer"
                      >
                        <button
                          onClick={() => removeProspect(prospect.id)}
                          className="absolute text-red-400 font-bold text-xs invisible group-hover:visible shadow-md top-0 right-0 rounded-sm py-0 px-1 bg-white"
                        >
                          x
                        </button>
                        {prospect.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative">
                <ComboboxInput
                  className={classNames(
                    "w-full p-3 border rounded-xl overflow-hidden focus:outline-none",
                  )}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                  <DropDownIcon className="w-5 h-5" />
                </ComboboxButton>
              </div>

              <ComboboxOptions
                anchor="bottom"
                className="relative z-[9999] w-[var(--input-width)] rounded-lg bg-white p-0.5 empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 shadow-2xl"
              >
                {filteredPeople.map((prospect) => (
                  <ComboboxOption
                    key={prospect.id}
                    value={prospect}
                    className="group flex items-center gap-1 data-[focus]:bg-blue-100 rounded-md  p-1"
                  >
                    <TickIcon className="w-3 h-3 invisible size-4 group-data-[selected]:visible" />
                    {prospect.label}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>

            <div className="flex justify-around gap-2">
              <Button outlined onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={selectedProspects.length === 0}>
                {isAddApplicantsLoading ? "..." : "Add applicants"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
