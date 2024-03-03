import { useShopQuery } from "@/app/hooks/useShopQuery";
import {
  Checkbox,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IProduct, Query, SearchFormFields, Shop } from "../Search";
import {
  FieldArrayMethodProps,
  FieldArrayWithId,
  useFormContext,
} from "react-hook-form";
import { nanoid } from "nanoid";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

const ShoplistItem = ({
  shop,
  query,
  fields,
  remove,
  append,
  onSetProducts,
}: {
  shop: Shop;
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
  const shopDomain = shop.d;
  const methods = useFormContext();
  const { formState, getValues } = methods;
  const enabled =
    formState.isSubmitted &&
    getValues("shops")?.some((_shop: { d: string }) => _shop.d === shopDomain && shop.active);
  const { isLoading, isSuccess, data, error } = useShopQuery({
    query,
    shopDomain,
    enabled,
  });
  const queryClient = useQueryClient();
  const [found, setFound] = useState<number>();

  const labelId = `checkbox-list-secondary-label-${shopDomain}`;
  const isError = data?.data.content?.message;

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
      setFound(data?.data.content?.length);
      queryClient.setQueryData([{ query, shopDomain }], {
        data: {
          content: [],
        },
      });
    }
  }, [data]);

  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Checkbox
                edge="end"
                disabled={!shop.active}
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
                checked={fields.some((field) => shopDomain === field.d && shop.active)}
                inputProps={{ "aria-labelledby": labelId }}
              />
            )}
          </>
        </ListItemIcon>
        <ListItemText
          id={labelId}
          primary={
            <Link
              className={`${shop.active ? 'font-semibold text-lg leading-tight tracking-tight': ''} underline`}
              target="_blank"
              href={`${"https://" + shopDomain}`}
            >
              {shopDomain}
            </Link>
          }
          secondary={`${isError ? isError : ""}  ${
            found ? `${found} matches` : "No machines found"
          }`}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default ShoplistItem;
