import { getItem } from "../lib/services/appwrite.service";

export default async function Layout({
  params: { slug },
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
