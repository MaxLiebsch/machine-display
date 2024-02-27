import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/Footer";
import ReactQueryProvider from "./lib/providers/ReactQueryProvider";
import SnackProvider from "./lib/providers/SnackBarProvider";
import AppWriteProvider from "./lib/providers/AppWriteProvider";
import MyLocalisationProvider from "./lib/providers/LocalisationProvider";
import MuiXLicense from "./components/MuiXLicense";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DipMax Machinery",
  description:
    "DipMax High-Tech Group specializes in selling Heavy Construction Machinery, Earth moving equipment, onshore and offshore Solar and Wind Technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MyLocalisationProvider>
        <AppWriteProvider>
          <ReactQueryProvider>
            <SnackProvider>
              <Header />
              <main className="pt-20">{children}</main>
              <Footer />
            </SnackProvider>
          </ReactQueryProvider>
        </AppWriteProvider>
        </MyLocalisationProvider>
        <MuiXLicense/>
      </body>
    </html>
  );
}
