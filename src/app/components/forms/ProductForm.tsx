import { PageContent } from "@/app/admin/page";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import * as yup from "yup";
import { Button } from "@mui/material";
import { IProduct } from "@/app/product/[...slug]/page";
import ControlledTextfield from "../controlledFields/ControlledTextfield";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import {
  createItem,
  getJWT,
  updateItem,
} from "@/app/lib/services/appwrite.service";
import { enqueueSnackbar } from "notistack";
import { api } from "@/app/lib/services/api.service";
import dynamic from "next/dynamic";
import MyTimer from "../atoms/Timer";
import { Models } from "appwrite";
import { GiCheckMark } from "react-icons/gi";

const MyEditor = dynamic(
  () => {
    return import("../Editor");
  },
  { ssr: false }
);

const buttonSx = {
  maxHeight: 20,
  minHeight: 20,
  p: 0,
  minWidth: 20,
  maxWidth: 20,
};

interface IProductForm {
  onProductPageCreated: Dispatch<
    SetStateAction<{ slug: string; success: boolean } | undefined>
  >;
  pageContent: PageContent;
  onPageContentChange: Dispatch<SetStateAction<PageContent | undefined>>;
}
const schema = yup.object({
  name: yup.string().required(),
  price: yup.string().required(),
  breadcrumbs: yup.array().required(),
  slug: yup.string().required(),
  published: yup.boolean().default(false),
  link: yup.object({
    href: yup.string().required(),
  }),
  images: yup.array().required(),
  description: yup.string().required(),
  details: yup.string().required(),
});

