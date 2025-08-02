import type { Metadata } from "next";
import { ClientThemeProvider } from "./ClientThemeProvider";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Handcraft Haven",
  description: "A marketplace for handmade crafts and goods",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
      >
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
