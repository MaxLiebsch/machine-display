import {
  createFileFromNode,
  getAuthenicatedClient,
} from "@/app/lib/services/node-appwrite.service";
import axios from "axios";
import { AppwriteException, InputFile, Storage } from "node-appwrite";
import { NextRequest } from "next/server";
import { sign } from "@/app/lib/sign";
import mime from "mime-types";
import { headers } from "next/headers";
import { backendapi } from "@/app/lib/services/backenapi.service";

const { IMAGOR_BASE_URL, WATERMARK_FILE, IMAGOR_SECRET } = process.env;

export async function POST(request: NextRequest) {
  const jwt = headers().get("x-appwrite-user-jwt");
  if (!jwt) return new Response(null, { status: 401 });

  const storage = new Storage(getAuthenicatedClient(jwt));

  const body = await request.json();
  const watermarkUrl = sign(WATERMARK_FILE!, IMAGOR_SECRET!);

  if (!("image" in body)) {
    return new Response(null, { status: 400 });
  }
  const { image, name, index } = body;
  const imageurl = image.original;
  const details = await backendapi.get(
    "/medications/get-image?link=" + imageurl,
    {
      responseType: "arraybuffer",
    }
  );

  if (details.status === 200) {
    const contentType = details.headers["content-type"];
    const ext = mime.extension(contentType);
    const file = new File([details.data], "file", {
      type: contentType as string,
    });
    try {
      const _response = await createFileFromNode(
        InputFile.fromBuffer(
          Buffer.from(await file.arrayBuffer()),
          name + `_${index}_` + "." + ext
        ),
        storage
      );
      const filename = _response.$id + "." + ext;
      const originalUrlHashed =
        `${IMAGOR_BASE_URL}/` +
        sign(
          `1024x768/filters:watermark(${watermarkUrl},0,657):format(webp)/${filename}`,
          IMAGOR_SECRET!
        );
      const thumbnailUrlHashed =
        `${IMAGOR_BASE_URL}/` +
        sign(
          `100x66/filters:watermark(${watermarkUrl},0,57):format(webp)/${filename}`,
          IMAGOR_SECRET!
        );
      return Response.json(
        {
          content: {
            image: {
              original: originalUrlHashed,
              thumbnail: thumbnailUrlHashed,
              id: _response.$id,
              alt: `Machine Image for ${name}`,
            },
            original: imageurl,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof AppwriteException) {
        return Response.json(
          {
            content: error.message,
          },
          { status: error.code ?? 500 }
        );
      } else {
        return Response.json(
          {
            content:
              "Something went wrong badly - we will not take care sorry.",
          },
          { status: 500 }
        );
      }
    }
  } else {
    return Response.json(
      {
        content: {
          message: "Download image failed",
          original: imageurl,
        },
      },
      { status: 500 }
    );
  }
}