const ProductForm = ({
  onProductPageCreated,
  pageContent,
  onPageContentChange,
}: IProductForm) => {
  const id = nanoid();
  const { n, p, ps, m, img, link } = pageContent;
  const [completing, setCompleting] = useState<boolean>(false);
  const slug = function (str: string) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  const methods = useForm<IProduct>({
    defaultValues: {
      name: n,
      price: p ? formatter.format(parseInt(p.replace(/\D/, "")) * 1.35) : "",
      // href: "",
      breadcrumbs: [{ id: 1, name: "Machinery", href: "#" }],
      slug: slug(n + "-" + id),
      published: false,
      images: img.map((img, i) => {
        return {
          id: i.toString(),
          original: img,
          thumbnail: img,
          alt: "standard-" + i,
        };
      }),
      link: {
        href: link,
      },
      description: "",
      details: "",
    },
    resolver: yupResolver<IProduct>(schema),
  });

  const detailsEditorRef = useRef<any | null>(null);
  const descriptionEditorRef = useRef<any | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    getValues,
    register,
    trigger,
    control,
    reset,
    formState: { errors, isValid, isSubmitted, isSubmitting, defaultValues },
  } = methods;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "images",
    }
  );

  const breadcrumbs = useFieldArray({
    control,
    name: "breadcrumbs",
  });

  useEffect(() => {
    if (Object.keys(errors).length) {
      alert(
        Object.values(errors)
          .map((error) => error.message)
          .join("\n,")
      );
    }
  }, [errors]);

  // const imageMutation = useMutation({
  //   mutationFn: (options)=>{
  //     return api.post(
  //       "/product/save-image",
  //       {
  //         image: options.image,
  //         name: slug(name),
  //         index,
  //       },
  //       {
  //         headers: {
  //           "x-appwrite-user-jwt": token,
  //         },
  //       }
  //     )
  //   },
  //   onSuccess
  // })

  const handleClearForm = () => {
    setCompleting(false);
    sessionStorage.removeItem("current");
    sessionStorage.removeItem("description");
    sessionStorage.removeItem("productid");
    sessionStorage.removeItem("details");
    reset();
  };

  const handleOnSuccess = async (response: Models.Document) => {
    setCompleting(true);
    const productId = sessionStorage.getItem("productid");
    if (!productId) {
      enqueueSnackbar({
        variant: "info",
        message: "Product page created. - " + response.$id,
      });
    }
    const id = response.$id;
    sessionStorage.setItem("productid", id);
    const images = getValues("images");
    const pendingImages = images.filter((image) => image.id.length < 20);
    const uploadedImages = [];
    const name = getValues("name");
    const jwt = (await getJWT()).jwt;
    for (let index = 0; index < pendingImages.length; index++) {
      const image = pendingImages[index];
      const imageres = await api.post(
        "/product/save-image",
        {
          image,
          name: slug(name),
          index,
        },
        {
          headers: {
            "x-appwrite-user-jwt": jwt,
          },
        }
      );
      if (imageres.status === 200) {
        uploadedImages.push(imageres.data.content.image);
        const uploadedImageIndex = images.findIndex(
          (image) => image.original === imageres.data.content.original
        );
        if (uploadedImageIndex !== -1) {
          images[uploadedImageIndex] = imageres.data.content.image;
        }
        setValue("images", images);
        enqueueSnackbar({
          variant: "info",
          message: `Uploaded ${index + 1} from ${pendingImages.length}`,
        });
      } else {
        enqueueSnackbar({
          variant: "warning",
          message: imageres.data.content,
        });
      }
    }
    updateItem({
      product: {
        images: uploadedImages,
        published: true,
      },
      id,
    })
      .then((response) => {
        onProductPageCreated({ slug: response.slug, success: true });
        handleClearForm();
      })
      .catch((error) => {
        enqueueSnackbar({
          variant: "warning",
          message: error.message,
        });
      });
  };

  const createItemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: handleOnSuccess,
    onError: (error) => {
      enqueueSnackbar({
        variant: "warning",
        message: error.message,
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: handleOnSuccess,
    onError: (error) => {
      enqueueSnackbar({
        variant: "warning",
        message: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<IProduct> = async (data) => {
    const productId = sessionStorage.getItem("productid");
    if (productId) {
      updateItemMutation.mutate({
        product: {
          ...data,
          images: data.images.filter((image) => image.id.length === 20),
        },
        id: productId,
      });
    } else {
      createItemMutation.mutate({ ...data, images: [] });
    }
  };

  const detailsMutation = useMutation({
    mutationFn: async (variables: { text: string; type: "html" | "text" }) => {
      enqueueSnackbar({ variant: "info", message: "Generating details..." });
      return api.post("/get-html", variables).then((res) => res.data);
    },
    onSuccess: (data, variables) => {
      const content = data.html;
      const key = variables.type === "html" ? "details" : "description";
      detailsEditorRef.current && detailsEditorRef.current.setData(content);
      sessionStorage.setItem("details", "true");
      setValue(key, content);
    },
  });

  const descriptionMutation = useMutation({
    mutationFn: async (variables: { text: string; type: "html" | "text" }) => {
      enqueueSnackbar({
        variant: "info",
        message: "Generating description...",
      });
      return api.post("/get-html", variables).then((res) => res.data);
    },
    onSuccess: (data, variables) => {
      const content = data.html;
      sessionStorage.setItem("description", "true");
      const key = variables.type === "html" ? "details" : "description";
      descriptionEditorRef.current &&
        descriptionEditorRef.current.setData(content);
      setValue(key, content);
    },
  });
  const allFields = watch();
  const name = watch("name");
  const price = watch("price");

  useEffect(() => {
    if (parseInt(price)) {
      const parsedPrice = parsePrice(price);
      if (parsedPrice) setValue("price", formatter.format(parsedPrice));
    }
  }, [price]);

  useEffect(() => {
    setValue("slug", slug(name + "-" + id));
  }, [name]);

  useEffect(() => {
    const values = getValues();
    values.name !== "" &&
      sessionStorage.setItem("current", JSON.stringify(values));
  }, [allFields]);

  useEffect(() => {
    const current = sessionStorage.getItem("current");
    if (current) {
      const parsed = JSON.parse(current) as IProduct;
      type keys = keyof IProduct;
      Object.entries(parsed).map(([key, value]) => {
        setValue(key as keys, value);
      });
    }
  }, []);

  useEffect(() => {
    const description = sessionStorage.getItem("description");
    const details = sessionStorage.getItem("details");
    !description &&
      descriptionMutation.mutate({ text: ps + " " + m, type: "text" });
    !details && detailsMutation.mutate({ text: ps + " " + m, type: "html" });
  }, [pageContent]);

  const parsePrice = (priceStr: string | undefined) => {
    if (!priceStr) return;
    const _price = priceStr.replace(/\D/, "");
    if (_price) {
      const price = parseInt(_price);
      return price;
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-between relative gap-2 flex-col"
        >
          <div className="flex flex-row gap-3 items-center ml-auto absolute top-6 right-0 mt-2">
            {isSubmitting || (completing && <MyTimer duration={90} />)}
            <Button
              disabled={
                descriptionMutation.isPending ||
                detailsMutation.isPending ||
                completing
              }
              variant="outlined"
              type="submit"
            >
              {isSubmitting ||
                (completing && (
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
                ))}
              {sessionStorage.getItem("productid")
                ? "Complete Page"
                : "Create Page"}
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => {
                handleClearForm();
                onPageContentChange(undefined);
              }}
            >
              Clear form
            </Button>
          </div>
          <h1 className="text-3xl mt-8">Product Information</h1>
          <div className="flex flex-col gap-3">
            <div className="text-gray-500 text-sm">
              Original price: {formatter.format(parseInt(p.replace(/\D/, "")))}
            </div>
            <div className="flex flex-row gap-2 justify-between w-full">
              <ControlledTextfield
                className="basis-2/3"
                label="Name"
                name="name"
              />
              <div className="relative">
                <div className="grid grid-rows-2 grid-flow-col gap-8 -top-4 -left-3 absolute h-16 w-full">
                  {[
                    { text: "10%", percentage: 1.1 },
                    { text: "15%", percentage: 1.15 },
                    { text: "20%", percentage: 1.2 },
                    { text: "25%", percentage: 1.25 },
                    { text: "30%", percentage: 1.3 },
                    { text: "35%", percentage: 1.35 },
                  ].map((margin, i) => (
                    <div className="z-50" key={margin.text + i}>
                      <Button
                        onClick={() => {
                          if (defaultValues) {
                            const price = parsePrice(defaultValues["price"]);
                            if (price) {
                              setValue(
                                "price",
                                formatter.format(price * margin.percentage)
                              );
                            }
                          }
                        }}
                      >
                        {margin.text}
                      </Button>
                    </div>
                  ))}
                </div>
                <ControlledTextfield label="Price" name="price" />
              </div>
            </div>
            <ControlledTextfield label="Slug" name="slug" />
            <div>
              <Button
                onClick={() => {
                  breadcrumbs.append({
                    id: breadcrumbs.fields.length + 1,
                    name: "",
                    href: "#",
                  });
                }}
              >
                Add Breadcrumb
              </Button>
              <div className="flex flex-row gap-2">
                {getValues("breadcrumbs").map((bread, i) => (
                  <div className="relative" key={`breadcrumbs.${i}`}>
                    {i !== 0 && (
                      <div className="absolute z-50 right-0 -top-1">
                        <Button onClick={() => breadcrumbs.remove(i)}>
                          Delete
                        </Button>
                      </div>
                    )}
                    <ControlledTextfield
                      label={`Breadcrumbs-${i + 1}`}
                      name={`breadcrumbs.${i}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row relative items-center mt-4">
            <h2 className="text-2xl">Text Content</h2>
            <div className="ml-auto absolute top-6 right-0 mt-2">
              <Button
                disabled={
                  isSubmitting ||
                  descriptionMutation.isPending ||
                  detailsMutation.isPending
                }
                onClick={() => {
                  detailsMutation.mutate({ text: ps + " " + m, type: "html" });
                  descriptionMutation.mutate({
                    text: ps + " " + m,
                    type: "text",
                  });
                }}
                variant="outlined"
              >
                {(descriptionMutation.isPending ||
                  detailsMutation.isPending ||
                  (descriptionMutation.isPending &&
                    detailsMutation.isPending)) && (
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
                Process Text content
              </Button>
            </div>
          </div>
          <h1 className="text-xl">Description</h1>
          <MyEditor
            onGetValues={getValues}
            name="description"
            onSetValue={setValue}
            ref={descriptionEditorRef}
          />
          <h1 className="text-xl mb-2">Details</h1>
          <MyEditor
            name="details"
            onGetValues={getValues}
            onSetValue={setValue}
            ref={detailsEditorRef}
          />
          <h1 className="text-2xl mb-2">Images</h1>
          <div className="flex flex-row justify-evenly flex-wrap gap-1">
            {getValues("images").map((img, i) => (
              <div
                className="relative rounded-lg overflow-hidden"
                key={i}
                {...register(`images.${i}`)}
              >
                {img.id.length === 20 && (
                  <div className="absolute w-full h-full top-0 grid grid-rows-1">
                    <GiCheckMark className="absolute z-30 place-self-center" />
                    <div className="bg-white opacity-70 w-full h-full"></div>
                  </div>
                )}
                <div className="bg-white absolute top-0 right-0">
                  {/* Move left */}
                  <Button
                    sx={buttonSx}
                    type="button"
                    disabled={i === 0}
                    variant="outlined"
                    color="warning"
                    onClick={() => swap(i, i + 1)}
                  >
                    {"<"}
                  </Button>
                  {/* Move right */}
                  <Button
                    sx={buttonSx}
                    disabled={i === getValues("images")?.length - 1}
                    type="button"
                    variant="outlined"
                    color="warning"
                    onClick={() => swap(i + 1, i)}
                  >
                    {">"}
                  </Button>
                  <Button
                    disabled={img.id.length === 20}
                    onClick={() => {
                      remove(i);
                    }}
                    className="text-black bg-white"
                  >
                    Delete
                  </Button>
                </div>
                <Image
                  width={300}
                  height={300}
                  src={img.original}
                  alt={i.toString()}
                />
              </div>
            ))}
          </div>
          {/* <div className="bg-slate-300 w-full h-96 my-3">
            Preview {window.location.hostname}/product/{getValues("slug")}
          </div> */}
        </form>
      </FormProvider>
    </div>
  );
};

export default ProductForm;
