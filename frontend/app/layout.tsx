import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frigg's Gate",
  description: "Central interface to the Life Nervous System cognitive architecture",
  icons: {
    icon: "/brain-favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${montserrat.className} h-full`}>
        <div
          className="flex flex-col h-full md:p-8"
          style={{ background: "rgb(38, 38, 41)" }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
