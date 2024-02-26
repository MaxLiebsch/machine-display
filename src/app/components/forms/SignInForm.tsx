"use client";

import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ControlledTextfield from "../controlledFields/ControlledTextfield";
import { Button } from "@mui/material";
import {
  getEmailSession,
  getSession,
} from "@/app/lib/services/appwrite.service";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { enqueueSnackbar } from "notistack";
import { AppwriteException } from "appwrite";
import { useRouter } from "next/navigation";

export interface SignInData {
  email: string;
  password: string;
}

const SignInForm = () => {
  const router = useRouter();
  const methods = useForm<SignInData>({
    resolver: yupResolver(
      yup.object({
        email: yup.string().required(),
        password: yup.string().min(8).required(),
      })
    ),
  });

  const { formState, handleSubmit } = methods;

  const onSubmit = (data: SignInData) => {
    const session = getEmailSession(data);
    session
      .then((session) => {
        router.push("/admin/new-product");
      })
      .catch((error) => {
        if (error instanceof AppwriteException) {
          enqueueSnackbar({ variant: "error", message: error.message });
        }
      });
  };

  useEffect(() => {
    getSession()
      .then((session) => {
        router.push("/admin/new-product");
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }, []);
  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <ControlledTextfield name="email" />
        <ControlledTextfield type="password" name="password" />
        <Button variant="outlined" type="submit">
          Sign in
        </Button>
      </form>
    </FormProvider>
  );
};

export default SignInForm;
