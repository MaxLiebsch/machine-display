"use client";
import { useEffect, useState } from "react";
import CrawlPageForm from "../../components/forms/CrawlPageForm";
import ProductForm from "../../components/forms/ProductForm";
import { Button } from "@mui/material";
import AuthProvider from "../../lib/providers/AuthProvider";

export interface PageContent {
  p: string;
  a: string;
  n: string;
  f: string; //features highlight
  pzn: string;
  m: string; //details
  link: string;
  ps: string; //description
  ls: any[];
  ean: string;
  img: string[];
}

export default function Page({ params }: { params: { slug: string } }) {
  const [productPageCreated, setProductPageCreated] = useState<{
    slug: string;
    success: boolean;
  }>();
  const [pageContent, setPageContent] = useState<PageContent>();

  useEffect(() => {
    if (!pageContent) {
      const _pageContent = sessionStorage.getItem("current");
      if (_pageContent) {
        setPageContent({
          p: "",
          link: "",
          a: "",
          n: "",
          f: "", //features highlight
          pzn: "",
          m: "", //details
          ps: "", //description
          ls: [],
          ean: "",
          img: [],
        });
      }
    }
  }, [pageContent]);

  return (
    <AuthProvider>
      <div>
        <div>
          {pageContent ? (
            <section className={`${!pageContent && "hidden"}`}>
              {productPageCreated?.success ? (
                <div>
                  <div>
                    <h1 className="text-3xl mt-8">
                      Product page is created successfully
                    </h1>
                    <p className="my-2">
                      URL:{" "}
                      {`${process.env.NEXT_PUBLIC_FE_BASEURL}/product/${productPageCreated?.slug}`}
                    </p>

                    <a
                      target="_blank"
                      className="mt-4 text-2xl underline-1"
                      href={`${process.env.NEXT_PUBLIC_FE_BASEURL}/product/${productPageCreated?.slug}`}
                    >
                      Click here to see the result
                    </a>
                  </div>
                  <Button
                    onClick={() => {
                      setProductPageCreated(undefined);
                      setPageContent(undefined);
                    }}
                  >
                    Add another product
                  </Button>
                </div>
              ) : (
                <>
                  <h2>Link: {pageContent.link}</h2>
                  <ProductForm
                    onPageContentChange={setPageContent}
                    pageContent={pageContent}
                    onProductPageCreated={setProductPageCreated}
                  />
                </>
              )}
            </section>
          ) : (
            <>
              <p>Enter a link you want to crawl.</p>
              <CrawlPageForm onPageLoaded={setPageContent} />
            </>
          )}
        </div>
      </div>
    </AuthProvider>
  );
}
