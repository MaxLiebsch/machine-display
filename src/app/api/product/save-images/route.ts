import {
  createFileFromNode,
  getAuthenicatedClient,
} from "@/app/lib/services/node-appwrite.service";
import axios from "axios";
import { InputFile, Storage } from "node-appwrite";
import { NextRequest } from "next/server";
import { sign } from "@/app/lib/sign";
import mime from "mime-types";
import { IImage } from "@/app/product/[...slug]/page";
import { cookies, headers } from "next/headers";

const { CRAWLER_BE, IMAGOR_BASE_URL, WATERMARK_FILE, IMAGOR_SECRET } =
  process.env;

export async function POST(request: NextRequest) {
  const cookie = cookies().get(
    `a_session_${process.env.NEXT_PUBLIC_PROJECT_ID}_legacy`
  );
  const jwt = headers().get("x-appwrite-user-jwt");
  if (!cookie || !jwt) return new Response(null, { status: 401 });

  const storage = new Storage(getAuthenicatedClient(jwt));

  const body = await request.json();
  const watermarkUrl = sign(WATERMARK_FILE!, IMAGOR_SECRET!);
  const processedImages: IImage[] = [];

  if (!("images" in body)) {
    return new Response(null, { status: 400 });
  }
  const { images, name } = body;
  for (let index = 0; index < images.length; index++) {
    const imageurl = images[index].original;
    const details = await axios.get(
      CRAWLER_BE + "/medications/get-image?link=" + imageurl,
      {
        responseType: "arraybuffer",
        headers: {
          Authorization:
            "Basic " +
            btoa(process.env.BE_USER_NAME + ":" + process.env.BE_PASSWORD),
        },
      }
    );

    if (details.status === 200) {
      const contentType = details.headers["content-type"];
      const ext = mime.extension(contentType);
      const file = new File([details.data], "file", {
        type: contentType as string,
      });
      const _response = await createFileFromNode(
        InputFile.fromBuffer(
          Buffer.from(await file.arrayBuffer()),
          name + `_${index}_` + "." + ext
        ),
        storage
      );
      if (_response.$id) {
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
        processedImages.push({
          original: originalUrlHashed,
          thumbnail: thumbnailUrlHashed,
          id: _response.$id,
          alt: `Machine Image for ${name}`,
        });
      }
    }
  }
  return Response.json({ content: processedImages }, { status: 200 });
}
