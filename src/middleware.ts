import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {

  const cookie = request.cookies.get(`a_session_${process.env.NEXT_PUBLIC_PROJECT_ID}_legacy`);


//   if(cookie){
//     console.log(request)
//   }

  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  //   let cookie = request.cookies.get('nextjs')
  //   console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  //   const allCookies = request.cookies.getAll()
  //   console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  //   request.cookies.has('nextjs') // => true
  //   request.cookies.delete('nextjs')
  //   request.cookies.has('nextjs') // => false

  //   // Setting cookies on the response using the `ResponseCookies` API
    const response = NextResponse.next()
  //   response.cookies.set('vercel', 'fast')
  //   response.cookies.set({
  //     name: 'vercel',
  //     value: 'fast',
  //     path: '/',
  //   })
  //   cookie = response.cookies.get('vercel')
  //   console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  //   // The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.

  return response;
}
