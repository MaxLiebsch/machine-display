import Gallery from "@/app/components/layout/Gallery";
import { getItem } from "@/app/lib/services/appwrite.service";
import React from "react";
import { redirect } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.slug;

  // fetch data
  const product = await getItem(params.slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.documents[0].name,
    description: product.documents[0].description,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const items = await getItem(params.slug);
  if (items.total === 0) {
    redirect("/");
  }
  return (
    <div className="bg-white">
      <div className="pt-6 px-2">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {items.documents[0].breadcrumbs.map((breadcrumb: Breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                href={"#"}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {items.documents[0].name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
          <Gallery images={items.documents[0].images} />
        </div>
        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {items.documents[0].name}
            </h1>
          </div>
          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              {items.documents[0].price}
              <p className="mt-1 text-sm text-gray-500">
                excl. €6,000 shipping and transport{" "}
              </p>
            </p>

            <div className="mt-10">
              <a
                href={`https://api.whatsapp.com/send?phone=${encodeURIComponent('491634037880')}&text=${
                  encodeURIComponent("I'm interested in this machine:\n") +
                  "https://machinery.dipmaxexport.com/product/" +
                  items.documents[0].slug +
                  encodeURIComponent("\nIs it still available?")
                }`}
                target="_blank"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Talk to us on Whatsapp
              </a>
            </div>
          </div>
          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            {items.documents[0].description && (
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: items.documents[0].description,
                      }}
                    ></div>
                  </p>
                </div>
              </div>
            )}
            {items.documents[0].details && (
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900 text-lg">
                  Details
                </h2>
                <div className="mt-4 space-y-6">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: items.documents[0].details,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface IProduct {
  name: string;
  price: string;
  // href: string;
  breadcrumbs: Breadcrumb[];
  slug: string;
  images: IImage[];
  description: string;
  // highlights?: string[];
  details: string;
}

export interface Breadcrumb {
  id: number;
  name: string;
  href: string;
}

export interface IImage {
  id: string;
  original: string;
  thumbnail: string;
  alt: string;
}
