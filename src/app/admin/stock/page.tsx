"use client";

import AuthProvider from "@/app/lib/providers/AuthProvider";
import {
  authenicatedFEClient,
  deleteFile,
  deleteItem,
  getItems,
  getJWT,
} from "@/app/lib/services/appwrite.service";
import { Button } from "@mui/material";
import {
  DataGridPremium,
  GridColDef,
  LicenseInfo,
} from "@mui/x-data-grid-premium";
import { useQuery } from "@tanstack/react-query";
import { Models } from "appwrite";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";

import React, { useEffect, useState } from "react";
import { useCollection } from "react-appwrite";

LicenseInfo.setLicenseKey(
  "e25030cfe0235dfde76a01f60b5bf883Tz00ODA0NixFPTE4OTM0NTI0MDAwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y"
);
const Stock = () => {
  const [stock, setStock] = useState<Row[]>([]);
  const databaseId = process.env.NEXT_PUBLIC_MACHINERY_DB_ID!;
  const collectionId = process.env.NEXT_PUBLIC_MACHINERY_COL_ID!;

  const items = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const jwt = await getJWT();
      if (jwt) authenicatedFEClient(jwt.jwt);
      return await getItems();
    },
  });

  useEffect(() => {
    if (items.data) {
      setStock(items.data.documents as Row[]);
    }
  }, [items.data]);

  const handleDelete = async (row: Row) => {
    console.log("row:", row);
    if (row.images.length > 0) {
      await Promise.all(
        row.images.map(async (image) => {
          return deleteFile(image.id).catch((e) => console.log(e));
        })
      );
    }
    deleteItem(row.$id)
      .then((res) => {
        enqueueSnackbar({ message: `${row.name} deleted` });
        items.refetch();
      })
      .catch(() => {
        enqueueSnackbar({ message: `Deletion for ${row.name} failed` });
      });
  };

  const columns: GridColDef<Row>[] = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "slug", headerName: "Slug", width: 350 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "price",
      headerName: "Price",
      width: 100,
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
    {
      field: "images",
      headerName: "Images",
      width: 50,
      renderCell: (params) => {
        return <>{params.row.images.length}</>;
      },
    },
    {
      field: "our-link",
      headerName: "Our Link",
      width: 75,
      renderCell: (params) => {
        if (params.row.slug)
          return (
            <Link
              target="_blank"
              href={
                process.env.NEXT_PUBLIC_FE_BASEURL +
                "/product/" +
                params.row.slug
              }
            >
              Visit
            </Link>
          );
      },
    },
    {
      field: "link",
      headerName: "Link",
      width: 60,
      renderCell: (params) => {
        if (params.row.link)
          return (
            <Link target="_blank" href={params.row.link.href}>
              Visit
            </Link>
          );
      },
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() => handleDelete(params.row)}
              variant="text"
              color="warning"
            >
              Del
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <AuthProvider>
      <div className="flex overflow-y-scroll h-[calc(100vh-280px)] ">
        <DataGridPremium
          getRowId={(row) => row.$id}
          rows={stock}
          columns={columns}
        />
      </div>
    </AuthProvider>
  );
};

export interface Row {
  slug: string;
  price: any;
  description: any;
  details: any;
  name: any;
  published: any;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  images: Image[];
  breadcrumbs: any[];
  link: any;
  $databaseId: string;
  $collectionId: string;
}

export interface Image {
  id: string;
  original: string;
  thumbnail: string;
  alt: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

export default Stock;
