import { IProduct } from "@/app/product/[...slug]/page";
import { Client, ID, Storage } from "node-appwrite";
import { cache } from "react";
import { InputFile } from "node-appwrite";

export const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

export const getAuthenicatedClient = (jwt: string) => {
  return client.setJWT(jwt);
};

// const databases = new Databases(client);
const storage = new Storage(client);

export const createFileFromNode = cache(async (file: InputFile, storage: Storage) => {
  let promise = await storage.createFile(
    process.env.NEXT_PUBLIC_IMAGE_BUCKET!,
    ID.unique(),
    file
  );
  return promise;
});

export const createThumbnailPreview = cache(async (fileId: string) => {
  let promise = await storage.getFilePreview(
    process.env.NEXT_PUBLIC_IMAGE_BUCKET!,
    fileId,
    100,
    70,
    undefined,
    50
  );
  return promise;
});
