"use server";

import { onAuthenticateUser } from "../../../actions/user";
import { redirect } from "next/navigation";

type Props = {};

const AuthCallbackPage = async (props: Props) => {
  console.log("Callback page loaded");
  let redirect_path: string | null = null;
  try {
    console.log("Attempting to authenticate user");
    const auth = await onAuthenticateUser();
    console.log("Auth result:", auth);

    if (auth.status === 200 || auth.status === 201) {
      console.log("User authenticated successfully, redirecting to dashboard");
      redirect_path = `/dashboard/${auth.user?.workspace[0].id}`;
      // return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }

    if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
      console.log("Authentication failed, redirecting to sign-in");
      redirect_path = "/auth/sign-in";
      // return redirect('/auth/sign-in')
    }
  } catch (error) {
    console.error("Error in callback page:", error);
    redirect_path = `/`;
  } finally {
    if (redirect_path) {
      console.log("Redirecting to:", redirect_path);
      redirect(redirect_path);
    }
  }
};

export default AuthCallbackPage;
