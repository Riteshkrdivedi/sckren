"use server";

import { onAuthenticateUser } from "../../../actions/user";
import { redirect } from "next/navigation";

type Props = {};

const AuthCallbackPage = async (props: Props) => {
  let redirect_path: string | null = null;
  try {
    const auth = await onAuthenticateUser();
    if (auth.status === 200 || auth.status === 201) {
      console.log("i am in dashboard");
      redirect_path = `/dashboard/${auth.user?.workspace[0].id}`;
      // return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }

    if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
      console.log("i am not    in dashboard");
      redirect_path = "/auth/sign-in";
      // return redirect('/auth/sign-in')
    }
  } catch (error) {
    redirect_path = `/`;
  } finally {
    if (redirect_path) {
      redirect(redirect_path);
    }
  }
};

export default AuthCallbackPage;
