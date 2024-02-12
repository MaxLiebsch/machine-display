import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(request: NextRequest) {
  console.log(request.geo);

  let ip;
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");
  if (xForwardedFor) {
    ip = xForwardedFor.split(",")[0];
  } else if (xRealIp) {
    ip = xRealIp;
  } else {
    ip = "unknown";
  }
  console.log("ip:", ip);

  const lookup = await (
    await fetch(process.env.NEXT_PUBLIC_FE_BASEURL! + "/api/ipinfo/" + ip)
  ).json();

  console.log(
    "lookup:",
    lookup.city_name,
    lookup.iso_code,
    "conditon",
    lookup.city_name !== "Berlin" || lookup.iso_code !== "BD",
    lookup.city_name === 'Berlin',
    lookup.iso_code === 'BD'
  );

  if(lookup.city_name === 'Berlin'){
    const response = NextResponse.next()
    return response;
  }

  if (lookup.iso_code === "BD") {
    const response = NextResponse.next()
    return response;
  }

  return NextResponse.redirect(process.env.NEXT_PUBLIC_FE_BASEURL! + "/");

}

export const config = {
  matcher: "/product/:path*",
};
