import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(request: NextRequest) {
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
  if(process.env.NODE_ENV === 'development'){
    const response = NextResponse.next();
      return response;
  }
  const lookup = await fetch(
    process.env.NEXT_PUBLIC_FE_BASEURL! + "/api/ipinfo/" + ip
    );
  if(lookup.ok){
    const result = await lookup.json() 
    if (result.city_name === "Berlin") {
      const response = NextResponse.next();
      return response;
    }
  
    if (result.iso_code === "BD" || result.iso_code === 'EG') {
      const response = NextResponse.next();
      return response;
    }

  }

  return NextResponse.redirect(process.env.NEXT_PUBLIC_FE_BASEURL! + "/");
}

export const config = {
  matcher: "/product/:path*",
};
