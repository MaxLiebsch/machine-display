import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(request: NextRequest) {
  const url = request.url;
  if (url.includes("/product")) {
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

    if (
      lookup.error === "ip not found" ||
      lookup.city_name !== "Berlin" ||
      lookup.iso_code !== "BD"
    ) {
      return NextResponse.redirect(process.env.NEXT_PUBLIC_FE_BASEURL! + "/");
    }
  } else {
    const response = NextResponse.next();
    return response;
  }
}
