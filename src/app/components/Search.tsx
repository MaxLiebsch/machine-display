"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import {
  FieldArrayMethodProps,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
import ControlledDropDown from "./controlledFields/ControlledDropDown";
import brands from "../static/brand_category.json";
import ControlledTextfield from "./controlledFields/ControlledTextfield";
import {
  Button,
  LinearProgress,
  List,
} from "@mui/material";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/services/api.service";
import ControlledDatePicker from "./controlledFields/ControlledDatePicker";
import {
  DataGridPremium,
  GridColDef,
  LicenseInfo,
} from "@mui/x-data-grid-premium";
import ShoplistItem from "./search/ShoplistItem";

LicenseInfo.setLicenseKey(
  '57534908ef4245d803e2687128c4e615Tz00ODA0NixFPTE2OTA1MzM4NTU5NzQsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y'
);

export type QueryKeys = "brand" | "model" | "product" | "year";

export interface IProduct {
  link: string;
  image: string;
  name: string;
  price: number | "no price";
  description?: string;
  shop: string;
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
  key: string;
  value: string;
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
  brand: string;
  model: string;
  year?: Date | null;
  product?: string;
  shops: { d: string }[];
}

const schema = yup.object({
  category: yup.string().required(),
  brand: yup.string().required(),
  model: yup.string().required(),
  year: yup.date().nullable(),
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
    },
    resolver: yupResolver<SearchFormFields>(schema),
  });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [query, setQuery] = useState<Query>({
    category: "",
    brand: {
      value: "",
      key: "",
    },
    year: {
      key: "",
      value: "",
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
    const query: Query = {
      category: data.category,
      brand: {
        value: brands.find((brand) => brand.key === data.brand)?.value ?? "",
        key: data.brand,
      },
      year: {
        key: data.year ? data.year.getFullYear().toString() : "",
        value: data.year ? data.year.getFullYear().toString() : "",
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
    setQuery(query)
    setTimeout(()=>{
      reset()
    },1500)
  };

  const shopsQuery = useQuery({
    queryKey: ["shops"],
    queryFn: () => api.get("/shops/Machinery"),
  });

  const shops = shopsQuery.data?.data.shops;

  useEffect(() => {
    if (shops) {
      shops.map((shop: { d: string }, i: number) => {
        if (!fields.some((field) => field.d === shop.d)) append({ d: shop.d });
      });
    }
  }, [shops]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 450 },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      sortable: true,
      sortComparator: (v1, v2) => {
        const _v1 = Number(v1);
        const _v2 = Number(v2);
        if (_v1 && _v2) {
          if (_v1 > _v2) return 1;
          else return -1;
        } else {
          if (v1 === "no price" && _v2) return 1;
          else {
            if (v2 === "no price" && _v1) return -1;
            else return 1;
          }
        }
      },
    },
    { field: "year", headerName: "Year", width: 150 },
    { field: "shop", headerName: "Shop", width: 150 },
    {
      field: "link",
      headerName: "Link",
      width: 150,
      renderCell: (params) => {
        return (
          <Link target="_blank" href={params.row.link}>
            Visit
          </Link>
        );
      },
    },
  ];

  return (
    <div className="mt-2">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-between relative gap-2 flex-col"
        >
          <div className="flex flex-row gap-2">
            <ControlledDropDown
              variant="outlined"
              name={"category"}
              defaultValue={{ key: "default", value: "Default" }}
              label="Category"
              entries={[
                { key: "default", value: "Default" },
                { key: "AgriculturalVehicle", value: "Agricultural Vehicle" },
                { key: "ConstructionMachine", value: "Construction Machines" },
              ]}
            />
            <ControlledDropDown
              variant="outlined"
              name={"brand"}
              label="Brand"
              entries={brands}
            />
            <ControlledTextfield fullWidth name="model" label="Model" />
            <ControlledDatePicker  name={"Year"} label="year" views={["year"]} />
          </div>
          <Button
            disabled={formState.isSubmitting}
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
            className="grid grid-cols-3"
            sx={{ width: "100%", bgcolor: "background.paper" }}
          >
            {shopsQuery.data.data.shops.map(
              (shop: { d: string }, i: number) => {
                const enabled =
                  formState.isSubmitting &&
                  getValues("shops").some((_shop) => _shop.d === shop.d);
                return (
                  <ShoplistItem
                    key={shop.d}
                    shopDomain={shop.d}
                    enabled={enabled}
                    query={query}
                    fields={fields}
                    onSetProducts={handleSetProducts}
                    remove={remove}
                    append={append}
                  />
                );
              }
            )}
          </List>
        )}
      </FormProvider>
      {formState.isSubmitting && <LinearProgress />}
      {products.length ? (
        <>
          <div className="text-end">
          {products.length} Products found
          </div>
          <div className="flex h-[calc(100vh-420px)] ">
            <DataGridPremium rows={products} columns={columns} />
          </div>
        </>
      ) : (
        <div className="text-center my-2">No Results </div>
      )}
    </div>
  );
};

export default Search;
