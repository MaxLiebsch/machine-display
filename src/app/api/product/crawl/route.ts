import { backendapi } from "@/app/lib/services/backenapi.service";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import * as yup from "yup";

export async function GET(request: NextRequest) {
  const jwt = headers().get("x-appwrite-user-jwt");
  if (!jwt) return new Response(null, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const link = searchParams.get("link");
  const schema = yup.string().url();
  if (!schema.cast(link)) {
    return new Response(null, { status: 400 });
  }
  const details = await backendapi.post(
    "/medications/get-product-infos/shop/no-need",
    { link }
    );
  if (details.status === 201) {
    return Response.json({ content: details.data }, { status: 200 });
  } else {
    return Response.json({ content: details.data }, { status: details.status });
  }
}
