"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
import ControlledDropDown from "./controlledFields/ControlledDropDown";
import brands from "../static/brands_all.json";
import agri_brands from "../static/brands_agri.json";
import machinery_brands from "../static/brands_machinery.json";
import ControlledTextfield from "./controlledFields/ControlledTextfield";
import { Button, LinearProgress, List } from "@mui/material";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/services/api.service";
import ControlledDatePicker from "./controlledFields/ControlledDatePicker";
import { GridAddIcon } from "@mui/x-data-grid-premium";
import ShoplistItem from "./search/ShoplistItem";
import SlideOut from "./layout/SlideOut";
import ControlledAutoComplete from "./controlledFields/ControlledAutoComplete";
import { formatter } from "./forms/ProductForm";

export type QueryKeys = "brand" | "model" | "product" | "year";

export interface IProduct {
  link: string;
  image: string;
  name: string;
  price: number | "no price";
  description?: string;
  shop: string;
  location: string;
  nameSub?: string;
  year?: string;
  createdAt: string;
  updatedAt: string;
  prime: boolean;
}

export interface Query {
  category: string;
  brand: Brand;
  year: Year;
  model: Model;
  product: Product;
}
export interface Year {
  min: number;
  max: number;
}

export interface Brand {
  key: string;
  value: string;
}

export interface Model {
  key: string;
  value: string;
}

export interface Product {
  key: string;
  value: string;
}

export interface SearchFormFields {
  category: string;
  brand: { key: string; value: string };
  model: string;
  year: {
    min: Date | null;
    max: Date | null;
  };
  product?: string;
  shops: { d: string }[];
}

export interface Shop {
  d: string;
  active: boolean;
}

const schema = yup.object({
  category: yup.string().required(),
  brand: yup
    .object({
      key: yup.string().required(),
      value: yup.string().required(),
    })
    .required(),
  model: yup.string().required(),
  year: yup.object({
    min: yup.date().required().nullable(),
    max: yup.date().required().nullable(),
  }),
  product: yup.string(),
  shops: yup
    .array(
      yup.object({
        d: yup.string().required(),
      })
    )
    .required(),
});

