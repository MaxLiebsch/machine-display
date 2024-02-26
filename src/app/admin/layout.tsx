import { LicenseInfo } from "@mui/x-data-grid-premium";
import AdminDashboard from "../components/layout/AdminDashboard";

export default async function Layout({
  children,
}: {
  params: { slug: string };
  modal: any;
  children: React.ReactNode;
}) {
  LicenseInfo.setLicenseKey(
    "e25030cfe0235dfde76a01f60b5bf883Tz00ODA0NixFPTE4OTM0NTI0MDAwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y"
  );
  return (
    <section>
      <AdminDashboard>{children}</AdminDashboard>
    </section>
  );
}
