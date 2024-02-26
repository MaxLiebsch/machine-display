import { useShopQuery } from "@/app/hooks/useShopQuery";
import {
  Checkbox,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useEffect } from "react";
import { IProduct, Query, SearchFormFields } from "../Search";
import {
  FieldArrayMethodProps,
  FieldArrayWithId,
  useFormContext,
} from "react-hook-form";
import { nanoid } from "nanoid";

const ShoplistItem = ({
  shopDomain,
  query,
  fields,
  remove,
  append,
  onSetProducts,
}: {
  shopDomain: string;
  enabled: boolean;
  query: Query;
  remove: (index?: number | number[] | undefined) => void;
  fields: FieldArrayWithId<SearchFormFields, "shops", "id">[];
  onSetProducts: (newProducts: IProduct[]) => void;
  append: (
    value:
      | {
          d: string;
        }
      | {
          d: string;
        }[],
    options?: FieldArrayMethodProps | undefined
  ) => void;
}) => {
  const methods = useFormContext();
  const { formState, getValues } = methods;
  const enabled =
    formState.isSubmitted &&
    getValues("shops").some((_shop: { d: string }) => _shop.d === shopDomain);
  const { isLoading, isSuccess, data,error } = useShopQuery({
    query,
    shopDomain,
    enabled,
  });
  const labelId = `checkbox-list-secondary-label-${shopDomain}`;
  const isError = data?.data.content?.message
  useEffect(() => {
    if (data?.data.content?.length && isSuccess) {
      onSetProducts(
        data.data.content.map((product: IProduct) => {
          let price = product.price;
          let tableprice = price.toString().replaceAll(/\D/g, "");
          if (Number(tableprice)) {
            price = Number(tableprice);
          } else {
            price = "no price";
          }

          return {
            ...product,
            price,
            shop: shopDomain,
            id: nanoid(),
          };
        })
      );
    }
  }, [data]);

  return (
    <ListItem
      secondaryAction={
        <>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Checkbox
              edge="end"
              onChange={(value) => {
                const index = fields.findIndex(
                  (field) => field.d === shopDomain
                );
                if (value.target.checked) {
                  append({ d: shopDomain });
                } else {
                  remove(index);
                }
              }}
              checked={fields.some((field) => shopDomain === field.d)}
              inputProps={{ "aria-labelledby": labelId }}
            />
          )}
        </>
      }
      disablePadding
    >
      <ListItemButton>
        <ListItemText
          id={labelId}
          primary={`${shopDomain}`}
          secondary={`${
            isError ? isError:''}  ${
            data?.data.content?.length
              ? `${data.data.content.length} matches`
              : "No machines found"
          }`}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default ShoplistItem;
