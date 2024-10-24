import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { getJWT } from "../../utils/helper";
import { useCreateFormMutation } from "../../features/user/apiSlice";
import { useNavigate } from "react-router-dom";
import { FormType } from "../../utils/types";
import { menuItems } from "../../utils/data";
import { useGetApplicationFormQuery } from "../../features/user/apiSlice";
import { useState } from "react";
import Alert from "./Alert";
import classNames from "classnames";

type NextFormType = Exclude<FormType, FormType.Application>;

export default function CreateFormDropdown() {
  const navigate = useNavigate();
  const jwt: string = getJWT();
  const [createForm] = useCreateFormMutation();
  const [createFormError, setCreateFormError] = useState(null);
  const { data: applicationForm } = useGetApplicationFormQuery(jwt);

  const onClickAddForm = async (type: NextFormType) => {
    try {
      const nextFormTitle = `${type} form name...`;

      let requestBody: object = { name: nextFormTitle, type };

      const { data: formData, error } = await createForm({
        jwt,
        body: requestBody,
      });

      if (error) {
        setCreateFormError(error);
        return;
      }

      const id = formData?._id;
      navigate(`/forms/${id}`);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const closeAlertHandler = () => {
    setCreateFormError(null);
  };

  return (
    <div>
      <Alert
        open={createFormError ?? false}
        type="error"
        onClose={closeAlertHandler}
      >
        Creating form failed!
      </Alert>
      <Menu>
        <MenuButton className="flex items-center gap-2 bg-primary-dark text-white px-4 py-3 rounded">
          <PlusIcon />
          Add form
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="origin-top-right rounded-lg border border-white/5 bg-white text-sm text-gray-500 font-medium transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 custom-shadow"
        >
          {menuItems.map((item, index) => (
            <MenuItem key={index}>
              {item.link ? (
                !applicationForm &&
                item.link === "/forms/create/application-form" ? (
                  <Link
                    to={item.link}
                    className={`group flex w-full items-center py-3 px-5 data-[focus]:bg-primary-dark data-[focus]:text-white ${
                      index === menuItems.length - 1
                        ? "border-none"
                        : "border-b"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="hidden"></span>
                )
              ) : (
                <button
                  className={classNames(
                    "group flex w-full items-center py-3 px-5 data-[focus]:bg-primary-dark data-[focus]:text-white",
                    { "border-none": index === menuItems.length - 1 },
                    { "border-b": !(index === menuItems.length - 1) }
                  )}
                  onClick={() => onClickAddForm(item.type as NextFormType)}
                >
                  {item.label}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
}
