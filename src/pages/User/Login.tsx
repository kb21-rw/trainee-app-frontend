import React, { useCallback, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/user/backendApi";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "universal-cookie";
import { H1 } from "../../components/ui/Typography";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import Loader from "../../components/ui/Loader";
import { ButtonSize, UserRole } from "../../utils/types";
import { useGetProfileQuery } from "../../features/user/backendApi";
import { useDispatch } from "react-redux";
import { showAlert } from "../../features/user/alertSlice";
import { getErrorInfo } from "../../utils/helper";

interface LoginFormValuesProps {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValuesProps>();
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let redirectUrl = searchParams.get("redirectTo") || "/";
  const { data: user, isLoading: isProfileLoading } = useGetProfileQuery(
    cookies.get("jwt")
  );

  const onSubmit: SubmitHandler<LoginFormValuesProps> = async (data) => {
    const result = await login(data);
    if (result?.data?.accessToken) {
      cookies.set("jwt", result.data.accessToken, { maxAge: 1800 });
    }
  };

  const navigateBasedOnRole = useCallback(
    (role: string) => {
      const roleRoutes = {
        [UserRole.Admin]: "/forms",
        [UserRole.Coach]: "/overview",
        [UserRole.Applicant]: "/home",
        [UserRole.Prospect]: "/home",
      };
      navigate(roleRoutes[role as keyof typeof roleRoutes] || redirectUrl);
    },
    [navigate, redirectUrl]
  );

  useEffect(() => {
    if (!isProfileLoading && user?.role) {
      navigateBasedOnRole(user.role);
    }
  }, [isProfileLoading, user, navigateBasedOnRole]);

  if (error) {
    const { message } = getErrorInfo(error);
    dispatch(
      showAlert({
        message,
        type: "error",
        displayDuration: 5000,
      })
    );
  }

  if (isProfileLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-screen justify-center gap-5 md:gap-16  px-5 sm:px-10 md:p-0 max-w-xl mx-auto w-1/4"
    >
      <div className="text-center">
        <H1>Login</H1>
      </div>
      <div className="space-y-3 md:space-y-6 lg:space-y-10 w-full">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}

        <InputField
          name="email"
          type="email"
          label="Email address"
          placeholder="example@gmail.com"
          register={register}
          options={{
            required: { value: true, message: "Email is required field" },
          }}
          errors={errors}
        />
        <InputField
          name="password"
          type="password"
          label="Password"
          placeholder="password"
          register={register}
          options={{
            required: { value: true, message: "Password is required field" },
          }}
          errors={errors}
        />
      </div>

      <Button size={ButtonSize.Large} type="submit">
        Login
      </Button>
      <div className="flex flex-col text-center">
        <span>
          Forgot password?{" "}
          <Link to="/reset-password" className="text-primary-dark">
            Reset
          </Link>
        </span>
        <span>
          Don&apos;t have an account ?{" "}
          <Link to="/signup" className="text-primary-dark">
            Sign up
          </Link>
        </span>
      </div>
    </form>
  );
};

export default Login;
