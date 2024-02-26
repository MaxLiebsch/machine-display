"use client";
import { AppwriteProvider } from "react-appwrite";
import { Client } from "appwrite";
import { ReactNode } from "react";

const appwrite = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

function AppWriteProvider({ children }: { children: ReactNode }) {
  return <AppwriteProvider client={appwrite}>{children}</AppwriteProvider>;
}

export default AppWriteProvider;
