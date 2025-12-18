import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ClientShell from "./ClientShell";
import MotionProvider from "./providers/MotionProvider";
import PageTransition from "./providers/PageTransition";
import Snow from "./BackgroundParticles";

export const metadata = {
  title: "Documind",
  description: "AI Document Intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Snow />
        <ClerkProvider>
          <ClientShell>
            <MotionProvider>
              <PageTransition>
                {children}
                </PageTransition>
            </MotionProvider>
          </ClientShell>
        </ClerkProvider>
      </body>
    </html>
  );
}