const Search = () => {
  const methods = useForm<SearchFormFields>({
    defaultValues: {
      category: "ConstructionMachine",
      brand: { key: "", value: "" },
      year: {
        min: new Date(2004, 0, 0),
        max: new Date(2018, 0, 0),
      },
    },
    resolver: yupResolver<SearchFormFields>(schema),
  });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [open, setOpen] = useState<boolean>(true);
  const [query, setQuery] = useState<Query>({
    category: "",
    brand: {
      value: "",
      key: "",
    },
    year: {
      min: 0,
      max: 0,
    },
    model: {
      key: "",
      value: "",
    },
    product: {
      key: "",
      value: "",
    },
  });
  const { handleSubmit, reset, formState, control, getValues } = methods;
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "shops",
    }
  );

  const handleSetProducts = (newProducts: IProduct[]) => {
    setProducts((state) => {
      return [...new Set([...state, ...newProducts])];
    });
  };

  const onSubmit: SubmitHandler<SearchFormFields> = async (data) => {
    setProducts([]);
    let foundBrand = brands.find((brand) => brand.key === data.brand.key);
    if (data.category === "AgriculturalVehicle") {
      const agri = agri_brands.find(
        (brand) => brand.value.toLowerCase() === data.brand.value.toLowerCase()
      );
      if (agri) {
        foundBrand = agri;
      } else {
        foundBrand!.key = "1400";
      }
    }
    if (data.category === "ConstructionMachine") {
      const machinery = machinery_brands.find(
        (brand) => brand.value.toLowerCase() === data.brand.value.toLowerCase()
      );
      if (machinery) {
        foundBrand = machinery;
      } else {
        foundBrand!.key = "1400";
      }
    }
    const query: Query = {
      category: data.category,
      brand: foundBrand!,
      year: {
        min: data.year.min !== null ? data.year.min.getFullYear() : 0,
        max: data.year.max !== null ? data.year.max.getFullYear() : 0,
      },
      model: {
        key: data.model,
        value: data.model,
      },
      product: {
        key: "",
        value: "",
      },
    };
    setQuery(query);
  };

  const shopsQuery = useQuery({
    queryKey: ["shops"],
    queryFn: () => api.get("/shops/Machinery"),
  });

  const shops = shopsQuery.data?.data.shops as Shop[];

  useEffect(() => {
    if (shops) {
      shops.map((shop, i: number) => {
        if (!fields.some((field) => field.d === shop.d && shop.active))
          append({ d: shop.d });
      });
    }
  }, [shops]);

  useEffect(() => {
    if (formState.isValid) {
      reset({
        shops: shops.filter((shop) => shop.active),
        brand: { key: "", value: "" },
      });
    }
  }, [formState.isSubmitSuccessful]);

  const queryClient = useQueryClient();

  return (
    <div className="mt-2">
      {!open && (
        <div className="absolute right-0 top-[50%] z-50">
          <Button
            color="primary"
            onClick={() => setOpen(true)}
            aria-label="add"
          >
            <GridAddIcon />
          </Button>
        </div>
      )}

      <SlideOut open={open} setOpen={setOpen}>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex justify-between relative gap-2 flex-col"
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1">
                <ControlledDropDown
                  variant="outlined"
                  name={"category"}
                  label="Category"
                  entries={[
                    { key: "default", value: "Default" },
                    {
                      key: "AgriculturalVehicle",
                      value: "Agricultural Vehicle",
                    },
                    {
                      key: "ConstructionMachine",
                      value: "Construction Machines",
                    },
                  ]}
                />
                <ControlledAutoComplete name={"brand"} />
              </div>
              <ControlledTextfield fullWidth name="model" label="Model" />
              <div className="flex flex-row gap-2">
                <ControlledDatePicker
                  sx={{ width: "100%" }}
                  name={"year.min"}
                  label="Year min"
                  minDate={new Date(1990, 0, 0)}
                  maxDate={new Date()}
                  views={["year"]}
                />
                <ControlledDatePicker
                  sx={{ width: "100%" }}
                  name={"year.max"}
                  label="Year max"
                  minDate={new Date(1990, 0, 0)}
                  maxDate={new Date()}
                  views={["year"]}
                />
              </div>
            </div>
            <Button
              disabled={formState.isSubmitting || !formState.isValid}
              type="submit"
              variant="outlined"
            >
              Search
            </Button>
          </form>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mt-4">
            Available shops
          </h2>
          {shopsQuery.data?.data && (
            <List
              dense
              className="h-[calc(100vh-400px)]"
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                overflowY: "scroll",
              }}
            >
              {shops
                .sort((a, b) => a.d.localeCompare(b.d))
                .map((shop, i: number) => {
                  const enabled =
                    formState.isSubmitting &&
                    getValues("shops")?.some(
                      (_shop) => _shop.d === shop.d && shop.active
                    );
                  return (
                    <ShoplistItem
                      key={shop.d}
                      shop={shop}
                      enabled={enabled}
                      query={query}
                      fields={fields}
                      onSetProducts={handleSetProducts}
                      remove={remove}
                      append={append}
                    />
                  );
                })}
            </List>
          )}
        </FormProvider>
      </SlideOut>
      {queryClient.isFetching() ? <LinearProgress /> : <></>}
      <div className="relative">
        {query.brand.key !== "" && (
          <div className="absolute left-0">
            Query: {query.brand.value} {query.model.value}, {query.year.min} -{" "}
            {query.year.max}
          </div>
        )}
        {products.length ? (
          <>
            <div className="text-end">{products.length} Products found</div>
            <ul role="list" className="divide-y divide-gray-100 p-0">
              {[...products]
                .sort((v1, v2) => {
                  const _v1 = Number(v1.price);
                  const _v2 = Number(v2.price);
                  if (_v1 && _v2) {
                    if (_v1 > _v2) return 1;
                    else return -1;
                  } else {
                    if (v1.price === "no price" && _v2) return 1;
                    else {
                      if (v2.price === "no price" && _v1) return -1;
                      else return 1;
                    }
                  }
                })
                .map((product) => (
                  <Link key={product.name} href={product.link} target="_blank">
                    <li className="flex gap-x-4 px-4 pt-5 pb-8 hover:bg-gray-300 relative">
                      <div className="absolute bottom-1 italic">{product.shop}</div>
                      <img
                        className="h-32 w-40 flex-none transition-all hover:scale(2) delay-500 bg-gray-50"
                        src={product.image}
                        alt=""
                      />
                      <div className="min-w-0 grid grid-cols-2 w-full">
                        <div>
                          <p className="text-xl font-semibold leading-6 text-gray-900">
                            {product.name}
                          </p>
                          <p>{product.description}</p>
                          <p>{product.location}</p>
                          <p>{product.year}</p>
                        </div>
                        <p className=" mt-1 truncate text-lg font-semibold leading-5 text-gray-800 place-self-start self-start justify-self-end">
                          {product.price !== 'no price'? formatter.format(product.price): product.price}
                        </p>
                      </div>
                    </li>
                  </Link>
                ))}
            </ul>
          </>
        ) : (
          <div className="text-center my-2">No Results </div>
        )}
      </div>
    </div>
  );
};

export default Search;
