export default async function Layout({
  params: { slug },
  modal,
  children,
}: {
  params: { slug: string };
  modal: any,
  children: React.ReactNode;
}) {

  
  return <section>{children}</section>;
}
