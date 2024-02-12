import SingletonReader from "@/app/lib/services/mmdb.service";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { ip: string } }
) {
  if (!params?.ip) {
    return Response.json({ error: "ip missing" }, { status: 400 });
  }
  const lookup = (await SingletonReader.getReader()).get(params.ip);
  if (!lookup) {
    return Response.json({ error: "ip not found" }, { status: 400 });
  }
  const { city, country } = lookup;
  return Response.json({
    city_name: city?.names.de,
    iso_code: country?.iso_code,
  });
}
