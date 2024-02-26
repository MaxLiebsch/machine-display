


import { redirect } from "next/navigation";
import AuthProvider from "../lib/providers/AuthProvider";


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
  redirect('/admin/search')
  return (
    <AuthProvider>
      <div> 
      </div>
    </AuthProvider>
  );
}
