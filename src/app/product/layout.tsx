import Footer from "../components/layout/Footer";
import Header from "../components/layout/header";

export default async function Layout({
  params: { slug },
  modal,
  children,
}: {
  params: { slug: string };
  modal: any;
  children: React.ReactNode;
}) {
  return (
    <section>
      <Header />
      <main className="pt-20">{children}</main>
    </section>
  );
}
