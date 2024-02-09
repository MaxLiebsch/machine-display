import React, { Dispatch, SetStateAction } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledTextfield from "../controlledFields/ControlledTextfield";
import { Button } from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { PageContent } from "@/app/admin/page";
import { enqueueSnackbar } from "notistack";
import { api } from "@/app/lib/services/api.service";
import MyTimer from "../atoms/Timer";

interface IFormInput {
  link: string;
}
interface ICrawlPageForm {
  onPageLoaded: Dispatch<SetStateAction<PageContent | undefined>>;
}
const schema = yup
  .object({
    link: yup.string().url().required(),
  })
  .required();

const CrawlPageForm = ({ onPageLoaded }: ICrawlPageForm) => {
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isValid, isSubmitted, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const details = await api.get("/product/crawl?link=" + data.link);
    if (details.status === 200) {
      onPageLoaded({ ...details.data.content, link: data.link });
      reset();
    } else {
      enqueueSnackbar(
        "Crawl failed, maybe the link is not available or the domain is not supported"
      );
    }
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex relative">
          <ControlledTextfield
            label="Link to crawl"
            className="w-full"
            name="link"
          />
          <div className="flex flew-row items-center gap-3 ml-auto absolute -top-11 right-0">
            {isSubmitting && <MyTimer duration={60} />}
            <Button disabled={isSubmitting} variant="outlined" type="submit">
              {isSubmitting && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx={12}
                    cy={12}
                    r={10}
                    stroke="currentColor"
                    strokeWidth={4}
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              Extract
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CrawlPageForm;
