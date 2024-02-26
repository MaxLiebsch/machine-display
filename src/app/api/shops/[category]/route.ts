import { backendapi } from "@/app/lib/services/backenapi.service";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const jwt = headers().get("x-appwrite-user-jwt");
  if (!jwt) return new Response(null, { status: 401 });

  if (!params.category) return new Response(null, { status: 400 });

  const details = await backendapi.get(`/shops/${params.category}`);
  if (details.status === 201) {
    return Response.json({ ...details.data }, { status: 200 });
  } else {
    return Response.json({ ...details.data }, { status: details.status });
  }
}
