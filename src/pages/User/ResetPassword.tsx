import React from "react";
import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation
} from "react-router-dom";
import { H1 } from "../../components/ui/Typography";
import Loader from "../../components/ui/Loader";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import { resetPassword } from "../../services/api";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const response = await resetPassword(email);
  return response;
};

const ResetPassword = () => {
  const error: any = useActionData();
  console.log({ error });
  const navigation = useNavigation();
  return (
    <Form
      method="post"
      replace
      className="flex flex-col h-screen justify-center gap-5 md:gap-16 items-center px-5 sm:px-10 md:p-0 max-w-xl mx-auto"
    >
      <H1>Reset password</H1>
      {navigation.state === "submitting" && <Loader />}
      <div className="space-y-3 md:space-y-6 lg:space-y-10 w-full">
        {error &&
          <div className="py-2 bg-error-light text-error-dark flex justify-center items-center rounded-lg">
            {error.message}
          </div>}
        <InputField
          name="email"
          type="email"
          label="Email address"
          placeholder="example@gmail.com"
        />
      </div>

      <Button>Reset</Button>
      <div className="">
        Back to {" "}
        <Link to="/login" className="text-primary-dark">
          login ?
        </Link>
      </div>
    </Form>
  );
};

export default ResetPassword;
