import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ClientShell from "./ClientShell";

export const metadata = {
  title: "Documind",
  description: "AI Document Intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ClientShell>
            {children}
          </ClientShell>
        </ClerkProvider>
      </body>
    </html>
  );
}