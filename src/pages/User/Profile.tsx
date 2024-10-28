import React from "react";
import { H1 } from "../../components/ui/Typography";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import Loader from "../../components/ui/Loader";
import Alert from "../../components/ui/Alert";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../features/user/apiSlice";
import { useForm } from "react-hook-form";
import { getJWT } from "../../utils/helper";

const Profile = () => {
  const [updateProfile, { isLoading, isSuccess, error }] =
    useUpdateProfileMutation();
  const jwt: string = getJWT();
  const { data } = useGetProfileQuery(jwt);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: {
    email?: string;
    name?: string;
    password?: string;
  }) => {
    const profileData: { email?: string; name?: string; password?: string } = {};
    if (data.email) profileData.email = data.email;
    if (data.name) profileData.name = data.name;
    if (data.password) profileData.password = data.password;
    await updateProfile({ jwt, profileData });
  };

  const errorMessage: any =
    errors.name?.message ||
    errors.email?.message ||
    errors.password?.message ||
    error?.data?.errorMessage;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl custom-shadow">
        <div>
          <H1>
            Profile Settings
          </H1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {isLoading && <Loader />}
          {isSuccess && (
            <Alert type="success">
              Profile updated successfully
            </Alert>
          )}
          {errorMessage && (
            <Alert type="error">
              {errorMessage}
            </Alert>
          )}
          <div className="rounded-md shadow-sm space-y-3">
            <InputField
              name="name"
              type="text"
              label="Name"
              placeholder="Your Name"
              defaultValue={data?.name}
              register={register}
              styles="rounded-t-md"
            />
            <InputField
              name="email"
              type="email"
              label="Email"
              placeholder="your.email@example.com"
              disabled
              defaultValue={data?.email}
              register={register}
              styles="rounded-none border-t-0"
            />
            <InputField
              name="password"
              type="password"
              label="Password"
              placeholder="New Password"
              register={register}
              styles="rounded-b-md border-t-0"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
