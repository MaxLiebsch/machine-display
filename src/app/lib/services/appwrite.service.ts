import { SignInData } from "@/app/components/forms/SignInForm";
import { IProduct } from "@/app/product/[...slug]/page";
import { Account, Client, Databases, ID, Query, Storage } from "appwrite";
import { cache } from "react";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

// Account
export const authenicatedFEClient = (jwt: string) => {
  client.setJWT(jwt);
};

export const getEmailSession = cache(async (creds: SignInData) => {
  let promise = await account.createEmailSession(creds.email, creds.password);
  return promise;
});

export const getSession = cache(async () => account.getSession("current"));

export const getAccount = cache(async () => account.get());

export const getJWT = cache(async () => account.createJWT());

export const logout = () => cache(() => account.deleteSession("current"));

//Machinery

export const getItem = cache(async (slug: string) => {
  let promise = await databases.listDocuments(
    process.env.NEXT_PUBLIC_MACHINERY_DB_ID!,
    process.env.NEXT_PUBLIC_MACHINERY_COL_ID!,
    [Query.equal("slug", slug), Query.equal("published", true)]
  );
  return promise;
});

export const createItem = cache(async (product: IProduct) => {
  let promise = await databases.createDocument(
    process.env.NEXT_PUBLIC_MACHINERY_DB_ID!,
    process.env.NEXT_PUBLIC_MACHINERY_COL_ID!,
    ID.unique(),
    product
  );
  return promise;
});

export const updateItem = cache(
  async (options: { product: Partial<IProduct>; id: string }) => {
    let promise = await databases.updateDocument(
      process.env.NEXT_PUBLIC_MACHINERY_DB_ID!,
      process.env.NEXT_PUBLIC_MACHINERY_COL_ID!,
      options.id,
      options.product
    );
    return promise;
  }
);

export const createFile = cache(async (file: File) => {
  let promise = await storage.createFile(
    process.env.NEXT_PUBLIC_IMAGE_BUCKET!,
    ID.unique(),
    file
  );
  return promise;
});
