import Navbar from "@/components/Navbar";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code grAIder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-50">
        <Navbar />
        <div className="mt-16 ml-5 h-[90vh]">{children}</div>
      </body>
    </html>
  );
}
