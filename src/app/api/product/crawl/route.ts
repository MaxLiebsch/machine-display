import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import * as yup from "yup";

export async function GET(request: NextRequest) {
  const cookie = cookies().get(
    `a_session_${process.env.NEXT_PUBLIC_PROJECT_ID}_legacy`
  );
  if (!cookie) return new Response(null, { status: 401 });

  
  const searchParams = request.nextUrl.searchParams;
  const link = searchParams.get("link");
  const schema = yup.string().url();
  if (!schema.cast(link)) {
    return new Response(null, { status: 400 });
  }
  const details = await axios.post(
    process.env.CRAWLER_BE + "/medications/get-product-infos/shop/no-need",
    { link },
    {
      headers: {
        Authorization:
          "Basic " +
          btoa(process.env.BE_USER_NAME + ":" + process.env.BE_PASSWORD),
      },
    }
  );
  if (details.status === 201) {
    return Response.json({ content: details.data }, { status: 200 });
  } else {
    return Response.json({ content: details.data }, { status: details.status });
  }
}
