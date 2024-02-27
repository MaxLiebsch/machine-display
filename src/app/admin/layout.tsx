import AdminDashboard from "../components/layout/AdminDashboard";
import AuthProvider from "../lib/providers/AuthProvider";

export default async function Layout({
  children,
}: {
  params: { slug: string };
  modal: any;
  children: React.ReactNode;
}) {
  return (
    <section>
      <AuthProvider>
        <AdminDashboard>{children}</AdminDashboard>
      </AuthProvider>
    </section>
  );
}
