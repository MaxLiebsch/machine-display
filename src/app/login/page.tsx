import React from "react";
import SignInForm from "../components/forms/SignInForm";

const SignInPage = async () => {

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-xl">Sign In</h2>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
