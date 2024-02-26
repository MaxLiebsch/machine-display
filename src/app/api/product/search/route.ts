import { backendapi } from "@/app/lib/services/backenapi.service";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const jwt = headers().get("x-appwrite-user-jwt");
  if (!jwt) return new Response(null, { status: 401 });

  if (!request.body) {
    return new Response(null, { status: 400 });
  }
  const details = await backendapi.post("/medications/queryShop", await request.json()); 
  if (details.status === 201) {
    return Response.json({ content: details.data }, { status: 200 });
  } else {
    return Response.json({ content: details.data }, { status: details.status });
  }
}
